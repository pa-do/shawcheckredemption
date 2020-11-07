from rest_framework import serializers
from .models import Personalcolor, User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'nickname', 'profile_image', 'color']

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Personalcolor
        fields = ['img']
