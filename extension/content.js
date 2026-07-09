// content.js - Catify Web Image Replacer
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
    return `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 500000)}?w=500&auto=format&fit=crop&q=80`;
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
}
