const buttons = document.querySelectorAll(".nav-btn");
const indicator = document.querySelector(".nav-indicator");
const sections = document.querySelectorAll(".page-section");

function moveIndicator(btn) {
  indicator.style.left = btn.offsetLeft + "px";
  indicator.style.width = btn.offsetWidth + "px";
}

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".nav-btn.active").classList.remove("active");
    btn.classList.add("active");

    sections.forEach(sec => sec.classList.remove("active"));
    document.getElementById(btn.dataset.section).classList.add("active");

    moveIndicator(btn);
  });
});

moveIndicator(document.querySelector(".nav-btn.active"));

async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatBox = document.getElementById("chatBox");
  const message = input.value.trim();
  if (!message) return;

  chatBox.innerHTML += `<div class="chat-message user"><b>You:</b> ${message}</div>`;
  input.value = "";

  const response = await fetch("https://YOUR-BACKEND-URL.vercel.app/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const data = await response.json();
  chatBox.innerHTML += `<div class="chat-message ai"><b>AI:</b> ${data.reply}</div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}
