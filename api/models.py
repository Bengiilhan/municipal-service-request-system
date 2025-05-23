from django.db import models
from django.contrib.auth.models import User

class ServiceRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Beklemede'),
        ('in_progress', 'İşlemde'),
        ('resolved', 'Tamamlandı'),
    ]

    citizen = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='images/', null=True, blank=True)
    video = models.FileField(upload_to='videos/', null=True, blank=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.status}"
