// events.js — list current & past events
import { db, collection, query, orderBy, getDocs } from "./firebase.js";

const currentHost = document.getElementById("currentEvent");
const listHost = document.getElementById("eventsList");

function renderEventCard(e){
  const div = document.createElement("div");
  div.className = "card";
  const when = e.date?.toDate ? e.date.toDate() : new Date(e.date);
  div.innerHTML = `<h3>${e.title}</h3>
    <p class="subtle">${when.toLocaleString()} — ${e.location || ""}</p>
    <p>${(e.details || "").replace(/\n/g,"<br>")}</p>`;
  return div;
}

(async () => {
  const q = query(collection(db, "events"), orderBy("date","asc"));
  const snap = await getDocs(q);
  const now = new Date();
  const events = snap.docs.map(d => ({ id:d.id, ...d.data() }));
  const upcoming = events.find(e => (e.date?.toDate ? e.date.toDate() : new Date(e.date)) >= now);
  if(currentHost){
    currentHost.innerHTML = upcoming ? renderEventCard(upcoming).outerHTML : "<p>No upcoming events yet.</p>";
  }
  if(listHost){
    listHost.innerHTML = "";
    events.forEach(e => listHost.appendChild(renderEventCard(e)));
  }
})();
