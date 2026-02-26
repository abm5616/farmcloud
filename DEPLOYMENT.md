# FarmCloud Production Deployment Guide

## 🔒 Pre-Deployment Security Checklist

### Critical Steps (MUST DO)

#### 1. Environment Configuration
```bash
# Copy production template
cp .env.production.example .env

# Generate a strong SECRET_KEY
docker-compose exec web python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Edit .env with production values
SECRET_KEY=<generated-secret-key>
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com,server-ip
DB_PASSWORD=<strong-random-password-32-chars>
CORS_ALLOWED_ORIGINS=https://yourdomain.com
ADMIN_URL_PATH=<custom-secure-path>
```

#### 2. Rebuild Containers
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
docker-compose exec web python manage.py migrate
docker-compose exec web python manage.py collectstatic --noinput
```

#### 3. Security Verification
- ✅ SECRET_KEY is unique and strong
- ✅ DEBUG=False  
- ✅ Database password changed
- ✅ ADMIN_URL_PATH customized
- ✅ HTTPS configured
- ✅ Firewall rules set

---

## 🚀 Quick Start Production Deployment

### 1. Server Setup
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Clone repository
git clone <your-repo>
cd farmcloud
```

### 2. Configure & Deploy
```bash
cp .env.production.example .env
# Edit .env with your values
docker-compose up -d --build
docker-compose exec web python manage.py migrate
docker-compose exec web python manage.py createsuperuser
```

### 3. Access Application
- Frontend: https://yourdomain.com
- Admin: https://yourdomain.com/<your-custom-admin-path>/
- API: https://yourdomain.com/api/

---

## 🔐 Security Features Enabled

- **Brute Force Protection**: 5 failed login attempts = 30 min lockout
- **Rate Limiting**: API throttling (100/hour anon, 1000/hour auth)
- **Security Headers**: HSTS, XSS Protection, CSRF, CORS
- **JWT Auth**: 1-hour access tokens, 7-day refresh tokens
- **Password Policy**: 10 character minimum with validation
- **Logging**: Security events and errors tracked
- **Custom Admin URL**: Hidden admin panel path

---

**Document Version**: 1.0  
**Status**: Production Ready ✅
