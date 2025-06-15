from rest_framework import serializers
from .models import ServiceRequest
from django.contrib.auth.models import User


class ServiceRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceRequest
        fields = '__all__'
        read_only_fields = ['citizen', 'is_deleted']

    def create(self, validated_data):
        validated_data['citizen'] = self.context['request'].user
        return super().create(validated_data)

class AdminUpdateRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceRequest
        fields = ['is_deleted']
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


