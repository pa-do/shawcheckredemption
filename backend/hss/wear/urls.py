from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'wear'

router = DefaultRouter()
router.register('userclothes', views.UserClothesViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('mylist/', views.mylist),
    path('createcoordi/', views.create_coordi),
    path('likecoordi/coordi_pk/', views.like_coordi),
    path('likelist/', views.like_list),
    path('recommand/', views.recommand),
    # path('guidetour/<int:tour_pk>', views.guidetour),
]
