# 🚀 QUICK START GUIDE

## Immediate Next Steps

### 1. Configure Firebase (5 minutes)

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create new project: "protocolo-dark"
3. Enable Authentication → Email/Password
4. Create Firestore Database → Production mode
5. Copy config from Project Settings → General → Your apps
6. Paste into `src/lib/firebase.ts`
7. Update `.firebaserc` with project ID

### 2. Add Content (10 minutes)

**Video URLs** - Edit `src/lib/modules.ts`:
```typescript
videoUrl: "https://vimeo.com/YOUR_VIDEO_ID"
```

**Cover Images** - Add to `public/assets/`:
- mod1.jpg (1080x1620px)
- mod2.jpg
- mod3.jpg
- bonus.jpg
- sindicato.jpg

### 3. Test Locally (2 minutes)

```bash
npm run dev
```

Open `http://localhost:5173`

### 4. Deploy Backend (5 minutes)

```bash
firebase login
cd functions
npm run build
firebase deploy --only functions
```

Copy the webhook URL.

### 5. Deploy Frontend (3 minutes)

```bash
npm run build
firebase deploy --only hosting
```

### 6. Configure ParadisePags (2 minutes)

1. Add webhook URL to ParadisePags dashboard
2. Test with a purchase
3. Verify user appears in Firebase Console

---

## 🔑 Critical Files to Update

| File | What to Change |
|------|----------------|
| `src/lib/firebase.ts` | Firebase credentials |
| `.firebaserc` | Project ID |
| `src/lib/modules.ts` | Video URLs |
| `public/assets/` | Module images |

---

## 🧪 Test Webhook Manually

```bash
curl -X POST https://YOUR-REGION-YOUR-PROJECT.cloudfunctions.net/handleParadisePagsWebhook \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "status": "approved",
    "name": "Test User"
  }'
```

Check Firebase Console → Authentication for new user.

---

## 📱 Test Login

Default test user (create manually in Firebase Console):
- Email: `admin@protocolodark.com`
- Password: `Dark#2025`

---

## 🎯 Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Firebase
firebase login           # Login to Firebase
firebase deploy          # Deploy everything
firebase deploy --only hosting    # Deploy frontend only
firebase deploy --only functions  # Deploy backend only
firebase functions:log   # View function logs

# Functions
cd functions
npm run build           # Compile TypeScript
npm run serve           # Test locally with emulator
```

---

## 🔐 Firestore Security Rules

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

Paste this in Firebase Console → Firestore → Rules.

---

## 🎨 Quick Customizations

**Change primary color:**
```javascript
// tailwind.config.js
cyan: '#YOUR_COLOR'
```

**Reduce particles (better performance):**
```typescript
// src/components/background/ParticleVoid.tsx
const sphere = random.inSphere(new Float32Array(3000), { radius: 1.5 });
```

**Change access level:**
```typescript
// functions/src/index.ts
accessLevel: "soldado" // or "operador" or "elite"
```

---

**READY TO DEPLOY** 🎯
