// --- CLIMA ---
const elTemp   = document.getElementById('temp');
const elFeels  = document.getElementById('feels');
const elPlace  = document.getElementById('place');
const elTime   = document.getElementById('time');
const elIcon   = document.getElementById('icon');

const weatherIcons = {
  0:"☀️",1:"🌤️",2:"⛅",3:"☁️",
  45:"🌫️",48:"🌫️",
  51:"🌦️",53:"🌦️",55:"🌦️",
  61:"🌧️",63:"🌧️",65:"🌧️",
  71:"❄️",73:"❄️",75:"❄️",
  95:"⛈️",96:"⛈️",99:"⛈️"
};

async function reverseGeocode(lat, lon){
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const res = await fetch(url,{headers:{'User-Agent':'demo-app'}});
    const data = await res.json();
    return data.address.city || data.address.town || data.address.village || "Local";
  } catch { return "Local"; }
}

async function fetchWeather(lat, lon){
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
    const res = await fetch(url);
    const data = await res.json();
    const t = data?.current_weather?.temperature;
    const code = data?.current_weather?.weathercode;
    const tzTime = data?.current_weather?.time;

    elTemp.textContent  = Math.round(t);
    elFeels.textContent = Math.round(t);
    elIcon.textContent  = weatherIcons[code] || "❓";
    elTime.textContent  = tzTime ? new Date(tzTime).toLocaleString('pt-BR',{hour12:false}) : "—";
  } catch(err){
    console.error(err);
    elTemp.textContent="--";
    elFeels.textContent="--";
    elTime.textContent="Erro";
  }
}

function gotPosition(pos){
  const { latitude: lat, longitude: lon } = pos.coords;
  reverseGeocode(lat, lon).then(city=> elPlace.textContent = city);
  fetchWeather(lat, lon);
}

if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition(
      gotPosition,
      () => {
        elPlace.textContent = "Local não encontrado";
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  } else {
    elPlace.textContent = "Sem geolocalização";
  }
  

// --- DETALHES DE RECEITA ---
function openRecipe(title, img, desc){
  document.getElementById("detailTitle").textContent = title;
  document.getElementById("detailImg").src = img;
  document.getElementById("detailDesc").innerHTML = desc; // permite HTML
  document.getElementById("recipeDetail").classList.add("active");
}
function closeRecipe(){
  document.getElementById("recipeDetail").classList.remove("active");
}

// --- CHAT ---
const chatToggle   = document.getElementById('chat-toggle');
const chatClose    = document.getElementById('chat-close');
const chatBox      = document.getElementById('chat-box');
const chatMessages = document.getElementById('chat-messages');
const userInput    = document.getElementById('user-input');
const sendBtn      = document.getElementById('send-btn');

function addMessage(text, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', `${sender}-message`);
  messageDiv.innerText = text;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight; 
}

function handleUserMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, 'user');
  userInput.value = '';

  setTimeout(() => {
      const botResponse = generateBotResponse(message);
      addMessage(botResponse, 'bot');
  }, 500);
}

function generateBotResponse(msg) {
  const m = msg.toLowerCase();
  if (m.includes('olá') || m.includes('oi')) return 'Olá! Bem-vindo ao Ana. Como posso te ajudar?';
  if (m.includes('clima')) return 'A previsão do tempo está no canto superior direito da página!';
  return 'Desculpe, não entendi. Posso te ajudar com receitas ou informações do site.';
}

chatToggle.addEventListener('click', () => {
  chatBox.style.display = 'flex';
  chatToggle.style.display = 'none';
  addMessage('Olá! Eu sou o Consultor Ana. Em que posso te ajudar?', 'bot');
});

chatClose.addEventListener('click', () => {
  chatBox.style.display = 'none';
  chatToggle.style.display = 'block';
});

sendBtn.addEventListener('click', handleUserMessage);
userInput.addEventListener('keypress', (e) => { if(e.key==='Enter') handleUserMessage(); });
