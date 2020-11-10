from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view
from django.contrib.auth import get_user_model
from django.http import HttpResponse, JsonResponse
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .serializers import *
from .models import *
from rest_framework import status
import datetime

# 이미지 처리
from PIL import Image

# 유저 옷 CRUD 
class UserClothesViewSet(ModelViewSet):
    """
        유저 옷 1개 CRUD API

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
    queryset = UserClothes.objects.all()
    serializer_class = UserClothesSerializer
    def perform_create(self, serializer):
        serializer.save(user_id=self.request.user.pk)

# 내 옷만 가져오기
@api_view(['GET'])
def mylist(request):
    """
        내가 등록한 옷 가져오는 API

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
            - category : 1 : headwear,
                        2 : top,
                        3 : outer,
                        4 : acc,
                        5 : pants,
                        6 : bag,
                        7 : watch,
                        8 : shoes,
            123
            456
            789 형태로 사진이 합성되며
            headwear : pk, top : pk ... 순으로 8개 보내고 없으면 -1
    """
    User = get_user_model()
    user = get_object_or_404(User, pk=request.user.pk)
    serializer = CoordiSerializer(data=request.data)
    merged = Image.new('RGB', (300 * 3, 300 * 3), (250,250,250))
    cnt = 0
    i, j = 0, -1
    for idx, value in request.data.items():
        cnt += 1
        j += 1
        if cnt == 4:
            i, j = 1, 0
        elif cnt == 7:
            i, j = 2, 0
        if value == '-1':
            continue
        else:
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

# 코디셋 테스트
def coordiset_test(request):
    from wear import coordiset
    result = coordiset.run_self()
    print('result : ',result)


# 추천 받기
@api_view(['POST'])
def recommand(request):
    """
        코디셋 추천하는 API

        ---
        # 내용
    """
    pass

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


# 전처리된 이미지와 이미지에서 추출한 색상값을 반환
# 현재 코드는 색상값만 반환하고 있음
# todo: 이미지 반환 코드 추가
def image_preprocess(request):
    from wear import preprocess

    # result 는 색상의 rgb값
    result = preprocess.image_preprocess()
    rgb = [{'R': result[0], 'G': result[1], 'B': result[2]}]
    return JsonResponse(rgb, safe=False)