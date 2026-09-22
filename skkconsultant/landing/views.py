from django.http import Http404
from accounts.auth_views import AnonymousView
from gallery.models import Category, Image, BeforeAfter
from .models import Review

class Index(AnonymousView):
    def handle_get(self):
        self.html = 'landing/index.html'
        self.context['reviews'] = Review.objects.order_by('?')[:6]

class About(AnonymousView):
    def handle_get(self):
        self.html = 'landing/about.html'

class Gallery(AnonymousView):
    def handle_get(self):
        self.html = 'landing/gallery.html'

        categories = Category.objects.all()
        active_category = None

        if self.slug:
            active_category = next((c for c in categories if c.slug == self.slug), None)
            if active_category is None:
                raise Http404('Unknown gallery category')

        images = Image.objects.filter(category=active_category) if active_category else Image.objects.all()

        self.context['categories'] = categories
        self.context['active_slug'] = active_category.slug if active_category else 'all'
        self.context['images'] = images
        self.context['beforeafters'] = BeforeAfter.objects.all()

class Contact(AnonymousView):
    def handle_get(self):
        self.html = 'landing/contact.html'

class Services(AnonymousView):
    def handle_get(self):
        self.html = 'landing/services.html'
