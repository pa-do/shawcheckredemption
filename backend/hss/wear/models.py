from django.db import models

# Create your models here.

class Cloth(models.Model):
    cloth_img = models.ImageField(upload_to="cloth/%Y/%m/%d")
    title = models.CharField(max_length=100)
    category = models.IntegerField()