import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient

@pytest.mark.django_db
def test_register_user_success():
    client = APIClient()
    response = client.post('/api/register/', {'username': 'newuser', 'password': 'abc123'})

    assert response.status_code == 201
    assert User.objects.filter(username='newuser').exists()

@pytest.mark.django_db
def test_register_user_duplicate():
    User.objects.create_user(username='existing', password='abc123')

    client = APIClient()
    response = client.post('/api/register/', {'username': 'existing', 'password': 'newpass'})

    assert response.status_code == 400
    assert response.data['error'] == 'Kullanıcı adı zaten var.'
