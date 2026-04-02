#!/bin/bash

# Hostinger VPS Setup Script for RN Herbal India
# Run this on your Hostinger VPS as root or with sudo

echo "🚀 Starting RN Herbal India Node.js Setup on Hostinger VPS..."

# Update system packages
echo "📦 Updating system packages..."
apt-get update && apt-get upgrade -y

# Install Node.js and npm (LTS version)
echo "📥 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2 (process manager)
echo "📥 Installing PM2..."
npm install -g pm2

# Install Nginx (web server/reverse proxy)
echo "📥 Installing Nginx..."
apt-get install -y nginx

# Install Git
echo "📥 Installing Git..."
apt-get install -y git

# Enable Nginx
echo "⚙️ Enabling Nginx..."
systemctl enable nginx
systemctl start nginx

# Create application directory
echo "📁 Creating application directory..."
mkdir -p /var/www/rn-herbal-india
cd /var/www/rn-herbal-india

# Clone repository
echo "📥 Cloning repository..."
git clone https://github.com/sumit342i/rn-herbal-india.git .

# Install dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Copy environment file
echo "⚙️ Setting up environment variables..."
cp .env.example .env
# IMPORTANT: Edit .env with your actual credentials below!

echo "✅ Setup complete!"
echo ""
echo "📝 NEXT STEPS:"
echo "1. Edit /var/www/rn-herbal-india/.env with your credentials"
echo "2. Run: pm2 start server.js --name 'rn-herbal'"
echo "3. Configure Nginx (follow the guide below)"
echo "4. Set up SSL with Certbot"
