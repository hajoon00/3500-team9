import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

describe("App Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the Yelper heading", () => {
    render(<App />);
    expect(screen.getByText(/Yelper/i)).toBeInTheDocument();
  });

  it("renders API key input and disabled Save button initially", () => {
    render(<App />);
    const apiKeyInput = screen.getByPlaceholderText("Enter your OpenAI API key");
    expect(apiKeyInput).toBeInTheDocument();
    const saveButton = screen.getByRole("button", { name: /Save/i });
    expect(saveButton).toBeDisabled();
  });

  it("enables Save button when API key is entered", () => {
    render(<App />);
    const apiKeyInput = screen.getByPlaceholderText("Enter your OpenAI API key");
    const saveButton = screen.getByRole("button", { name: /Save/i });
    fireEvent.change(apiKeyInput, { target: { value: "test-key" } });
    expect(saveButton).toBeEnabled();
  });

  it("saves API key and shows 'API Key Saved' after clicking Save", async () => {
    render(<App />);
    const apiKeyInput = screen.getByPlaceholderText("Enter your OpenAI API key");
    fireEvent.change(apiKeyInput, { target: { value: "test-key" } });
    const saveButton = screen.getByRole("button", { name: /Save/i });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.getByText(/API Key Saved/i)).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: /Edit/i })).toBeInTheDocument();
  });

  it("disables Generate button when API key is not saved", () => {
    render(<App />);
    const generateButton = screen.getByRole("button", { name: /Generate Night Plan/i });
    expect(generateButton).toBeDisabled();
  });

  it("shows error message if OpenAI API request fails", async () => {
    (window.chrome.storage.local.get as jest.Mock).mockImplementation((keys, callback) => callback({ apiKey: 'key' }));
    global.fetch = jest.fn().mockResolvedValue({ ok: false });
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText("Enter your OpenAI API key"), { target: { value: "key" } });
    fireEvent.click(screen.getByRole("button", { name: /Save/i }));
    await waitFor(() => expect(screen.getByText(/API Key Saved/i)).toBeInTheDocument());
    fireEvent.change(screen.getByPlaceholderText("Paste Google Maps URL here"), { target: { value: "http://test" } });
    const generateButton = screen.getByRole("button", { name: /Generate Night Plan/i });
    expect(generateButton).toBeEnabled();
    fireEvent.click(generateButton);
    await waitFor(() => expect(screen.getByText(/Failed to generate night plan/i)).toBeInTheDocument());
  });

  it("renders suggestions after successful fetch", async () => {
    (window.chrome.storage.local.get as jest.Mock).mockImplementation((keys, callback) => callback({ apiKey: 'key' }));
    const suggestionText = `Dessert
name: Sweet Spot
address: 123 Main St
order: 1
routing_from_previous: Walk 2 mins
why_this_stop: Delicious desserts
`;
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ choices: [{ message: { content: suggestionText } }] }),
    });
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText("Enter your OpenAI API key"), { target: { value: "key" } });
    fireEvent.click(screen.getByRole("button", { name: /Save/i }));
    await waitFor(() => expect(screen.getByText(/API Key Saved/i)).toBeInTheDocument());
    fireEvent.change(screen.getByPlaceholderText("Paste Google Maps URL here"), { target: { value: "http://test" } });
    const generateBtn = screen.getByRole("button", { name: /Generate Night Plan/i });
    expect(generateBtn).toBeEnabled();
    fireEvent.click(generateBtn);
    await waitFor(() => expect(screen.getByText(/Your Night Plan/i)).toBeInTheDocument());
    expect(screen.getByText(/Sweet Spot/i)).toBeInTheDocument();
  });
});
