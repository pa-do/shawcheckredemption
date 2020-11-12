from accounts.serializers import UserSerializer
from django.db.models import fields
from rest_framework import serializers

from .models import *

class AccessorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Accessory
        fields = '__all__'

class BagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bag
        fields = '__all__'

class HeadwearSerializer(serializers.ModelSerializer):
    class Meta:
        model = Headwear
        fields = '__all__'

class OuterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Outer
        fields = '__all__'

class PantsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pants
        fields = '__all__'

class ShoesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shoes
        fields = '__all__'

class TopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Top
        fields = '__all__'

class WatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Watch
        fields = '__all__'

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