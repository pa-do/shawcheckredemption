from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view
from django.contrib.auth import get_user_model
from django.http import HttpResponse, JsonResponse
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .serializers import *
from .models import Personalcolor, User
from rest_framework import status

# 퍼스널컬러 체크
from accounts.personalcolor.src.personal_color_analysis import personal_color
import argparse
import os

# Create your views here.


@api_view(['GET'])
def checkID(request, name):
    """
        DB에 중복 아이디 체크하는 API

        ---
        # 내용
            parameter로 유저 이름을 보내면 됩니다
    """
    User = get_user_model()
    user = User.objects.filter(username=name)
    minFlag = maxFlag = numFlag = False
    if len(name) < 5:
        minFlag = True
    if len(name) >= 16:
        maxFlag = True
    try:
        int(name)
        numFlag = True
    except:
        pass
    
    if user:
        return HttpResponse('이미 있는 아이디입니다.')
    elif minFlag:
        return HttpResponse('아이디가 너무 짧습니다.')
    elif maxFlag:
        return HttpResponse('아이디가 너무 깁니다.')
    elif numFlag:
        return HttpResponse('아이디는 숫자로만 이루어질 수 없습니다.')
    else:
        return HttpResponse('사용 할 수 있는 아이디입니다.')

@api_view(['POST'])
def personalcolor(request):
    """
        유저의 얼굴 사진 인식후 퍼스널 컬러 진단해주는 API

        ---
        # 내용
            - img : 유저가 올린 사진
            response 값을 유저에게 보여주면 됨
            판별후 자동으로 user 모델의 color 칸이
            spring/summer/fall/winter 중 하나로 등록됨
    """
    User = get_user_model()
    user = get_object_or_404(User, pk=request.user.pk)
    serializer = ColorSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=user)
    # imgpath = "C:/Users/multicampus/Desktop/coolcool.png" # 이미지 경로 설정
    pimg = Personalcolor.objects.get(user=user)
    imgpath = "./media/" + str(pimg.img)
    chk = 0
    try:
        ans, tone = personal_color.analysis(imgpath)
        user.color = tone
        user.save()
        chk = 1
    except:
        pass
    pimg.delete()
    os.remove(imgpath)
    if chk:
        return HttpResponse(ans)
    else:
        return HttpResponse('정면 사진을 올려주세요.')