# Night Plan Generator Chrome Extension

A Chrome extension that helps you plan your perfect night out by generating a curated itinerary of nearby dessert spots, bars, and dance venues based on your starting restaurant location.

## Features

- **Smart Night Planning**: Generates a complete night plan with multiple stops
- **Location-Based**: Uses your starting restaurant location to find nearby venues
- **Detailed Information**: Provides addresses, routing instructions, and explanations for each stop
- **Visual Organization**: Clean, easy-to-read layout with clear sections and routing information
- **Secure API Key Management**: Safely stores your OpenAI API key

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/hajoon00/3500-team9.git
   ```

2. Install dependencies:

   ```bash
   cd 3500-team9
   npm install
   ```

3. Build the extension:

   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` folder from this project

## Usage

1. **Set Up Your API Key**:

   - Click the extension icon in your Chrome toolbar
   - Enter your OpenAI API key in the provided field
   - Click "Save" to store your API key securely

2. **Generate a Night Plan**:

   - Copy the Google Maps URL of your starting restaurant
   - Paste the URL into the extension's input field
   - Click "Generate Night Plan"

3. **View Your Plan**:
   The extension will generate a detailed night plan including:
   - Dessert locations
   - Drink spots (cocktail/wine/beer bars)
   - Dancing or live music venues
   - Walking/rideshare directions between stops
   - Explanations for each venue choice

## Response Format

The night plan will be organized with the following information for each stop:

```
name: Place name
address: Full address
order: Which number stop this is (1, 2, 3, etc.)
routing_from_previous: Simple walking or rideshare directions from the previous stop
why_this_stop: One-sentence explanation of why it fits at that point in the night
```

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Chrome browser

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build the extension for production
- `npm run preview`: Preview the production build

### Project Structure

```
├── src/
│   ├── App.tsx           # Main application component
│   ├── App.css           # Styles for the application
│   ├── manifest.json     # Extension configuration
│   └── index.html        # Entry point HTML file
├── public/               # Static assets
└── dist/                 # Built extension files
```

## Security

- Your OpenAI API key is stored securely in Chrome's local storage
- The extension only makes API calls to OpenAI's servers
- No data is collected or stored beyond your API key

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

The project has been extended with additional functionality, testing setup, and documentation. The most difficult part was figuring out the right combination of packages for the testing suite (for instance, I would avoid `jest-chrome`, `mockzilla`, `mockzilla-webextension`, to name but a few).

## Features
- Manage and store your OpenAI API key directly in the extension (save, edit, cancel).
- Input a restaurant URL to generate a concise night-out plan (Dessert, Drinks, Dancing/Live Music).
- Fetch recommendations via OpenAI's Chat Completions API and display formatted suggestions with place name, address, visit order, routing instructions, and rationale.
- Responsive React-based popup UI built with TypeScript and Vite.
- Background service worker handling storage events and future context-menu integrations.

## Team Members and Responsibilities
- Chorlotte – Frontend development, UI/UX design, and React component implementation.
- Hajoon – Frontend, Prompt engineering, OpenAI API integration, and chat message formatting.
- Carson – Landing Page, testing strategy, writing unit/manual tests, and quality assurance.
- Ava – OpenAI API integration, documentation, maintenance, and project coordination.

## Known Bugs and Incomplete Features
- Prompt parsing may occasionally mis-split sections when unexpected line breaks occur.
- No automated UI/integration tests yet (manual interface testing only).
- Error handling could be enhanced for network failures or rate limits from the OpenAI API.
- Support for additional planning categories (e.g., Late-night Eats) not yet added.
- OpenAI database has limited access to google map.

