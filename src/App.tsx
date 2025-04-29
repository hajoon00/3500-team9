import React, { useState, useEffect } from "react";
import "./App.css";
//dummy data
const restaurant = {
  name: "Restaurant Name",
  address: "3939 Chestnut St. Philadelphia, PA",
  reviews: 1275,
  rating: 4.5,
  summaryCount: 500,
  goodPct: 77,
  bestPart: ["bestPart1", "bestPart2"],
  potentialFlaws: ["flaw1", "flaw2"],
  bestDishes: ["bestdish1", "bestdish2"],
};

function getBarColor(pct: number): string {
  if (pct >= 80) return "#4caf50";
  if (pct >= 60) return "#ffeb3b";
  if (pct >= 40) return "#ff9800";
  return "#f44336";
}

function App() {
  const logoUrl = "images/logo.png";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<typeof restaurant | null>(null);
  const [apiKey, setApiKey] = useState<string>("");
  const [isApiKeySaved, setIsApiKeySaved] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Load API key on component mount
  useEffect(() => {
    chrome.storage.local.get(["apiKey"], (result) => {
      if (result.apiKey) {
        setApiKey(result.apiKey);
        setIsApiKeySaved(true);
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

  const handleSummarize = async () => {
    if (!isApiKeySaved) {
      setError("Please save your API key first");
      return;
    }

    setLoading(true);
    setError(null);

    //try catch for fetch, dummy for now
    try {
      setSummary(restaurant);
    } catch (err: any) {
      setError(err.message || "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="app-header">
        <img src={logoUrl} alt="Logo" className="app-logo" />
        <h1>Yelper</h1>
      </header>

      {/* Restaurant Header */}
      <div className="container">
        {/* API Key Section */}
        <section className="api-key-section">
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
                placeholder="Enter your API key"
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
          {!isApiKeySaved && !isEditing && (
            <div className="api-key-message">
              <p>Please enter and save your API key to use Yelper</p>
            </div>
          )}
        </section>

        {/* Restaurant Info */}
        <section className="restaurant-info">
          <div className="centered-section">
            <div className="details">
              <h2>{restaurant.name}</h2>
              <p className="address">{restaurant.address}</p>
              <p className="meta">
                <a href="#reviews">
                  {restaurant.reviews.toLocaleString()} reviews
                </a>
                <span className="star">★ {restaurant.rating}</span>
              </p>
            </div>
            {/* Button */}
            <div className="summarize-control">
              <button
                onClick={handleSummarize}
                disabled={loading || !isApiKeySaved}
              >
                {loading ? "Summarizing…" : "Generate Summary"}
              </button>
              {error && <p className="error">{error}</p>}
            </div>
          </div>
        </section>

        {summary && (
          <>
            {/* Percentage Good/Bad Bar */}
            <section className="rating-bar">
              <div className="bar">
                <div
                  className="fill"
                  style={{
                    width: `${restaurant.goodPct}%`,
                    backgroundColor: getBarColor(restaurant.goodPct),
                  }}
                />
              </div>
              <span className="good-label">
                {restaurant.goodPct}% good reviews
              </span>
            </section>

            {/* Summary Sections */}
            <section className="summaries">
              <div className="summary-block">
                <h3>Restaurant Highlights</h3>
                <p className="Best Part">{restaurant.bestPart.join(", ")}</p>
              </div>
              <div className="summary-block">
                <h3>Potential Flaws</h3>
                <p className="Potential Flaws">
                  {restaurant.potentialFlaws.join(", ")}
                </p>
              </div>
              <div className="summary-block">
                <h3>Popular Dishes</h3>
                <p className="Best Dishes">
                  {restaurant.bestDishes.join(", ")}
                </p>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
