let deferredPrompt;
const installBtn = document.getElementById('installBtn');
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.hidden = false;
});
installBtn?.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.hidden = true;
  console.log('Install outcome:', outcome);
});

// Simple demo: a persistent counter using localStorage
const countEl = document.getElementById('count');
const counterBtn = document.getElementById('counterBtn');
let count = Number(localStorage.getItem('rb_count') || 0);
if (countEl) countEl.textContent = count;
counterBtn?.addEventListener('click', () => {
  count++;
  localStorage.setItem('rb_count', String(count));
  if (countEl) countEl.textContent = count;
});

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').then(() => {
      console.log('Service Worker registered');
    }).catch(console.error);
  });
}
