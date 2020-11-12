from accounts.serializers import UserSerializer
from django.db.models import fields
from rest_framework import serializers

from .models import *

class UserClothesSerializer(serializers.ModelSerializer):
    class Meta: 
        model = UserClothes
        fields = ['img', 'category', 'color', 'subcategory']

class UserClothSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserClothes
        fields = '__all__'

class CoordiSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCoordi
        fields = ['acc', 'bag', 'headwear', 'outer', 'pants', 'shoes', 'top', 'watch', 'color', 'style', 'content']

class CoordiListSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCoordi
        fields = '__all__'

class UserMergeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    liked = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    def get_liked(self, obj):
        pk = self.context.get('request').user.pk
        chk = LikeCoordi.objects.filter(user=pk, coordi_num=obj.id)
        if chk.exists():
            return 1
        else:
            return 0
    def get_like_count(self, obj):
        count = LikeCoordi.objects.filter(coordi_num=obj.id)
        return len(count)
    class Meta:
        model = UserCoordi
        depth = 1
        fields = ['id', 'user', 'img', 'color', 'style', 'content', 'liked', 'like_count']