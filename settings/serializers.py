from rest_framework import serializers
from .models import Settings

class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = [
            'id', 'currency', 'timezone', 'language',
            'business_name', 'email', 'phone', 'address',
            'email_notifications', 'sms_notifications', 
            'order_alerts', 'low_stock_alerts',
            'delivery_fee', 'tax_rate', 'min_order_amount',
            'updated_at', 'updated_by'
        ]
        read_only_fields = ['id', 'updated_at']
