# Deployment Instructions for Exam Hero

## For Client (Firebase Account Owner)

### Prerequisites
- Firebase CLI installed: `npm install -g firebase-tools`
- Logged into Firebase: `firebase login`

### Deployment Steps

1. **Navigate to project directory**
   ```bash
   cd /path/to/exam-hero-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

### Alternative: Manual Upload
If CLI deployment fails:
1. Build the project: `npm run build`
2. Go to Firebase Console → Hosting
3. Click "Upload files" or drag the `dist` folder
4. Deploy the uploaded files

### Project Configuration
- **Project ID**: exam-hero-9eb23
- **Build Output**: dist folder
- **Domain**: https://examhero.app/

### Environment Variables Required
Make sure these are set in Firebase Console → Project Settings → General:
- VITE_apiKey
- VITE_authDomain  
- VITE_projectId
- VITE_storageBucket
- VITE_messagingSenderId
- VITE_appId
- VITE_image_upload_key

### Troubleshooting
- If build fails, run `npm install` first
- If deployment fails, check Firebase project permissions
- If site doesn't load, verify environment variables are set

