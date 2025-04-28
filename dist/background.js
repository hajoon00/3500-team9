/**
 * Background service worker for the Reviewer extension
 * Handles side panel setup
 */

// Register the side panel
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

// Set up message handling for content script communication
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'summarizeReviews') {
    // Forward the request to the sidebar
    chrome.runtime.sendMessage({
      action: 'newReview',
      data: message.data
    });
    
    // Always respond immediately, don't leave the promise hanging
    sendResponse({ success: true });
  }
  
  // Don't return true here, as we're not using asynchronous response
  // This resolves the "message channel closed" error
});

// Add a context menu item for clipping the current page
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'summarizeReviews',
    title: 'Use Yelper',
    contexts: ['page']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'summarizeReviews') {
    // open side panel
    chrome.sidePanel.open({ tabId: tab.id });

    // First check if content script is ready by sending a ping
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
          // Now try to summarize
          setTimeout(() => {
            chrome.tabs.sendMessage(tab.id, { action: 'summarizePage' });
          }, 100);
        });
      } else {
        // Content script is ready, clip the page
        chrome.tabs.sendMessage(tab.id, { action: 'summarizePage' });
      }
    });
  }
});

// Add feature for landing page to get GPT API key
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.tabs.create({ url: "landing.html" });
  }
});

// check to make sure the landing page is only shown once
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.storage.local.set({ hasSeenLanding: true });
    chrome.tabs.create({ url: "landing.html" });
  }
});


console.log('Review summarizer background script loaded');
