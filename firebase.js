// firebase.js — Firebase v10 CDN, no top-level await
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getFirestore, doc, getDoc, setDoc, collection, addDoc, onSnapshot,
  query, orderBy, serverTimestamp, getDocs, deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import {
  getAuth, signInAnonymously, onAuthStateChanged,
  signInWithEmailAndPassword, signOut,
  setPersistence, browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDoYwk7CsJp4O5lfuEgBsHGeioJuZxysr4",
  authDomain: "shallwe-project.firebaseapp.com",
  projectId: "shallwe-project",
  storageBucket: "shallwe-project.firebasestorage.app",
  messagingSenderId: "329989191902",
  appId: "1:329989191902:web:7ba19c2ad6f84833c1ea4f",
  measurementId: "G-NTV6TQV9RZ"
};

export const app  = initializeApp(firebaseConfig);
export const db   = getFirestore(app);
export const auth = getAuth(app);

// Persist login (no top-level await)
setPersistence(auth, browserLocalPersistence).catch(() => {});

export const ADMIN_UID = "mxFS592ds8cgeEspA0VxJkTu4Nl2";

// ---- Auth helper ----
export async function ensureAnonAuth() {
  if (auth.currentUser) return auth.currentUser;
  try { await signInAnonymously(auth); }
  catch {
    throw new Error("Enable Anonymous sign-in: Firebase Console → Authentication → Sign-in method.");
  }
  return new Promise(res => onAuthStateChanged(auth, u => u && res(u)));
}

// ---- CHAT (key fix: createdAtMillis + orderBy) ----
export function listenMessages(cb) {
  const ref = collection(db, "messages");
  const qy  = query(ref, orderBy("createdAtMillis", "asc"));
  return onSnapshot(qy, snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}
export async function sendMessage({ text, userId, displayName }) {
  await addDoc(collection(db, "messages"), {
    text,
    userId,
    displayName: displayName || 'Anon',
    createdAt: serverTimestamp(),     // server time
    createdAtMillis: Date.now()       // client time for ordering (prevents vanishing)
  });
}

// ---- (rest of your helpers unchanged) ----
// Current event
export async function getCurrentEvent() {
  const ref = doc(db, "events", "current");
  const snap = await getDoc(ref);
  return snap.exists() ? { id: "current", ...snap.data() } : null;
}
export function listenCurrentParticipants(cb) {
  const ref = collection(db, "events", "current", "participants");
  const qy  = query(ref, orderBy("name"));
  return onSnapshot(qy, snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}
// Suggestions
export function listenSuggestions(cb) {
  const qy = query(collection(db, "suggestions"), orderBy("createdAt", "desc"));
  return onSnapshot(qy, snap => cb(snap.docs.map(d => ({ id:d.id, ...d.data() }))));
}
export async function submitSuggestion(payload) {
  await addDoc(collection(db, "suggestions"), { ...payload, createdAt: serverTimestamp() });
}
// Past events
export async function listPastEvents() {
  const snap = await getDocs(query(collection(db, "past_events"), orderBy("date","desc")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
// Archive helpers
function todayUkISO() {
  const now = new Date();
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone:'Europe/London', year:'numeric', month:'2-digit', day:'2-digit' });
  const [dd, mm, yyyy] = fmt.format(now).split('/');
  return `${yyyy}-${mm}-${dd}`;
}
function isPastDate(date) { return typeof date === 'string' && date < todayUkISO(); }
async function archiveCurrentCore({ bypassDateCheck=false }={}) {
  const evRef = doc(db, "events", "current");
  const evSnap = await getDoc(evRef);
  if (!evSnap.exists()) return { status: "no-current" };
  const ev = evSnap.data();
  if (!bypassDateCheck && !isPastDate(ev.date)) return { status: "not-past" };
  if (ev._archived) return { status: "already-archived" };
  const partsSnap = await getDocs(collection(db, "events", "current", "participants"));
  const participants = partsSnap.docs.map(d => ({ id:d.id, ...d.data() }));
  const pastRef = await addDoc(collection(db, "past_events"), {
    title: ev.title || "Untitled",
    place: ev.place || ev.location || "",
    date: ev.date || null,
    time: ev.time || null,
    location: ev.location || ev.place || "",
    description: ev.description || "",
    participants,
    archivedFromCurrent: true,
    archivedAt: serverTimestamp()
  });
  for (const d of partsSnap.docs) await deleteDoc(d.ref);
  await deleteDoc(evRef);
  return { status:"archived", pastId: pastRef.id };
}
export async function archiveCurrentEventIfExpired() { return archiveCurrentCore(); }
export async function archiveCurrentEventNow() { return archiveCurrentCore({ bypassDateCheck:true }); }
// Admin
export async function emailSignIn(email, password) { return (await signInWithEmailAndPassword(auth, email, password)).user; }
export async function emailSignOut() { await signOut(auth); }
export async function saveCurrentEvent(data) { await setDoc(doc(db,"events","current"), { ...data, _archived:false }, { merge:true }); }
export async function loadCurrentParticipants() {
  const snap = await getDocs(collection(db, "events","current","participants"));
  return snap.docs.map(d => ({ id:d.id, ...d.data() }));
}
export async function saveCurrentParticipants(list) {
  const col = collection(db, "events","current","participants");
  const snap = await getDocs(col);
  for (const d of snap.docs) await deleteDoc(d.ref);
  for (const p of list) await addDoc(col, { name:p.name, status:(p.status||'maybe').toLowerCase() });
}
// People
export async function listPeople() {
  const snap = await getDocs(query(collection(db, "people"), orderBy("name")));
  return snap.docs.map(d => ({ id:d.id, ...d.data() }));
}
export async function addPerson(name) { await addDoc(collection(db,"people"), { name:name.trim() }); }
export async function deletePerson(id) { await deleteDoc(doc(db,"people",id)); }
export async function renamePerson(id,newName) { await setDoc(doc(db,"people",id), { name:newName.trim() }, { merge:true }); }
export async function upsertPeople(names) {
  const existing = await listPeople();
  const have = new Set(existing.map(p => (p.name||'').toLowerCase()));
  for (const raw of names) {
    const name = (raw||'').trim();
    if (!name || have.has(name.toLowerCase())) continue;
    await addDoc(collection(db,'people'), { name });
  }
}
// RSVP
export async function rsvpForCurrentEvent({ name, status }) {
  if (!auth.currentUser) await signInAnonymously(auth);
  const uid = auth.currentUser.uid;
  await setDoc(doc(db,"events","current","participants",uid), {
    userId: uid, name: name||'Anon', status: (status||'maybe').toLowerCase()
  }, { merge:true });
}
