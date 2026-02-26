# 🚀 FarmCloud - Quick Start Guide

## Prerequisites
- Docker Desktop must be installed and running

## Step 1: Initialize Project (First Time Only)

```powershell
cd C:\Users\user\Documents\farm
.\init-project.ps1
```

This will take 2-3 minutes. It will:
- Generate secure environment variables
- Build Docker containers
- Start PostgreSQL and Django
- Run database migrations

## Step 2: Create Your Admin Account

```powershell
docker-compose exec web python manage.py createsuperuser
```

Enter:
- Username: (your choice)
- Email: (optional)
- Password: (minimum 10 characters)

## Step 3: Access Admin Portal

Open browser: **http://localhost:8000/admin**

Login with the credentials you just created.

## What You Can Do Now

### 1. Add Livestock Breeds
Navigate to: **Inventory → Breeds**
- Click "Add Breed"
- Examples: Boer (Goat), Najdi (Sheep), Damascus (Goat)

### 2. Add Animals to Inventory
Navigate to: **Inventory → Animals**
- Click "Add Animal"
- Assign tag number, breed, weight, status, price

### 3. Create Product Offers
Navigate to: **Inventory → Offers**
- Create packages like "Whole Goat", "Family Pack", etc.

### 4. Add Customers
Navigate to: **Customers → Customers**
- Add customer contact info and addresses
- Mark VIP customers
- View order history and spending

### 5. Create Orders
Navigate to: **Orders → Orders**
- Click "Add Order"
- Select customer
- Add items (animals or offers)
- Set delivery details
- Track payment status

## Daily Operations

### Check Today's Orders
1. Go to **Orders → Orders**
2. Filter by today's date
3. Update order status as you process them

### View Customer Analytics
1. Go to **Customers → Customers**
2. See total orders and spending for each customer
3. Click customer name to see full order history

### Manage Inventory
1. Go to **Inventory → Animals**
2. Filter by status (Available, Sold, etc.)
3. Bulk update status using actions

## Common Tasks

### Mark Order as Confirmed
1. Select order(s) from list
2. Choose "Confirm selected orders" from Actions dropdown
3. Click "Go"

### Track Delivery
1. Open an order
2. Scroll to "Delivery" section
3. Add driver info, dispatch time

### Export Data
1. On any list page, select items
2. Use Export action (if available)

## Tips

- **Use Search**: Every list has a search box - use tag numbers, names, phone numbers
- **Use Filters**: Right sidebar has useful filters
- **Bulk Actions**: Select multiple items and use Actions dropdown
- **Customer Notes**: Add internal notes about preferences or special requests

## Need Help?

View logs:
```powershell
docker-compose logs -f web
```

Restart services:
```powershell
docker-compose restart
```

Stop everything:
```powershell
docker-compose down
```

## Next: Add Contact/Analytics Page

You mentioned wanting a contact page to track who orders more. This data is already available in the **Customers** admin page:
- Sort by "Total Spent" to see top customers
- Sort by "Last Order Date" to see recent activity
- Filter by VIP status

We can create a custom dashboard view if you want more visual analytics!
