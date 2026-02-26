# SSH Key Deployment Guide for FarmCloud

## 🔑 RSA Key Generated Successfully!

**Date**: February 26, 2026  
**Key Type**: RSA 4096-bit  
**Key Name**: farmcloud_rsa

---

## 📍 Key Locations

- **Private Key**: `C:\Users\user\.ssh\farmcloud_rsa`
- **Public Key**: `C:\Users\user\.ssh\farmcloud_rsa.pub`
- **Key Fingerprint**: `SHA256:qBdMAjtEDnBZRXcpBRneYBfdT1ncAZcfSA4IfmIk8hg`

---

## 📋 Your Public Key

Copy this public key to your server:

```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCWNKLldt8jKNXZm4mh5WOrUzdvC4TjDJo6+RexR78riG+EzlYqNaCnIxcnljcmnhcJjoMPOtSI2JGGL6oHINSLdqYVl9qcMZ6qODtreDOXlZzPO/R7XGXmMTchwtLus4Jp86phr9wOikyCI5A/l2+oH538MfvrDF6Y6roXxEgEidbR6NK6ufCntn8F3OXJUJsfEXHGSqiIzXtxXMzyE4P0cQCTFAnpVIM+Xz6UinwtrvgxOif8rN6WeqNEeL8IFNh7ewIy4b54lwzzMDVc0Ua4rJtjxkZfgUKw8n56vs0Pn8GOvm4z+wyAHOFr9MzYNoRh41NX55lUYCInruJ6kqczSK9+qS7mTM3JSYjjYRH39G0HkTCgd6yv/h196lqBrVJxBXFs9vseWnVJUqWu77xwxcjK/SDSmTIexyNBMyAVpOCMDL+u/4fOE4kOgaAeLjbK6bqtglIdHQo71dWrwAkoVV3AuDzmyDsZ/v3+9StQoZjql94/JESBEcL5FyAdzXW+7t6ULnGprkUt6neCjOTvIxUjYBZqGTDdOOd6SJO60pSw/BT7ptzpFu+ixkzrUNm53MOtXTBJCbDFav+WermG0xNofLy4gCYTHUyeV4MPalgAoRtAz0uMPrMGLkMchnJWqorXvneiEKthcJEwhHPZPgeFp8faeqke4W4SAU9ifw== farmcloud-deployment-key
```

---

## 🚀 How to Add Key to Your Server

### Method 1: Using ssh-copy-id (Recommended)

If you have password access to the server:

```bash
ssh-copy-id -i ~/.ssh/farmcloud_rsa.pub user@your-server-ip
```

### Method 2: Manual Setup

If ssh-copy-id is not available:

1. **Connect to your server** (using password):
   ```bash
   ssh user@your-server-ip
   ```

2. **Create .ssh directory** (if it doesn't exist):
   ```bash
   mkdir -p ~/.ssh
   chmod 700 ~/.ssh
   ```

3. **Add your public key**:
   ```bash
   echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCWNKLldt8jKNXZm4mh5WOrUzdvC4TjDJo6+RexR78riG+EzlYqNaCnIxcnljcmnhcJjoMPOtSI2JGGL6oHINSLdqYVl9qcMZ6qODtreDOXlZzPO/R7XGXmMTchwtLus4Jp86phr9wOikyCI5A/l2+oH538MfvrDF6Y6roXxEgEidbR6NK6ufCntn8F3OXJUJsfEXHGSqiIzXtxXMzyE4P0cQCTFAnpVIM+Xz6UinwtrvgxOif8rN6WeqNEeL8IFNh7ewIy4b54lwzzMDVc0Ua4rJtjxkZfgUKw8n56vs0Pn8GOvm4z+wyAHOFr9MzYNoRh41NX55lUYCInruJ6kqczSK9+qS7mTM3JSYjjYRH39G0HkTCgd6yv/h196lqBrVJxBXFs9vseWnVJUqWu77xwxcjK/SDSmTIexyNBMyAVpOCMDL+u/4fOE4kOgaAeLjbK6bqtglIdHQo71dWrwAkoVV3AuDzmyDsZ/v3+9StQoZjql94/JESBEcL5FyAdzXW+7t6ULnGprkUt6neCjOTvIxUjYBZqGTDdOOd6SJO60pSw/BT7ptzpFu+ixkzrUNm53MOtXTBJCbDFav+WermG0xNofLy4gCYTHUyeV4MPalgAoRtAz0uMPrMGLkMchnJWqorXvneiEKthcJEwhHPZPgeFp8faeqke4W4SAU9ifw== farmcloud-deployment-key" >> ~/.ssh/authorized_keys
   ```

4. **Set correct permissions**:
   ```bash
   chmod 600 ~/.ssh/authorized_keys
   ```

### Method 3: Using Cloud Provider Dashboard

For AWS, DigitalOcean, Azure, etc.:

1. Log into your cloud provider dashboard
2. Navigate to SSH Keys or Security settings
3. Click "Add SSH Key"
4. Paste the public key above
5. Name it: "FarmCloud Deployment Key"

---

## 🔐 Using Your SSH Key

### From Windows (PowerShell/Command Prompt):

```powershell
# Connect to your server
ssh -i C:\Users\user\.ssh\farmcloud_rsa user@your-server-ip

# Or add to SSH config for easier access
# Create/edit: C:\Users\user\.ssh\config
```

### SSH Config File (Recommended):

Create or edit `C:\Users\user\.ssh\config`:

```
Host farmcloud-prod
    HostName your-server-ip-or-domain
    User your-username
    IdentityFile C:\Users\user\.ssh\farmcloud_rsa
    Port 22
```

Then connect with just:
```bash
ssh farmcloud-prod
```

---

## 🔒 Security Best Practices

### ✅ DO:
- Keep your private key (`farmcloud_rsa`) secure and never share it
- Use the key only from trusted machines
- Set up SSH config for convenience
- Consider using ssh-agent to avoid typing the key path repeatedly
- Back up your private key to a secure location (encrypted USB, password manager)

### ❌ DON'T:
- Never commit the private key to Git
- Never share the private key via email or chat
- Never upload the private key to any server
- Don't use the same key for multiple production servers

### 🛡️ Server-Side Security:

After setting up key authentication, **disable password authentication**:

1. Edit SSH config on server:
   ```bash
   sudo nano /etc/ssh/sshd_config
   ```

2. Set these values:
   ```
   PasswordAuthentication no
   PubkeyAuthentication yes
   PermitRootLogin no
   ```

3. Restart SSH service:
   ```bash
   sudo systemctl restart sshd
   ```

---

## 📦 Deployment Workflow with SSH Key

### 1. Initial Server Setup:
```bash
# Connect to server
ssh -i C:\Users\user\.ssh\farmcloud_rsa user@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER
```

### 2. Deploy FarmCloud:
```bash
# Clone repository (using HTTPS or SSH)
git clone https://github.com/your-repo/farmcloud.git
cd farmcloud

# Copy production environment
cp .env.production.example .env
nano .env  # Edit with production values

# Deploy
docker-compose up -d --build
docker-compose exec web python manage.py migrate
docker-compose exec web python manage.py createsuperuser
docker-compose exec web python manage.py collectstatic --noinput
```

### 3. Automated Deployment Script:

Save on your local machine as `deploy.ps1`:

```powershell
# FarmCloud Deployment Script
$SERVER = "user@your-server-ip"
$KEY = "C:\Users\user\.ssh\farmcloud_rsa"
$REMOTE_PATH = "/home/user/farmcloud"

Write-Host "🚀 Deploying FarmCloud to production..." -ForegroundColor Green

# Pull latest code
ssh -i $KEY $SERVER "cd $REMOTE_PATH && git pull origin main"

# Rebuild containers
ssh -i $KEY $SERVER "cd $REMOTE_PATH && docker-compose down"
ssh -i $KEY $SERVER "cd $REMOTE_PATH && docker-compose up -d --build"

# Run migrations
ssh -i $KEY $SERVER "cd $REMOTE_PATH && docker-compose exec -T web python manage.py migrate"

# Collect static files
ssh -i $KEY $SERVER "cd $REMOTE_PATH && docker-compose exec -T web python manage.py collectstatic --noinput"

Write-Host "✅ Deployment complete!" -ForegroundColor Green
```

---

## 🔧 Troubleshooting

### Problem: "Permission denied (publickey)"

**Solution**:
```bash
# Verify key is added to authorized_keys on server
ssh -i C:\Users\user\.ssh\farmcloud_rsa user@your-server-ip cat ~/.ssh/authorized_keys

# Check key permissions locally
icacls C:\Users\user\.ssh\farmcloud_rsa
# Should be: NT AUTHORITY\SYSTEM:(F), Your User:(F)
```

### Problem: "Bad permissions"

**Solution** (Windows):
```powershell
# Fix key permissions
icacls C:\Users\user\.ssh\farmcloud_rsa /inheritance:r
icacls C:\Users\user\.ssh\farmcloud_rsa /grant:r "$env:USERNAME:(R)"
```

### Problem: SSH times out

**Solutions**:
- Check firewall allows port 22
- Verify server IP is correct
- Ensure SSH service is running on server: `sudo systemctl status sshd`
- Try verbose mode: `ssh -vvv -i C:\Users\user\.ssh\farmcloud_rsa user@server-ip`

---

## 📝 Quick Reference

### Key Information:
- **Type**: RSA 4096-bit
- **Private Key**: `C:\Users\user\.ssh\farmcloud_rsa` (KEEP SECRET!)
- **Public Key**: `C:\Users\user\.ssh\farmcloud_rsa.pub` (Safe to share)
- **Fingerprint**: `SHA256:qBdMAjtEDnBZRXcpBRneYBfdT1ncAZcfSA4IfmIk8hg`

### Common Commands:
```bash
# Connect to server
ssh -i C:\Users\user\.ssh\farmcloud_rsa user@server-ip

# Copy files to server
scp -i C:\Users\user\.ssh\farmcloud_rsa file.txt user@server-ip:/path/

# Copy files from server
scp -i C:\Users\user\.ssh\farmcloud_rsa user@server-ip:/path/file.txt .

# View public key
cat C:\Users\user\.ssh\farmcloud_rsa.pub
```

---

## ✅ Checklist

Before deploying to production:

- [ ] Public key added to server's `~/.ssh/authorized_keys`
- [ ] SSH connection tested successfully
- [ ] Password authentication disabled on server
- [ ] Private key backed up securely
- [ ] SSH config file created for easy access
- [ ] Firewall configured (port 22 or custom SSH port)
- [ ] Only necessary users have server access
- [ ] Root login disabled

---

**SSH Key Setup Complete!** 🎉

Your FarmCloud deployment is now ready for secure server access.

For production deployment, follow: `DEPLOYMENT.md`
