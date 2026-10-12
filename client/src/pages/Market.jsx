import {
    useEffect,
    useState
} from "react";

import api from "../services/api";

import StockCard from "../components/StockCard";

function Market() {
    const [stocks, setStocks] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [lastUpdated, setLastUpdated] =
        useState(null);

    const loadStocks = async () => {
        try {
            const response =
                await api.get("/stocks");

            setStocks(
                response.data.stocks
            );

            setLastUpdated(
                new Date()
            );

            setError("");
        } catch (error) {
            console.error(
                "Could not load market data:",
                error
            );

            setError(
                "Could not load market data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStocks();

        const interval =
            setInterval(
                loadStocks,
                10000
            );

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="market-page">

            <div className="container py-4">

                {/* Header */}

                <div className="market-header">

                    <div>
                        <h1 className="market-title">
                            Market
                        </h1>

                        <p className="market-subtitle">
                            Explore simulated market
                            prices and stock performance.
                        </p>
                    </div>

                    <div className="market-live-area">

                        <span className="live-badge">
                            <span className="live-dot"></span>
                            Live Updates
                        </span>

                        {lastUpdated && (
                            <div className="last-updated">
                                Updated at{" "}
                                {lastUpdated.toLocaleTimeString()}
                            </div>
                        )}

                    </div>

                </div>

                {/* Loading */}

                {loading && (
                    <div className="market-loading">

                        <div
                            className="spinner-border"
                            role="status"
                        >
                            <span className="visually-hidden">
                                Loading...
                            </span>
                        </div>

                        <p>
                            Loading market data...
                        </p>

                    </div>
                )}

                {/* Error */}

                {error && (
                    <div
                        className="alert alert-danger"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                {/* Stocks */}

                {!loading &&
                    !error &&
                    stocks.length > 0 && (
                        <div className="stock-grid">

                            {stocks.map(
                                (stock) => (
                                    <StockCard
                                        key={stock._id}
                                        stock={stock}
                                    />
                                )
                            )}

                        </div>
                    )}

                {/* Empty state */}

                {!loading &&
                    !error &&
                    stocks.length === 0 && (
                        <div className="alert alert-info">
                            No stocks are currently available.
                        </div>
                    )}

                {/* Live information */}

                <div className="live-market-info">

                    <div className="live-market-icon">
                        ↗
                    </div>

                    <div>
                        <h5>
                            Live Market Data
                        </h5>

                        <p>
                            Stock prices update
                            automatically every
                            10 seconds. This page
                            shows simulated market
                            movements for
                            demonstration purposes.
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Market;