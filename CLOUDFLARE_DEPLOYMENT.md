# 🚀 Cloudflare Pages Deployment Guide

Your application is now configured to deploy on **Cloudflare Pages** (frontend) with **Cloudflare Workers** (backend API).

## Architecture

```
Cloudflare Pages (Frontend)
├── public/
│   ├── index.html       (Landing page)
│   ├── order.html       (Order form)
│   ├── style.css        (Styling)
│   └── script.js        (Frontend logic)
└── 
    
Cloudflare Workers (Backend API)
└── functions/
    └── api/
        └── submit-order.js  (Order submission handler)
```

## Deployment Steps

### Step 1: Install Wrangler CLI
```bash
npm install -g wrangler
```

### Step 2: Create a Cloudflare Account & API Token
1. Go to https://dash.cloudflare.com
2. Sign up or log in
3. Create an API token:
   - Go to Profile → API Tokens
   - Create "Edit Cloudflare Workers" token
   - Copy the token

### Step 3: Authenticate with Wrangler
```bash
wrangler login
# Paste your API token when prompted
```

### Step 4: Create a Cloudflare Pages Project
Two options:

#### Option A: Connect GitHub (Recommended)
1. Go to https://dash.cloudflare.com
2. Pages → Create a project
3. Select "Connect to Git" → Choose GitHub
4. Select your `rn-herbalindia` repository
5. Set build settings:
   - **Framework**: None
   - **Build command**: `npm install`
   - **Build output directory**: `public`
6. Deploy!

#### Option B: Manual Deployment
```bash
cd c:\Users\Entertainment\Downloads\rnherbaltesting-main 1
wrangler pages publish public/
```

### Step 5: Deploy Worker Functions
The Worker functions in `functions/api/submit-order.js` will automatically deploy to Cloudflare Workers and integrate with Pages.

### Step 6: Configure Environment Variables

In Cloudflare Dashboard:
1. Go to **Workers & Pages** → **Settings**
2. Under **Environment Variables**, add:
   ```
   EMAIL_USER=digital.work.3442@gmail.com
   EMAIL_PASSWORD=wqgnjegwyxpjqutf
   ```

## Project Structure

```
rn-herbal-india/
├── public/                          # Static assets for Pages
│   ├── index.html
│   ├── order.html
│   ├── style.css
│   ├── script.js
│   └── [product images]
├── functions/                       # Cloudflare Workers functions
│   └── api/
│       └── submit-order.js         # API endpoint handler
├── package.json
├── wrangler.toml                   # Cloudflare configuration
├── .env                             # Local development (don't commit)
├── .gitignore
└── README.md
```

## Local Development

### Test Frontend Locally
```bash
# Serve the public directory
npx serve public
# Visit http://localhost:3000
```

### Test Worker Functions Locally
```bash
wrangler dev
# Visit http://localhost:8787
```

## Important Notes

### Environment Variables
- ✅ Set in Cloudflare Dashboard (Production)
- ✅ Use `.env` for local development only
- ⚠️ **NEVER commit `.env` to Git** (already in .gitignore)

### Email Configuration
1. Use **Gmail App Password** (not regular password)
2. Enable 2-Step Verification on Gmail
3. Generate App Password: https://myaccount.google.com → Security
4. Use this password in environment variables

### CORS Handling
The Worker automatically handles CORS for cross-origin requests from Cloudflare Pages.

### Images & Assets
If you have product images:
1. Move them to `public/images/`
2. Update image paths in HTML: `src="images/your-image.jpg"`
3. Cloudflare Pages will serve them automatically

## Testing Your Deployment

1. **Visit your Pages URL**: `https://your-project.pages.dev`
2. **Test the order form**: 
   - Submit a test order
   - Check your email for confirmation
3. **Monitor logs**:
   - Pages: Dashboard → Overview → Deployments
   - Workers: Logs or Analytics

## Monitoring & Logs

### View Pages Logs
```bash
wrangler tail --service=pages
```

### View Worker Logs
```bash
wrangler tail
```

## Custom Domain (Optional)

To use your own domain:
1. In Cloudflare Dashboard → Pages → Custom domains
2. Add your domain: `rnherbalindia.com`
3. Update DNS records as instructed

## Troubleshooting

### Issue: Worker not receiving requests
- **Solution**: Check if function routes are correctly configured
- Verify `functions/` directory structure is exactly: `functions/api/submit-order.js`

### Issue: Email not sending
- **Solution**: Verify `EMAIL_USER` and `EMAIL_PASSWORD` in Cloudflare env vars
- Check Gmail App Password is correctly generated

### Issue: API returns 405 error
- **Solution**: Ensure form submits POST requests to `/api/submit-order`

### Issue: CORS errors in browser
- **Solution**: The Worker includes CORS headers, should work automatically

## Cost

- **Cloudflare Pages**: Free (limited to 500 deployments/month)
- **Cloudflare Workers**: Free (limited to 100,000 requests/day)
- **DNS & Security**: Free with Cloudflare

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Create Cloudflare account
3. ✅ Connect repository to Pages
4. ✅ Set environment variables
5. ✅ Deploy and test

Your order system will be live at: `https://your-project.pages.dev`

---

For more help:
- Cloudflare Pages: https://developers.cloudflare.com/pages/
- Cloudflare Workers: https://developers.cloudflare.com/workers/
- Nodemailer: https://nodemailer.com/
