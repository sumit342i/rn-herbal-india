# 📧 RN Herbal India - Email Order System Setup Guide

Complete step-by-step guide to set up and deploy your Node.js + Nodemailer email order system.

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Setup (Development)](#local-setup-development)
3. [Gmail Configuration](#gmail-configuration)
4. [Testing the System](#testing-the-system)
5. [Deployment Options](#deployment-options)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **A Gmail account** (with 2-Step Verification enabled)
- **Git** (optional but recommended)
- **Text editor** (VS Code recommended)

### Check if Node.js is installed:
```bash
node --version
npm --version
```

---

## Local Setup (Development)

### Step 1: Navigate to Project Directory
```bash
# Open terminal/PowerShell in your project folder
cd c:\Users\Entertainment\Downloads\rnherbaltesting-main\rnherbaltesting-main
```

### Step 2: Install Required Dependencies
```bash
npm install
```

This will install:
- **express** - Web framework
- **nodemailer** - Email sending library
- **cors** - Cross-origin requests
- **dotenv** - Environment variables
- **nodemon** (dev only) - Auto-restart server during development

### Step 3: Create .env File
1. Look for `.env.example` file in your project
2. **DO NOT rename it** - instead, create a new file called `.env` (no extension)
3. Copy the contents from `.env.example` to `.env`

**Your .env file should look like:**
```
EMAIL_USER=your-gmail-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
PORT=5000
NODE_ENV=development
```

---

## Gmail Configuration

### ⚠️ IMPORTANT: You MUST Use App Password, NOT Your Gmail Password!

Gmail doesn't allow direct access from apps for security reasons. Follow these steps to create an App Password:

### Step A: Enable 2-Step Verification
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click **"Security"** in the left sidebar
3. Scroll down to **"2-Step Verification"**
4. Click **"2-Step Verification"** and follow the prompts
5. You'll need to verify your identity with your phone

### Step B: Generate App Password
1. After 2FA is enabled, go back to **Security** page
2. Scroll to **"App passwords"** (only appears if 2FA is enabled)
3. Choose:
   - **Select app:** Mail
   - **Select device:** Windows Computer (or your device type)
4. Click **Generate**
5. **Google will generate a 16-character password** - This is what you need!

**Example of App Password:** `abcd efgh ijkl mnop` (spaces are ok)

### Step C: Add to .env File
```
EMAIL_USER=digital.work.3442@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

⚠️ **NEVER commit .env file to GitHub!** It's already in `.gitignore`.

---

## Testing the System

### Option 1: Test Locally (Recommended First)

```bash
# Start the development server
npm start
```

You should see:
```
✅ Email server is ready to send messages
🚀 Server is running on http://localhost:5000
📧 Email system configured for: your-email@gmail.com
💼 Admin email: digital.work.3442@gmail.com
```

### Option 2: Test with Nodemon (Auto-restart on file changes)
```bash
npm run dev
```

### Now Test the Order Form:
1. Open browser and go to `http://localhost:5000`
2. Fill in the order form with test data
3. Click "PLACE ORDER NOW"
4. You should:
   - See success message
   - Receive 2 emails (one for admin, one for customer)
   - See emails arrive in about 5-10 seconds

### Check Email Inbox:
- **Admin email:** digital.work.3442@gmail.com (receives order details)
- **Customer email:** Whatever email the customer entered (receives confirmation)

---

## Deployment Options

### ⭐ Best Option: Heroku (Free Tier Available, Simple Setup)

#### Prerequisites:
- [Heroku Account](https://heroku.com) (free)
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

#### Steps:
1. **Install Heroku CLI** and login:
```bash
heroku login
```

2. **Initialize Git** (if not already):
```bash
git init
git add .
git commit -m "Initial commit"
```

3. **Create Heroku App:**
```bash
heroku create your-app-name
```
(Example: `heroku create rn-herbal-orders`)

4. **Add Environment Variables to Heroku:**
```bash
heroku config:set EMAIL_USER=digital.work.3442@gmail.com
heroku config:set EMAIL_PASSWORD=your-app-password
heroku config:set NODE_ENV=production
```

5. **Deploy:**
```bash
git push heroku main
```

6. **Check if running:**
```bash
heroku logs --tail
```

Your app will be at: `https://your-app-name.herokuapp.com`

**Update order.html to point to your Heroku domain:**
```javascript
const response = await fetch('https://your-app-name.herokuapp.com/api/submit-order', {
```

---

### ⭐ Option 2: Railway.app (User-Friendly Alternative)

1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project → Deploy from GitHub repo
4. Add environment variables in Railway dashboard
5. Deploy!

---

### ⭐ Option 3: Render.com (Simple & Reliable)

1. Go to [Render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repo
4. Set environment variables
5. Deploy!

---

### Option 4: AWS, DigitalOcean, etc. (Advanced)
If you prefer self-managed servers, these provide more control but require more setup:
- **DigitalOcean** - App Platform (simple) or Droplets (advanced)
- **AWS** - EC2 instances
- **Google Cloud** - Compute Engine

---

## Troubleshooting

### ❌ "Error: ENOTFOUND" when trying to fetch API

**Problem:** Frontend can't reach backend
**Solution:**
- If testing locally: Make sure backend is running (`npm start`)
- If deployed: Update the API URL in order.html to match your deployed server URL

**For local testing:**
```javascript
// Your order.html should have:
const response = await fetch('http://localhost:5000/api/submit-order', {
```

**For production (Heroku example):**
```javascript
// Change to:
const response = await fetch('https://YOUR-HEROKU-APP.herokuapp.com/api/submit-order', {
```
   
---

### ❌ "Invalid login" or "Authentication failed"

**Problem:** Email credentials are wrong
**Solution:**
1. Verify EMAIL_USER is your Gmail address
2. Verify you used **App Password**, NOT your regular Gmail password
3. Check for extra spaces in .env file
4. Make sure 2-Step Verification is enabled

---

### ❌ Form submits but no emails received

**Problem:** Backend isn't sending emails
**Solution:**
1. Check server logs: `npm start` should show "✅ Email server is ready..."
2. Check browser console (F12) for error messages
3. Check if emails went to spam folder
4. Verify Gmail account hasn't been locked (check myaccount.google.com)

---

### ❌ "CORS" error in browser console

**Problem:** Frontend blocked by CORS policy
**Solution:**
- This is already configured in server.js with `cors()` middleware
- Make sure backend is running
- Clear browser cache (Ctrl+Shift+Delete)

---

## 📊 Project Structure

```
rn-herbal-order-system/
├── server.js              ← Node.js backend (main file)
├── order.html             ← Order form (frontend)
├── style.css              ← Styling
├── script.js              ← General scripts
├── package.json           ← Dependencies
├── .env.example          ← Template for environment variables
├── .env                  ← Your actual credentials (DO NOT COMMIT)
├── .gitignore            ← Files to ignore in Git
└── README.md
```

---

## 🔐 Security Checklist

- [ ] .env file is in .gitignore (never commit credentials)
- [ ] Using App Password, not regular Gmail password
- [ ] 2-Step Verification is enabled on Gmail account
- [ ] Order data is validated on both frontend and backend
- [ ] HTTPS is used in production (automatic on Heroku/Railway/Render)
- [ ] Sensitive data is not logged

---

## 📞 Quick Reference

**Start local server:**
```bash
npm start
```

**Start with auto-reload:**
```bash
npm run dev
```

**Deploy to Heroku:**
```bash
git push heroku main
```

**View server logs:**
```bash
npm start
# or for Heroku:
heroku logs --tail
```

---

## ✅ What Customers Will Experience

1. Customer fills out order form with:
   - Name, Phone, Email
   - Delivery Address (address, city, state, pincode)
   - **Quantity of products**
   - Payment method shows total price dynamically

2. Customer clicks "PLACE ORDER NOW"

3. **Admin receives email** with:
   - Order details
   - Quantity ordered
   - Total amount
   - Delivery address

4. **Customer receives confirmation email** with:
   - Order summary
   - Total amount to pay
   - Delivery address confirmation
   - Contact information

5. Your team processes the order via email and ships the product

---

## 🎯 Next Steps

1. **Complete Local Setup** following the steps above
2. **Test thoroughly** with real emails
3. **Choose a hosting provider** (Heroku recommended for beginners)
4. **Deploy** to production
5. **Update any hardcoded URLs** if needed
6. **Monitor email delivery** for the first few orders

---

## 📧 Email Templates

Custom email templates are configured in `server.js`. You can modify the HTML in the email sending functions to:
- Change colors and branding
- Add your logo/images
- Modify text and language
- Add more fields

Simply edit the HTML in the email sending sections and restart the server.

---

## 🆘 Need Help?

If you encounter issues:
1. Check the **Troubleshooting** section above
2. Look at **Browser Console** (F12 in Chrome/Firefox)
3. Look at **Server Logs** (terminal where `npm start` is running)
4. Check **Gmail account** for security alerts

---

**Last Updated:** March 2026
**System:** RN Herbal India Email Order System
