from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ServiceRequestViewSet,
    register_user,
    user_info,
    mark_request_deleted,
    undo_request_deletion
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'requests', ServiceRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register_user, name='register'),
    path('user-info/', user_info, name='user_info'),
    path('mark-deleted/<int:pk>/', mark_request_deleted, name='mark_request_deleted'),
    path('undo-deletion/<int:pk>/', undo_request_deletion, name='undo_request_deletion'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
