# FarmCloud Django Project Initialization Script

Write-Host "🐐 Initializing FarmCloud Admin Portal..." -ForegroundColor Green

# Create .env file if it doesn't exist
if (-Not (Test-Path .env)) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    
    # Generate a secure secret key
    $secretKey = -join ((65..90) + (97..122) + (48..57) + @(33,35,36,37,38,42,43,45,61) | Get-Random -Count 50 | ForEach-Object {[char]$_})
    (Get-Content .env) -replace 'your-secret-key-here-generate-new-one', $secretKey | Set-Content .env
    
    Write-Host "✓ .env file created with random SECRET_KEY" -ForegroundColor Green
}

# Build and start containers
Write-Host "`nBuilding Docker containers..." -ForegroundColor Yellow
docker-compose build

Write-Host "`nStarting services..." -ForegroundColor Yellow
docker-compose up -d

# Wait for database to be ready
Write-Host "`nWaiting for database..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Run migrations
Write-Host "`nRunning migrations..." -ForegroundColor Yellow
docker-compose exec web python manage.py migrate

# Create superuser prompt
Write-Host "`n✓ Project initialized successfully!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Create admin user: docker-compose exec web python manage.py createsuperuser"
Write-Host "2. Access admin at: http://localhost:8000/admin"
Write-Host "3. View logs: docker-compose logs -f web"
Write-Host "`nTo stop: docker-compose down"
