from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BreedViewSet, AnimalViewSet, OfferViewSet

app_name = 'inventory'

router = DefaultRouter()
router.register(r'breeds', BreedViewSet)
router.register(r'animals', AnimalViewSet)
router.register(r'offers', OfferViewSet)

urlpatterns = router.urls
