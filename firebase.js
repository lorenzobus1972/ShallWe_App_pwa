// firebase.js — Firebase v10+ (ESM via CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, addDoc, getDocs, updateDoc, collection, onSnapshot, query, orderBy, limit, where, increment } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

export const ADMIN_UID = "mxFS592ds8cgeEspA0VxJkTu4Nl2";

const firebaseConfig = {
  apiKey: "AIzaSyDoYwk7CsJp4O5lfuEgBsHGeioJuZxysr4",
  authDomain: "shallwe-project.firebaseapp.com",
  projectId: "shallwe-project",
  storageBucket: "shallwe-project.firebasestorage.app",
  messagingSenderId: "329989191902",
  appId: "1:329989191902:web:7ba19c2ad6f84833c1ea4f",
  measurementId: "G-NTV6TQV9RZ"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// --- helpers ---
export function onAuth(fn){ return onAuthStateChanged(auth, fn); }

export async function ensureUserDoc(user){
  if(!user) return;
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if(!snap.exists()){
    await setDoc(ref, {
      displayName: user.displayName || "Walker",
      photoURL: user.photoURL || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }else{
    await updateDoc(ref, { updatedAt: serverTimestamp() });
  }
}

export async function signInWithGoogle(){
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
}
export async function emailPasswordSignIn(email, password){
  return signInWithEmailAndPassword(auth, email, password);
}
export async function doSignOut(){ return signOut(auth); }

export async function saveProfile(displayName, photoURL){
  if(!auth.currentUser) throw new Error("Not signed in");
  await updateProfile(auth.currentUser, { displayName, photoURL });
  await setDoc(doc(db,"users",auth.currentUser.uid), { displayName, photoURL, updatedAt: serverTimestamp() }, { merge:true });
}

// --- chat ---
export { serverTimestamp, doc, getDoc, setDoc, addDoc, getDocs, updateDoc, collection, onSnapshot, query, orderBy, limit, where, increment };
