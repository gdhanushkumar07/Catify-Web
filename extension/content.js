// content.js - Catify Web Image Replacer
let isActive = true;
let catImagesPool = [];
const API_URL = 'https://api.thecatapi.com/v1/images/search?limit=25';

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

// Fetch a batch of cat images to populate our replacement pool
async function fetchCatImages() {
  try {
    const response = await fetch(API_URL);
    if (response.ok) {
      const data = await response.json();
      return data.map(item => item.url);
    }
  } catch (error) {
    console.error('[Catify Web] Error fetching cat images:', error);
  }
  
  // High-quality backup cat images from Unsplash in case of rate limit or network issues
  return [
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526336028075-85586b9793a0?w=500&auto=format&fit=crop&q=80'
  ];
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
    return `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 500000)}?w=500&auto=format&fit=crop&q=80`;
  }
  const randomIndex = Math.floor(Math.random() * catImagesPool.length);
  return catImagesPool[randomIndex];
}

// Replaces a single image element and increments the replaced counter
function replaceImageElement(img) {
  // Guard against already processed images
  if (img.dataset.catified === 'true') return;
  
  // Guard against very tiny tracking pixels or icons
  if (img.clientWidth > 0 && img.clientWidth < 16 && img.clientHeight > 0 && img.clientHeight < 16) {
    return;
  }

  // Backup original source
  img.dataset.originalSrc = img.src;
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

// Replace all images currently on the page
function replaceExistingImages() {
  const images = document.querySelectorAll('img');
  images.forEach(replaceImageElement);
}

// Use MutationObserver to catify dynamically loaded elements (infinite scroll, AJAX)
function observeDOM() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
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
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}
