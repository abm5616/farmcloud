from django.db import models

class Settings(models.Model):
    """Application settings - Single instance model"""
    
    # General Settings
    currency = models.CharField(max_length=3, default='AED')
    timezone = models.CharField(max_length=50, default='Asia/Dubai')
    language = models.CharField(max_length=2, default='en')
    
    # Business Information
    business_name = models.CharField(max_length=255, default='FarmCloud Livestock')
    email = models.EmailField(default='admin@farmcloud.ae')
    phone = models.CharField(max_length=20, default='+971 50 123 4567')
    address = models.TextField(default='Dubai, UAE')
    
    # Notifications
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    order_alerts = models.BooleanField(default=True)
    low_stock_alerts = models.BooleanField(default=True)
    
    # Pricing
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=50.00)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=5.00)
    min_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=100.00)
    
    # Metadata
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.CharField(max_length=100, blank=True, null=True)
    
    class Meta:
        db_table = 'settings'
        verbose_name = 'Settings'
        verbose_name_plural = 'Settings'
    
    def save(self, *args, **kwargs):
        # Ensure only one instance exists
        self.pk = 1
        super().save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):
        # Prevent deletion
        pass
    
    @classmethod
    def load(cls):
        """Get or create the settings instance"""
        obj, created = cls.objects.get_or_create(pk=1)
        return obj
    
    def __str__(self):
        return f"Settings - {self.business_name}"
