from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view
from django.contrib.auth import get_user_model
from django.http import HttpResponse, JsonResponse
from rest_framework.response import Response
from .serializers import *
from accounts.serializers import *
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
                - subcategory : num
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
            cloth.brand = request.data['brand']
            cloth.item = request.data['item']
            cloth.price = int(request.data['price'])
            cloth.url = request.data['url']
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


# 유저 코디 CRUD 
class Coordi(APIView):
    """
        유저 코디 관리하는 API

        ---
    """
    def get(self, request):
        serializer = UserMergeSerializer(UserCoordi.objects.filter(c_code=1).order_by('-id'), many=True, context={'request': request})
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    def post(self, request, format=None):
        """
            유저 코디 등록하는 API

            ---
            # 내용
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
        merged = Image.new('RGBA', (150 * 3, 150 * 3), (250,250,250,0))
        i, j = 0, 0
        need = 0
        for idx, value in request.data.items():
            if idx == 'color' or idx == 'style' or idx == 'content':
                continue
            if value == '-1':
                continue
            if idx == 'headwear':
                i, j = 0, 0
            elif idx == 'top':
                i, j = 0, 1
                need += 1
            elif idx == 'outer':
                i, j = 0, 2
            elif idx == 'acc':
                i, j = 1, 0
            elif idx == 'pants':
                i, j = 1, 1
                need += 1
            elif idx == 'bag':
                i, j = 1, 2
            elif idx == 'watch':
                i, j = 2, 0
            elif idx == 'shoes':
                i, j = 2, 1
                need += 1

            A = UserClothes.objects.get(pk=value)
            im = Image.open(A.img)
            merged.paste(im, (150 * j, 150 * i))
        if need < 3:
            return HttpResponse('상의, 하의, 신발 값이 필요합니다.')
        now = datetime.datetime.now()
        nowDate = now.strftime('%M%H%S')
        targeturl = "usercoordi/" + user.username + '_' + nowDate + '.png'
        merged.save('./media/' + targeturl)
        if serializer.is_valid():
            serializer.save(user=user, img=targeturl, c_code=1)
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(data=serializer.errors)

# 유저 코디 CRUD 
class Coordi_detail(APIView):
    """
        유저 코디 관리하는 API

        ---
    """
    def delete(self, request, pk, format=None):
        """
            유저 코디 1개 삭제 요청

            ---
            # 내용
                /coordi/pk delete 요청, JWT 헤더의 유저가 다르면 삭제안됨
        """
        User = get_user_model()
        user = get_object_or_404(User, pk=request.user.pk)
        coordi = get_object_or_404(UserCoordi, pk=pk)
        if coordi.user == user:
            coordi.delete()
            return HttpResponse('삭제 완료')
        return HttpResponse('다른 유저입니다')

# 내가 등록한 코디 보기
@api_view(['GET'])
def list_coordi(request):
    """
        내가 등록한 코디를 모아보는 API

        ---
    """
    User = get_user_model()
    user = get_object_or_404(User, pk=request.user.pk)
    coordi = UserCoordi.objects.filter(user=user, c_code=1).order_by('-id')
    serializer = UserMergeSerializer(coordi, many=True, context={'request': request})
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
    ucoordi = get_object_or_404(UserCoordi, pk=coordi_pk)
    Lcoordi, flag = LikeCoordi.objects.get_or_create(coordi_num=ucoordi, user=user)
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
    clothes = LikeCoordi.objects.filter(user=user).order_by('-id').values()
    like = []
    for i in clothes:
        data = {}
        cloth = UserCoordi.objects.get(id=i['coordi_num_id'])
        serializer = CoordiListSerializer(cloth)
        if serializer.data['c_code'] == 0:
            if serializer.data['headwear'] > -1:
                A = Headwear.objects.get(pk=serializer.data['headwear'])
                data['headwear'] = HeadwearSerializer(A).data
            if serializer.data['top'] > -1:
                A = Top.objects.get(pk=serializer.data['top'])
                data['top'] = TopSerializer(A).data
            if serializer.data['outer'] > -1:
                A = Outer.objects.get(pk=serializer.data['outer'])
                data['outer'] = OuterSerializer(A).data
            if serializer.data['acc'] > -1:
                A = Accessory.objects.get(pk=serializer.data['acc'])
                data['acc'] = AccessorySerializer(A).data
            if serializer.data['pants'] > -1:
                A = Pants.objects.get(pk=serializer.data['pants'])
                data['pants'] = PantsSerializer(A).data
            if serializer.data['bag'] > -1:
                A = Bag.objects.get(pk=serializer.data['bag'])
                data['bag'] = BagSerializer(A).data
            if serializer.data['watch'] > -1:
                A = Watch.objects.get(pk=serializer.data['watch'])
                data['watch'] = WatchSerializer(A).data
            if serializer.data['shoes'] > -1:
                A = Shoes.objects.get(pk=serializer.data['shoes'])
                data['shoes'] = ShoesSerializer(A).data
        c_user = get_object_or_404(User, pk=serializer.data['user'])
        user_data = UserSerializer(c_user)
        chk = LikeCoordi.objects.filter(user=user, coordi_num=i['coordi_num_id'])
        liked = 1 if chk.exists() else 0
        count = LikeCoordi.objects.filter(coordi_num=i['coordi_num_id'])
        like.append({'id':i['coordi_num_id'], 'user':user_data.data, 'img':cloth.img, 'liked': liked, 'like_count': len(count),'data': data})
    return Response(like)


# 추천 받기
@api_view(['POST'])
def recommand(request):
    """
        코디 추천받는 API

        ---
        # 내용
            { headwear : pk,
                top : pk,
                outer : pk,
                acc : pk,
                pants : pk,
                bag : pk,
                watch : pk,
                shoes : pk,
                who : string
                where : string
            }   pk 값 없으면 -1  // 5개의 추천 이미지와 pk값 리턴됨
    """
    from wear import coordiset
    User = get_user_model()
    user = get_object_or_404(User, pk=request.user.pk)
    # 기존 추천 이미지 삭제
    remains = UserCoordi.objects.filter(c_code=0, user=user).values()
    for i in remains:
        rchk = LikeCoordi.objects.filter(coordi_num_id = i['id'])
        if rchk.exists():
            continue
        remain = UserCoordi.objects.get(id=i['id'])
        remainS = CoordiListSerializer(remain)
        os.remove("./media/"+str(remainS.data['img']))
        remain.delete()
    who = request.data['who']
    where = request.data['where']
    now = datetime.datetime.now()
    nowDate = int(now.strftime('%m'))
    weather = 'winter'
    if 3 <= nowDate < 6:
        weather = 'spring'
    elif 6 <= nowDate < 9:
        weather = 'summer'
    elif 9 <= nowDate < 12:
        weather = 'fall'
    user_pick_item = {}
    if request.data['headwear'] != '-1':
        A = UserClothes.objects.get(pk=request.data['headwear'])
        user_pick_item['headwear'] = [A.subcategory, A.color, A.img]
    if request.data['top'] != '-1':
        A = UserClothes.objects.get(pk=request.data['top'])
        user_pick_item['top'] = [A.subcategory, A.color, A.img]
    if request.data['outer'] != '-1':
        A = UserClothes.objects.get(pk=request.data['outer'])
        user_pick_item['outer'] = [A.subcategory, A.color, A.img]
    if request.data['acc'] != '-1':
        A = UserClothes.objects.get(pk=request.data['acc'])
        user_pick_item['acc'] = [A.subcategory, A.color, A.img]
    if request.data['pants'] != '-1':
        A = UserClothes.objects.get(pk=request.data['pants'])
        user_pick_item['pants'] = [A.subcategory, A.color, A.img]
    if request.data['bag'] != '-1':
        A = UserClothes.objects.get(pk=request.data['bag'])
        user_pick_item['bag'] = [A.subcategory, A.color, A.img]
    if request.data['watch'] != '-1':
        A = UserClothes.objects.get(pk=request.data['watch'])
        user_pick_item['watch'] = [A.subcategory, A.color, A.img]
    if request.data['shoes'] != '-1':
        A = UserClothes.objects.get(pk=request.data['shoes'])
        user_pick_item['shoes'] = [A.subcategory, A.color, A.img]


    # ######################### 유저에게 받는 데이터 #############################
    user_info = {
        "who": who,
        "where": where,
        "weather": weather,
        "user_pick_item": user_pick_item,
        "user_personal_color": user.color
    }
    # ###########################################################################
    result = coordiset.run_self(user_info, user)
    return Response(result)

# 코디 전부 가져오기(인피니트)
@api_view(['GET'])
def infinite(request, idx):
    """
        사람들이 올린 코디를 인덱스로 줌

        ---
        # 내용
            pk 값을 파라미터로 보내면 됨
    """
    coordi = UserCoordi.objects.filter(c_code=1).order_by('-id')[idx:idx+6]
    serializer = UserMergeSerializer(coordi, many=True, context={'request': request})
    return Response(status=status.HTTP_200_OK, data=serializer.data)
    