// profile.js — update profile
import { auth, onAuth, saveProfile } from "./firebase.js";

const form = document.getElementById("profileForm");
const msg = document.getElementById("profileMsg");

onAuth((u) => {
  if(!u){ msg.textContent = "Please sign in to edit your profile."; form.querySelectorAll("input,button,textarea").forEach(el => el.disabled = true); return; }
  form.displayName.value = u.displayName || "";
  form.photoURL.value = u.photoURL || "";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  try{
    await saveProfile(form.displayName.value.trim(), form.photoURL.value.trim());
    msg.textContent = "Profile updated ✅";
  }catch(err){
    msg.textContent = "Error: " + err.message;
  }
});
