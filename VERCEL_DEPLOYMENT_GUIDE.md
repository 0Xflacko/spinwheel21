# Vercel Deployment Guide for WTF Games Spinning Wheel

## Overview

This guide will walk you through deploying your Next.js spinning wheel application to Vercel, including environment variable setup and Google Sheets integration.

---

## Prerequisites

- GitHub account (recommended for automatic deployments)
- Vercel account (free tier available)
- Your Google Sheets API credentials ready
- Domain name (optional, Vercel provides free subdomain)

---

## Step 1: Prepare Your Repository

### 1.1 Ensure All Files Are Committed

```bash
# Check git status
git status

# Add any uncommitted files
git add .

# Commit changes
git commit -m "Prepare for Vercel deployment"

# Push to GitHub
git push origin main
```

### 1.2 Verify Package Dependencies

Make sure your `package.json` includes all required dependencies:

```json
{
  "dependencies": {
    "framer-motion": "^12.23.12",
    "googleapis": "^144.0.0",
    "next": "15.5.2",
    "react": "19.1.0",
    "react-dom": "19.1.0"
  }
}
```

---

## Step 2: Create Vercel Account and Connect Repository

### 2.1 Sign Up for Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub" (recommended)
4. Authorize Vercel to access your GitHub repositories

### 2.2 Import Your Project

1. On Vercel dashboard, click "New Project"
2. Find your spinning wheel repository
3. Click "Import"
4. Configure project settings:
   - **Project Name**: `wtf-games-spinwheel` (or your preferred name)
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (should auto-fill)
   - **Output Directory**: `.next` (should auto-fill)

---

## Step 3: Configure Environment Variables

### 3.1 Add Environment Variables in Vercel

1. In your project settings, go to "Environment Variables"
2. Add each variable from your `.env.local` file:

```env
# Google Sheets Configuration
GOOGLE_SHEETS_ID=your_actual_google_sheets_id
GOOGLE_PROJECT_ID=your_actual_project_id
GOOGLE_PRIVATE_KEY_ID=your_actual_private_key_id
GOOGLE_PRIVATE_KEY=your_actual_private_key_with_newlines
GOOGLE_CLIENT_EMAIL=your_actual_service_account_email
GOOGLE_CLIENT_ID=your_actual_client_id
```

### 3.2 Important Notes for Environment Variables

- **GOOGLE_PRIVATE_KEY**: Copy the entire private key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- **Environments**: Set variables for "Production", "Preview", and "Development"
- **Sensitive Data**: All environment variables are encrypted and secure in Vercel

### 3.3 Environment Variable Setup Example

```
Name: GOOGLE_SHEETS_ID
Value: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
Environments: Production, Preview, Development
```

---

## Step 4: Deploy the Application

### 4.1 Initial Deployment

1. After adding environment variables, click "Deploy"
2. Vercel will:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Run build process (`npm run build`)
   - Deploy to a unique URL

### 4.2 Monitor Deployment

1. Watch the build logs in real-time
2. Check for any build errors
3. Deployment typically takes 1-3 minutes

---

## Step 5: Verify Deployment

### 5.1 Test Core Functionality

Visit your deployed URL and test:

- [ ] Landing page loads correctly
- [ ] Spinning wheel animation works
- [ ] Prize calculation is accurate
- [ ] Email form submission works
- [ ] Google Sheets integration saves data
- [ ] Good Luck page displays
- [ ] External links work (wtfleagues.com)

### 5.2 Check API Endpoints

Test your API endpoints:

- `https://your-app.vercel.app/api/save-email` (POST request)
- `https://your-app.vercel.app/api/test-env` (GET request to verify env vars)

---

## Step 6: Configure Custom Domain (Optional)

### 6.1 Add Custom Domain

1. In Vercel project settings, go to "Domains"
2. Add your custom domain (e.g., `spinwheel.wtfgames.com`)
3. Configure DNS settings as instructed by Vercel
4. Wait for SSL certificate generation (automatic)

### 6.2 DNS Configuration Example

For a subdomain like `spinwheel.wtfgames.com`:

```
Type: CNAME
Name: spinwheel
Value: cname.vercel-dns.com
```

---

## Step 7: Set up Automatic Deployments

### 7.1 GitHub Integration

Vercel automatically sets up:

- **Production deployments** from `main` branch
- **Preview deployments** from pull requests
- **Development deployments** from other branches

### 7.2 Deployment Triggers

Every time you:

- Push to `main` branch → Production deployment
- Create pull request → Preview deployment
- Push to other branches → Development deployment

---

## Step 8: Performance Optimization

### 8.1 Vercel Analytics (Optional)

1. Enable Vercel Analytics in project settings
2. Get insights on:
   - Page load times
   - Core Web Vitals
   - User experience metrics

### 8.2 Edge Functions

Your API routes automatically become serverless functions:

- `/api/save-email` → Vercel serverless function
- `/api/test-env` → Vercel serverless function
- Automatic scaling based on traffic

---

## Step 9: Monitoring and Maintenance

### 9.1 Function Logs

Monitor your serverless functions:

1. Go to Vercel dashboard
2. Click on your project
3. Go to "Functions" tab
4. View logs and performance metrics

### 9.2 Error Tracking

Set up error monitoring:

- Check function logs for errors
- Monitor Google Sheets API quota usage
- Set up alerts for failed deployments

---

## Step 10: Security and Best Practices

### 10.1 Environment Security

- Never commit `.env.local` to git
- Use Vercel's environment variable encryption
- Regularly rotate API keys

### 10.2 API Rate Limits

Google Sheets API limits:

- 100 requests per 100 seconds per user
- 300 requests per 100 seconds
- Monitor usage in Google Cloud Console

---

## Troubleshooting Common Issues

### Build Errors

**Issue**: Build fails with dependency errors
**Solution**:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Environment Variable Issues

**Issue**: Google Sheets integration fails
**Solution**:

1. Verify all environment variables are set correctly
2. Check GOOGLE_PRIVATE_KEY includes full key with newlines
3. Test with `/api/test-env` endpoint

### API Timeout Issues

**Issue**: Serverless function timeouts
**Solution**:

- Vercel hobby plan: 10s timeout
- Vercel Pro plan: 60s timeout
- Optimize Google Sheets API calls

### Domain Configuration

**Issue**: Custom domain not working
**Solution**:

1. Verify DNS propagation (can take 24-48 hours)
2. Check DNS configuration matches Vercel instructions
3. Ensure SSL certificate is generated

---

## Deployment Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Google Sheets integration tested
- [ ] All buttons have proper cursor styling
- [ ] Prize calculation accuracy verified
- [ ] Email validation working
- [ ] Mobile responsiveness confirmed
- [ ] Analytics/GTM code added (if implementing)
- [ ] Custom domain configured (if desired)
- [ ] Error handling tested
- [ ] Performance optimized

---

## Post-Deployment Steps

### 1. Update Ad Campaigns

Update your ad campaign URLs to point to:

- Production URL: `https://your-app.vercel.app`
- Or custom domain: `https://spinwheel.yourdomain.com`

### 2. Set up Monitoring

- Configure Google Analytics (if following the analytics guide)
- Set up Vercel Analytics
- Monitor Google Sheets for submissions

### 3. Performance Testing

- Test with different devices and browsers
- Verify loading speeds
- Check mobile performance

---

## Scaling Considerations

### Traffic Expectations

Vercel free tier includes:

- 100GB bandwidth per month
- Unlimited static requests
- 100 serverless function executions per day

### Upgrading Plans

For higher traffic:

- **Pro Plan**: $20/month per user
- **Team Plan**: $20/month per user + team features
- **Enterprise**: Custom pricing

---

## Support and Resources

### Vercel Documentation

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)

### Getting Help

- Vercel Community Discord
- GitHub Issues
- Vercel Support (Pro+ plans)

---

## Quick Deploy Commands

For future updates:

```bash
# Make changes locally
git add .
git commit -m "Update spinning wheel features"
git push origin main
# Vercel automatically deploys!
```

Your spinning wheel app will be live and ready for ad traffic! 🚀
