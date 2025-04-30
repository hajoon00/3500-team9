# Chrome Extension Starter (React, TypeScript, Vite)

This project demonstrates how to build a Chrome extension using [React](https://react.dev/) with TypeScript and Vite. It showcases key features such as interacting with Chrome APIs ([storage](https://developer.chrome.com/docs/extensions/reference/api/storage), [contextMenus](https://developer.chrome.com/docs/extensions/reference/api/contextMenus)), testing with [Jest](https://jestjs.io/) and [Sinon](https://sinonjs.org/), and structuring a React app with separation of concerns.

## Installation

### Install From Release

- Download the latest release from the [Releases](https://github.com/CIS-3500/chrome-extension-react-typescript-vite-starter-main/releases)
- Unzip the downloaded ZIP file
- Open Chrome and navigate to `chrome://extensions`
- Enable "Developer mode"
- Drag and drop the unzipped folder into the extensions page

### Install From Source

1. Clone the repository:

   ```bash
   git clone https://github.com/CIS-3500/chrome-extension-react-typescript-vite-starter-main
   ```

2. Install dependencies:

   ```bash
   cd chrome-extension-react-typescript-vite-starter-main
   npm install
   ```

3. Build the extension:

   ```bash
   npm run build
   ```

4. Load the extension in Chrome:

   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` directory from the project

## Development

- Run the development server with hot reloading:

  ```bash
  npm run dev
  ```

- Load the unpacked extension in Chrome from the `dist` directory
- Make changes to the source code and the extension will automatically reload

## Chrome Extension Architecture

This project follows the Manifest V3 architecture for Chrome extensions. Key components of the architecture include:

- `manifest.json`: Defines the extension's metadata, permissions, and script configurations
- `background.js`: Runs in the background and handles events and long-running tasks
- `contentScript.js`: Injected into web pages to interact with the DOM and communicate with the background script **(not used here)**
- Popup window: Displays the extension's user interface when the extension icon is clicked

### Manifest V3

This extension is built using the latest version of the Chrome extension manifest (Manifest V3). The `manifest.json` file defines the extension's properties, permissions, and scripts.

Key aspects of the Manifest V3 configuration include:

- `manifest_version`: Set to `3` to use Manifest V3
- `background`: Specifies the background script as a service worker
- `action`: Defines the popup HTML file
- `permissions`: Declares the required permissions for the extension (storage, activeTab, contextMenus)
- `content_scripts`: Specifies the content script to be injected into web pages

## Testing

The project includes a comprehensive testing setup using Jest, Sinon, and sinon-chrome. The tests cover various aspects of the extension, including component rendering, user interactions, and mocking of Chrome APIs.

To run the tests:

```bash
npm run test
```

To generate a coverage report:

```bash
npm run coverage
```

### Mocking Chrome APIs

One of the key aspects of testing a Chrome extension is mocking the Chrome APIs. This project uses the following libraries to achieve this:

- [Jest](https://jestjs.io/): The test runner and assertion library
- [Sinon](https://sinonjs.org/): A library for creating spies, stubs, and mocks
- [sinon-chrome](https://github.com/acvetkov/sinon-chrome/): A collection of pre-built mocks for Chrome APIs
- [jest-sinon](https://github.com/djkf/jest-sinon): An extension for Jest to work seamlessly with Sinon

Here's an example test that demonstrates mocking the Chrome storage API:

```typescript
it("sets initial state with empty array when snippets key is an empty array in local storage", async () => {
  chrome.storage.local.get.withArgs("snippets").yields({ snippets: [] });

  render(<App />);
  const snippetElements = screen.queryAllByRole("listitem");
  expect(snippetElements).toHaveLength(0);
});
```

In this test, we mock the `chrome.storage.local.get` method to return an empty array for the 'snippets' key. This allows us to test how the `App` component behaves when there are no saved snippets.

## Duplicating Project: Using This Project As A Starting Point

You are welcome to use this repository as a starting point for your own work. The best way to do so is to import the repository into your own GitHub account: You can do so either [using the GitHub Importer (recommended)](https://docs.github.com/en/migrations/importing-source-code/using-github-importer/importing-a-repository-with-github-importer) or [manually using the command-line](https://docs.github.com/en/repositories/creating-and-managing-repositories/duplicating-a-repository).

## Credits

The initial setup of this project was based on the tutorial by [Harshita Joshi](https://github.com/Harshita-mindfire) on creating a Chrome extension with React and TypeScript. The corresponding Medium article can be found [here](https://medium.com/@tharshita13/creating-a-chrome-extension-with-react-a-step-by-step-guide-47fe9bab24a1).

Further setup was done by [Michelle Chang](https://github.com/michellechang02) by replacing the Webpack initialization of the app with Vite.

The project has been extended with additional functionality, testing setup, and documentation. The most difficult part was figuring out the right combination of packages for the testing suite (for instance, I would avoid `jest-chrome`, `mockzilla`, `mockzilla-webextension`, to name but a few).

## Features
- Manage and store your OpenAI API key directly in the extension (save, edit, cancel).
- Input a restaurant URL to generate a concise night-out plan (Dessert, Drinks, Dancing/Live Music).
- Fetch recommendations via OpenAI's Chat Completions API and display formatted suggestions with place name, address, visit order, routing instructions, and rationale.
- Responsive React-based popup UI built with TypeScript and Vite.
- Background service worker handling storage events and future context-menu integrations.

## Team Members and Responsibilities
- [Name] – Frontend development, UI/UX design, and React component implementation.
- [Name] – Prompt engineering, OpenAI API integration, and chat message formatting.
- [Name] – Testing strategy, writing unit/manual tests, and quality assurance.
- [Name] – Documentation, maintenance, and project coordination.

## Known Bugs and Incomplete Features
- Prompt parsing may occasionally mis-split sections when unexpected line breaks occur.
- No automated UI/integration tests yet (manual interface testing only).
- Context-menu integration is scaffolded but not fully implemented within the page context.
- Error handling could be enhanced for network failures or rate limits from the OpenAI API.
- Support for additional planning categories (e.g., Late-night Eats) not yet added.

## Basic Testing Documentation
Bare-bones testing information is maintained in [TESTING.md](TESTING.md), including manual interface walkthroughs and prompt test cases.
