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
  bestDishes: ["bestdish1", "bestdish2"]
};


function getBarColor(pct: number): string {
  if (pct >= 80)   return "#4caf50"  
  if (pct >= 60)   return "#ffeb3b" 
  if (pct >= 40)   return "#ff9800" 
  return "#f44336"                  
}

function App() {
  const logoUrl = "images/logo.png";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<typeof restaurant | null>(null)

  const handleSummarize = async () => {
    setLoading(true);
    setError(null);

    //try catch for fetch, dummy for now
    try {
      setSummary(restaurant)
    } catch (err: any) {
      setError(err.message || "error")
    } finally {
      setLoading(false)
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
        <section className="restaurant-info">
          <div className="preview-photo">preview photo</div>
          <div className="centered-section">
            <div className="details">
              <h2>{restaurant.name}</h2>
              <p className="address">{restaurant.address}</p>
              <p className="meta">
                <a href="#reviews">{restaurant.reviews.toLocaleString()} reviews</a>
                <span className="star">★ {restaurant.rating}</span>
              </p>
            </div>
            {/* Button */}
            <div className="summarize-control">
              <button onClick={handleSummarize} disabled={loading}>
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
              style={{ width: `${restaurant.goodPct}%`,       
              backgroundColor: getBarColor(restaurant.goodPct)
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
            <p className="Potential Flaws">{restaurant.potentialFlaws.join(", ")}</p>
          </div>
          <div className="summary-block">
            <h3>Popular Dishes</h3>
            <p className="Best Dishes">{restaurant.bestDishes.join(", ")}</p>
          </div>
        </section>
        </>
      )}
    </div>
  );
}


export default App;
