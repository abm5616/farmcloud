from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = [
        ('ADMIN', 'Administrator'),
        ('MANAGER', 'Manager'),
        ('STAFF', 'Staff'),
        ('DELIVERY', 'Delivery'),
    ]
    
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='STAFF')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    avatar = models.CharField(max_length=1, blank=True, null=True)
    last_login_display = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'users'
        ordering = ['-date_joined']
    
    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.role})"
    
    def save(self, *args, **kwargs):
        # Auto-generate avatar from first letter of first name
        if not self.avatar and self.first_name:
            self.avatar = self.first_name[0].upper()
        elif not self.avatar and self.username:
            self.avatar = self.username[0].upper()
        super().save(*args, **kwargs)
