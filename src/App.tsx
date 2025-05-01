import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const logoUrl = "images/logo.png";
  const [restaurantUrl, setRestaurantUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isApiKeySaved, setIsApiKeySaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load API key on component mount
  useEffect(() => {
    chrome.storage.local.get(["apiKey"], (result) => {
      // Load existing API key into input, but do not mark as saved until user clicks Save
      if (result.apiKey) {
        setApiKey(result.apiKey);
      }
    });
  }, []);

  const handleSaveApiKey = () => {
    chrome.storage.local.set({ apiKey }, () => {
      setIsApiKeySaved(true);
      setIsEditing(false);
      setError(null);
    });
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    setIsApiKeySaved(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setIsApiKeySaved(false);
  };

  const handleCancelEdit = () => {
    chrome.storage.local.get(["apiKey"], (result) => {
      setApiKey(result.apiKey || "");
      setIsEditing(false);
      setIsApiKeySaved(true);
    });
  };

  const handleGenerate = async () => {
    if (!isApiKeySaved) {
      setError("Please save your API key first");
      return;
    }

    if (!restaurantUrl) {
      setError("Please enter a restaurant URL");
      return;
    }

    setLoading(true);
    setError(null);
    setSuggestions(null);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful nightlife planning assistant. Keep responses concise.",
              },
              {
                role: "user",
                content: `I'm planning a night out starting at this restaurant: ${restaurantUrl}. Please recommend a fun night plan with places nearby for: Dessert Drinks (cocktail/wine/beer bar) Dancing or live music (if available) For each spot, provide:
                The place name and address The optimal visiting order & simple walking/rideshare routing A one-sentence explanation of why it fits at that point in the night Focus on options within easy walking distance from each other where possible. Make it concise.
                
                response format: name: Place name
address: Full address
order: Which number stop this is (1, 2, 3, etc.)
routing_from_previous: Simple walking or rideshare directions from the previous stop
why_this_stop: One-sentence explanation of why it fits at that point in the night`,
              },
            ],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate night plan");
      }

      const data = await response.json();
      setSuggestions(data.choices[0].message.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formatSuggestions = (text: string) => {
    // Split the text into main sections (Dessert, Drinks, Dancing)
    const mainSections = text.split(/\n(?=Dessert|Drinks|Dancing)/);

    return mainSections.map((section, index) => {
      const lines = section.split("\n");
      const title = lines[0].trim();
      const content = lines.slice(1);

      // Process each stop in the section
      const stops = [];
      let currentStop = null;

      for (const line of content) {
        if (line.startsWith("name:")) {
          if (currentStop) {
            stops.push(currentStop);
          }
          currentStop = {
            name: line.replace("name:", "").trim(),
            address: "",
            order: "",
            routing: "",
            explanation: "",
          };
        } else if (currentStop) {
          if (line.startsWith("address:")) {
            currentStop.address = line.replace("address:", "").trim();
          } else if (line.startsWith("order:")) {
            currentStop.order = line.replace("order:", "").trim();
          } else if (line.startsWith("routing_from_previous:")) {
            currentStop.routing = line
              .replace("routing_from_previous:", "")
              .trim();
          } else if (line.startsWith("why_this_stop:")) {
            currentStop.explanation = line.replace("why_this_stop:", "").trim();
          }
        }
      }
      if (currentStop) {
        stops.push(currentStop);
      }

      return (
        <div key={index} className="night-plan-section">
          <h3 className="section-title">{title}</h3>
          <div className="section-content">
            {stops.map((stop, stopIndex) => (
              <div key={stopIndex}>
                <div className="stop-info">
                  <div className="stop-header">
                    <span className="stop-name">{stop.name}</span>
                    <span className="stop-order">Stop {stop.order}</span>
                  </div>
                  <div className="stop-address">{stop.address}</div>
                  <div className="stop-explanation">{stop.explanation}</div>
                </div>
                {stopIndex < stops.length - 1 && (
                  <>
                    <div className="routing-arrow" />
                    <div className="routing-info">{stop.routing}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="App">
      <header className="app-header">
        <img src={logoUrl} alt="Logo" className="app-logo" />
        <h1>Yelper</h1>
      </header>

      <div className="container">
        <div className="api-key-section">
          {isApiKeySaved && !isEditing ? (
            <div className="api-key-saved">
              <div className="api-key-status">
                <span className="api-key-label">API Key Saved</span>
                <button onClick={handleEditClick} className="edit-button">
                  Edit
                </button>
              </div>
            </div>
          ) : (
            <div className="api-key-input">
              <input
                type="password"
                value={apiKey}
                onChange={handleApiKeyChange}
                placeholder="Enter your OpenAI API key"
                className="api-key-field"
              />
              <div className="api-key-buttons">
                <button
                  onClick={handleSaveApiKey}
                  disabled={!apiKey}
                  className="save-api-key-button"
                >
                  Save
                </button>
                {isEditing && (
                  <button onClick={handleCancelEdit} className="cancel-button">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="input-group">
          <label>Restaurant Google Maps URL:</label>
          <input
            type="text"
            value={restaurantUrl}
            onChange={(e) => setRestaurantUrl(e.target.value)}
            placeholder="Paste Google Maps URL here"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !restaurantUrl || !isApiKeySaved}
          className="generate-button"
        >
          {loading ? "Generating..." : "Generate Night Plan"}
        </button>

        {error && <div className="error">{error}</div>}

        {suggestions && (
          <div className="suggestions-container">
            <h2 className="suggestions-title">Your Night Plan</h2>
            <div className="suggestions">{formatSuggestions(suggestions)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
