
const $ = s => document.querySelector(s);
const ipInput = $('#espIp');
const tSlider = $('#tint');
const tVal = $('#tVal');
const statusEl = $('#status');

ipInput.value = localStorage.getItem('esp_ip') || '';

function baseUrl(){
  const ip = ipInput.value.trim() || localStorage.getItem('esp_ip');
  return ip ? `http://${ip}` : null;
}

$('#btnSaveIp').onclick = () => {
  if(ipInput.value.trim()){
    localStorage.setItem('esp_ip', ipInput.value.trim());
    flash('Saved ESP32 IP');
  }
};

$('#btnAuto').onclick   = () => post('/mode?val=AUTO');
$('#btnManual').onclick = () => post('/mode?val=MANUAL');
$('#btnPrivacy').onclick= () => post('/privacy?val=TOGGLE');
$('#btnFailsafe').onclick= () => post('/failsafe?val=ON');
$('#btnClear').onclick   = () => post('/tint?val=0');

$('#btnProfile1').onclick= () => post('/profile?val=DRIVER');
$('#btnProfile2').onclick= () => post('/profile?val=PASSENGER');
$('#btnSaveProfile').onclick= () => post('/profile?val=SAVE');

tSlider.addEventListener('input', ()=> tVal.textContent = tSlider.value);
tSlider.addEventListener('change', ()=> post(`/tint?val=${tSlider.value}`));

async function post(path){
  const base = baseUrl();
  if(!base){ statusEl.textContent = 'Status: set ESP IP first'; return; }
  try{
    const r = await fetch(base + path, {method:'POST'});
    statusEl.textContent = 'Status: ' + await r.text();
  }catch(e){
    statusEl.textContent = 'Status: OFFLINE (' + e + ')';
  }
}

async function poll(){
  const base = baseUrl();
  if(!base){ statusEl.textContent = 'Status: set ESP IP'; return; }
  try{
    const r = await fetch(base + '/status');
    statusEl.textContent = 'Status: ' + await r.text();
  }catch(e){
    statusEl.textContent = 'Status: OFFLINE';
  }
}
setInterval(poll, 2000);

function flash(msg){
  statusEl.textContent = 'Status: ' + msg;
  setTimeout(poll, 800);
}
