from rest_framework import serializers
from .models import Customer


class CustomerSerializer(serializers.ModelSerializer):
    total_orders_count = serializers.ReadOnlyField()
    total_spent = serializers.ReadOnlyField()
    
    class Meta:
        model = Customer
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'last_order_date']
