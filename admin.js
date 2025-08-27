// admin.js — admin-only event creation
import { auth, ADMIN_UID, db, collection, addDoc, serverTimestamp } from "./firebase.js";

const form = document.getElementById("eventForm");
const msg = document.getElementById("adminMsg");

function guard(){
  const u = auth.currentUser;
  if(!u){ msg.textContent = "Please sign in (Google)."; return false; }
  if(u.uid !== ADMIN_UID){ msg.textContent = "Access denied: admin only."; return false; }
  return true;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if(!guard()) return;
  const data = {
    title: document.getElementById("title").value.trim(),
    date: new Date(document.getElementById("date").value),
    location: document.getElementById("location").value.trim(),
    details: document.getElementById("details").value.trim(),
    createdAt: serverTimestamp(),
    createdBy: auth.currentUser.uid
  };
  try{
    await addDoc(collection(db, "events"), data);
    msg.textContent = "Saved ✅";
    form.reset();
  }catch(err){
    msg.textContent = "Error: " + err.message;
  }
});
