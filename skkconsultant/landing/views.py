from accounts.auth_views import AnonymousView

class Index(AnonymousView):
    def handle_get(self):
        self.html = 'landing/index.html'

class About(AnonymousView):
    def handle_get(self):
        self.html = 'landing/about.html'

class Gallery(AnonymousView):
    def handle_get(self):
        self.html = 'landing/gallery.html'

class Contact(AnonymousView):
    def handle_get(self):
        self.html = 'landing/contact.html'

class Services(AnonymousView):
    def handle_get(self):
        self.html = 'landing/services.html'
