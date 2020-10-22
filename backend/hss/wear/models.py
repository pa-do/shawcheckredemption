from django.db import models
from django.conf import settings

# Create your models here.

class Clothes(models.Model):
    # user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    coord_num = models.ForeignKey(Coordi, on_delete=models.CASCADE)
    brand = models.CharField(max_length=50)
    item = models.CharField(max_length=50)
    img = models.ImageField(upload_to="clothes/")
    url = models.CharField(max_length=100)
    category = models.IntegerField()

class Coordi(models.Model):
    coordi_set = models.CharField(max_length=100)

class MyClothes(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    img = models.ImageField(upload_to="Myclothes/%Y/%m/%d")
    category = models.IntegerField()

class UserCoordi(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    hat = models.IntegerField()
    shirt = models.IntegerField()
    pants = models.IntegerField()
    outer = models.IntegerField()
    shoes = models.IntegerField()
    accessory = models.IntegerField()

class LikeCoordi(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    coordi_num = models.IntegerField()
