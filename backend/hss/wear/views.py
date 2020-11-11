from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view
from django.contrib.auth import get_user_model
from django.http import HttpResponse, JsonResponse
from rest_framework.response import Response
from .serializers import *
from .models import *
from rest_framework import status
from rest_framework.views import APIView
import datetime

# 이미지 처리
from PIL import Image
from wear import preprocess
import os

color_name = ['흰색', '라이트그레이', '회색', '다크 그레이', '검정색', '딥레드', '빨간색', 
              '라즈베리', '네온 핑크', '분홍색', '라이트 핑크', '페일 핑크', '피치', '코랄', 
              '라이트 오렌지', '네온 오렌지', '오렌지 핑크', '주황색', '아이보리', '라이트 옐로우',
              '노란색', '머스타드', '네온 그린', '라이트 그린', '민트', '녹색', '올리브 그린', '카키',
              '다크 그린', '스카이 블루', '네온 블루', '파란색', '네이비', '자주', '라벤더', '보라색', 
              '버건디', '갈색', '로즈골드', '레드 브라운', '카키 베이지', '카멜', '샌드', '베이지색', 
              '데님', '연청', '중청', '진청', '흑청']

color_chip_rgb = [[255, 255, 255], [217, 217, 215], [156, 156, 155], [83, 86, 91], [0, 0, 0], 
                  [156, 35, 54], [232, 4, 22], [215, 64, 97], [223, 24, 149], [247, 17, 158],
                  [255, 163, 182], [220, 166, 156], [250, 171, 141], [237, 104, 89], [254, 124, 0],
                  [253, 92, 1], [228, 74, 86], [247, 68, 27], [254, 255, 239], [249, 225, 125],
                  [251, 234, 43], [240, 179, 37], [212, 237, 22], [139, 197, 1], [64, 193, 171], 
                  [42, 172, 20], [122, 134, 60], [91, 90, 58], [29, 66, 33], [91, 193, 231],
                  [2, 128, 238], [36, 30, 252], [0, 31, 98], [125, 0, 76], [167, 123, 202],
                  [78, 8, 108], [118, 34, 47], [108, 42, 22], [183, 82, 62], [190, 77, 0], 
                  [161, 116, 0], [215, 154, 47], [201, 180, 149], [232, 195, 129],
                  [61, 63, 107], [97, 134, 176], [38, 58, 84], [35, 40, 51], [33, 35, 34]]

# 유저 옷 CRUD 
class UserClothesAPI(APIView):
    """
        유저 옷 1개 넣는 CRUD API

        ---
    """
    def post(self, request, format=None):
        """
            유저 옷 1개 생성 요청

            ---
            # 내용
                - img : 올릴 옷 이미지
                - category : 1 : headwear,
                            2 : top,
                            3 : outer,
                            4 : acc,
                            5 : pants,
                            6 : bag,
                            7 : watch,
                            8 : shoes, 중 한개를 입력
                - color : 컨펌 후 채워지게 될 칸
        """
        User = get_user_model()
        user = get_object_or_404(User, pk=request.user.pk)
        serializer = UserClothesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            uimg = UserClothes.objects.last()
            imgpath = "./media/" + str(uimg.img)
            result, imglink = preprocess.image_preprocess(imgpath)
            os.remove(imgpath)
            uimg.img = imglink
            uimg.save()

            rgb = [{'R': result[0], 'G': result[1], 'B': result[2]}]
            return JsonResponse({'pk': uimg.pk,'R': result[0], 'G': result[1], 'B': result[2], 'img': imglink})
        return HttpResponse("저장 안됨 ㅅㄱ")

class clothes_detail(APIView):
    """
        유저 옷 1개 관리하는 API

        ---
    """
    def get(self, request, pk):
        """
            유저 옷 1개 정보 요청

            ---
            # 내용
                /userclothes/pk get 요청
        """
        cloth = get_object_or_404(UserClothes, pk=pk)
        serializer = UserClothSerializer(cloth)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        """
            유저 옷 1개 정보 수정 요청

            ---
            # 내용
                /userclothes/pk put 요청, JWT 헤더의 유저가 다르면 수정안됨
                body에 color값 {R:num , G:num, B:num} 주면 됨
        """
        User = get_user_model()
        user = get_object_or_404(User, pk=request.user.pk)
        cloth = get_object_or_404(UserClothes, pk=pk)
        if cloth.user == user:
            rgb = [int(request.data['R']), int(request.data['G']), int(request.data['B'])]
            ans = 0
            for i in range(len(color_name)):
                if rgb == color_chip_rgb[i]:
                    ans = i
                    break
            cloth.color = color_name[ans]
            cloth.save()
            # print(cloth.color)
            return HttpResponse('수정 완료')
        return HttpResponse('다른 유저입니다')

    def delete(self, request, pk, format=None):
        """
            유저 옷 1개 삭제 요청

            ---
            # 내용
                /userclothes/pk delete 요청, JWT 헤더의 유저가 다르면 삭제안됨
        """
        User = get_user_model()
        user = get_object_or_404(User, pk=request.user.pk)
        cloth = get_object_or_404(UserClothes, pk=pk)
        if cloth.user == user:
            cloth.delete()
            return HttpResponse('삭제 완료')
        return HttpResponse('다른 유저입니다')

# 내 옷만 가져오기
@api_view(['GET'])
def mylist(request):
    """
        내가 등록한 옷 전부 가져오는 API

        ---
    """
    User = get_user_model()
    user = get_object_or_404(User, pk=request.user.pk)
    clothes = UserClothes.objects.filter(user=user).values()
    headwear, top, outer, acc, pants, bag, watch, shoes = [], [], [], [], [], [], [], []
    for i in clothes:
        if i['category'] == 1:
            headwear.append({'id':i['id'], 'img':i['img']})
        elif i['category'] == 2:
            top.append({'id':i['id'], 'img':i['img']})
        elif i['category'] == 3:
            outer.append({'id':i['id'], 'img':i['img']})
        elif i['category'] == 4:
            acc.append({'id':i['id'], 'img':i['img']})
        elif i['category'] == 5:
            pants.append({'id':i['id'], 'img':i['img']})
        elif i['category'] == 6:
            bag.append({'id':i['id'], 'img':i['img']})
        elif i['category'] == 7:
            watch.append({'id':i['id'], 'img':i['img']})
        elif i['category'] == 8:
            shoes.append({'id':i['id'], 'img':i['img']})
    return JsonResponse({
        1 : headwear,
        2 : top,
        3 : outer,
        4 : acc,
        5 : pants,
        6 : bag,
        7 : watch,
        8 : shoes,
    })

# 유저 코디 등록하기
@api_view(['POST'])
def create_coordi(request):
    """
        유저 코디 등록하는 API

        ---
        # 내용
            반드시 순서에 맞춰서 보내주세요
            { headwear : pk,
              top : pk,
              outer : pk,
              acc : pk,
              pants : pk,
              bag : pk,
              watch : pk,
              shoes : pk,
              color : string , style : string, content : string ...
            }
            123
            456
            789 형태로 사진이 합성되며 pk 값 없으면 -1
    """
    User = get_user_model()
    user = get_object_or_404(User, pk=request.user.pk)
    serializer = CoordiSerializer(data=request.data)
    merged = Image.new('RGBA', (300 * 3, 300 * 3), (250,250,250,0))
    i, j = 0, 0
    for idx, value in request.data.items():
        if idx == 'color' or idx == 'style' or idx == 'content':
            continue
        if idx == 'headwear':
            i, j = 0, 0
        elif idx == 'top':
            i, j = 0, 1
        elif idx == 'outer':
            i, j = 0, 2
        elif idx == 'acc':
            i, j = 1, 0
        elif idx == 'pants':
            i, j = 1, 1
        elif idx == 'bag':
            i, j = 1, 2
        elif idx == 'watch':
            i, j = 2, 0
        elif idx == 'shoes':
            i, j = 2, 1
        if value == '-1':
            continue

        A = UserClothes.objects.get(pk=value)
        im = Image.open(A.img)
        im = im.resize((300, 300))
        merged.paste(im, (300 * j, 300 * i))

    now = datetime.datetime.now()
    nowDate = now.strftime('%M%H%S')
    targeturl = "/media/usercoordi/" + user.username + '_' + nowDate + '.png'
    merged.save('.' + targeturl)
    if serializer.is_valid():
        serializer.save(user=user, img=targeturl)
        return Response(data=serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(data=serializer.errors)

# 내가 등록한 코디 보기
@api_view(['GET'])
def list_coordi(request):
    """
        내가 등록한 코디를 모아보는 API

        ---
    """
    User = get_user_model()
    user = get_object_or_404(User, pk=request.user.pk)
    coordi = UserCoordi.objects.filter(user=user)
    serializer = UserMergeSerializer(coordi, many=True)
    return Response(serializer.data)

# 유저 코디 좋아요
@api_view(['POST'])
def like_coordi(request, coordi_pk):
    """
        사람들이 올린 코디를 좋아요 하는 API

        ---
        # 내용
            pk 값을 파라미터로 보내면 되며,
            두번째 요청마다 자동으로 삭제됨
    """
    User = get_user_model()
    user = get_object_or_404(User, pk=request.user.pk)
    Lcoordi, flag = LikeCoordi.objects.get_or_create(oordi_num=coordi_pk, user=user)
    if flag:
        return HttpResponse('좋아요 등록.')
    else:
        Lcoordi.delete()
        return HttpResponse('좋아요 삭제.')

# 좋아요 코디 가져오기
@api_view(['GET'])
def like_list(request):
    """
        내가 좋아요한 코디들을 가져오는 API

        ---
        # 내용
            [{id: num, img: string, id:num2, img: string2 ...}]
    """
    User = get_user_model()
    user = get_object_or_404(User, pk=request.user.pk)
    clothes = LikeCoordi.objects.filter(user=user).values()
    like = []
    for i in clothes:
        cloth = UserCoordi.objects.get(id=i['id'])
        like.append({'id':i['id'], 'img':i['img']})
    return JsonResponse(like)


# 추천 받기
@api_view(['POST'])
def recommand(request):
    from wear import coordiset

    ######################### 유저에게 받는 데이터 #############################
    user_info = {
        "who": "professor",
        "where": "restaurant",
        "weather": "summer",
        "user_pick_item": {"watch": [0, "검정색", "이미지주소"]},
        "user_personal_color": "spring"
    }
    
    ###########################################################################
    
    result = coordiset.run_self(user_info)
    print('result : ',result)
    return result

# 쓸것 들
# for idx, value in request.data.items():
    # print(idx, value)
    # if idx == 'acc':
    #     A = Accessory.objects.get(pk=value)
    # elif idx == 'bag':
    #     A = Bag.objects.get(pk=value)
    # elif idx == 'headwear':
    #     A = Headwear.objects.get(pk=value)
    # elif idx == 'outer':
    #     A = Outer.objects.get(pk=value)
    # elif idx == 'pants':
    #     A = Pants.objects.get(pk=value)
    # elif idx == 'shoes':
    #     A = Shoes.objects.get(pk=value)
    # elif idx == 'top':
    #     A = Top.objects.get(pk=value)
    # elif idx == 'watch':
    #     A = Watch.objects.get(pk=value)