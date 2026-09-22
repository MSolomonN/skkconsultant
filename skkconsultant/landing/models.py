from django.db import models

class Review(models.Model):
    name = models.CharField(max_length=100)
    rating = models.IntegerField(default=0)
    description = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-created_at',)
