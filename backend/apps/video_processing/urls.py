from django.urls import path
from .views import VideoProcessView

urlpatterns = [
    path('', VideoProcessView.as_view(), name='video-process'),
]
