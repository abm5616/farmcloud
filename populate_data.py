"""
Populate database with sample data
Run: docker-compose exec web python populate_data.py
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'farmcloud.settings')
django.setup()

from customers.models import Customer
from inventory.models import Breed, Animal, Offer
from orders.models import Order, OrderItem
from datetime import date, datetime, timedelta

print("🐐 Populating FarmCloud database with sample data...\n")

# Clear existing data
print("Clearing existing data...")
OrderItem.objects.all().delete()
Order.objects.all().delete()
Animal.objects.all().delete()
Offer.objects.all().delete()
Breed.objects.all().delete()
Customer.objects.all().delete()
print("✓ Cleared\n")

# Create Breeds
print("Creating breeds...")
breeds = [
    Breed.objects.create(name="Boer", animal_type="GOAT", description="Premium meat goat breed", typical_weight_min=25, typical_weight_max=35),
    Breed.objects.create(name="Damascus", animal_type="GOAT", description="Large Syrian goat", typical_weight_min=30, typical_weight_max=40),
    Breed.objects.create(name="Najdi", animal_type="SHEEP", description="Traditional Arabian sheep", typical_weight_min=35, typical_weight_max=45),
    Breed.objects.create(name="Awassi", animal_type="SHEEP", description="Hardy Middle Eastern sheep", typical_weight_min=38, typical_weight_max=48),
]
print(f"✓ Created {len(breeds)} breeds\n")

# Create Animals
print("Creating animals...")
animals = [
    Animal.objects.create(tag_number="GT-001", animal_type="GOAT", breed=breeds[0], weight=28.5, age_months=18, gender="MALE", status="AVAILABLE", price=1200, date_acquired=date(2025, 12, 1), location="Main Farm"),
    Animal.objects.create(tag_number="GT-002", animal_type="GOAT", breed=breeds[0], weight=26.0, age_months=16, gender="FEMALE", status="AVAILABLE", price=1100, date_acquired=date(2025, 12, 5), location="Main Farm"),
    Animal.objects.create(tag_number="GT-003", animal_type="GOAT", breed=breeds[1], weight=32.0, age_months=20, gender="MALE", status="RESERVED", price=1400, date_acquired=date(2025, 11, 15), location="Main Farm"),
    Animal.objects.create(tag_number="SH-001", animal_type="SHEEP", breed=breeds[2], weight=38.0, age_months=24, gender="FEMALE", status="AVAILABLE", price=1800, date_acquired=date(2025, 11, 20), location="Main Farm"),
    Animal.objects.create(tag_number="SH-002", animal_type="SHEEP", breed=breeds[3], weight=40.5, age_months=28, gender="MALE", status="AVAILABLE", price=2000, date_acquired=date(2025, 10, 10), location="Main Farm"),
    Animal.objects.create(tag_number="GT-004", animal_type="GOAT", breed=breeds[0], weight=27.0, age_months=17, gender="MALE", status="AVAILABLE", price=1150, date_acquired=date(2026, 1, 5), location="Main Farm"),
]
print(f"✓ Created {len(animals)} animals\n")

# Create Offers
print("Creating offers...")
offers = [
    Offer.objects.create(name="Whole Goat - Boer Breed", slug="whole-goat-boer", offer_type="WHOLE", animal_type="GOAT", description="Premium Boer breed goat, 25-30kg live weight", price=1200, is_active=True, is_featured=True, stock_quantity=8, display_order=1),
    Offer.objects.create(name="Whole Sheep - Najdi", slug="whole-sheep-najdi", offer_type="WHOLE", animal_type="SHEEP", description="Traditional Najdi sheep, 35-40kg live weight", price=1800, is_active=True, is_featured=True, stock_quantity=5, display_order=2),
    Offer.objects.create(name="Half Goat - Mixed Cut", slug="half-goat-mixed", offer_type="HALF", animal_type="GOAT", description="Fresh mixed cuts, approximately 12kg", price=650, original_price=750, is_active=True, is_featured=False, stock_quantity=12, display_order=3),
    Offer.objects.create(name="Family Pack", slug="family-pack", offer_type="PACKAGE", description="Mixed goat & sheep, 5kg premium cuts", price=450, is_active=True, is_featured=True, stock_quantity=20, display_order=4),
    Offer.objects.create(name="Premium Cuts Package", slug="premium-cuts", offer_type="CUTS", description="Best cuts selection, 3kg", price=580, original_price=650, is_active=True, is_featured=False, stock_quantity=15, display_order=5),
]
print(f"✓ Created {len(offers)} offers\n")

# Create Customers
print("Creating customers...")
customers = [
    Customer.objects.create(
        full_name="Mohammed Al-Rashid", phone_number="+971501234567", email="mohammed@example.com",
        address_line1="123 Dubai Marina", city="Dubai", emirate="DUBAI",
        customer_type="INDIVIDUAL", is_vip=True, is_active=True
    ),
    Customer.objects.create(
        full_name="Fatima Khalil", phone_number="+971509876543", email="fatima@example.com",
        address_line1="456 Sharjah Road", city="Sharjah", emirate="SHARJAH",
        customer_type="INDIVIDUAL", is_active=True
    ),
    Customer.objects.create(
        full_name="Ali Hassan", phone_number="+971505551234", email="ali@example.com",
        address_line1="789 Abu Dhabi Ave", city="Abu Dhabi", emirate="ABU_DHABI",
        customer_type="BUSINESS", is_vip=True, is_active=True
    ),
]
print(f"✓ Created {len(customers)} customers\n")

# Create Orders
print("Creating orders...")
orders = []

# Order 1
order1 = Order.objects.create(
    customer=customers[0],
    status="PENDING",
    delivery_method="HOME_DELIVERY",
    delivery_address="123 Dubai Marina, Dubai",
    delivery_date=date.today() + timedelta(days=1),
    payment_status="UNPAID",
    payment_method="CASH",
    subtotal=1200,
    delivery_fee=50,
    discount_amount=0,
)
OrderItem.objects.create(order=order1, animal=animals[0], item_name="Whole Goat - Boer", quantity=1, unit_price=1200)
orders.append(order1)

# Order 2
order2 = Order.objects.create(
    customer=customers[1],
    status="CONFIRMED",
    delivery_method="HOME_DELIVERY",
    delivery_address="456 Sharjah Road, Sharjah",
    delivery_date=date.today() + timedelta(days=2),
    payment_status="PAID",
    payment_method="CARD",
    subtotal=900,
    delivery_fee=40,
    discount_amount=50,
    amount_paid=890,
)
OrderItem.objects.create(order=order2, offer=offers[3], item_name="Family Pack", quantity=2, unit_price=450)
orders.append(order2)

# Order 3
order3 = Order.objects.create(
    customer=customers[2],
    status="PREPARING",
    delivery_method="FARM_PICKUP",
    delivery_date=date.today() + timedelta(days=1),
    payment_status="PAID",
    payment_method="BANK_TRANSFER",
    subtotal=1800,
    delivery_fee=0,
    discount_amount=0,
    amount_paid=1800,
)
OrderItem.objects.create(order=order3, animal=animals[3], item_name="Whole Sheep - Najdi", quantity=1, unit_price=1800)
orders.append(order3)

print(f"✓ Created {len(orders)} orders\n")

print("=" * 50)
print("✅ Database populated successfully!")
print("=" * 50)
print(f"\n📊 Summary:")
print(f"   • {len(breeds)} breeds")
print(f"   • {len(animals)} animals")
print(f"   • {len(offers)} offers")
print(f"   • {len(customers)} customers")
print(f"   • {len(orders)} orders")
print(f"\n🌐 Access your data:")
print(f"   • Django Admin: http://localhost:8000/admin")
print(f"   • API: http://localhost:8000/api/")
print(f"   • Frontend: http://localhost:3000")
print()
