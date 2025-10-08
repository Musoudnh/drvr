# Deployment Guide

This guide will help you successfully deploy your FinanceFlow application to production.

## Prerequisites

Before deploying, ensure you have:
- Your Supabase project credentials (URL and anon key)
- Access to a hosting platform (Vercel, Netlify, or similar)

## Critical: Environment Variables

**The most common reason deployments fail is missing environment variables.**

Your application requires these environment variables to function:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

These values are found in your Supabase project:
1. Go to your Supabase dashboard
2. Navigate to Project Settings > API
3. Copy the "Project URL" and "anon/public" key

## Platform-Specific Instructions

### Vercel

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository in Vercel
3. Before deploying, add environment variables:
   - Go to Project Settings > Environment Variables
   - Add `VITE_SUPABASE_URL` with your Supabase URL
   - Add `VITE_SUPABASE_ANON_KEY` with your anon key
   - Apply to: Production, Preview, and Development
4. Deploy

### Netlify

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository in Netlify
3. Before deploying, configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Go to Site settings > Build & deploy > Environment
   - Add `VITE_SUPABASE_URL` with your Supabase URL
   - Add `VITE_SUPABASE_ANON_KEY` with your anon key
4. Deploy

The `_redirects` file is already included in your build, so client-side routing will work automatically.

### Other Platforms

For other hosting platforms:
1. Set build command to: `npm run build`
2. Set output directory to: `dist`
3. Configure the environment variables listed above
4. Ensure SPA routing is enabled (the `_redirects` file handles this for most platforms)

## Post-Deployment Checklist

After deploying, verify:

1. **Site loads**: Visit your deployed URL
2. **No console errors**: Open browser DevTools > Console
3. **Environment variables work**: Check that the login page appears correctly
4. **Routing works**: Navigate to different pages and refresh - you should not get 404 errors
5. **Database connection**: Try logging in or signing up to verify Supabase connection

## Troubleshooting

### Blank Page or White Screen

**Cause**: Missing environment variables

**Solution**:
1. Open browser console (F12)
2. Look for errors mentioning Supabase or environment variables
3. Verify environment variables are set in your hosting platform
4. Redeploy after adding variables

### 404 Errors on Page Refresh

**Cause**: SPA routing not configured

**Solution**:
- The `_redirects` file should be in your `dist` folder after build
- Verify it exists: check `dist/_redirects`
- For custom platforms, ensure SPA fallback is enabled

### "Application configuration error"

**Cause**: Environment variables not loaded correctly

**Solution**:
1. Check variable names are exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
2. No extra spaces in values
3. Values must be set in your hosting platform's settings, not just in `.env` file
4. Redeploy after updating

### Database Connection Errors

**Cause**: Incorrect Supabase credentials or network issues

**Solution**:
1. Verify the URL and key are correct
2. Check Supabase dashboard for any service disruptions
3. Ensure your Supabase project is active and not paused

## Security Notes

- Never commit your `.env` file to version control (it's already in `.gitignore`)
- The `.env.example` file is safe to commit - it contains no actual credentials
- The anon key is safe to expose in client-side code (it's designed for public use)
- Always use Row Level Security (RLS) in Supabase to protect your data

## Need Help?

If you're still experiencing issues:
1. Check the browser console for specific error messages
2. Verify all environment variables are correctly set
3. Ensure your build completed without errors
4. Check your hosting platform's build logs for issues
