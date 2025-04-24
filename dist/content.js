/**
 * Content script for the extension
 * Extracts page content and sends it to the background script
 */
  
  // Function to clip the current page
  function summarizeReviews() {

    // Send the data to the background script
    chrome.runtime.sendMessage({
      action: 'summarizeReviews',
      data: ""
    }, response => {
      if (response && response.success) {
        console.log('Review summarized successfully');
      } else {
        console.error('Failed to summarize');
      }
    });
  }
  
  // Listen for messages from popup or background
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Respond to ping to check if content script is loaded
    if (message.action === 'ping') {
      sendResponse({ success: true });
      return;
    }
    
    if (message.action === 'summarizeReviews') {
      summarizeReviews();
      sendResponse({ success: true });
    }
  });
  