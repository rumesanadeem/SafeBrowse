// extension/popup.js

const countEl  = document.getElementById('count');
const statusEl = document.getElementById('lastUrl');

// On load, fetch persisted count
chrome.storage.local.get({ blockedCount: 0 }, ({ blockedCount }) => {
  console.log('[Popup] Loaded blockedCount:', blockedCount);
  countEl.textContent  = `Blocked: ${blockedCount}`;
  statusEl.textContent = 'No recent blocks';
});

// Listen for live BLOCKED messages
chrome.runtime.onMessage.addListener((msg) => {
  console.log('[Popup] Received message:', msg);
  if (msg.type === 'BLOCKED') {
    countEl.textContent  = `Blocked: ${msg.newCount}`;
    statusEl.textContent = `Last blocked: ${msg.url}\n(reason: malicious behavior)`;
  }
});
