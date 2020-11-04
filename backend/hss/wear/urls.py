from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'wear'

router = DefaultRouter()
router.register('mycloth', views.MyClothesViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('mylist', views.mylist),
    path('recommand', views.recommand),
    # path('guidetour/<int:tour_pk>', views.guidetour),
]
