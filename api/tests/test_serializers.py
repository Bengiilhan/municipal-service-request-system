import pytest
from rest_framework.test import APIRequestFactory
from django.contrib.auth.models import User
from api.serializers import ServiceRequestSerializer

@pytest.mark.django_db
def test_service_request_serializer_creates_citizen_automatically():
    # Kullanıcı oluştur
    user = User.objects.create_user(username='testuser', password='testpass')

    # Sahte istek oluştur
    factory = APIRequestFactory()
    request = factory.post('/api/servicerequests/')
    request.user = user

    # Giriş verisi
    data = {
        "title": "Kaldırım Çökmesi",
        "description": "Yolda büyük bir çökme oluştu.",
        "latitude": 38.41,
        "longitude": 27.12
    }

    # Serializer çağrısı
    serializer = ServiceRequestSerializer(data=data, context={'request': request})
    assert serializer.is_valid(), serializer.errors  # Geçerli mi kontrol et
    instance = serializer.save()

    # Sonuç doğrulaması
    assert instance.citizen == user
    assert instance.title == "Kaldırım Çökmesi"
