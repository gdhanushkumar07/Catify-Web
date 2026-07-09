// popup.js - Catify Web Control Center
const toggleSwitch = document.getElementById('toggle-switch');
const catCounter = document.getElementById('cat-counter');
const resetCounterBtn = document.getElementById('reset-counter');

// Load initial states on open
chrome.storage.local.get(['isActive', 'replacedCount'], (result) => {
  toggleSwitch.checked = result.isActive !== false;
  catCounter.textContent = result.replacedCount || 0;
});

// Broadcast state change to the active tab content script
toggleSwitch.addEventListener('change', () => {
  const isActive = toggleSwitch.checked;
  chrome.storage.local.set({ isActive }, () => {
    // Message active tab to reload/disable/enable
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleActive', isActive });
      }
    });
  });
});

// Handle statistics reset
resetCounterBtn.addEventListener('click', () => {
  chrome.storage.local.set({ replacedCount: 0 }, () => {
    catCounter.textContent = '0';
  });
});

// Update the counter in real time when popup is active
setInterval(() => {
  chrome.storage.local.get(['replacedCount'], (result) => {
    catCounter.textContent = result.replacedCount || 0;
  });
}, 1000);