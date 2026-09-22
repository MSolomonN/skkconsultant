from django.urls import path
from .views import *

app_name = 'landing'

urlpatterns = [
    path('', Index.as_view(), name='landing-index'),
    path('about/', About.as_view(), name='landing-about'),
    path('contact/', Contact.as_view(), name='landing-contact'),
    path('gallery/', Gallery.as_view(), name='landing-gallery'),
    path('services/', Services.as_view(), name='landing-services'),
]
