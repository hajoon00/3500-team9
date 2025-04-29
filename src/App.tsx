import React, { useState, useEffect } from "react";
import "./App.css";

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
  const [summary, setSummary] = useState<any>(null);
  const [apiKey, setApiKey] = useState<string>("");
  const [isApiKeySaved, setIsApiKeySaved] = useState<boolean>(false);

  // Restaurant search state
  const [restaurantSearch, setRestaurantSearch] = useState({
    name: "",
    city: "",
  });

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
    // Send message to background script to save API key
    chrome.runtime.sendMessage(
      { action: "saveAPIKey", data: apiKey },
      (response) => {
        if (response?.success) {
          setIsApiKeySaved(true);
          setError(null);
        } else {
          setError("Failed to save API key");
        }
      }
    );
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    setIsApiKeySaved(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRestaurantSearch((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSummarize = async () => {
    if (!isApiKeySaved) {
      setError("Please save your API key first");
      return;
    }

    if (!restaurantSearch.name || !restaurantSearch.city) {
      setError("Please enter restaurant name and city");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Make API call to OpenAI
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful assistant that specializes in analyzing Yelp restaurant reviews and data. You have access to Yelp's database and can provide accurate information about restaurants based on their Yelp listings and reviews.",
              },
              {
                role: "user",
                content: `Search for the following restaurant on Yelp and provide:
              1. Complete Yelp listing address
              2. Current Yelp rating (out of 5 stars)
              3. Number of Yelp reviews
              4. Two main highlights based on Yelp reviews (what makes this restaurant special)
              5. Two potential flaws mentioned in Yelp reviews (areas that could be improved)
              6. Two most popular dishes according to Yelp reviews
              
              Restaurant: ${restaurantSearch.name}
              City: ${restaurantSearch.city}
              
              Please format the response as a JSON object with the following structure:
              {
                "name": "restaurant name as listed on Yelp",
                "address": "full Yelp listing address",
                "rating": number (0-5 based on Yelp rating),
                "reviews": number (total Yelp reviews),
                "bestPart": ["highlight1 from Yelp reviews", "highlight2 from Yelp reviews"],
                "potentialFlaws": ["flaw1 from Yelp reviews", "flaw2 from Yelp reviews"],
                "bestDishes": ["popular dish1 from Yelp reviews", "popular dish2 from Yelp reviews"]
              }`,
              },
            ],
            temperature: 0.7,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data from OpenAI");
      }

      const data = await response.json();
      let content;
      try {
        content = JSON.parse(data.choices[0].message.content);
      } catch (err) {
        console.error(
          "Failed to parse API response:",
          data.choices[0].message.content
        );
        throw new Error("Invalid response format from API");
      }

      // Create the summary object
      const generatedSummary = {
        ...content,
        summaryCount: Math.floor(content.reviews * 0.4), // 40% of total reviews
        goodPct: Math.min(100, Math.max(0, content.rating * 20)), // Convert 5-star to percentage
      };

      setSummary(generatedSummary);
    } catch (err: any) {
      setError(err.message || "An error occurred while generating the summary");
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

      {/* API Key Section */}
      <section className="api-key-section">
        <div className="api-key-input">
          <input
            type="password"
            value={apiKey}
            onChange={handleApiKeyChange}
            placeholder="Enter your API key"
            className="api-key-field"
          />
          <button
            onClick={handleSaveApiKey}
            disabled={!apiKey || isApiKeySaved}
            className="save-api-key-button"
          >
            {isApiKeySaved ? "API Key Saved" : "Save API Key"}
          </button>
        </div>
        {!isApiKeySaved && (
          <div className="api-key-message">
            <p>Please enter and save your API key to use Yelper</p>
          </div>
        )}
      </section>

      {/* Restaurant Search Section */}
      <section className="restaurant-search-section">
        <div className="input-group">
          <input
            type="text"
            name="name"
            value={restaurantSearch.name}
            onChange={handleSearchChange}
            placeholder="Restaurant Name"
            className="restaurant-input"
          />
          <input
            type="text"
            name="city"
            value={restaurantSearch.city}
            onChange={handleSearchChange}
            placeholder="City"
            className="restaurant-input"
          />
        </div>
      </section>

      {/* Restaurant Header */}
      <section className="restaurant-info">
        <div className="centered-section">
          <div className="details">
            <h2>
              {summary?.name || restaurantSearch.name || "Restaurant Name"}
            </h2>
            <p className="address">
              {summary?.address || "Restaurant Address"}
            </p>
            <p className="meta">
              <a href="#reviews">
                {summary?.reviews?.toLocaleString() || "0"} reviews
              </a>
              <span className="star">★ {summary?.rating || 0}</span>
            </p>
          </div>
          {/* Button */}
          <div className="summarize-control">
            <button
              onClick={handleSummarize}
              disabled={loading || !isApiKeySaved}
            >
              {loading ? "Searching…" : "Search Restaurant"}
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
                  width: `${summary.goodPct}%`,
                  backgroundColor: getBarColor(summary.goodPct),
                }}
              />
            </div>
            <span className="good-label">{summary.goodPct}% good reviews</span>
          </section>

          {/* Summary Sections */}
          <section className="summaries">
            <div className="summary-block">
              <h3>Restaurant Highlights</h3>
              <p className="Best Part">{summary.bestPart.join(", ")}</p>
            </div>
            <div className="summary-block">
              <h3>Potential Flaws</h3>
              <p className="Potential Flaws">
                {summary.potentialFlaws.join(", ")}
              </p>
            </div>
            <div className="summary-block">
              <h3>Popular Dishes</h3>
              <p className="Best Dishes">{summary.bestDishes.join(", ")}</p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default App;
