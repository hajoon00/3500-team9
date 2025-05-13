async function summarizeWithOpenAI(text, apiKey) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `Summarize this: ${text}` }]
      })
    });
  
    if (!response.ok) throw new Error("OpenAI API error");
    const data = await response.json();
  
    // check if response is in expected format
    if (
      !data.choices ||
      !Array.isArray(data.choices) ||
      !data.choices[0]?.message?.content
    ) {
      throw new Error("Malformed OpenAI response");
    }
  
    return data.choices[0].message.content;
  }
  
  global.fetch = jest.fn();
  
  describe('summarizeWithOpenAI', () => {
    beforeEach(() => {
      fetch.mockClear();
    });
  
    it('sends the correct request and returns the summary', async () => {
      const mockResponse = {
        choices: [
          { message: { content: "This is a summary." } }
        ]
      };
  
      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });
  
      const result = await summarizeWithOpenAI("Long review text here", "fake-api-key");
  
      expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer fake-api-key"
        })
      }));
  
      expect(result).toBe("This is a summary.");
    });
  
    it('throws an error if API fails', async () => {
      fetch.mockResolvedValue({ ok: false });
  
      await expect(summarizeWithOpenAI("text", "key")).rejects.toThrow("OpenAI API error");
    });
  
    it('throws an error if OpenAI response is malformed', async () => {
      // invalid response
      fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ unexpected: "format" })
      });
  
      await expect(summarizeWithOpenAI("text", "key")).rejects.toThrow("Malformed OpenAI response");
    });
  });
  
  describe('background script behavior', () => {
    it('saves API key to chrome.storage.local', () => {
      const message = { action: "saveAPIKey", data: "test-key" };
      const sendResponse = jest.fn();
  
      const listener = (message, sender, sendResponse) => {
        if (message.action === "saveAPIKey") {
          const input = message.data;
          chrome.storage.local.set({ apiKey: input }, () => {
            sendResponse({ success: true });
          });
          return true;
        }
      };
  
      listener(message, null, sendResponse);
  
      expect(chrome.storage.local.set).toHaveBeenCalledWith(
        { apiKey: "test-key" },
        expect.any(Function)
      );
  
      expect(sendResponse).toHaveBeenCalledWith({ success: true });
    });
  });
  