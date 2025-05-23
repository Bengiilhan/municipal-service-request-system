from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceRequestViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'requests', ServiceRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
from .views import register_user

urlpatterns += [
    path('register/', register_user, name='register'),
]

from .views import user_info

urlpatterns += [
    path('user-info/', user_info, name='user_info'),
]

from django.conf import settings
from django.conf.urls.static import static

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
