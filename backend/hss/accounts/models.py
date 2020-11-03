from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    first_name = None
    last_name = None
    user_code = models.IntegerField(default=0)
    profile_image = models.ImageField('프로필사진', default='/profile/default.jpg', upload_to="profile/")
    phone_number = models.CharField('휴대폰번호', blank=True, max_length=20)