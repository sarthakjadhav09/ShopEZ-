import { useEffect, useRef } from "react";

import Chart from "chart.js/auto";

function StockChart({ historicalData }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if (!historicalData || historicalData.length === 0) {
            return;
        }

        if (!canvasRef.current) {
            return;
        }

        // Destroy any previous chart before creating a new one
        if (chartRef.current) {
            chartRef.current.destroy();
            chartRef.current = null;
        }

        const labels = historicalData.map((item) => {
            return new Date(item.date).toLocaleDateString();
        });

        const prices = historicalData.map((item) => {
            return Number(item.close);
        });

        const context = canvasRef.current.getContext("2d");

        chartRef.current = new Chart(context, {
            type: "line",

            data: {
                labels,

                datasets: [
                    {
                        label: "Closing Price",
                        data: prices,
                        tension: 0.3,
                        fill: false,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }
                ]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        display: true
                    },

                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `$${Number(
                                    context.raw
                                ).toFixed(2)}`;
                            }
                        }
                    }
                },

                scales: {
                    y: {
                        beginAtZero: false,

                        ticks: {
                            callback: (value) => {
                                return `$${value}`;
                            }
                        }
                    }
                }
            }
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
                chartRef.current = null;
            }
        };
    }, [historicalData]);

    if (!historicalData || historicalData.length === 0) {
        return (
            <div className="alert alert-info">
                Historical price data is not available
                for this stock.
            </div>
        );
    }

    return (
        <div
            style={{
                height: "350px",
                position: "relative"
            }}
        >
            <canvas ref={canvasRef}></canvas>
        </div>
    );
}

export default StockChart;