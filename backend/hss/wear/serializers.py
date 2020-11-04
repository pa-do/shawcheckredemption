from rest_framework import serializers

from .models import *

class MyClothesSerializer(serializers.ModelSerializer):
    class Meta: 
        model = MyClothes
        fields = ['img', 'category']


