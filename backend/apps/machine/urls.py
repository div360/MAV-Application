from django.urls import path
from .views import MachineView

urlpatterns = [
    path('', MachineView.as_view(), name='machine'),
]
