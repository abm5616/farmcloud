from django.db import models
from django.core.validators import MinValueValidator


class AnimalType(models.TextChoices):
    GOAT = 'GOAT', 'Goat'
    SHEEP = 'SHEEP', 'Sheep'


class AnimalStatus(models.TextChoices):
    AVAILABLE = 'AVAILABLE', 'Available'
    RESERVED = 'RESERVED', 'Reserved'
    SOLD = 'SOLD', 'Sold'
    PROCESSING = 'PROCESSING', 'Processing'


class Breed(models.Model):
    """Livestock breed information"""
    name = models.CharField(max_length=100)
    animal_type = models.CharField(max_length=10, choices=AnimalType.choices)
    description = models.TextField(blank=True)
    typical_weight_min = models.DecimalField(max_digits=5, decimal_places=2, help_text="Minimum weight in kg")
    typical_weight_max = models.DecimalField(max_digits=5, decimal_places=2, help_text="Maximum weight in kg")
    
    class Meta:
        ordering = ['animal_type', 'name']
        
    def __str__(self):
        return f"{self.name} ({self.get_animal_type_display()})"


class Animal(models.Model):
    """Individual animal in inventory"""
    tag_number = models.CharField(max_length=50, unique=True, help_text="Unique identification tag")
    animal_type = models.CharField(max_length=10, choices=AnimalType.choices)
    breed = models.ForeignKey(Breed, on_delete=models.PROTECT, related_name='animals')
    
    # Physical attributes
    weight = models.DecimalField(max_digits=6, decimal_places=2, validators=[MinValueValidator(0)], help_text="Weight in kg")
    age_months = models.PositiveIntegerField(help_text="Age in months")
    gender = models.CharField(max_length=10, choices=[('MALE', 'Male'), ('FEMALE', 'Female')])
    color = models.CharField(max_length=50, blank=True)
    
    # Status & Pricing
    status = models.CharField(max_length=20, choices=AnimalStatus.choices, default=AnimalStatus.AVAILABLE)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    
    # Metadata
    date_acquired = models.DateField()
    location = models.CharField(max_length=100, default='Main Farm')
    health_notes = models.TextField(blank=True)
    image = models.ImageField(upload_to='animals/', blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'animal_type']),
            models.Index(fields=['tag_number']),
        ]
    
    def __str__(self):
        return f"{self.tag_number} - {self.breed.name} ({self.weight}kg)"


class Offer(models.Model):
    """Product offers/packages for customers"""
    
    OFFER_TYPE = [
        ('WHOLE', 'Whole Animal'),
        ('HALF', 'Half Animal'),
        ('QUARTER', 'Quarter Animal'),
        ('PACKAGE', 'Mixed Package'),
        ('CUTS', 'Specific Cuts'),
    ]
    
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    offer_type = models.CharField(max_length=20, choices=OFFER_TYPE)
    animal_type = models.CharField(max_length=10, choices=AnimalType.choices, blank=True)
    
    description = models.TextField()
    details = models.TextField(blank=True, help_text="Additional details (weight range, cuts included, etc.)")
    
    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="For showing discounts")
    
    # Availability
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    stock_quantity = models.PositiveIntegerField(default=0, help_text="Available quantity")
    
    # Media
    image = models.ImageField(upload_to='offers/', blank=True, null=True)
    
    # Metadata
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['display_order', '-created_at']
    
    def __str__(self):
        return self.name
    
    @property
    def is_on_sale(self):
        return self.original_price and self.original_price > self.price
    
    @property
    def discount_percentage(self):
        if self.is_on_sale:
            return round(((self.original_price - self.price) / self.original_price) * 100)
        return 0
