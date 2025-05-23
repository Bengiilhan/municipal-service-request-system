from django.shortcuts import render

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import ServiceRequest
from .serializers import ServiceRequestSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

class ServiceRequestViewSet(viewsets.ModelViewSet):
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    queryset = ServiceRequest.objects.all().order_by('-created_at')
    serializer_class = ServiceRequestSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Kullanıcı adı zaten var.'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password)
    return Response({'message': 'Kayıt başarılı!'}, status=status.HTTP_201_CREATED)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_info(request):
    user = request.user
    return Response({
        'username': user.username,
        'is_staff': user.is_staff,
        'id': user.id,
    })
