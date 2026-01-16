// ===== NAV BAR ANIMATION =====
const buttons = document.querySelectorAll(".nav-btn");
const indicator = document.querySelector(".nav-indicator");
const sections = document.querySelectorAll(".page-section");

function moveIndicator(btn){
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

// Init indicator
moveIndicator(document.querySelector(".nav-btn.active"));

// ===== CO2 CALCULATOR =====
function calculateCO2(){
  const km = document.getElementById("co2Input").value;
  if(!km) return alert("Enter a number!");
  const co2 = (km * 0.21).toFixed(2); // kg CO2/km approx
  document.getElementById("co2Result").innerText = `Approximate CO₂ emissions: ${co2} kg/day`;
}

// ===== LIVE DATA (placeholder, real API can be integrated) =====
const liveData = document.getElementById("liveData");
liveData.innerHTML = `
Temperature: 30°C <br>
Humidity: 45% <br>
Wind: 15 km/h <br>
UV Index: 8
`;

// ===== HUGGING FACE AI =====
const HF_API_KEY = "PASTE_YOUR_HUGGINGFACE_KEY_HERE";

async function sendMessage(){
  const input = document.getElementById("userInput");
  const chatBox = document.getElementById("chatBox");
  const message = input.value.trim();
  if(!message) return;

  chatBox.innerHTML += `<div class="user"><b>You:</b> ${message}</div>`;
  input.value = "";

  const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct", {
    method:"POST",
    headers:{
      "Authorization": `Bearer ${HF_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: `User: ${message}\nAI:` })
  });

  const data = await response.json();
  let aiText = "Sorry, something went wrong.";
  if(Array.isArray(data) && data[0]?.generated_text){
    aiText = data[0].generated_text.replace(/User:.*/s,"").trim();
  }

  chatBox.innerHTML += `<div class="ai"><b>AI:</b> ${aiText}</div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}
