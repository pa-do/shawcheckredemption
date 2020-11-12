from django.urls import path, include
from . import views

app_name = 'wear'


urlpatterns = [
    # 코디 아이템 등록/삭제
    path('userclothes/', views.UserClothesAPI.as_view()),
    path('userclothes/<int:pk>', views.clothes_detail.as_view()),
    # 내가 등록한 아이템 보기
    path('mylist/', views.mylist),
    # 코디셋 등록하기
    path('coordi/', views.Coordi.as_view()),
    path('coordi/<int:pk>', views.Coordi_detail.as_view()),
    # 내가 등록한 코디셋 보기
    path('listcoordi/', views.list_coordi),
    # 코디셋 좋아요/삭제 하기
    path('likecoordi/<int:coordi_pk>', views.like_coordi),
    # 내가 좋아요한 리스트 가져오기
    path('likelist/', views.like_list),
    # 코디 추천
    path('recommand/', views.recommand),
    # path('guidetour/<int:tour_pk>', views.guidetour),
]
