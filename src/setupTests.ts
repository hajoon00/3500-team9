// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
// Mock Chrome APIs for testing environment
Object.defineProperty(window, 'chrome', {
  writable: true,
  value: {
    storage: {
      local: {
        get: jest.fn((keys, callback) => {
          // Default: no API key saved
          callback({ apiKey: '' });
        }),
        set: jest.fn((items, callback) => {
          if (callback) callback();
        }),
      },
    },
    runtime: {
      onMessage: {
        addListener: jest.fn(),
      },
    },
  },
});