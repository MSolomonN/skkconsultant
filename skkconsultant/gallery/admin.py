from django.contrib import admin
from .models import Category, Image, BeforeAfter

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'updated_at', 'created_at')

@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ('category', 'image', 'updated_at', 'created_at')
    list_filter = ('category',)

@admin.register(BeforeAfter)
class BeforeAfterAdmin(admin.ModelAdmin):
    list_display = ('category', 'image_before', 'image_after', 'updated_at', 'created_at')
    list_filter = ('category',)
