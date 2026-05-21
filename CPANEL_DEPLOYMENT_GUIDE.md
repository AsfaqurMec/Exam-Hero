# cPanel Deployment Guide for Exam Hero

## Overview
This guide will help you deploy your React/Vite Exam Hero application on cPanel hosting.

## Prerequisites
- cPanel hosting account with Node.js support
- Access to cPanel File Manager
- Node.js application feature enabled in cPanel

## Deployment Options

### Option 1: Static Files Deployment (Recommended for React Apps)

Since your app is a React/Vite application, the easiest way is to deploy it as static files:

#### Steps:
1. **Build your application locally:**
   ```bash
   npm run build
   ```

2. **Upload to cPanel:**
   - Go to cPanel → File Manager
   - Navigate to `public_html` (or your domain's root directory)
   - Upload the entire `dist` folder contents
   - Make sure `index.html` is in the root of `public_html`

3. **Create .htaccess file** (for React Router support):
   - Create a `.htaccess` file in `public_html`
   - Add the following content:

#### .htaccess Configuration:
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

### Option 2: Node.js Application Deployment

If you want to use the Node.js application feature in cPanel:

#### Steps:
1. **Prepare your application:**
   - Create a `server.js` file (see below)
   - Update `package.json` with start script

2. **Upload files:**
   - Upload your entire project to a subdirectory (e.g., `backend`)
   - Make sure all files are uploaded

3. **Configure in cPanel:**
   - Go to cPanel → Node.js Applications
   - Create new application:
     - **Node.js version:** 18.x or 20.x (recommended)
     - **Application mode:** Production
     - **Application root:** backend (or your folder name)
     - **Application URL:** your-domain.com
     - **Application startup file:** server.js

4. **Install dependencies:**
   - Click "Run NPM Install" in the Node.js application interface

5. **Start the application:**
   - Click the "Start" button

## Required Files for Node.js Deployment

### server.js
```javascript
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

### Updated package.json
Add these scripts to your package.json:
```json
{
  "scripts": {
    "start": "node server.js",
    "build": "vite build",
    "dev": "vite"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

## Environment Variables

If your app uses environment variables, you can set them in cPanel:

1. Go to cPanel → Node.js Applications
2. Click on your application
3. Go to "Environment Variables" tab
4. Add your variables (e.g., VITE_API_KEY, etc.)

## Important Notes

### For Static Deployment:
- ✅ Faster loading
- ✅ Lower server resource usage
- ✅ Better for SEO
- ❌ No server-side features

### For Node.js Deployment:
- ✅ Can handle server-side logic
- ✅ Better for dynamic content
- ❌ Uses more server resources
- ❌ Requires Node.js hosting

## Troubleshooting

### Common Issues:

1. **404 errors on page refresh:**
   - Make sure `.htaccess` file is properly configured
   - Check that all routes redirect to `index.html`

2. **Assets not loading:**
   - Verify file paths in `dist/index.html`
   - Check that all files are uploaded correctly

3. **Node.js app not starting:**
   - Check Node.js version compatibility
   - Verify `package.json` has correct start script
   - Check application logs in cPanel

4. **Environment variables not working:**
   - Set variables in cPanel Node.js application settings
   - Restart the application after adding variables

## Recommended Approach

For your Exam Hero application, I recommend **Option 1 (Static Files Deployment)** because:
- It's a React frontend application
- Faster performance
- Lower hosting costs
- Easier to maintain

## Next Steps

1. Choose your deployment method
2. Follow the corresponding steps
3. Test your application thoroughly
4. Set up SSL certificate if needed
5. Configure domain settings

## Support

If you encounter any issues:
1. Check cPanel error logs
2. Verify file permissions
3. Test locally first
4. Contact your hosting provider if needed

