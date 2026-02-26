from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, OrderItemViewSet, DeliveryViewSet

app_name = 'orders'

router = DefaultRouter()
router.register(r'orders', OrderViewSet)
router.register(r'order-items', OrderItemViewSet)
router.register(r'deliveries', DeliveryViewSet)

urlpatterns = router.urls
