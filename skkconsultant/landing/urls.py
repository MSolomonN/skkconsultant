from django.urls import path
from .views import *

app_name = 'landing'

urlpatterns = [
    path('', Index.as_view(), name='index'),
    path('about/', About.as_view(), name='about'),
    path('contact/', Contact.as_view(), name='contact'),
    path('gallery/', Gallery.as_view(), name='gallery'),
    path('services/', Services.as_view(), name='services'),
]
