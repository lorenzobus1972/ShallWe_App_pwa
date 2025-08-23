# ShallWe!? — Static Firebase App

Zero-build HTML/CSS/JS app wired to Firebase (Auth + Firestore).

## Firebase config
Already embedded in `firebase.js`:
- projectId: `shallwe-project`
- admin UID: `mxFS592ds8cgeEspA0VxJkTu4Nl2`

## Pages
- `index.html` — Next event, participants chips + legend, RSVP, menu, chat FAB
- `chat.html` — Realtime chat (anonymous auth, stable ordering)
- `suggest.html` — Suggest an event; admin can delete suggestions
- `admin.html` — Admin panel (Email/Password login), set event, participants, archive
- `people.html` — Admin-only People list (master names)
- `past.html` — Past events archive with participant chips
- `styles.css` — Shared styles (no inline CSS)
- `firebase.js` — Firebase helpers (Auth, Firestore)

## Setup
1. Firebase Console → Authentication → enable **Email/Password** and **Anonymous**.
2. Create admin user; ensure UID = `mxFS592ds8cgeEspA0VxJkTu4Nl2`.
3. Firestore → Rules → paste `rules.txt` → **Publish**.
4. Deploy: `firebase deploy --only hosting`.
5. Open `admin.html` to set the first current event + participants.
