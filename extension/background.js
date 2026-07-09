// background.js - Catify Web Background Fetch Proxy
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
});