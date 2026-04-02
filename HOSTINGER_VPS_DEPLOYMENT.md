# 🚀 Hostinger VPS Deployment Guide

Your Node.js order system is configured for deployment on **Hostinger VPS**.

## Architecture

```
Your Domain (rnherbalindia.com)
        ↓
Nginx (Reverse Proxy, Port 80/443)
        ↓
Node.js App (Express Server, Port 5000)
        ↓
Email (Gmail SMTP)
```

## Prerequisites

- Hostinger VPS account (at least 2GB RAM recommended)
- SSH access to your VPS
- Your domain connected to Hostinger
- Port 80, 443, and 5000 open on VPS firewall

## Step 1: Connect to Your VPS

### Using Terminal (Command Prompt/PowerShell on Windows)
```bash
ssh root@your-vps-ip-address
# Or if you have a username:
ssh username@your-vps-ip-address
```

If you don't know your VPS credentials:
- Log in to Hostinger Control Panel
- Navigate to **VPS** → Your VPS
- Click **Manage** → **Access** → **SSH/SFTP**
- Copy the connection details

## Step 2: Automated Setup (Recommended)

Download and run the setup script:

```bash
cd /root
wget https://raw.githubusercontent.com/sumit342i/rn-herbal-india/main/hostinger-vps-setup.sh
chmod +x hostinger-vps-setup.sh
./hostinger-vps-setup.sh
```

This will automatically:
- Update system packages
- Install Node.js & npm
- Install PM2 (process manager)
- Install Nginx (web server)
- Clone your GitHub repository
- Install dependencies

## Step 3: Manual Setup (If Automated Doesn't Work)

### 3.1 Update System
```bash
apt-get update && apt-get upgrade -y
```

### 3.2 Install Node.js (LTS)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs
```

### 3.3 Install PM2 (Process Manager)
```bash
npm install -g pm2
```

### 3.4 Install Nginx
```bash
apt-get install -y nginx
systemctl enable nginx
systemctl start nginx
```

### 3.5 Clone Repository
```bash
cd /var/www
git clone https://github.com/sumit342i/rn-herbal-india.git rn-herbal-india
cd rn-herbal-india
npm install
```

### 3.6 Create & Configure .env File
```bash
nano .env
```

Add your credentials:
```
EMAIL_USER=digital.work.3442@gmail.com
EMAIL_PASSWORD=wqgnjegwyxpjqutf
PORT=5000
NODE_ENV=production
```

Press `Ctrl+X`, then `Y`, then `Enter` to save.

## Step 4: Start Your Application with PM2

```bash
cd /var/www/rn-herbal-india
pm2 start server.js --name "rn-herbal"
pm2 startup
pm2 save
```

This will:
- Start your Node.js app on port 5000
- Auto-restart if the process crashes
- Restart automatically when VPS reboots

### Useful PM2 Commands
```bash
pm2 list              # View all running apps
pm2 logs rn-herbal    # View app logs
pm2 restart rn-herbal # Restart app
pm2 stop rn-herbal    # Stop app
pm2 delete rn-herbal  # Remove app
```

## Step 5: Configure Nginx (Reverse Proxy)

### 5.1 Copy Nginx Configuration
```bash
cp /var/www/rn-herbal-india/nginx-hostinger.conf /etc/nginx/sites-available/rn-herbal
```

### 5.2 Edit Configuration with Your Domain
```bash
nano /etc/nginx/sites-available/rn-herbal
```

Replace:
- `your-domain.com` with your actual domain
- `your-vps-ip-address` in comments

Press `Ctrl+X`, `Y`, `Enter` to save.

### 5.3 Enable Nginx Configuration
```bash
ln -s /etc/nginx/sites-available/rn-herbal /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
```

### 5.4 Test Nginx Configuration
```bash
nginx -t
```

You should see:
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 5.5 Restart Nginx
```bash
systemctl restart nginx
```

## Step 6: Setup SSL Certificate (HTTPS)

### 6.1 Install Certbot
```bash
apt-get install -y certbot python3-certbot-nginx
```

### 6.2 Generate Free SSL Certificate
```bash
certbot certonly --nginx -d your-domain.com -d www.your-domain.com
```

Answer the prompts:
- Enter your email address
- Agree to terms
- Choose to redirect HTTP to HTTPS (recommended)

### 6.3 Update Nginx with SSL Paths
The certificate paths in your Nginx config:
```
/etc/letsencrypt/live/your-domain.com/fullchain.pem
/etc/letsencrypt/live/your-domain.com/privkey.pem
```

These are automatically created by Certbot in the command above.

### 6.4 Setup Auto-Renewal
```bash
certbot renew --dry-run
```

SSL certificates are free and auto-renew automatically.

## Step 7: Point Your Domain to VPS

In your domain registrar (wherever you bought your domain):

1. Go to **DNS Settings**
2. Find **A Record** pointing to your domain
3. Change value to your VPS IP address
4. Wait 24-48 hours for DNS propagation (usually instant)

Or in Hostinger Control Panel:
- **Domains** → Your Domain
- **DNS Zone** → Edit A Record
- Set to your VPS IP

## Step 8: Test Your Deployment

### Test Website
1. Visit `https://your-domain.com`
2. Check that it loads
3. Try submitting an order

### Test Email
1. Submit a test order on the form
2. Check your email for confirmation
3. Check admin email (`digital.work.3442@gmail.com`)

### View Logs
```bash
# Application logs
pm2 logs rn-herbal

# Nginx access logs
tail -f /var/access_log/nginx/access.log

# Nginx error logs
tail -f /var/log/nginx/error.log
```

## Monitoring & Maintenance

### Check System Resources
```bash
top
df -h
free -h
```

### Update Application
To deploy updates:
```bash
cd /var/www/rn-herbal-india
git pull origin main
npm install
pm2 restart rn-herbal
```

### Backup Your Data
Regular backups in Hostinger Control Panel:
- **VPS** → Backups
- Enable automatic backups

### Monitor Uptime
Use free services like:
- UptimeRobot: https://uptimerobot.com
- Pingdom: https://www.pingdom.com
- Sentry: https://sentry.io (error tracking)

## Troubleshooting

### Issue: "Connection refused" when visiting domain
**Solution:**
```bash
# Check if Node.js app is running
pm2 status

# Check if Nginx is running
systemctl status nginx

# Check Nginx configuration
nginx -t
```

### Issue: Email not sending
**Solution:**
```bash
# Check Node.js logs
pm2 logs rn-herbal

# Verify Gmail credentials in .env
cat /var/www/rn-herbal-india/.env

# Ensure EMAIL_PASSWORD is Gmail App Password, not regular password
```

### Issue: SSL certificate errors
**Solution:**
```bash
# Check certificate status
certbot certificates

# Renew manually if needed
certbot renew --force-renewal
```

### Issue: High CPU/Memory Usage
**Solution:**
```bash
# Check what's using resources
top

# Restart the app
pm2 restart rn-herbal

# Check for memory leaks in logs
pm2 logs rn-herbal
```

### Issue: "Permission denied" errors
**Solution:**
```bash
# Fix permissions
sudo chown -R www-data:www-data /var/www/rn-herbal-india
chmod -R 755 /var/www/rn-herbal-india
```

## Hostinger-Specific Tips

### Using Hostinger File Manager
Instead of SSH, you can use Hostinger's File Manager:
- Control Panel → **File Manager**
- Navigate to `/var/www/rn-herbal-india`
- Upload files directly

### Using Hostinger Control Panel to Restart
- Control Panel → **VPS** → Your VPS
- **Manage** → **Services** → Control Nginx & Services

### Hostinger Support
If you need help:
- Live Chat: Available 24/7
- Tickets: Support section in control panel
- Provide: VPS IP, error messages, and when the issue occurred

## Cost

- **Hostinger VPS**: ~$3-6/month (2GB RAM)
- **Domain**: ~$10-15/year
- **SSL Certificate**: Free (Let's Encrypt via Certbot)
- **Total**: ~$50-85/year

## Security Checklist

- ✅ SSL certificate installed
- ✅ Environment variables protected (.env not in git)
- ✅ Nginx configured with security headers
- ✅ Firewall configured (Hostinger allows SSH, HTTP, HTTPS)
- ✅ Gmail App Password used (not regular password)
- ✅ Regular backups enabled

## Performance Tips

1. **Enable Gzip Compression** (already in Nginx config)
2. **Enable Caching** (added to Nginx config)
3. **Monitor Resource Usage** with PM2
4. **Use CDN** for images (optional, Cloudflare free plan)
5. **Optimize Images** before uploading

## Next Steps

1. ✅ Connect to VPS via SSH
2. ✅ Run setup script or manual commands
3. ✅ Configure .env with credentials
4. ✅ Start with PM2
5. ✅ Configure Nginx
6. ✅ Setup SSL certificate
7. ✅ Point domain to VPS
8. ✅ Test and monitor

Your application will be live at `https://your-domain.com`

---

For more help:
- Hostinger VPS Documentation: docs.hostinger.com
- PM2 Documentation: https://pm2.keymetrics.io
- Nginx Documentation: https://nginx.org
- Node.js Documentation: https://nodejs.org
