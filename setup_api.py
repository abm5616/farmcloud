"""
Script to create all necessary API files for Django REST Framework
Run this inside Docker: docker-compose exec web python setup_api.py
"""

import os

# Inventory serializers
inventory_serializers = """from rest_framework import serializers
from .models import Breed, Animal, Offer


class BreedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Breed
        fields = '__all__'


class AnimalSerializer(serializers.ModelSerializer):
    breed_name = serializers.CharField(source='breed.name', read_only=True)
    
    class Meta:
        model = Animal
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class OfferSerializer(serializers.ModelSerializer):
    is_on_sale = serializers.ReadOnlyField()
    discount_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = Offer
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
"""

# Inventory views
inventory_views = """from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Breed, Animal, Offer
from .serializers import BreedSerializer, AnimalSerializer, OfferSerializer


class BreedViewSet(viewsets.ModelViewSet):
    queryset = Breed.objects.all().order_by('animal_type', 'name')
    serializer_class = BreedSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['animal_type']
    search_fields = ['name']


class AnimalViewSet(viewsets.ModelViewSet):
    queryset = Animal.objects.all().order_by('-created_at')
    serializer_class = AnimalSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'animal_type', 'breed', 'gender', 'location']
    search_fields = ['tag_number', 'breed__name']
    ordering_fields = ['created_at', 'weight', 'price']


class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.all().order_by('display_order', '-created_at')
    serializer_class = OfferSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_active', 'is_featured', 'offer_type', 'animal_type']
    search_fields = ['name', 'description']
"""

# Orders serializers
orders_serializers = """from rest_framework import serializers
from .models import Order, OrderItem, Delivery


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'
        read_only_fields = ['total_price', 'created_at']


class DeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.full_name', read_only=True)
    balance_due = serializers.ReadOnlyField()
    
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['order_number', 'total_amount', 'created_at', 'updated_at', 'confirmed_at', 'completed_at']
"""

# Orders views
orders_views = """from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Order, OrderItem, Delivery
from .serializers import OrderSerializer, OrderItemSerializer, DeliverySerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().select_related('customer').prefetch_related('items').order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'payment_status', 'delivery_method', 'customer']
    search_fields = ['order_number', 'customer__full_name', 'customer__phone_number']
    ordering_fields = ['created_at', 'delivery_date', 'total_amount']


class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all().order_by('id')
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['order']


class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.all().select_related('order').order_by('-created_at')
    serializer_class = DeliverySerializer
    permission_classes = [IsAuthenticated]
"""

# Update URLs
inventory_urls = """from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BreedViewSet, AnimalViewSet, OfferViewSet

app_name = 'inventory'

router = DefaultRouter()
router.register(r'breeds', BreedViewSet)
router.register(r'animals', AnimalViewSet)
router.register(r'offers', OfferViewSet)

urlpatterns = router.urls
"""

customers_urls = """from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomerViewSet

app_name = 'customers'

router = DefaultRouter()
router.register(r'customers', CustomerViewSet)

urlpatterns = router.urls
"""

orders_urls = """from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, OrderItemViewSet, DeliveryViewSet

app_name = 'orders'

router = DefaultRouter()
router.register(r'orders', OrderViewSet)
router.register(r'order-items', OrderItemViewSet)
router.register(r'deliveries', DeliveryViewSet)

urlpatterns = router.urls
"""

# Write files
files = {
    'inventory/serializers.py': inventory_serializers,
    'inventory/views.py': inventory_views,
    'inventory/urls.py': inventory_urls,
    'orders/serializers.py': orders_serializers,
    'orders/views.py': orders_views,
    'orders/urls.py': orders_urls,
    'customers/urls.py': customers_urls,
}

for filepath, content in files.items():
    with open(filepath, 'w') as f:
        f.write(content)
    print(f"✓ Created {filepath}")

print("\n✅ All API files created successfully!")
print("\nNext steps:")
print("1. Add 'django_filters' to requirements.txt")
print("2. Add 'django_filters' to INSTALLED_APPS in settings.py")
print("3. Restart Django: docker-compose restart web")
