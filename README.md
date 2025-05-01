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

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
