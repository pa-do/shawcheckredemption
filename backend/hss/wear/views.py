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
   queryset = UserClothes.objects.all()
   serializer_class = UserClothesSerializer
   def perform_create(self, serializer):
        serializer.save(user_id=self.request.user.pk)

# 내 옷만 가져오기
@api_view(['GET'])
def mylist(request):
    User = get_user_model()
    user = get_object_or_404(User, pk=request.user.pk)
    clothes = UserClothes.objects.filter(user=user)
    serializer = UserClothSerializer(clothes, many=True)
    return Response(serializer.data)

# 유저 코디 등록하기
@api_view(['POST'])
def create_coordi(request):
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

# 유저 코디 좋아요
@api_view(['POST'])
def like_coordi(request, coordi_pk):
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
    User = get_user_model()
    user = get_object_or_404(User, pk=request.user.pk)
    clothes = UserClothes.objects.filter(user=user)
    serializer = UserMergeSerializer(clothes, many=True)
    return Response(serializer.data)

# 코디셋 테스트
def coordiset_test(request):
    from wear import coordiset
    result = coordiset.run_self()
    print('result : ',result)


# @api_view(['GET'])
# def detail_tour(request, tour_pk):
#     User = get_user_model()
#     user = get_object_or_404(User, pk=request.user.pk)
#     tours = TripItemModel.objects.filter(pk=tour_pk)[0]
#     paiders = GuideTour.objects.filter(trip_item=tour_pk)
#     flag = False
#     for paider in paiders:
#         if paider.user == user:
#             flag = True
#     serializer = TourDetailSerializer(tours)
#     return JsonResponse({"result": serializer.data, "flag": flag})

# 추천 받기
@api_view(['POST'])
def recommand(request):
    pass

# ----------------------------------- 이미지 합치기 --------------

# from PIL import Image
# im = Image.open('python.png')
 
# # 크기를 600x600 으로
# img2 = im.resize((600, 600))
# img2.save('python-600.jpg')

# # 1. 병합할 이미지 만들기
# merged = Image.new('L', (400, 200))

# # 2. 이미지 불러오기
# im0 = Image.open('mnist_0.png')
# im1 = Image.open('mnist_1.png')

# # 3. 이미지 붙여넣기
# merged.paste(im0, (0, 0))
# merged.paste(im1, (200, 0))

# # 4. 병합한 이미지 저장하기
# merged.save('mnist_merged.png')

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