from django.db import models
from django.conf import settings

# Create your models here.

class Accessory(models.Model):
    brand = models.CharField(max_length=50)
    category = models.IntegerField()
    color = models.CharField(max_length=10)
    season = models.CharField(max_length=50)
    textile = models.CharField(max_length=50)
    item = models.CharField(max_length=100)
    price = models.IntegerField()
    img = models.CharField(max_length=100)
    url = models.CharField(max_length=200)
    style = models.CharField(max_length=50, blank=True)

class Bag(models.Model):
    brand = models.CharField(max_length=50)
    category = models.IntegerField()
    color = models.CharField(max_length=10)
    season = models.CharField(max_length=50)
    textile = models.CharField(max_length=50)
    item = models.CharField(max_length=100)
    price = models.IntegerField()
    img = models.CharField(max_length=100)
    url = models.CharField(max_length=200)
    style = models.CharField(max_length=50, blank=True)

class Headwear(models.Model):
    brand = models.CharField(max_length=50)
    category = models.IntegerField()
    color = models.CharField(max_length=10)
    season = models.CharField(max_length=50)
    textile = models.CharField(max_length=50)
    item = models.CharField(max_length=100)
    price = models.IntegerField()
    img = models.CharField(max_length=100)
    url = models.CharField(max_length=200)
    style = models.CharField(max_length=50, blank=True)

class Outer(models.Model):
    brand = models.CharField(max_length=50)
    category = models.IntegerField()
    color = models.CharField(max_length=10)
    season = models.CharField(max_length=50)
    textile = models.CharField(max_length=50)
    item = models.CharField(max_length=100)
    price = models.IntegerField()
    img = models.CharField(max_length=100)
    url = models.CharField(max_length=200)
    style = models.CharField(max_length=50, blank=True)

class Pants(models.Model):
    brand = models.CharField(max_length=50)
    category = models.IntegerField()
    color = models.CharField(max_length=10)
    season = models.CharField(max_length=50)
    textile = models.CharField(max_length=50)
    item = models.CharField(max_length=100)
    price = models.IntegerField()
    img = models.CharField(max_length=100)
    url = models.CharField(max_length=200)
    style = models.CharField(max_length=50, blank=True)

# 신발
class Shoes(models.Model):
    brand = models.CharField(max_length=50)
    category = models.IntegerField()
    color = models.CharField(max_length=10)
    season = models.CharField(max_length=50)
    textile = models.CharField(max_length=50)
    item = models.CharField(max_length=100)
    price = models.IntegerField()
    img = models.CharField(max_length=100)
    url = models.CharField(max_length=200)
    style = models.CharField(max_length=50, blank=True)

# 상의
class Top(models.Model):
    brand = models.CharField(max_length=50)
    category = models.IntegerField()
    color = models.CharField(max_length=10)
    season = models.CharField(max_length=50)
    textile = models.CharField(max_length=50)
    item = models.CharField(max_length=100)
    price = models.IntegerField()
    img = models.CharField(max_length=100)
    url = models.CharField(max_length=200)
    style = models.CharField(max_length=50, blank=True)

# 시계
class Watch(models.Model):
    brand = models.CharField(max_length=50)
    category = models.IntegerField()
    color = models.CharField(max_length=10)
    season = models.CharField(max_length=50)
    textile = models.CharField(max_length=50)
    item = models.CharField(max_length=100)
    price = models.IntegerField()
    img = models.CharField(max_length=100)
    url = models.CharField(max_length=200)
    style = models.CharField(max_length=50, blank=True)

# 내가 등록한 옷
class UserClothes(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    img = models.ImageField(upload_to="Myclothes/%Y/%m/%d")
    category = models.IntegerField()
    color = models.CharField(max_length=5)

# 사용자가 등록한 코디
class UserCoordi(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    acc = models.IntegerField(null=True, blank=True)
    bag = models.IntegerField(null=True, blank=True)
    headwear = models.IntegerField(null=True, blank=True)
    outer = models.IntegerField(null=True, blank=True)
    pants = models.IntegerField(null=True, blank=True)
    shoes = models.IntegerField(null=True, blank=True)
    top = models.IntegerField(null=True, blank=True)
    watch = models.IntegerField(null=True, blank=True)
    ming = models.ImageField(null=True, blank=True, upload_to="UserCoordi/%Y/%m/%d")

# 좋아요 등록
class LikeCoordi(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    coordi_num = models.IntegerField()
