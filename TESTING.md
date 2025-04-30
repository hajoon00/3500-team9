<!--- TESTING.md: Interface and Prompt Testing Documentation --->
# Testing Documentation

This document outlines the manual and prompt testing approaches for the Yelper Chrome extension.

## Testing Approach
- Interface testing is performed via manual walkthroughs in a loaded extension in Chrome.
- Prompt testing uses manual test cases against the OpenAI Chat Completions API (model: `gpt-3.5-turbo`).

---

## 1. Interface Testing

### Manual Walkthrough Steps
1. Build and load the extension:
   - Run `npm run build`.
   - Open Chrome and navigate to `chrome://extensions`, enable Developer mode.
   - Click **Load unpacked** and select the `dist` directory.
2. API Key Management
   - Open the popup, enter a valid OpenAI API key, click **Save**. Verify indicator shows "API Key Saved".
   - Click **Edit**, modify the key, click **Cancel**; verify the original key is restored.
3. Night Plan Generation
   - With API key saved, enter a valid restaurant Yelp URL (e.g., `https://www.yelp.com/biz/amsterdam-bar-and-hall`), click **Generate**.
   - Verify that three sections (Dessert, Drinks, Dancing) appear with at least one stop each.
   - Inspect each stop for: name, address, order label (Stop 1, 2, etc.), routing arrow/text, and a one-sentence rationale.
4. Error Handling
   - Remove or clear the API key and attempt generation: expect an error prompt "Please save your API key first".
   - Enter invalid or empty restaurant URL and attempt generation: expect an error prompt "Please enter a restaurant URL".

---

## 2. Prompt Testing

Model: `gpt-3.5-turbo`

| Test Case | Description | Input | Expected Output | Current Behavior |
|-----------|-------------|-------|-----------------|------------------|
| 1. Valid URL | Generate full night plan for a known restaurant | restaurantUrl: `https://www.yelp.com/biz/momofuku-seattle`<br/>apiKey: saved | Three sections (Dessert, Drinks, Dancing) each with at least one stop formatted with keys: `name`, `address`, `order`, `routing_from_previous`, `why_this_stop`. | Returns a correctly structured plan in text and UI. |
| 2. Missing API Key | Attempt generation without saving API key | restaurantUrl: `https://www.yelp.com/biz/momofuku-seattle`<br/>apiKey: _not saved_ | Error message: "Please save your API key first" and no API call is attempted. | UI blocks request and shows correct error. |
| 3. Empty URL | Attempt generation with empty URL field | restaurantUrl: ``<br/>apiKey: saved | Error message: "Please enter a restaurant URL". | UI blocks request and shows correct error. |

---

Additional prompt variations and edge cases (rate limits, API timeouts, malformed URLs) should be added as the extension matures.

*End of Testing Documentation*