from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db.models.signals import post_save
from random import randint

class UserManager(BaseUserManager):
    """Define a model manager for user model with no username field."""
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular user with the given email and password."""
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)

class User(AbstractUser):
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    username = None
    
    unique_id = models.CharField(max_length=250, unique=True, null=True, blank=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=13, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    objects = UserManager()

    class Meta:
        ordering = ('-created_at',)

    def __str__(self):
        return self.get_identity()
    
    def get_identity(self):
        if self.first_name and self.last_name:
            return f'{self.first_name} {self.last_name}'
        else:
            return self.email

    def generate_unique_id(self):
        strng = 'abc0def1gh2ijk3lmn4op5qrs6tu7vw8xyz9'
        last_index = len(strng) - 1
        length = 30
        unique_id = ''
        
        for i in range(length): 
            rand_index = randint(0, last_index)
            unique_id += strng[rand_index]

        return unique_id
    
    def post_save(sender, instance, **kwargs):
        # save slug
        if not instance.unique_id:
            instance.unique_id = instance.generate_unique_id()
            instance.save()

# signals
post_save.connect(User.post_save, sender=User)
