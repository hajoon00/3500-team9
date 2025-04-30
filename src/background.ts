// Make this a module
export {};

// Background service worker for the Yelper extension

// Set up message handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "saveAPIKey") {
    const input = message.data;
    console.log('Saving API Key:', input);
    chrome.storage.local.set({ apiKey: input }, () => {
      console.log('API Key saved!');
      sendResponse({ success: true });
    });
    return true; // Keep the message channel open for the async response
  }
});

console.log('Yelper background script loaded'); 