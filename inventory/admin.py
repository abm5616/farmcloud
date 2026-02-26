from django.contrib import admin
from django.utils.html import format_html
from .models import Breed, Animal, Offer


@admin.register(Breed)
class BreedAdmin(admin.ModelAdmin):
    list_display = ['name', 'animal_type', 'typical_weight_range', 'animal_count']
    list_filter = ['animal_type']
    search_fields = ['name', 'description']
    
    def typical_weight_range(self, obj):
        return f"{obj.typical_weight_min} - {obj.typical_weight_max} kg"
    typical_weight_range.short_description = 'Weight Range'
    
    def animal_count(self, obj):
        return obj.animals.count()
    animal_count.short_description = 'Animals'


@admin.register(Animal)
class AnimalAdmin(admin.ModelAdmin):
    list_display = ['tag_number', 'breed', 'animal_type', 'weight', 'age_months', 'gender', 'status_badge', 'price', 'location']
    list_filter = ['status', 'animal_type', 'gender', 'breed', 'location']
    search_fields = ['tag_number', 'breed__name']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('tag_number', 'animal_type', 'breed')
        }),
        ('Physical Attributes', {
            'fields': ('weight', 'age_months', 'gender', 'color', 'image')
        }),
        ('Status & Pricing', {
            'fields': ('status', 'price', 'location')
        }),
        ('Additional Info', {
            'fields': ('date_acquired', 'health_notes')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def status_badge(self, obj):
        colors = {
            'AVAILABLE': '#28a745',
            'RESERVED': '#ffc107',
            'SOLD': '#6c757d',
            'PROCESSING': '#17a2b8',
        }
        color = colors.get(obj.status, '#000')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    actions = ['mark_as_available', 'mark_as_sold']
    
    def mark_as_available(self, request, queryset):
        queryset.update(status='AVAILABLE')
    mark_as_available.short_description = "Mark selected as Available"
    
    def mark_as_sold(self, request, queryset):
        queryset.update(status='SOLD')
    mark_as_sold.short_description = "Mark selected as Sold"


@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ['name', 'offer_type', 'animal_type', 'price_display', 'stock_quantity', 'is_active', 'is_featured']
    list_filter = ['is_active', 'is_featured', 'offer_type', 'animal_type']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'offer_type', 'animal_type')
        }),
        ('Content', {
            'fields': ('description', 'details', 'image')
        }),
        ('Pricing', {
            'fields': ('price', 'original_price')
        }),
        ('Availability', {
            'fields': ('is_active', 'is_featured', 'stock_quantity', 'display_order')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def price_display(self, obj):
        if obj.is_on_sale:
            return format_html(
                '<strong>AED {}</strong> <del style="color: #999;">AED {}</del> <span style="color: #d9534f;">-{}%</span>',
                obj.price, obj.original_price, obj.discount_percentage
            )
        return f"AED {obj.price}"
    price_display.short_description = 'Price'
