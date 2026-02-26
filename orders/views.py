from rest_framework import viewsets, filters
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import Order, OrderItem, Delivery
from .serializers import OrderSerializer, OrderItemSerializer, DeliverySerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().select_related('customer').prefetch_related('items').order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]  # Changed for development
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'payment_status', 'delivery_method', 'customer']
    search_fields = ['order_number', 'customer__full_name', 'customer__phone_number']
    ordering_fields = ['created_at', 'delivery_date', 'total_amount']


class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all().order_by('id')
    serializer_class = OrderItemSerializer
    permission_classes = [AllowAny]  # Changed for development
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['order']


class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.all().select_related('order').order_by('-created_at')
    serializer_class = DeliverySerializer
    permission_classes = [AllowAny]  # Changed for development
