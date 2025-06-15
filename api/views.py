from django.shortcuts import render
from django.contrib.auth.models import User

from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, IsAdminUser
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import ServiceRequest
from .serializers import ServiceRequestSerializer, AdminUpdateRequestSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class ServiceRequestViewSet(viewsets.ModelViewSet):
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    serializer_class = ServiceRequestSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = ServiceRequest.objects.all().order_by('-created_at')

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.is_staff:
            # Yöneticiye tüm veriler (silinen dahil) gösterilsin
            return ServiceRequest.objects.all().order_by('-created_at')
        else:
            # Normal kullanıcılar silinmeyenleri görsün
            return ServiceRequest.objects.filter(is_deleted=False).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(citizen=self.request.user)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_deleted = True
        instance.save()
        return Response({'status': 'deleted'}, status=status.HTTP_204_NO_CONTENT)


# ✅ Kullanıcı kayıt
@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Kullanıcı adı zaten var.'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password)
    return Response({'message': 'Kayıt başarılı!'}, status=status.HTTP_201_CREATED)


# ✅ Giriş yapan kullanıcının bilgileri
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_info(request):
    user = request.user
    return Response({
        'username': user.username,
        'is_staff': user.is_staff,
        'id': user.id,
    })


# ✅ Talebi silindi olarak işaretle
@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def mark_request_deleted(request, pk):
    try:
        service_request = ServiceRequest.objects.get(pk=pk)
    except ServiceRequest.DoesNotExist:
        return Response({"error": "Talep bulunamadı."}, status=status.HTTP_404_NOT_FOUND)

    serializer = AdminUpdateRequestSerializer(service_request, data={'is_deleted': True}, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Talep silindi olarak işaretlendi."})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Silmeyi geri al
@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def undo_request_deletion(request, pk):
    try:
        service_request = ServiceRequest.objects.get(pk=pk)
    except ServiceRequest.DoesNotExist:
        return Response({"error": "Talep bulunamadı."}, status=status.HTTP_404_NOT_FOUND)

    serializer = AdminUpdateRequestSerializer(service_request, data={'is_deleted': False}, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Silme işlemi geri alındı."})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
