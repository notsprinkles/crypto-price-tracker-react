import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Filler } from "chart.js";

// Register required Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Filler);

const CryptoChart = ({ coinId }) => {
    console.log("Rendering CryptoChart for:", coinId);

    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const chartRef = useRef(null); // 👈 Ref for scrolling

    useEffect(() => {
        if (!coinId) return;

        const fetchChartData = async () => {
            try {
                setLoading(true);
                setError(null);
                setChartData(null);
                
                console.log(`Fetching chart data for: ${coinId}`);

                const response = await fetch(
                    `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`
                );
                const data = await response.json();
                console.log("API Response:", data);

                if (!data.prices) {
                    throw new Error("Invalid API response");
                }

                const labels = data.prices.map(price => new Date(price[0]).toLocaleDateString());
                const prices = data.prices.map(price => price[1]);

                setTimeout(() => {
                    setChartData({
                        labels,
                        datasets: [
                            {
                                label: "Price (USD)",
                                data: prices,
                                borderColor: "#4CAF50",
                                backgroundColor: "rgba(76, 175, 80, 0.2)",
                                fill: true,
                            },
                        ],
                    });

                    // 👇 Scroll into view when the chart updates
                    chartRef.current?.scrollIntoView({ behavior: "smooth" });

                }, 100);
            } catch (err) {
                console.error("Error fetching chart data:", err);
                setError("Failed to load chart data.");
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, [coinId]);

    if (loading) return <p>Loading chart...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!chartData) return <p>No data available.</p>;

    return (
        <div ref={chartRef} style={{ width: "600px", margin: "20px auto" }}>
            <h2>7-Day Price Chart</h2>
            <Line data={chartData} />
        </div>
    );
};

export default CryptoChart;


