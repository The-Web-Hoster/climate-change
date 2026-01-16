// PAGE SWITCHING
const navButtons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");
navButtons.forEach(btn=>{
  btn.addEventListener("click",()=>{
    pages.forEach(p=>p.classList.remove("active-page"));
    document.getElementById(btn.dataset.page).classList.add("active-page");
  });
});

// CO2 CALCULATOR
const btnCalc = document.getElementById("calc-btn");
const resultBox = document.getElementById("result");
btnCalc.addEventListener("click",()=>{
  const electricity = Number(document.getElementById("electricity").value || 0);
  const travel = Number(document.getElementById("travel").value || 0);
  const total = (electricity*0.4 + travel*0.21).toFixed(2);
  let status="Low", color="#7CFF7C";
  if(total>20){status="High"; color="#ff5252";}
  else if(total>10){status="Neutral"; color="#ffd54f";}
  resultBox.innerHTML = `<strong>Total CO₂:</strong> ${total} kg/day<br>
                         <strong>Status:</strong> <span style="color:${color}; font-weight:bold;">${status}</span>`;
});

// LIVE CLIMATE DATA
const weatherContainer = document.getElementById("weatherData");
const apiUrl = "https://api.open-meteo.com/v1/forecast?latitude=24.4539&longitude=54.3773&current_weather=true&daily=sunrise,sunset&timezone=Asia/Dubai";
fetch(apiUrl).then(res=>res.json()).then(data=>{
  const temp=data.current_weather.temperature;
  const wind=data.current_weather.windspeed;
  const sunrise=data.daily.sunrise[0].split("T")[1];
  const sunset=data.daily.sunset[0].split("T")[1];
  weatherContainer.innerHTML = `
    <div class="card"><div class="value">${temp}°C</div><div class="label">Temperature</div></div>
    <div class="card"><div class="value">${wind} km/h</div><div class="label">Wind Speed</div></div>
    <div class="card"><div class="value">${sunrise}</div><div class="label">Sunrise</div></div>
    <div class="card"><div class="value">${sunset}</div><div class="label">Sunset</div></div>
  `;
}).catch(()=>{weatherContainer.innerHTML="<p>Failed to load climate data.</p>";});

// AI CHATBOT
const chatLog=document.getElementById("chat-log");
const chatInput=document.getElementById("chat-input");
const chatSend=document.getElementById("chat-send");
chatSend.addEventListener("click",sendMessage);
chatInput.addEventListener("keydown",e=>{if(e.key==="Enter")sendMessage();});

function addUserMessage(txt){const msg=document.createElement("div");msg.className="chat-message chat-user";msg.innerText=txt;chatLog.appendChild(msg);chatLog.scrollTop=chatLog.scrollHeight;}
function addAIMessage(txt){const msg=document.createElement("div");msg.className="chat-message chat-ai";msg.innerText=txt;chatLog.appendChild(msg);chatLog.scrollTop=chatLog.scrollHeight;}

async function sendMessage(){
  const txt=chatInput.value.trim();if(!txt) return; addUserMessage(txt); chatInput.value="";
  const typing=document.createElement("div"); typing.className="chat-message chat-ai"; typing.innerText="AI is typing..."; chatLog.appendChild(typing); chatLog.scrollTop=chatLog.scrollHeight;

  try{
    const res=await fetch("https://YOUR-BACKEND-URL.vercel.app/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:txt})});
    const data=await res.json();
    chatLog.removeChild(typing);
    addAIMessage(data.reply);
  }catch(err){
    chatLog.removeChild(typing);
    addAIMessage("AI is unavailable.");
  }
}
