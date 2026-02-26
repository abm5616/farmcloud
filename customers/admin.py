from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Count, Sum
from .models import Customer


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'phone_number', 'emirate', 'customer_type', 'orders_count', 'total_spent_display', 'vip_badge', 'last_order_date']
    list_filter = ['emirate', 'customer_type', 'is_vip', 'is_active', 'preferred_language']
    search_fields = ['full_name', 'phone_number', 'email', 'address_line1', 'city']
    readonly_fields = ['created_at', 'updated_at', 'last_order_date', 'orders_count', 'total_spent_display']
    
    fieldsets = (
        ('Contact Information', {
            'fields': ('full_name', 'phone_number', 'email', 'whatsapp_number')
        }),
        ('Address', {
            'fields': ('address_line1', 'address_line2', 'city', 'emirate', 'postal_code')
        }),
        ('Customer Details', {
            'fields': ('customer_type', 'preferred_language', 'is_vip', 'is_active')
        }),
        ('Analytics', {
            'fields': ('orders_count', 'total_spent_display', 'last_order_date'),
            'classes': ('collapse',)
        }),
        ('Notes', {
            'fields': ('notes',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def orders_count(self, obj):
        return obj.total_orders_count
    orders_count.short_description = 'Total Orders'
    
    def total_spent_display(self, obj):
        total = obj.total_spent
        return format_html('<strong>AED {:,.2f}</strong>', total)
    total_spent_display.short_description = 'Total Spent'
    
    def vip_badge(self, obj):
        if obj.is_vip:
            return format_html('<span style="background-color: #ffc107; color: #000; padding: 3px 8px; border-radius: 3px; font-weight: bold;">⭐ VIP</span>')
        return ''
    vip_badge.short_description = 'Status'
    
    actions = ['mark_as_vip', 'remove_vip_status']
    
    def mark_as_vip(self, request, queryset):
        queryset.update(is_vip=True)
    mark_as_vip.short_description = "Mark as VIP"
    
    def remove_vip_status(self, request, queryset):
        queryset.update(is_vip=False)
    remove_vip_status.short_description = "Remove VIP status"
    
    # Add a custom view for top customers
    def changelist_view(self, request, extra_context=None):
        # Get top spending customers
        extra_context = extra_context or {}
        
        # This will be shown in the admin changelist
        return super().changelist_view(request, extra_context=extra_context)
