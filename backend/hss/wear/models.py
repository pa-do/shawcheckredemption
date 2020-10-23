from django.db import models
from django.conf import settings

# Create your models here.

class Accessory(models.Model):
    brand = models.CharField(max_length=50)
    category = models.IntegerField()
    color = models.CharField(max_length=50)
    season = models.CharField(max_length=50)
    textile = models.CharField(max_length=50)
    item = models.CharField(max_length=100)
    img_src = models.ImageField(max_length=200)
    url = models.CharField(max_length=200)

class Bag(models.Model):
    brand = models.CharField(max_length=50)
    category = models.IntegerField()
    color = models.CharField(max_length=50)
    season = models.CharField(max_length=50)
    textile = models.CharField(max_length=50)
    item = models.CharField(max_length=100)
    img_src = models.ImageField(max_length=200)
    url = models.CharField(max_length=200)

class Headwear(models.Model):
    brand = models.CharField(max_length=50)
    category = models.IntegerField()
    color = models.CharField(max_length=50)
    season = models.CharField(max_length=50)
    textile = models.CharField(max_length=50)
    item = models.CharField(max_length=100)
    img_src = models.ImageField(max_length=200)
    url = models.CharField(max_length=200)

class Outer(models.Model):
    brand = models.CharField(max_length=50)
    category = models.IntegerField()
    color = models.CharField(max_length=50)
    season = models.CharField(max_length=50)
    textile = models.CharField(max_length=50)
    item = models.CharField(max_length=100)
    img_src = models.ImageField(max_length=200)
    url = models.CharField(max_length=200)

class Pants(models.Model):
    brand = models.CharField(max_length=50)
    category = models.IntegerField()
    color = models.CharField(max_length=50)
    season = models.CharField(max_length=50)
    textile = models.CharField(max_length=50)
    item = models.CharField(max_length=100)
    img_src = models.ImageField(max_length=200)
    url = models.CharField(max_length=200)

class Shoes(models.Model):
    brand = models.CharField(max_length=50)
    category = models.IntegerField()
    color = models.CharField(max_length=50)
    season = models.CharField(max_length=50)
    textile = models.CharField(max_length=50)
    item = models.CharField(max_length=100)
    img_src = models.ImageField(max_length=200)
    url = models.CharField(max_length=200)

class Top(models.Model):
    brand = models.CharField(max_length=50)
    category = models.IntegerField()
    color = models.CharField(max_length=50)
    season = models.CharField(max_length=50)
    textile = models.CharField(max_length=50)
    item = models.CharField(max_length=100)
    img_src = models.ImageField(max_length=200)
    url = models.CharField(max_length=200)

class Watch(models.Model):
    brand = models.CharField(max_length=50)
    category = models.IntegerField()
    color = models.CharField(max_length=50)
    season = models.CharField(max_length=50)
    textile = models.CharField(max_length=50)
    item = models.CharField(max_length=100)
    img_src = models.ImageField(max_length=200)
    url = models.CharField(max_length=200)

class Coordi(models.Model):
    coordi_set = models.CharField(max_length=100)

class MyClothes(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    img = models.ImageField(upload_to="Myclothes/%Y/%m/%d")
    category = models.IntegerField()

# 사용자가 등록한 코디
class UserCoordi(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    hat = models.IntegerField()
    shirt = models.IntegerField()
    pants = models.IntegerField()
    outer = models.IntegerField()
    shoes = models.IntegerField()
    accessory = models.IntegerField()

# 좋아요 등록
class LikeCoordi(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    coordi_num = models.IntegerField()
