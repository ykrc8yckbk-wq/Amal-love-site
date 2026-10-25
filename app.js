const $ = (id) => document.getElementById(id);
const audio = $("bg-music");
const musicToggle = $("music-toggle");
const logoutButton = $("logout");
if (logoutButton) logoutButton.addEventListener("click", async () => {
  await fetch("/.netlify/functions/auth", {method:"DELETE", credentials:"same-origin"});
  window.location.replace("/");
});

async function loadProtectedMemories() {
  try {
    const response = await fetch("/.netlify/functions/memories", {credentials:"same-origin"});
    if (!response.ok) return;
    const data = await response.json();
    if (!Array.isArray(data.memories) || data.memories.length === 0) return;
    const list = $("memory-list");
    list.innerHTML = "";
    data.memories.forEach((memory) => {
      const card = document.createElement("article");
      card.className = "memory-card";
      const photo = document.createElement("div");
      photo.className = "memory-photo placeholder-photo";
      if (memory.image && /^https:\/\/|^\//.test(memory.image)) {
        const img = document.createElement("img");
        img.src = memory.image; img.alt = memory.title || "Our memory";
        img.style.cssText = "width:100%;height:100%;object-fit:cover";
        photo.textContent = ""; photo.appendChild(img);
      } else {
        photo.textContent = "♡";
        const small = document.createElement("small"); small.textContent = "Add a photo URL"; photo.appendChild(small);
      }
      const content = document.createElement("div"); content.className = "memory-content";
      const date = document.createElement("p"); date.className = "memory-date"; date.textContent = memory.date || "A MEMORY";
      const title = document.createElement("h3"); title.textContent = memory.title || "A little moment";
      const story = document.createElement("p"); story.textContent = memory.story || "Write what happened here.";
      content.append(date,title,story); card.append(photo,content); list.appendChild(card);
    });
  } catch (_) { /* Keep the starter placeholders visible if no private store is configured yet. */ }
}

loadProtectedMemories();

$("secret-note-btn").addEventListener("click", () => $("secret-note").classList.toggle("hidden"));

const questions = [
  {q:"Question 1 of 3: What is the best part of our story?", options:["A. The little moments","B. The big adventures","C. Every moment with you"], correct:2, feedback:"Exactly. Every moment with you is my favourite. ♥"},
  {q:"Question 2 of 3: What do I want us to collect more of?", options:["A. Cute photos","B. Beautiful memories","C. Both, forever"], correct:2, feedback:"Yes — more photos, more memories, more us. ♡"},
  {q:"Question 3 of 3: Who is my favourite person?", options:["A. Amal","B. Amal, obviously","C. Still Amal"], correct:1, feedback:"All answers accepted. It's always you, Amal. 💗"}
];
let questionIndex = 0;
function renderQuestion() {
  const q = questions[questionIndex];
  $("quiz-question").textContent = q.q;
  $("quiz-options").innerHTML = "";
  q.options.forEach((label,index) => {
    const button = document.createElement("button");
    button.type = "button"; button.textContent = label;
    button.addEventListener("click", () => {
      $("quiz-options").querySelectorAll("button").forEach(b => b.disabled = true);
      $("quiz-feedback").textContent = q.feedback;
      $("quiz-next").classList.remove("hidden");
    });
    $("quiz-options").appendChild(button);
  });
  $("quiz-feedback").textContent = "";
  $("quiz-next").textContent = questionIndex === questions.length-1 ? "Play again ↻" : "Next question →";
  $("quiz-next").classList.add("hidden");
}
$("quiz-next").addEventListener("click", () => {questionIndex = (questionIndex+1)%questions.length;renderQuestion();});
renderQuestion();

const compliments = [
  "You make my world softer and brighter. ♥",
  "If I could relive one little moment, I'd choose another day with you.",
  "Your smile is one of my favourite things in this world. ♡",
  "You are loved in all the big ways and all the tiny ones.",
  "No matter how ordinary the day is, you make it feel special.",
  "My favourite notification will always be your name. 💌",
  "Here's your reminder: you're my favourite kind of magic.",
  "I hope you see yourself through my eyes for just one second. ✨"
];
let lastCompliment = -1;
$("compliment-btn").addEventListener("click", () => {
  let next;
  do { next = Math.floor(Math.random()*compliments.length); } while (next === lastCompliment);
  lastCompliment = next;
  $("compliment").textContent = compliments[next];
});

musicToggle.addEventListener("click", async () => {
  if (!audio.src) {
    alert("Add your own licensed MP3 file as /music.mp3, then set it in app.js to enable music.");
    return;
  }
  if (audio.paused) { try { await audio.play(); musicToggle.innerHTML = "♫ <span>Pause</span>"; } catch (_) {} }
  else { audio.pause(); musicToggle.innerHTML = "♫ <span>Music</span>"; }
});
