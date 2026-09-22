from django.shortcuts import render, reverse, redirect
from django.views import View
from django.http import JsonResponse

class AnonymousView(View):
    html = None
    redirect = None
    context = {}

    def handle_get(self): 
        pass

    def handle_post(self): 
        pass

    def set_base_context(self):
        self.context = {
            **self.context, 
        }
    
    def get(self, request, slug=None):
        self.request = request
        self.slug = slug
        
        self.handle_get()
        self.set_base_context()

        # return if any redirect was set
        if self.redirect: return redirect(self.redirect)
            
        return render(request, self.html, self.context)
    

    def post(self, request):
        self.request = request

        self.handle_post()
        self.context = {
            **self.context,
        }
        
        return JsonResponse(self.context)
