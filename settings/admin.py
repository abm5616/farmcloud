from django.contrib import admin
from .models import Settings

@admin.register(Settings)
class SettingsAdmin(admin.ModelAdmin):
    list_display = ['business_name', 'email', 'phone', 'currency', 'updated_at']
    fieldsets = (
        ('General Settings', {
            'fields': ('currency', 'timezone', 'language')
        }),
        ('Business Information', {
            'fields': ('business_name', 'email', 'phone', 'address')
        }),
        ('Notifications', {
            'fields': ('email_notifications', 'sms_notifications', 'order_alerts', 'low_stock_alerts')
        }),
        ('Pricing', {
            'fields': ('delivery_fee', 'tax_rate', 'min_order_amount')
        }),
        ('Metadata', {
            'fields': ('updated_at', 'updated_by'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ['updated_at']
    
    def has_add_permission(self, request):
        # Prevent adding more than one instance
        return not Settings.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # Prevent deletion
        return False
