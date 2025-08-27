// chat.js — realtime chat with reactions
import { auth, db, serverTimestamp, collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, increment } from "./firebase.js";

const chatStream = document.getElementById("chatStream");
const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

const roomPath = ["chats","global","messages"]; // collection path

function renderMessage(id, data){
  const isSelf = auth.currentUser && data.userId === auth.currentUser.uid;
  const wrap = document.createElement("div");
  wrap.className = "msg" + (isSelf ? " msg--self" : "");
  wrap.dataset.id = id;

  const avatar = document.createElement("div");
  avatar.className = "msg__avatar";
  avatar.setAttribute("aria-hidden", "true");

  const bubble = document.createElement("div");
  bubble.className = "msg__bubble";
  bubble.tabIndex = 0;
  bubble.setAttribute("role","button");
  bubble.setAttribute("aria-label","React to message");
  bubble.textContent = data.text;

  const meta = document.createElement("div");
  meta.className = "msg__meta";
  const when = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
  meta.textContent = (data.displayName || "Walker") + " • " + when.toLocaleString();

  const reacts = document.createElement("div");
  reacts.className = "reactions";
  const emojis = ["👍","❤️","😂"];
  emojis.forEach(e => {
    const b = document.createElement("button");
    b.type="button"; b.className="react-btn"; b.textContent = e + " " + (data.reactions?.[e] || 0);
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", async () => {
      try{
        await updateDoc(doc(db, ...roomPath, id), { ["reactions."+e]: increment(1) });
      }catch(err){
        console.error(err);
      }
    });
    reacts.appendChild(b);
  });

  const stack = document.createElement("div");
  stack.style.maxWidth = "min(640px, 100%)";
  stack.appendChild(bubble);
  stack.appendChild(meta);
  stack.appendChild(reacts);

  if(isSelf){
    wrap.appendChild(stack);
  }else{
    wrap.appendChild(avatar);
    wrap.appendChild(stack);
  }
  return wrap;
}

function scrollToBottom(){
  chatStream.scrollTop = chatStream.scrollHeight;
}

onSnapshot(
  query(collection(db, ...roomPath), orderBy("createdAt","asc")),
  (snap) => {
    chatStream.innerHTML = "";
    snap.forEach(docSnap => {
      const el = renderMessage(docSnap.id, docSnap.data());
      chatStream.appendChild(el);
    });
    scrollToBottom();
  }
);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if(!auth.currentUser){ alert("Please sign in to chat (use Google in the header)."); return; }
  const text = input.value.trim();
  if(!text) return;
  sendBtn.disabled = true;
  try{
    await addDoc(collection(db, ...roomPath), {
      userId: auth.currentUser.uid,
      displayName: auth.currentUser.displayName || "Walker",
      text,
      createdAt: serverTimestamp(),
      reactions: {}
    });
    input.value = "";
    input.focus();
  }catch(err){
    alert("Couldn't send: " + err.message);
  }finally{
    sendBtn.disabled = false;
  }
});
