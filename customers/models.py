from django.db import models
from django.core.validators import RegexValidator


class Customer(models.Model):
    """Customer contact information and order history"""
    
    # Contact Information
    full_name = models.CharField(max_length=200)
    phone_regex = RegexValidator(regex=r'^\+?971[0-9]{9}$|^0[0-9]{9}$', message="Phone number must be in UAE format")
    phone_number = models.CharField(validators=[phone_regex], max_length=15, unique=True)
    email = models.EmailField(blank=True)
    
    # Address
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100)
    emirate = models.CharField(max_length=50, choices=[
        ('ABU_DHABI', 'Abu Dhabi'),
        ('DUBAI', 'Dubai'),
        ('SHARJAH', 'Sharjah'),
        ('AJMAN', 'Ajman'),
        ('UMM_AL_QUWAIN', 'Umm Al Quwain'),
        ('RAS_AL_KHAIMAH', 'Ras Al Khaimah'),
        ('FUJAIRAH', 'Fujairah'),
    ])
    postal_code = models.CharField(max_length=10, blank=True)
    
    # Customer Type
    customer_type = models.CharField(max_length=20, choices=[
        ('INDIVIDUAL', 'Individual'),
        ('BUSINESS', 'Business'),
    ], default='INDIVIDUAL')
    
    # Preferences
    preferred_language = models.CharField(max_length=10, choices=[
        ('EN', 'English'),
        ('AR', 'Arabic'),
    ], default='EN')
    whatsapp_number = models.CharField(max_length=15, blank=True, help_text="If different from phone")
    
    # Notes
    notes = models.TextField(blank=True, help_text="Internal notes about customer")
    
    # Status
    is_active = models.BooleanField(default=True)
    is_vip = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_order_date = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['phone_number']),
            models.Index(fields=['email']),
            models.Index(fields=['-last_order_date']),
        ]
    
    def __str__(self):
        return f"{self.full_name} ({self.phone_number})"
    
    @property
    def total_orders_count(self):
        """Count of all orders"""
        return self.orders.count()
    
    @property
    def total_spent(self):
        """Total amount spent by customer"""
        from django.db.models import Sum
        from orders.models import OrderStatus
        return self.orders.filter(
            status__in=[OrderStatus.COMPLETED, OrderStatus.DELIVERED]
        ).aggregate(total=Sum('total_amount'))['total'] or 0
    
    @property
    def display_emirate(self):
        """Human readable emirate name"""
        return self.get_emirate_display()
