/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ExtensionFile {
  name: string;
  language: string;
  code: string;
  description: string;
}

export const extensionFiles: ExtensionFile[] = [
  {
    name: "manifest.json",
    language: "json",
    description: "Configures the metadata, permissions, content scripts, and popup action for the Manifest V3 extension.",
    code: `{
  "manifest_version": 3,
  "name": "Catify Web - Random Cat Image Replacer",
  "version": "1.0",
  "description": "Replaces all images on any webpage with cute, random cat images fetched from The Cat API.",
  "permissions": [
    "storage"
  ],
  "host_permissions": [
    "https://api.thecatapi.com/*"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/cat_16.png",
      "48": "icons/cat_48.png",
      "128": "icons/cat_128.png"
    }
  },
  "icons": {
    "16": "icons/cat_16.png",
    "48": "icons/cat_48.png",
    "128": "icons/cat_128.png"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "run_at": "document_end"
    }
  ]
}`
  },
  {
    name: "background.js",
    language: "javascript",
    description: "Acts as a centralized network proxy for API requests to bypass rigid Content Security Policies (CSP) active on some target websites.",
    code: `// background.js - Catify Web Background Fetch Proxy
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fetchCats') {
    fetch('https://api.thecatapi.com/v1/images/search?limit=25')
      .then(response => {
        if (!response.ok) throw new Error('API request failed');
        return response.json();
      })
      .then(data => {
        const urls = data.map(item => item.url);
        sendResponse({ success: true, urls });
      })
      .catch(error => {
        console.error('[Catify Web] Error in service worker fetch:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep message channel open for asynchronous reply
  }
});`
  },
  {
    name: "content.js",
    language: "javascript",
    description: "Injected into webpages to scan for image elements, replace their sources with random cat images, and observe changes in the DOM to catify dynamically added images.",
    code: `// content.js - Catify Web Image Replacer
let isActive = true;
let catImagesPool = [];

// Load initial state from Chrome storage
chrome.storage.local.get(['isActive', 'replacedCount'], (result) => {
  isActive = result.isActive !== false; // default to true
  if (isActive) {
    initCatification();
  }
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleActive') {
    isActive = message.isActive;
    if (isActive) {
      initCatification();
    } else {
      // Reload the page to restore original images
      window.location.reload();
    }
  }
});

// Fetch a batch of cat images to populate our replacement pool via Background Worker (CSP Bypass)
function fetchCatImages() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'fetchCats' }, (response) => {
      if (response && response.success && response.urls && response.urls.length > 0) {
        resolve(response.urls);
      } else {
        console.log('[Catify Web] Service worker fetch failed or CSP-blocked, using local high-quality backups.');
        resolve([
          'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=500&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=500&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=500&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=500&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=500&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1526336028075-85586b9793a0?w=500&auto=format&fit=crop&q=80'
        ]);
      }
    });
  });
}

// Initialize the replacement process
async function initCatification() {
  catImagesPool = await fetchCatImages();
  replaceExistingImages();
  observeDOM();
}

// Select a random cat image from our pre-fetched pool
function getRandomCatImage() {
  if (catImagesPool.length === 0) {
    // Generate a randomized Unsplash fallback
    return \`https://images.unsplash.com/photo-\${1500000000000 + Math.floor(Math.random() * 500000)}?w=500&auto=format&fit=crop&q=80\`;
  }
  const randomIndex = Math.floor(Math.random() * catImagesPool.length);
  return catImagesPool[randomIndex];
}

// Check if an image should be replaced (ignores logos, avatars, small icons/pills)
function shouldReplaceImage(img) {
  // Check explicit attributes first
  const src = (img.src || '').toLowerCase();
  const className = (img.className || '').toLowerCase();
  const id = (img.id || '').toLowerCase();
  const alt = (img.alt || '').toLowerCase();
  const role = (img.getAttribute('role') || '').toLowerCase();

  // Exclude common UI/branding/nav elements
  const excludeKeywords = ['logo', 'avatar', 'profile', 'icon', 'nav', 'button', 'badge', 'brand', 'user', 'menu', 'search', 'favicon', 'sprite', 'symbol', 'loader', 'spinner', 'sign-in', 'signin', 'log-in', 'login'];
  for (const kw of excludeKeywords) {
    if (src.includes(kw) || className.includes(kw) || id.includes(kw) || alt.includes(kw) || role.includes(kw)) {
      return false;
    }
  }

  // Check parent elements for header, nav, footer, button, profile, logo wrapper
  let parent = img.parentElement;
  let depth = 0;
  while (parent && depth < 4) {
    const parentClass = (parent.className || '').toLowerCase();
    const parentId = (parent.id || '').toLowerCase();
    const parentTag = parent.tagName.toLowerCase();
    
    if (parentTag === 'header' || parentTag === 'nav' || parentTag === 'button' || parentTag === 'footer') {
      return false;
    }
    const parentExcludeKeywords = ['profile', 'avatar', 'logo', 'menu', 'nav', 'header', 'brand', 'button', 'user-box', 'userbox'];
    for (const kw of parentExcludeKeywords) {
      if (parentClass.includes(kw) || parentId.includes(kw)) {
        return false;
      }
    }
    parent = parent.parentElement;
    depth++;
  }

  // Check dimensions
  // If the image has layout and is small (under 40px), skip it (e.g. search pill icons are typically 16px to 32px)
  if ((img.clientWidth > 0 && img.clientWidth < 40) || (img.clientHeight > 0 && img.clientHeight < 40)) {
    return false;
  }
  if ((img.naturalWidth > 0 && img.naturalWidth < 40) || (img.naturalHeight > 0 && img.naturalHeight < 40)) {
    return false;
  }
  const attrW = parseInt(img.getAttribute('width') || '0', 10);
  const attrH = parseInt(img.getAttribute('height') || '0', 10);
  if ((attrW > 0 && attrW < 40) || (attrH > 0 && attrH < 40)) {
    return false;
  }

  return true;
}

// Replaces a single image element and increments the replaced counter
function replaceImageElement(img) {
  // Check if we should replace this image (preserves logos, search pills, and profiles)
  if (!shouldReplaceImage(img)) return;

  // Guard against already processed images with a cat URL
  if (img.dataset.catified === 'true' && isCatUrl(img.src)) return;

  // Backup original source if not already backed up
  if (!img.dataset.originalSrc) {
    img.dataset.originalSrc = img.src || '';
  }
  img.dataset.catified = 'true';
  
  const catUrl = getRandomCatImage();
  
  // Apply new cat source
  img.src = catUrl;
  if (img.srcset) {
    img.srcset = catUrl;
  }
  
  // Smoothly center-cover the cat photo
  img.style.objectFit = 'cover';
  
  // Increment local storage counter
  chrome.storage.local.get(['replacedCount'], (result) => {
    const currentCount = result.replacedCount || 0;
    chrome.storage.local.set({ replacedCount: currentCount + 1 });
  });
}

// Check if a URL belongs to a cat image from our pool or fallbacks
function isCatUrl(url) {
  if (!url) return false;
  if (url.startsWith('data:')) return false; // Base64 placeholders should be replaced
  if (catImagesPool.includes(url)) return true;
  if (url.includes('unsplash.com') && url.includes('photo-')) return true;
  if (url.includes('thecatapi.com')) return true;
  return false;
}

// Replace all images currently on the page
function replaceExistingImages() {
  const images = document.querySelectorAll('img');
  images.forEach(replaceImageElement);
}

// Use MutationObserver to catify dynamically loaded elements and capture lazy-load source changes
function observeDOM() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes') {
        const target = mutation.target;
        if (target.tagName === 'IMG') {
          const currentSrc = target.src;
          if (currentSrc && !isCatUrl(currentSrc)) {
            // Re-trigger replacement if the page changed the source back to the original image
            replaceImageElement(target);
          }
        }
      } else if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'IMG') {
              replaceImageElement(node);
            } else {
              const nestedImgs = node.querySelectorAll('img');
              nestedImgs.forEach(replaceImageElement);
            }
          }
        }
      }
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src', 'srcset']
  });
}`
  },
  {
    name: "popup.html",
    language: "html",
    description: "The visual interface displayed when users click the extension's puzzle-piece icon. Houses the master on/off switch and the 'Cats Loaded' statistic panel.",
    code: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      width: 300px;
      font-family: 'Segoe UI', system-ui, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
      color: #0f172a;
    }
    .header {
      background: linear-gradient(135deg, #f59e0b, #ef4444);
      color: white;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    }
    .title {
      font-size: 16px;
      font-weight: 700;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .container {
      padding: 16px;
    }
    .card {
      background: white;
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .card-title {
      font-weight: 600;
      font-size: 13px;
      margin: 0;
    }
    .card-desc {
      font-size: 11px;
      color: #64748b;
      margin-top: 2px;
    }
    /* Switch styling */
    .switch {
      position: relative;
      display: inline-block;
      width: 42px;
      height: 22px;
    }
    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #cbd5e1;
      transition: .25s;
      border-radius: 22px;
    }
    .slider:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .25s;
      border-radius: 50%;
    }
    input:checked + .slider {
      background-color: #ef4444;
    }
    input:checked + .slider:before {
      transform: translateX(20px);
    }
    .counter-val {
      font-size: 24px;
      font-weight: 700;
      color: #ef4444;
    }
    .footer {
      text-align: center;
      font-size: 10px;
      color: #94a3b8;
      padding-bottom: 12px;
    }
    .btn {
      background: #f1f5f9;
      color: #475569;
      border: none;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s;
    }
    .btn:hover {
      background: #e2e8f0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="title">🐱 Catify Web</h1>
    <span style="font-size: 18px;">🐾</span>
  </div>
  
  <div class="container">
    <div class="card">
      <div>
        <h2 class="card-title">Enable Catify</h2>
        <div class="card-desc">Replace webpage images</div>
      </div>
      <label class="switch">
        <input type="checkbox" id="toggle-switch" checked>
        <span class="slider"></span>
      </label>
    </div>

    <div class="card" style="flex-direction: column; align-items: flex-start; gap: 8px;">
      <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
        <div>
          <h2 class="card-title">Cats Loaded</h2>
          <div class="card-desc">Total images replaced</div>
        </div>
        <div class="counter-val" id="cat-counter">0</div>
      </div>
      <button class="btn" id="reset-counter">Reset Stat</button>
    </div>
  </div>

  <div class="footer">
    v1.0 • Built with ❤️ for Developer Mode
  </div>

  <script src="popup.js"></script>
</body>
</html>`
  },
  {
    name: "popup.js",
    language: "javascript",
    description: "Fires in the popup context to query the chrome storage API, coordinate toggling messages with the active tab, and update stats continuously.",
    code: `// popup.js - Catify Web Control Center
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
}, 1000);`
  }
];

export function generateCatIconBlob(size: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Could not get 2D context'));
      return;
    }

    // Border and base background circle
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - Math.max(1, size / 24), 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b'; // Warm Amber
    ctx.fill();
    ctx.lineWidth = Math.max(1.5, size / 16);
    ctx.strokeStyle = '#d97706'; // Golden Amber stroke
    ctx.stroke();

    // Draw Left Ear
    ctx.beginPath();
    ctx.moveTo(size * 0.22, size * 0.38);
    ctx.lineTo(size * 0.14, size * 0.12);
    ctx.lineTo(size * 0.42, size * 0.26);
    ctx.closePath();
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.lineWidth = Math.max(1.5, size / 20);
    ctx.strokeStyle = '#d97706';
    ctx.stroke();

    // Draw Left Ear Inner
    ctx.beginPath();
    ctx.moveTo(size * 0.25, size * 0.34);
    ctx.lineTo(size * 0.19, size * 0.18);
    ctx.lineTo(size * 0.38, size * 0.27);
    ctx.closePath();
    ctx.fillStyle = '#fda4af'; // Pink Inner Ear
    ctx.fill();

    // Draw Right Ear
    ctx.beginPath();
    ctx.moveTo(size * 0.78, size * 0.38);
    ctx.lineTo(size * 0.86, size * 0.12);
    ctx.lineTo(size * 0.58, size * 0.26);
    ctx.closePath();
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.lineWidth = Math.max(1.5, size / 20);
    ctx.strokeStyle = '#d97706';
    ctx.stroke();

    // Draw Right Ear Inner
    ctx.beginPath();
    ctx.moveTo(size * 0.75, size * 0.34);
    ctx.lineTo(size * 0.81, size * 0.18);
    ctx.lineTo(size * 0.62, size * 0.27);
    ctx.closePath();
    ctx.fillStyle = '#fda4af'; // Pink Inner Ear
    ctx.fill();

    // Face circle
    ctx.beginPath();
    ctx.arc(size / 2, size * 0.60, size * 0.33, 0, Math.PI * 2);
    ctx.fillStyle = '#fef3c7'; // Cream-sand cheeks
    ctx.fill();
    ctx.lineWidth = Math.max(1.5, size / 24);
    ctx.strokeStyle = '#d97706';
    ctx.stroke();

    // Cute Left Eye
    ctx.fillStyle = '#1e293b'; // Slate 800
    ctx.beginPath();
    ctx.arc(size * 0.38, size * 0.54, size * 0.05, 0, Math.PI * 2);
    ctx.fill();
    
    // Left eye shine
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(size * 0.36, size * 0.52, size * 0.018, 0, Math.PI * 2);
    ctx.fill();

    // Cute Right Eye
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(size * 0.62, size * 0.54, size * 0.05, 0, Math.PI * 2);
    ctx.fill();
    
    // Right eye shine
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(size * 0.60, size * 0.52, size * 0.018, 0, Math.PI * 2);
    ctx.fill();

    // Cute little pink nose
    ctx.beginPath();
    ctx.moveTo(size * 0.46, size * 0.60);
    ctx.lineTo(size * 0.54, size * 0.60);
    ctx.lineTo(size * 0.50, size * 0.65);
    ctx.closePath();
    ctx.fillStyle = '#f43f5e'; // Rose Pink
    ctx.fill();

    // Cute curved whiskers
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = Math.max(1, size / 40);
    
    // Left whiskers
    ctx.beginPath();
    ctx.moveTo(size * 0.35, size * 0.60);
    ctx.lineTo(size * 0.16, size * 0.58);
    ctx.moveTo(size * 0.35, size * 0.63);
    ctx.lineTo(size * 0.13, size * 0.64);
    
    // Right whiskers
    ctx.moveTo(size * 0.65, size * 0.60);
    ctx.lineTo(size * 0.84, size * 0.58);
    ctx.moveTo(size * 0.65, size * 0.63);
    ctx.lineTo(size * 0.87, size * 0.64);
    ctx.stroke();

    // W-shaped Mouth
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = Math.max(1.5, size / 32);
    
    // Left curve
    ctx.beginPath();
    ctx.arc(size * 0.46, size * 0.65, size * 0.045, 0, Math.PI);
    ctx.stroke();
    
    // Right curve
    ctx.beginPath();
    ctx.arc(size * 0.54, size * 0.65, size * 0.045, 0, Math.PI);
    ctx.stroke();

    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Canvas toBlob failed'));
      }
    }, 'image/png');
  });
}
