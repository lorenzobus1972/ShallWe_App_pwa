// suggest.js — add suggestion document
import { auth, db, collection, addDoc, serverTimestamp } from "./firebase.js";

const form = document.getElementById("suggestForm");
const msg = document.getElementById("suggestMsg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const idea = document.getElementById("idea").value.trim();
  if(!idea) return;
  try{
    await addDoc(collection(db, "suggestions"), {
      idea, createdAt: serverTimestamp(),
      userId: auth.currentUser?.uid || null
    });
    msg.textContent = "Sent, thank you!";
    form.reset();
  }catch(err){
    msg.textContent = "Error: " + err.message;
  }
});
