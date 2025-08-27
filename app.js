// app.js — common UI and auth handling
import { auth, onAuth, ensureUserDoc, signInWithGoogle, doSignOut, ADMIN_UID } from "./firebase.js";

// Mobile menu toggle
const toggleBtn = document.getElementById("nav-toggle");
const menu = document.getElementById("menu");
if(toggleBtn && menu){
  toggleBtn.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

// Auth controls in nav (optional: sign-in/out buttons could be added here later)
// Keep header minimal per user feedback

function updateAuthUI(user){
  // Example: show admin link only to admin (already visible in nav; you could toggle here)
}

onAuth(async (user) => {
  updateAuthUI(user);
  if(user){
    await ensureUserDoc(user);
  }
});

// Register Service Worker
if("serviceWorker" in navigator){
  navigator.serviceWorker.register("service-worker.js").catch(()=>{});
}
