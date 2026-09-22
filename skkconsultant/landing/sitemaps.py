from django.contrib.sitemaps import Sitemap
from django.urls import reverse

class StaticViewSitemap(Sitemap):
    def items(self):
        return [
            'landing:index',
            'landing:about',
            'landing:services',
            'landing:contact',
            'landing:gallery',
        ]

    def location(self, item):
        return reverse(item)
