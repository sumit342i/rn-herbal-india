# 🚀 Railway Deployment Guide

## Step 1: Prepare Your Code
Your code is already configured for Railway deployment! All necessary files are in place.

## Step 2: Push to GitHub
Make sure your code is pushed to GitHub:
```bash
git push origin main
```

## Step 3: Deploy on Railway

### Option A: Using Railway CLI (Recommended)
1. Install Railway CLI: https://docs.railway.app/develop/cli
2. Login with:
   ```bash
   railway login
   ```
3. Link your project:
   ```bash
   railway link
   ```
4. Deploy:
   ```bash
   railway up
   ```

### Option B: Using Railway Dashboard (Web UI)
1. Go to https://railway.app
2. Sign up or log in with GitHub
3. Click "Create New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `rn-herbalindia` repository
6. Railway will auto-detect your Node.js app

## Step 4: Configure Environment Variables

After deployment starts, configure these environment variables in Railway Dashboard:

```
EMAIL_USER=digital.work.3442@gmail.com
EMAIL_PASSWORD=wqgnjegwyxpjqutf
NODE_ENV=production
```

⚠️ **Important:** Use your actual Gmail App Password (not your regular Gmail password)

## Step 5: View Your Deployment

Once deployed, Railway will provide you with:
- **Public URL**: Your app will be live at this domain
- **Logs**: Real-time server logs in the dashboard
- **Environment Variables**: Manage your secrets safely

## Deployment Checklist

- ✅ Node.js version specified in package.json
- ✅ Port configured to use `process.env.PORT`
- ✅ `npm start` script configured
- ✅ .env file ignored in .gitignore
- ✅ Dependencies installed (express, nodemailer, cors, dotenv)
- ✅ railway.json configuration created

## Testing Your Deployment

After deployment:
1. Visit your Railway URL
2. Test the order form
3. Check email delivery (verify SMTP is working)
4. Monitor logs in Railway Dashboard

## Troubleshooting

**Build fails:**
- Check if all dependencies are in `package.json` ✓

**Email not sending:**
- Verify `EMAIL_USER` and `EMAIL_PASSWORD` in Railway env vars
- Ensure Gmail 2-Step Verification is enabled
- Check email logs in server console

**Port issues:**
- Railway automatically assigns a PORT
- Your app correctly uses `process.env.PORT || 5000` ✓

## FAQ

**Q: What's the difference between Railway and Vercel?**
- Railway: Better for Node.js backends, databases, multiple services
- Vercel: Optimized for serverless functions and Next.js

**Q: Is email sending free?**
- Gmail SMTP is free for reasonable usage (≤500 emails/day)

**Q: How to rollback a deployment?**
- Go to Railway Dashboard → Deployments → Select previous version

---

For more help: https://docs.railway.app
