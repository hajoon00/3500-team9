// Background service worker for the Reviewer extension

// Register the side panel
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

// Set up message handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'summarizeReviews') {
    chrome.runtime.sendMessage({
      action: 'newReview',
      data: message.data
    });
    sendResponse({ success: true });

  } else if (message.action === "saveAPIKey") {
    const input = message.data;
    console.log('Saving API Key:', input);
    chrome.storage.local.set({ apiKey: input }, () => {
      console.log('API Key saved!');
    });
    sendResponse({ success: true });
  }
});

// Context menu setup
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.storage.local.set({ hasSeenLanding: true });
    chrome.tabs.create({ url: "landing.html" });
  }

  chrome.contextMenus.create({
    id: 'summarizeReviews',
    title: 'Use Yelper',
    contexts: ['page']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'summarizeReviews') {
    // Open side panel
    chrome.sidePanel.open({ tabId: tab.id });
    // First check if content script is ready
    chrome.tabs.sendMessage(tab.id, { action: 'ping' }, (response) => {
      if (chrome.runtime.lastError) {
        // Content script isn't ready, inject it
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        }, () => {
          if (chrome.runtime.lastError) {
            console.error('Failed to inject content script:', chrome.runtime.lastError);
            return;
          }
          // Summarize after injection
          setTimeout(() => {
            chrome.tabs.sendMessage(tab.id, { action: 'summarizePage' });
          }, 100);
        });
      } else {
        // Content script is ready
        chrome.tabs.sendMessage(tab.id, { action: 'summarizePage' });
      }
    });
  }
});

console.log('Review summarizer background script loaded');
