# ShallWe!? — PWA

A lightweight Progressive Web App to plan walks, chat, and meet for coffee & cake. Built with semantic HTML5, CSS3, and Firebase v10+ (ES modules via CDN). No inline CSS. Accessible, responsive, and works offline.

## 1) One‑time setup

1. Firebase Console → **Authentication**: enable **Google** (email/password optional).
2. **Cloud Firestore**: enable (Native mode).
3. (Optional) **Storage**: only needed if you later add uploads.
4. In **Project settings → General**, ensure the web config in `firebase.js` matches your project.
5. Set your admin UID in `firebase.js` and in `firestore.rules` (currently: `mxFS592ds8cgeEspA0VxJkTu4Nl2`).

Deploy rules:
```bash
firebase deploy --only firestore:rules,storage
```

## 2) Local run
Serve with a local server (service worker needs http):
```bash
python -m http.server 8000
# then open http://localhost:8000/index.html
```

## 3) Hosting
### Firebase Hosting
```bash
firebase deploy --only hosting
```

## 4) Collections used
- `users/{uid}` — user profiles
- `chats/global/messages/{msg}` — chat messages + reactions
- `events/{id}` — events { title, date (timestamp), location, details }
- `suggestions/{id}` — free text suggestions (public create)

## 5) Icons & PWA
Icons live in `assets/icons/`:
- `icon-192.png`
- `icon-512.png`

`manifest.webmanifest` references them. Replace with your real logo anytime.

## 6) Notes
- Chat uses Google sign‑in; others can still browse events.
- Your own messages render on the right; reactions increment atomically.
- Edge/iOS scrolling is smooth via standard properties (no deprecated webkit hacks).
