from django.db.models import fields
from rest_framework import serializers

from .models import *

class UserClothesSerializer(serializers.ModelSerializer):
    class Meta: 
        model = UserClothes
        fields = ['img', 'category', 'color']

class UserClothSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserClothes
        fields = '__all__'

class CoordiSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCoordi
        fields = ['acc', 'bag', 'headwear', 'outer', 'pants', 'shoes', 'top', 'watch']

class CoordiListSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCoordi
        fields = '__all__'

class UserMergeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCoordi
        fields = ['id', 'img', 'color', 'style', 'content']