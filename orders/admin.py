from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from .models import Order, OrderItem, Delivery


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1
    fields = ['item_name', 'quantity', 'unit_price', 'total_price', 'processing_instructions']
    readonly_fields = ['total_price']


class DeliveryInline(admin.StackedInline):
    model = Delivery
    extra = 0
    fields = ['driver_name', 'driver_phone', 'vehicle_info', 'dispatched_at', 'delivered_at', 'delivery_notes']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'customer_link', 'status_badge', 'payment_badge', 'total_amount', 'delivery_method', 'delivery_date', 'created_at']
    list_filter = ['status', 'payment_status', 'delivery_method', 'delivery_date', 'created_at']
    search_fields = ['order_number', 'customer__full_name', 'customer__phone_number']
    readonly_fields = ['order_number', 'total_amount', 'created_at', 'updated_at', 'confirmed_at', 'completed_at', 'balance_due']
    inlines = [OrderItemInline, DeliveryInline]
    
    fieldsets = (
        ('Order Information', {
            'fields': ('order_number', 'customer', 'status', 'created_at', 'updated_at')
        }),
        ('Delivery Details', {
            'fields': ('delivery_method', 'delivery_address', 'delivery_date', 'delivery_time_slot', 'delivery_notes')
        }),
        ('Payment', {
            'fields': ('payment_status', 'payment_method', 'subtotal', 'delivery_fee', 'discount_amount', 'total_amount', 'amount_paid', 'balance_due')
        }),
        ('Notes', {
            'fields': ('customer_notes', 'internal_notes')
        }),
        ('Timestamps', {
            'fields': ('confirmed_at', 'completed_at'),
            'classes': ('collapse',)
        }),
    )
    
    def customer_link(self, obj):
        from django.urls import reverse
        from django.utils.html import format_html
        url = reverse("admin:customers_customer_change", args=[obj.customer.id])
        return format_html('<a href="{}">{}</a>', url, obj.customer.full_name)
    customer_link.short_description = 'Customer'
    
    def status_badge(self, obj):
        colors = {
            'PENDING': '#6c757d',
            'CONFIRMED': '#28a745',
            'PREPARING': '#ffc107',
            'READY': '#17a2b8',
            'OUT_FOR_DELIVERY': '#9b59b6',
            'DELIVERED': '#28a745',
            'COMPLETED': '#28a745',
            'CANCELLED': '#dc3545',
        }
        color = colors.get(obj.status, '#000')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    def payment_badge(self, obj):
        colors = {
            'UNPAID': '#dc3545',
            'PARTIAL': '#ffc107',
            'PAID': '#28a745',
            'REFUNDED': '#6c757d',
        }
        color = colors.get(obj.payment_status, '#000')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            color, obj.get_payment_status_display()
        )
    payment_badge.short_description = 'Payment'
    
    actions = ['mark_as_confirmed', 'mark_as_preparing', 'mark_as_completed']
    
    def mark_as_confirmed(self, request, queryset):
        queryset.update(status='CONFIRMED', confirmed_at=timezone.now())
    mark_as_confirmed.short_description = "Confirm selected orders"
    
    def mark_as_preparing(self, request, queryset):
        queryset.update(status='PREPARING')
    mark_as_preparing.short_description = "Mark as Preparing"
    
    def mark_as_completed(self, request, queryset):
        queryset.update(status='COMPLETED', completed_at=timezone.now())
    mark_as_completed.short_description = "Mark as Completed"


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'item_name', 'quantity', 'unit_price', 'total_price']
    list_filter = ['order__status']
    search_fields = ['order__order_number', 'item_name']


@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = ['order', 'driver_name', 'driver_phone', 'dispatched_at', 'delivered_at']
    list_filter = ['dispatched_at', 'delivered_at']
    search_fields = ['order__order_number', 'driver_name']
