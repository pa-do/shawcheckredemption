from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view
from django.contrib.auth import get_user_model
from django.http import HttpResponse, JsonResponse
from rest_framework.response import Response
# from rest_framework import viewsets
from .serializers import *
from .models import *
from rest_framework import status
import datetime


# Create your views here.

@api_view(['POST'])
def create_tour(request):
    User = get_user_model()
    user = get_object_or_404(User, pk=request.user.pk)
    serializer = GuideItemSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=user)
        return Response(data=serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(data=serializer.errors)

@api_view(['GET'])
def list_tour(request):
    now = datetime.datetime.now()
    nowDate = now.strftime('%Y%m%d')
    tours = TripItemModel.objects.filter(start_date__gte=int(nowDate)).order_by('start_date')
    serializer = TourSerializer(tours, many=True)
    return Response(serializer.data)

# class GuideViewSet(viewsets.ModelViewSet):
#     queryset = TripItemModel.objects.all()
#     serializer_class = GuideItemSerializer
#     def perform_create(self, serializer):
#         serializer.save(user_id=self.request.user.pk)

@api_view(['GET'])
def detail_tour(request, tour_pk):
    User = get_user_model()
    user = get_object_or_404(User, pk=request.user.pk)
    tours = TripItemModel.objects.filter(pk=tour_pk)[0]
    paiders = GuideTour.objects.filter(trip_item=tour_pk)
    flag = False
    for paider in paiders:
        if paider.user == user:
            flag = True
    serializer = TourDetailSerializer(tours)
    return JsonResponse({"result": serializer.data, "flag": flag})
