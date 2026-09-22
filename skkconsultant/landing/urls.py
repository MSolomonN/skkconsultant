from django.urls import path
from .views import *

app_name = 'landing'

urlpatterns = [
    path('', Index.as_view(), name='landing-index'),
]
