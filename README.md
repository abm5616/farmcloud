# 🐐 FarmCloud Admin Portal

Modern Django-based admin portal for managing livestock inventory, orders, and customers.

## 🚀 Features

- **Inventory Management**: Track individual animals, breeds, and product offers
- **Order Management**: Complete order processing from creation to delivery
- **Customer Tracking**: View customer profiles, order history, and spending analytics
- **Secure & Modern**: Django 5.x with PostgreSQL 16, JWT auth, CORS support
- **Dockerized**: Easy deployment with Docker Compose

## 📋 Requirements

- Docker Desktop for Windows
- Git (optional)

## 🛠️ Quick Start

### 1. Initialize the Project

```powershell
# Navigate to project directory
cd C:\Users\user\Documents\farm

# Run initialization script
.\init-project.ps1
```

This script will:
- Create a secure `.env` file with random SECRET_KEY
- Build Docker containers
- Start PostgreSQL and Django services
- Run database migrations

### 2. Create Admin User

```powershell
docker-compose exec web python manage.py createsuperuser
```

Follow the prompts to create your admin account.

### 3. Access the Admin Portal

Open your browser and go to:
- **Admin Portal**: http://localhost:8000/admin
- **API**: http://localhost:8000/api/

## 📦 Project Structure

```
farm/
├── farmcloud/          # Django project settings
├── inventory/          # Animals, breeds, offers
├── orders/             # Order management
├── customers/          # Customer management
├── mockups/            # UI mockups
├── docker-compose.yml  # Docker configuration
├── Dockerfile          # Django container
├── requirements.txt    # Python dependencies
└── .env                # Environment variables (generated)
```

## 🔧 Common Commands

### Docker Management
```powershell
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f web

# Rebuild containers
docker-compose up -d --build
```

### Django Management
```powershell
# Create migrations
docker-compose exec web python manage.py makemigrations

# Run migrations
docker-compose exec web python manage.py migrate

# Create superuser
docker-compose exec web python manage.py createsuperuser

# Collect static files
docker-compose exec web python manage.py collectstatic --noinput

# Django shell
docker-compose exec web python manage.py shell
```

### Database
```powershell
# Access PostgreSQL
docker-compose exec db psql -U farmcloud -d farmcloud

# Backup database
docker-compose exec db pg_dump -U farmcloud farmcloud > backup.sql

# Restore database
docker-compose exec -T db psql -U farmcloud farmcloud < backup.sql
```

## 📊 Data Models

### Inventory App
- **Breed**: Livestock breed information (Boer, Najdi, etc.)
- **Animal**: Individual animals with tracking tags, weight, status
- **Offer**: Product packages and offerings for customers

### Customers App
- **Customer**: Contact info, address, order history, spending analytics

### Orders App
- **Order**: Complete order details with status tracking
- **OrderItem**: Individual line items in orders
- **Delivery**: Delivery tracking and driver information

## 🎨 Admin Features

The Django admin includes:
- Beautiful custom theme (django-admin-interface)
- Advanced filtering and search
- Inline editing
- Bulk actions
- Export functionality
- Customer analytics dashboard

### Customer Analytics
- Total orders count
- Total amount spent
- Last order date
- VIP status tracking

### Order Tracking
- Automatic order number generation (ORD-YYYYMMDD-XXXX)
- Status workflow (Pending → Confirmed → Preparing → Delivery → Completed)
- Payment tracking with partial payments support
- Delivery scheduling

## 🔐 Security Features

- Environment-based configuration
- Strong password validation (10+ characters)
- JWT authentication for APIs
- CORS protection
- SQL injection prevention (Django ORM)
- XSS protection
- HTTPS-ready (production)
- Secure session cookies (production)

## 🌐 API Endpoints

APIs are available at `/api/` with JWT authentication:

- `/api/animals/` - Animal inventory
- `/api/offers/` - Product offers
- `/api/customers/` - Customer management
- `/api/orders/` - Order management

## 📱 Next Steps

1. **Add Sample Data**: Create breeds, animals, and offers through admin
2. **Test Orders**: Create test customers and orders
3. **Configure Delivery Zones**: Set up delivery fees by emirate
4. **Customize Admin**: Adjust admin.py files for your workflow
5. **Build Frontend**: Use mockups to create customer-facing website

## 🐛 Troubleshooting

### Container won't start
```powershell
docker-compose down -v
docker-compose up -d --build
```

### Database connection error
Check that PostgreSQL is healthy:
```powershell
docker-compose ps
docker-compose logs db
```

### Permission errors
Ensure Docker Desktop has access to the project directory.

## 📝 Environment Variables

Key variables in `.env`:
- `DEBUG`: Set to False in production
- `SECRET_KEY`: Auto-generated secure key
- `DB_PASSWORD`: Database password
- `ALLOWED_HOSTS`: Comma-separated hostnames

## 🚀 Production Deployment

For production:
1. Set `DEBUG=False` in `.env`
2. Add your domain to `ALLOWED_HOSTS`
3. Change `DB_PASSWORD` to strong password
4. Use a reverse proxy (Nginx)
5. Enable SSL/TLS certificates
6. Set up automated backups

## 📞 Support

For issues or questions, check the logs:
```powershell
docker-compose logs -f
```

---

Built with ❤️ using Django 5.x + PostgreSQL 16
