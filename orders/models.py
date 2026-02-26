from django.db import models
from django.core.validators import MinValueValidator
from django.utils import timezone
from customers.models import Customer
from inventory.models import Animal, Offer


class OrderStatus(models.TextChoices):
    PENDING = 'PENDING', 'Pending'
    CONFIRMED = 'CONFIRMED', 'Confirmed'
    PREPARING = 'PREPARING', 'Preparing'
    READY = 'READY', 'Ready for Delivery'
    OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY', 'Out for Delivery'
    DELIVERED = 'DELIVERED', 'Delivered'
    COMPLETED = 'COMPLETED', 'Completed'
    CANCELLED = 'CANCELLED', 'Cancelled'


class PaymentStatus(models.TextChoices):
    UNPAID = 'UNPAID', 'Unpaid'
    PARTIAL = 'PARTIAL', 'Partially Paid'
    PAID = 'PAID', 'Paid'
    REFUNDED = 'REFUNDED', 'Refunded'


class PaymentMethod(models.TextChoices):
    CASH = 'CASH', 'Cash'
    CARD = 'CARD', 'Card'
    BANK_TRANSFER = 'BANK_TRANSFER', 'Bank Transfer'
    ONLINE = 'ONLINE', 'Online Payment'


class DeliveryMethod(models.TextChoices):
    FARM_PICKUP = 'FARM_PICKUP', 'Farm Pickup'
    HOME_DELIVERY = 'HOME_DELIVERY', 'Home Delivery'


class Order(models.Model):
    """Customer orders"""
    
    # Order Reference
    order_number = models.CharField(max_length=50, unique=True, editable=False)
    
    # Customer
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name='orders')
    
    # Order Details
    status = models.CharField(max_length=20, choices=OrderStatus.choices, default=OrderStatus.PENDING)
    
    # Delivery
    delivery_method = models.CharField(max_length=20, choices=DeliveryMethod.choices)
    delivery_address = models.TextField(blank=True, help_text="Full delivery address")
    delivery_date = models.DateField(null=True, blank=True)
    delivery_time_slot = models.CharField(max_length=50, blank=True, help_text="e.g., 2:00 PM - 4:00 PM")
    delivery_notes = models.TextField(blank=True)
    
    # Payment
    payment_status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.UNPAID)
    payment_method = models.CharField(max_length=20, choices=PaymentMethod.choices, blank=True)
    
    # Pricing
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    delivery_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Notes
    customer_notes = models.TextField(blank=True, help_text="Notes from customer")
    internal_notes = models.TextField(blank=True, help_text="Internal notes for staff")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order_number']),
            models.Index(fields=['status', 'delivery_date']),
            models.Index(fields=['customer', '-created_at']),
        ]
    
    def __str__(self):
        return f"Order #{self.order_number} - {self.customer.full_name}"
    
    def save(self, *args, **kwargs):
        if not self.order_number:
            # Generate order number: ORD-YYYYMMDD-XXXX
            from django.db.models import Max
            today = timezone.now().date().strftime('%Y%m%d')
            last_order = Order.objects.filter(order_number__startswith=f'ORD-{today}').aggregate(Max('order_number'))
            if last_order['order_number__max']:
                last_number = int(last_order['order_number__max'].split('-')[-1])
                new_number = last_number + 1
            else:
                new_number = 1
            self.order_number = f'ORD-{today}-{new_number:04d}'
        
        # Calculate total
        self.total_amount = self.subtotal + self.delivery_fee - self.discount_amount
        
        # Update payment status based on amount paid
        if self.amount_paid >= self.total_amount:
            self.payment_status = PaymentStatus.PAID
        elif self.amount_paid > 0:
            self.payment_status = PaymentStatus.PARTIAL
        else:
            self.payment_status = PaymentStatus.UNPAID
        
        super().save(*args, **kwargs)
    
    @property
    def balance_due(self):
        """Remaining amount to be paid"""
        return max(0, self.total_amount - self.amount_paid)


class OrderItem(models.Model):
    """Individual items in an order"""
    
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    
    # Link to either an animal or an offer
    animal = models.ForeignKey(Animal, on_delete=models.PROTECT, null=True, blank=True, related_name='order_items')
    offer = models.ForeignKey(Offer, on_delete=models.PROTECT, null=True, blank=True, related_name='order_items')
    
    # Item details (stored to preserve data even if animal/offer changes)
    item_name = models.CharField(max_length=200)
    item_description = models.TextField(blank=True)
    
    quantity = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    total_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    
    # Processing instructions
    processing_instructions = models.TextField(blank=True, help_text="Cutting, packaging preferences")
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['id']
    
    def __str__(self):
        return f"{self.item_name} x{self.quantity}"
    
    def save(self, *args, **kwargs):
        self.total_price = self.quantity * self.unit_price
        super().save(*args, **kwargs)


class Delivery(models.Model):
    """Delivery tracking for orders"""
    
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='delivery')
    
    driver_name = models.CharField(max_length=100, blank=True)
    driver_phone = models.CharField(max_length=15, blank=True)
    vehicle_info = models.CharField(max_length=100, blank=True)
    
    dispatched_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    
    delivery_notes = models.TextField(blank=True)
    customer_signature = models.ImageField(upload_to='signatures/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Delivery for {self.order.order_number}"
