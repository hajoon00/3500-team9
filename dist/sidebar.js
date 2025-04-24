/**
 * Sidebar script for the Webpage Clipper extension
 * Handles displaying and managing clipped pages using IndexedDB
 */

// Elements
const summaryContainer = document.getElementById('summaryContainer');

// Render all clipped pages from the database
async function renderSummary() {
  try {
    // Clear the container
    summaryContainer.innerHTML = '';
    
    // Add to the container
    
  } catch (error) {
    console.error('Error rendering summary: ', error);
    summaryContainer.innerHTML = `
      <div class="no-summary">
        <p>Error summary</p>
        <p>${error.message}</p>
      </div>
    `;
  }
}

// Initialize the database and render the pages
async function initialize() {
  try {
    //await renderSummary();
  } catch (error) {
    console.error('Error initializing database:', error);
    summaryContainer.innerHTML = `
      <div class="no-clips">
        <p>${error.message}</p>
      </div>
    `;
  }
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'summarizePage' && message.data) {
    // refresh the summary
    (async () => {
      try {
        await renderSummary();
      } catch (error) {
        console.error('Error summarizing:', error);
      }
    })();
  }
  // Don't return true here as we're not sending an asynchronous response
  // Returning true was causing duplicate clips due to message port staying open
});

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', initialize);
