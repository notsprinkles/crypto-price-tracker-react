import React, { useState, useEffect } from "react";
import axios from "axios";
import CryptoChart from "./CryptoChart";

const CryptoList = () => {
  const [coins, setCoins] = useState([]);
  const [prevPrices, setPrevPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("market_cap");
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 100,
              page: 1,
              sparkline: false,
            },
          }
        );

        // Store previous prices before updating
        const newPrevPrices = {};
        response.data.forEach((coin) => {
          newPrevPrices[coin.id] = coin.current_price;
        });

        setPrevPrices((prev) => ({ ...prev, ...newPrevPrices }));
        setCoins(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Auto-refresh prices every 5s
    return () => clearInterval(interval);
  }, []);

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedCoins = [...filteredCoins].sort((a, b) => {
    if (sortBy === "price") return b.current_price - a.current_price;
    if (sortBy === "market_cap") return b.market_cap - a.market_cap;
    if (sortBy === "change") return b.price_change_percentage_24h - a.price_change_percentage_24h;
    return 0;
  });

  return (
    <div className={darkMode ? "dark-mode" : "light-mode"}>
      <h2>Crypto Price Tracker</h2>

      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          padding: "8px",
          margin: "10px",
          cursor: "pointer",
          background: darkMode ? "#fff" : "#333",
          color: darkMode ? "#000" : "#fff",
          border: "none",
          borderRadius: "5px",
        }}
      >
        {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
      </button>

      {/* Search & Sort */}
      <input
        type="text"
        placeholder="Search for a coin..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "8px", margin: "10px", width: "200px" }}
      />
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        style={{ padding: "8px", margin: "10px" }}
      >
        <option value="market_cap">Sort by Market Cap</option>
        <option value="price">Sort by Price</option>
        <option value="change">Sort by 24h Change</option>
      </select>

      {/* Show Chart if a coin is selected */}
      {selectedCoin && <CryptoChart coinId={selectedCoin} />}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Coin</th>
              <th>Price (USD)</th>
              <th>24h Change</th>
              <th>Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {sortedCoins.map((coin) => {
              const prevPrice = prevPrices[coin.id] || coin.current_price;
              const priceChange = coin.current_price - prevPrice;
              const priceColor = priceChange > 0 ? "green" : priceChange < 0 ? "red" : "black";

              return (
                <tr
                  key={coin.id}
                  onClick={() => setSelectedCoin(coin.id)}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <img src={coin.image} alt={coin.name} width="30" />
                    {coin.name}
                  </td>
                  <td
                    style={{
                      color: priceColor,
                      transition: "color 0.5s ease-in-out", // Smooth color change
                    }}
                  >
                    ${coin.current_price.toLocaleString()}
                  </td>
                  <td
                    style={{
                      color: coin.price_change_percentage_24h > 0 ? "green" : "red",
                      transition: "color 0.5s ease-in-out",
                    }}
                  >
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </td>
                  <td>${coin.market_cap.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CryptoList;




