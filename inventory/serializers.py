from rest_framework import serializers
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
