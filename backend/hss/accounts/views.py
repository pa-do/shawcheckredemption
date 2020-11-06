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

# 퍼스널컬러 체크
# from personal_color_analysis import personal_color
import argparse
import os


# Create your views here.

def personalcolor(request):
    # imgpath = "C:/Users/multicampus/Desktop/coolcool.png" # 이미지 경로 설정
    imgpath = request.data.img
    # ans = personal_color.analysis(imgpath)
    return HttpResponse(ans)