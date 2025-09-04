import React, { useState, useEffect } from "react";
import CryptoList from "./CryptoList";
import CryptoChart from "./CryptoChart";
import AlertForm from "./AlertForm";
import "./styles.css";

function App() {
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [alerts, setAlerts] = useState([]);

  // Function to handle adding an alert
  const handleSetAlert = ({ coin, price }) => {
    setAlerts([...alerts, { coin, price }]);
  };

  // Function to check if any alert has been triggered
  const checkPriceAlerts = (coinId, currentPrice) => {
    alerts.forEach((alert) => {
      if (alert.coin === coinId && currentPrice >= alert.price) {
        // Trigger a notification
        new Notification(`Price Alert! ${coinId} reached ${currentPrice} USD`);
        // Optionally, you can remove the alert after it's triggered
        setAlerts(alerts.filter((a) => a !== alert));
      }
    });
  };

  // Listen for coin price changes and check if any alert should be triggered
  useEffect(() => {
    if (selectedCoin) {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${selectedCoin}&vs_currencies=usd`
          );
          const data = await response.json();
          const currentPrice = data[selectedCoin]?.usd;

          if (currentPrice) {
            // Check if the current price triggers any alerts
            checkPriceAlerts(selectedCoin, currentPrice);
          }
        } catch (err) {
          console.error("Error fetching price:", err);
        }
      }, 5000); // Check every 5 seconds

      return () => clearInterval(interval); // Clean up the interval when the component unmounts
    }
  }, [selectedCoin, alerts]);

  // Request permission for notifications
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div>
      {/* Alert Form */}
      <AlertForm onSetAlert={handleSetAlert} />

      {/* Chart appears at the top */}
      {selectedCoin && <CryptoChart coinId={selectedCoin} />}

      {/* List appears below */}
      <CryptoList onCoinClick={setSelectedCoin} />
    </div>
  );
}

export default App;



