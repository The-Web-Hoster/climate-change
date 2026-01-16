// -------------------
// PAGE SWITCHING
// -------------------
const navButtons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    pages.forEach(p => p.classList.remove("active-page"));
    document.getElementById(btn.dataset.page).classList.add("active-page");
  });
});

// -------------------
// CO2 CALCULATOR
// -------------------
const btnCalc = document.getElementById("calc-btn");
const resultBox = document.getElementById("result");

btnCalc.addEventListener("click", () => {
  const electricity = Number(document.getElementById("electricity").value || 0);
  const travel = Number(document.getElementById("travel").value || 0);
  const electricityCO2 = electricity * 0.4;
  const travelCO2 = travel * 0.21;
  const total = (electricityCO2 + travelCO2).toFixed(2);

  let status = "Low", color="#7CFF7C";
  if(total>20){status="High"; color="#ff5252";}
  else if(total>10){status="Neutral"; color="#ffd54f";}

  resultBox.innerHTML = `<strong>Total CO₂:</strong> ${total} kg/day<br>
                         <strong>Status:</strong> <span style="color:${color}; font-weight:bold;">${status}</span>`;

  addAIMessage(`Your CO₂ footprint is ${total} kg/day (${status}). Here are tips:`);
  setTimeout(()=> addAIMessage(getSmartTips(status)), 600);
});

function getSmartTips(status) {
  if(status==="Low") return "Great job! Keep saving electricity and using eco-friendly transport.";
  if(status==="Neutral") return "Your footprint is moderate. Walk more and reduce electricity usage.";
  return "High footprint! Use public transport, turn off devices, and save energy.";
}

// -------------------
// LIVE CLIMATE DATA
// -------------------
const weatherContainer = document.getElementById("weatherData");
const apiUrl = "https://api.open-meteo.com/v1/forecast?latitude=24.4539&longitude=54.3773&current_weather=true&daily=sunrise,sunset&timezone=Asia/Dubai";

fetch(apiUrl)
.then(res=>res.json())
.then(data=>{
  const temp = data.current_weather.temperature;
  const wind = data.current_weather.windspeed;
  const uv = data.current_weather.weathercode; // simplified for demo
  const sunrise = data.daily.sunrise[0].split("T")[1];
  const sunset = data.daily.sunset[0].split("T")[1];

  weatherContainer.innerHTML = `
    <div class="card"><div class="value">${temp}°C</div><div class="label">Temperature</div></div>
    <div class="card"><div class="value">${uv}</div><div class="label">Weather Code (UV proxy)</div></div>
    <div class="card"><div class="value">${wind} km/h</div><div class="label">Wind Speed</div></div>
    <div class="card"><div class="value">${sunrise}</div><div class="label">Sunrise</div></div>
    <div class="card"><div class="value">${sunset}</div><div class="label">Sunset</div></div>
  `;
})
.catch(()=>{ weatherContainer.innerHTML="<p>Failed to load climate data.</p>"; });

// -------------------
// AI CHATBOT
// -------------------
const chatLog = document.getElementById("chat-log");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");

chatSend.addEventListener("click", sendMessage);
chatInput.addEventListener("keydown", e=>{if(e.key==="Enter")sendMessage();});

function sendMessage() {
  const text = chatInput.value.trim();
  if(!text) return;
  addUserMessage(text);
  chatInput.value="";
  simulateTyping(text);
}

function addUserMessage(text){
  const msg=document.createElement("div");
  msg.className="chat-message chat-user";
  msg.innerText=text;
  chatLog.appendChild(msg);
  chatLog.scrollTop=chatLog.scrollHeight;
}

function addAIMessage(text){
  const msg=document.createElement("div");
  msg.className="chat-message chat-ai";
  msg.innerText=text;
  chatLog.appendChild(msg);
  chatLog.scrollTop=chatLog.scrollHeight;
}

function simulateTyping(input){
  const typingMsg=document.createElement("div");
  typingMsg.className="chat-message chat-ai";
  typingMsg.innerText="AI is typing...";
  chatLog.appendChild(typingMsg);
  chatLog.scrollTop=chatLog.scrollHeight;

  setTimeout(()=>{
    chatLog.removeChild(typingMsg);
    generateAIResponse(input);
  },1000+Math.random()*1000);
}

function generateAIResponse(text){
  text=text.toLowerCase();
  if(text.includes("co2")||text.includes("footprint")) addAIMessage("Reduce electricity, walk more, and use public transport.");
  else if(text.includes("uv")) addAIMessage("UV Index above 6 is high. Wear sunscreen and protective clothing.");
  else if(text.includes("sun")||text.includes("heat")) addAIMessage("It's hot in the UAE! Stay hydrated and avoid sun.");
  else if(text.includes("climate")) addAIMessage("The UAE has a desert climate: hot summers, mild winters, high UV.");
  else addAIMessage("I can help! Ask about your CO₂ footprint or UAE climate.");
}
