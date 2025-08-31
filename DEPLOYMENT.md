# 🚀 Deployment Guide

This guide will help you deploy Bunkr to production.

## 📋 Prerequisites

- [Supabase](https://supabase.com) account and project
- [Vercel](https://vercel.com) account (recommended) or other hosting platform
- Git repository with your Bunkr code

## 🔧 Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `bunkr-attendance` (or your preferred name)
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for project to be ready (usually 2-3 minutes)

### 1.2 Database Setup

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `supabase-setup.sql`
3. Paste into the SQL editor and click "Run"
4. Verify all tables are created in **Table Editor**

### 1.3 Get API Keys

1. Go to **Settings** → **API**
2. Copy your **Project URL** and **anon public** key
3. These will be your environment variables

## 🌐 Step 2: Environment Configuration

### 2.1 Local Development

Create `.env.local` file in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_NAME=Bunkr
NEXT_PUBLIC_APP_VERSION=0.1.0
```

### 2.2 Production Environment

You'll add these same variables to your hosting platform.

## 🚀 Step 3: Deploy to Vercel (Recommended)

### 3.1 Connect Repository

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. Select the repository containing Bunkr

### 3.2 Configure Project

1. **Framework Preset**: Next.js (should auto-detect)
2. **Root Directory**: `./` (leave as default)
3. **Build Command**: `npm run build` (should auto-detect)
4. **Output Directory**: `.next` (should auto-detect)
5. **Install Command**: `npm install` (should auto-detect)

### 3.3 Environment Variables

1. Click "Environment Variables"
2. Add each variable from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_NAME`
   - `NEXT_PUBLIC_APP_VERSION`

### 3.4 Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Your app will be available at the provided URL

## 🐳 Alternative: Docker Deployment

### 3.1 Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### 3.2 Build and Run

```bash
docker build -t bunkr .
docker run -p 3000:3000 --env-file .env.local bunkr
```

## 🌍 Alternative: Other Platforms

### Netlify

1. Connect your Git repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables in site settings

### Railway

1. Connect your Git repository
2. Auto-detects Next.js
3. Add environment variables in project settings
4. Automatic deployments on push

### DigitalOcean App Platform

1. Connect your Git repository
2. Choose Next.js as app type
3. Add environment variables
4. Deploy with one click

## ✅ Step 4: Post-Deployment

### 4.1 Test Your App

1. Visit your deployed URL
2. Test authentication (sign up/sign in)
3. Test course creation
4. Test attendance marking
5. Test duty leave uploads
6. Test PWA installation

### 4.2 PWA Verification

1. Open Chrome DevTools
2. Go to **Application** tab
3. Check **Manifest** and **Service Workers**
4. Test "Install" prompt on mobile

### 4.3 Performance Check

1. Run Lighthouse audit
2. Check Core Web Vitals
3. Verify offline functionality

## 🔒 Step 5: Security & Monitoring

### 5.1 Supabase Security

1. **Row Level Security**: Already enabled via setup script
2. **API Keys**: Keep your service role key secret
3. **Storage**: Verify bucket policies are correct

### 5.2 Environment Security

1. Never commit `.env.local` to Git
2. Use different keys for development/production
3. Regularly rotate API keys

### 5.3 Monitoring

1. Set up Supabase alerts for unusual activity
2. Monitor Vercel analytics
3. Set up error tracking (e.g., Sentry)

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

#### Environment Variables
- Ensure all variables are set in hosting platform
- Check variable names match exactly
- Verify Supabase URL format

#### Database Connection
- Verify Supabase project is active
- Check RLS policies are applied
- Test connection in Supabase dashboard

#### PWA Issues
- Clear browser cache
- Check manifest.json is accessible
- Verify service worker registration

### Support Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)

## 🎉 Success!

Your Bunkr attendance tracker is now deployed and ready to use! 

**Next Steps:**
1. Share the app with your team/students
2. Set up custom domain (optional)
3. Monitor usage and performance
4. Plan future enhancements

---

**Need Help?** Check the troubleshooting section or open an issue in the repository.
