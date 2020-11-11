from django.urls import path, include
from . import views

app_name = 'accounts'

urlpatterns = [
    path('personalcolor/', views.personalcolor),
    # path('guidetour/<int:tour_pk>', views.guidetour),
    path('chk/<str:name>', views.checkID),
]
