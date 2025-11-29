# 🎯 PROTOCOLO DARK // MEMBER AREA

A cinematic digital ecosystem for tactical operators. Built with React, Firebase, and Three.js.

## 🏗️ ARCHITECTURE

- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **3D**: Three.js (@react-three/fiber)
- **Backend**: Firebase v9 (Auth + Firestore + Cloud Functions)
- **Video**: react-player
- **Icons**: Lucide React

---

## 🚀 QUICK START

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password provider)
3. Create a **Firestore Database** (Start in production mode)
4. Copy your Firebase config from Project Settings > General > Your apps
5. Update `src/lib/firebase.ts` with your credentials
6. Update `.firebaserc` with your project ID

### 3. Setup Environment Variables (Optional)

Create a `.env` file:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

---

## 🔧 FIREBASE FUNCTIONS (WEBHOOK)

### 1. Install Functions Dependencies

```bash
cd functions
npm install
```

### 2. Deploy Functions

```bash
firebase login
firebase deploy --only functions
```

### 3. Get Webhook URL

After deployment, you'll receive a URL like:
```
https://us-central1-protocolo-dark.cloudfunctions.net/handleParadisePagsWebhook
```

### 4. Configure ParadisePags

1. Go to ParadisePags dashboard
2. Navigate to Webhooks settings
3. Add the Cloud Function URL
4. Test with a sample transaction

### Webhook Payload Format

The function expects this JSON structure:

```json
{
  "email": "customer@example.com",
  "status": "approved",
  "name": "Customer Name",
  "product_id": "protocolo-dark"
}
```

**Adjust field names in `functions/src/index.ts` to match ParadisePags docs.**

---

## 📦 PRODUCTION BUILD

```bash
npm run build
```

Deploy to Firebase Hosting:

```bash
firebase deploy --only hosting
```

Or deploy to Vercel/Netlify (connect your repo).

---

## 🎨 CUSTOMIZATION

### Add Video URLs

Edit `src/lib/modules.ts` and replace placeholder URLs:

```typescript
videoUrl: "https://vimeo.com/YOUR_VIDEO_ID"
```

### Add Module Cover Images

Place images in `public/assets/`:
- `mod1.jpg`
- `mod2.jpg`
- `mod3.jpg`
- `bonus.jpg`
- `sindicato.jpg`

### Change Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  void: '#050505',
  cyan: '#00AEEF',
  gold: '#FFD700',
  // ...
}
```

---

## 📊 FIRESTORE STRUCTURE

### Collection: `users`

```typescript
{
  uid: string
  email: string
  displayName: string
  accessLevel: "soldado" | "operador" | "elite"
  createdAt: Timestamp
  lastUpdated: Timestamp
  progress: {
    [lessonId]: boolean
  }
  currentLesson: string
}
```

---

## 🔐 SECURITY RULES

Add these Firestore rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🎯 FEATURES

✅ **Serverless Webhook** - Auto-provision users from ParadisePags  
✅ **Firebase Auth** - Email/password authentication  
✅ **Progress Tracking** - Firestore-synced lesson completion  
✅ **Cinematic UI** - Three.js particle void + Framer Motion  
✅ **Video Player** - Custom-skinned react-player  
✅ **Responsive** - Mobile-first design  

---

## 📝 TODO

- [ ] Add actual video URLs to `src/lib/modules.ts`
- [ ] Upload module cover images to `public/assets/`
- [ ] Configure Firebase project credentials
- [ ] Deploy Cloud Functions
- [ ] Setup ParadisePags webhook
- [ ] Test end-to-end user flow
- [ ] (Optional) Setup Nodemailer for welcome emails

---

## 🆘 TROUBLESHOOTING

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Firebase Auth errors
- Check if Email/Password provider is enabled in Firebase Console
- Verify `firebase.ts` credentials are correct

### Webhook not working
- Check Cloud Function logs: `firebase functions:log`
- Verify CORS is enabled
- Test with curl/Postman first

---

## 📄 LICENSE

Proprietary - Protocolo Dark © 2025

---

**PROTOCOL INITIATED** 🎯
