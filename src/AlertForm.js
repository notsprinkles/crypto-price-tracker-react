import React, { useState, useEffect } from "react";

const AlertForm = ({ onSetAlert }) => {
  const [coin, setCoin] = useState("");
  const [price, setPrice] = useState("");
  const [coinList, setCoinList] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);

  // Fetch coin list when the component mounts
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch("https://api.coingecko.com/api/v3/coins/list");
        const data = await response.json();
        setCoinList(data);
      } catch (error) {
        console.error("Error fetching coin list:", error);
      }
    };
    fetchCoins();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (coin && price) {
      onSetAlert({ coin, price: parseFloat(price) });
      setCoin("");
      setPrice("");
      setFilteredCoins([]); // Clear suggestions
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px", position: "relative" }}>
      {/* Coin Search Input */}
      <input
        type="text"
        value={coin}
        onChange={(e) => setCoin(e.target.value)}
        placeholder="Enter coin (e.g., bitcoin)"
        style={{ padding: "10px", marginRight: "10px" }}
      />
      
      {/* Suggestions Dropdown */}
      {filteredCoins.length > 0 && (
        <ul style={{
          position: "absolute",
          background: "white",
          border: "1px solid #ccc",
          listStyleType: "none",
          padding: "5px",
          margin: "0",
          maxHeight: "150px",
          overflowY: "auto",
          width: "200px"
        }}>
          {filteredCoins.map((c) => (
            <li 
              key={c.id} 
              onClick={() => { setCoin(c.id); setFilteredCoins([]); }} 
              style={{ padding: "5px", cursor: "pointer" }}
            >
              {c.id}
            </li>
          ))}
        </ul>
      )}

      {/* Price Input */}
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Target price (USD)"
        style={{ padding: "10px", marginRight: "10px" }}
      />
      
      <button type="submit" style={{ padding: "10px" }}>
        Set Alert
      </button>
    </form>
  );
};

export default AlertForm;
