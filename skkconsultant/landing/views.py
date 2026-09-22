from accounts.auth_views import AnonymousView

class Index(AnonymousView):
    def handle_get(self):
        self.html = 'landing/index.html'
