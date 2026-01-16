// CO2 Calculator
const btn = document.getElementById("calc-btn");
const resultBox = document.getElementById("result");

btn.addEventListener("click", () => {
  const electricity = Number(document.getElementById("electricity").value || 0);
  const travel = Number(document.getElementById("travel").value || 0);
  const electricityCO2 = electricity * 0.4;
  const travelCO2 = travel * 0.21;
  const total = (electricityCO2 + travelCO2).toFixed(2);

  let status = "Low";
  let color = "#7CFF7C";
  if(total > 20){ status="High"; color="#ff5252"; }
  else if(total > 10){ status="Neutral"; color="#ffd54f"; }

  resultBox.innerHTML = `<strong>Total CO₂:</strong> ${total} kg/day<br>
                         <strong>Status:</strong> <span style="color:${color}; font-weight:bold;">${status}</span>`;

  // Also send to AI assistant
  addAIMessage(`Your CO₂ footprint is ${total} kg/day, which is considered ${status}. To reduce it, you can save electricity and use public transport.`);
});

// LIVE WEATHER DATA
const container = document.getElementById("weatherData");
const url = "https://api.open-meteo.com/v1/forecast?latitude=24.4539&longitude=54.3773&current=temperature_2m,wind_speed_10m,uv_index&daily=sunrise,sunset&timezone=Asia/Dubai";

fetch(url)
.then(res => res.json())
.then(data => {
  const temp = data.current.temperature_2m;
  const wind = data.current.wind_speed_10m;
  const uv = data.current.uv_index;
  const sunrise = data.daily.sunrise[0].split("T")[1];
  const sunset = data.daily.sunset[0].split("T")[1];

  container.innerHTML = `
    <div class="card"><div class="value">${temp}°C</div><div class="label">Temperature</div></div>
    <div class="card"><div class="value">${uv}</div><div class="label">UV Index</div></div>
    <div class="card"><div class="value">${wind} km/h</div><div class="label">Wind Speed</div></div>
    <div class="card"><div class="value">${sunrise}</div><div class="label">Sunrise</div></div>
    <div class="card"><div class="value">${sunset}</div><div class="label">Sunset</div></div>
  `;
})
.catch(() => { container.innerHTML = "<p>Failed to load climate data.</p>"; });

// -------------------
// CHATBOT LOGIC
// -------------------
const chatLog = document.getElementById("chat-log");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");

chatSend.addEventListener("click", sendMessage);
chatInput.addEventListener("keydown", e => { if(e.key === "Enter") sendMessage(); });

function sendMessage() {
  const text = chatInput.value.trim();
  if(!text) return;

  addUserMessage(text);
  chatInput.value = "";
  setTimeout(()=>{ generateAIResponse(text); }, 500);
}

function addUserMessage(text) {
  const msg = document.createElement("div");
  msg.className = "chat-message chat-user";
  msg.innerText = text;
  chatLog.appendChild(msg);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function addAIMessage(text) {
  const msg = document.createElement("div");
  msg.className = "chat-message chat-ai";
  msg.innerText = text;
  chatLog.appendChild(msg);
  chatLog.scrollTop = chatLog.scrollHeight;
}

// Simple AI responses
function generateAIResponse(text) {
  text = text.toLowerCase();
  if(text.includes("co2") || text.includes("footprint")) addAIMessage("Remember, you can reduce CO₂ by saving electricity, walking more, and using public transport.");
  else if(text.includes("uv")) addAIMessage("UV Index above 6 is high. Wear sunscreen, sunglasses, and limit sun exposure during midday.");
  else if(text.includes("sun") || text.includes("heat")) addAIMessage("The UAE can be very hot! Stay hydrated and avoid prolonged sun exposure.");
  else if(text.includes("climate")) addAIMessage("The UAE has a desert climate: very hot summers, mild winters, and high UV levels.");
  else addAIMessage("I'm here to help! Ask me about your CO₂ footprint or UAE climate.");
}
