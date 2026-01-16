// NAVIGATION + underline
const navButtons = document.querySelectorAll(".nav-btn");
const underline = document.querySelector(".nav-underline");
const pages = document.querySelectorAll(".page");

function moveUnderline(btn){
  underline.style.width = btn.offsetWidth + "px";
  underline.style.left = btn.offsetLeft + "px";
}
moveUnderline(document.querySelector(".nav-btn.active"));

navButtons.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    navButtons.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    moveUnderline(btn);

    pages.forEach(p=>p.classList.remove("active-page"));
    document.getElementById(btn.dataset.page).classList.add("active-page");
  });
});

window.addEventListener("resize", ()=>{
  const activeBtn = document.querySelector(".nav-btn.active");
  if(activeBtn) moveUnderline(activeBtn);
});

// CO2 CALCULATOR
const btnCalc = document.getElementById("calc-btn");
const resultBox = document.getElementById("result");
btnCalc.addEventListener("click",()=>{
  const electricity=Number(document.getElementById("electricity").value||0);
  const travel=Number(document.getElementById("travel").value||0);
  const total=(electricity*0.4 + travel*0.21).toFixed(2);
  let status="Low", color="#7CFF7C";
  if(total>20){status="High"; color="#ff5252";}
  else if(total>10){status="Neutral"; color="#ffd54f";}
  resultBox.innerHTML=`<strong>Total CO₂:</strong> ${total} kg/day<br><strong>Status:</strong> <span style="color:${color}; font-weight:bold;">${status}</span>`;
});

// LIVE CLIMATE DATA
const weatherContainer=document.getElementById("weatherData");
fetch("https://api.open-meteo.com/v1/forecast?latitude=24.4539&longitude=54.3773&current_weather=true&daily=sunrise,sunset&timezone=Asia/Dubai")
.then(res=>res.json())
.then(data=>{
  const temp=data.current_weather.temperature;
  const wind=data.current_weather.windspeed;
  const sunrise=data.daily.sunrise[0].split("T")[1];
  const sunset=data.daily.sunset[0].split("T")[1];
  weatherContainer.innerHTML=`
    <div class="card"><div class="value">${temp}°C</div><div class="label">Temperature</div></div>
    <div class="card"><div class="value">${wind} km/h</div><div class="label">Wind Speed</div></div>
    <div class="card"><div class="value">${sunrise}</div><div class="label">Sunrise</div></div>
    <div class="card"><div class="value">${sunset}</div><div class="label">Sunset</div></div>
  `;
})
.catch(()=>{ weatherContainer.innerHTML="<p>Failed to load climate data.</p>"; });

// AI Chat using Hugging Face free model
const chatLog = document.getElementById("chat-log");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");

chatSend.addEventListener("click", sendMessage);
chatInput.addEventListener("keydown", e=>{if(e.key==="Enter") sendMessage();});

async function sendMessage(){
  const text=chatInput.value.trim();
  if(!text) return;
  addUserMessage(text);
  chatInput.value="";

  addAIMessage("AI is typing...");

  // Use Hugging Face Inference API (example for free GPT-Neo model)
  // No key needed for public space
  const modelUrl = "https://huggingface.co/spaces/yuntian-deng/ChatGPT"; // replace with a free hosted space
  try {
    const response = await fetch(modelUrl, {
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({inputs: text})
    });
    const data = await response.json();
    chatLog.lastChild.innerText = data.generated_text || "Sorry, I couldn't generate a response.";
  } catch(e){
    chatLog.lastChild.innerText = "Error: Cannot fetch AI response.";
  }
}

function addUserMessage(msg){
  const div=document.createElement("div");
  div.className="chat-message chat-user";
  div.innerText=msg;
  chatLog.appendChild(div);
  chatLog.scrollTop=chatLog.scrollHeight;
}

function addAIMessage(msg){
  const div=document.createElement("div");
  div.className="chat-message chat-ai";
  div.innerText=msg;
  chatLog.appendChild(div);
  chatLog.scrollTop=chatLog.scrollHeight;
}
