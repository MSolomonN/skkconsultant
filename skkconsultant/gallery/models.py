from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-created_at',)
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name
    
class Image(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='gallery')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-created_at',)

class BeforeAfter(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    image_before = models.ImageField(upload_to='gallery')
    image_after = models.ImageField(upload_to='gallery')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-created_at',)
        verbose_name = 'Before After Image'
        verbose_name_plural = 'Before After Images'
