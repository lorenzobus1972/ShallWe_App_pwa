// people.js — list users
import { db, collection, getDocs, query } from "./firebase.js";

const list = document.getElementById("peopleList");

(async () => {
  const q = query(collection(db, "users"));
  const snap = await getDocs(q);
  const ul = document.createElement("ul");
  ul.style.listStyle = "none"; ul.style.padding = "0";
  snap.forEach(docSnap => {
    const u = docSnap.data();
    const li = document.createElement("li");
    li.style.padding = ".4rem 0"; li.style.borderBottom = "1px solid #e6eeea";
    li.innerHTML = `<strong>${u.displayName || "Walker"}</strong>${u.photoURL ? ` — <a href="${u.photoURL}">photo</a>` : ""}`;
    ul.appendChild(li);
  });
  list.innerHTML = "";
  list.appendChild(ul);
})();
