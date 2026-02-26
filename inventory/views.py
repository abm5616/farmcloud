from rest_framework import viewsets, filters
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import Breed, Animal, Offer
from .serializers import BreedSerializer, AnimalSerializer, OfferSerializer


class BreedViewSet(viewsets.ModelViewSet):
    queryset = Breed.objects.all().order_by('animal_type', 'name')
    serializer_class = BreedSerializer
    permission_classes = [AllowAny]  # Changed for development
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['animal_type']
    search_fields = ['name']


class AnimalViewSet(viewsets.ModelViewSet):
    queryset = Animal.objects.all().order_by('-created_at')
    serializer_class = AnimalSerializer
    permission_classes = [AllowAny]  # Changed for development
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'animal_type', 'breed', 'gender', 'location']
    search_fields = ['tag_number', 'breed__name']
    ordering_fields = ['created_at', 'weight', 'price']


class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.all().order_by('display_order', '-created_at')
    serializer_class = OfferSerializer
    permission_classes = [AllowAny]  # Changed for development
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_active', 'is_featured', 'offer_type', 'animal_type']
    search_fields = ['name', 'description']
