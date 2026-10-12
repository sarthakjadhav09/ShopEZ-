import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import api from "../services/api";

import StockChart
    from "../components/StockChart";

import {
    useAuth
} from "../context/AuthContext";

function StockDetails() {
    const {
        symbol
    } = useParams();

    const navigate = useNavigate();

    const {
        user
    } = useAuth();

    const [
        stock,
        setStock
    ] = useState(null);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState("");

    const [
        quantity,
        setQuantity
    ] = useState(1);

    const [
        trading,
        setTrading
    ] = useState(false);

    const [
        tradeMessage,
        setTradeMessage
    ] = useState("");

    const [
        tradeError,
        setTradeError
    ] = useState("");

    useEffect(() => {
        const fetchStock = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await api.get(
                        `/stocks/${symbol}`
                    );

                setStock(
                    response.data.stock
                );
            } catch (error) {
                console.error(
                    "Stock details error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load stock details."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStock();
    }, [symbol]);

    const handleTrade = async (type) => {
        setTradeMessage("");
        setTradeError("");

        if (!user) {
            navigate("/login");
            return;
        }

        const numericQuantity =
            Number(quantity);

        if (
            !Number.isInteger(
                numericQuantity
            ) ||
            numericQuantity <= 0
        ) {
            setTradeError(
                "Quantity must be a positive whole number."
            );

            return;
        }

        try {
            setTrading(true);

            const endpoint =
                type === "BUY"
                    ? "/trades/buy"
                    : "/trades/sell";

            const response =
                await api.post(
                    endpoint,
                    {
                        stockId: stock._id,
                        quantity: numericQuantity
                    }
                );

            setTradeMessage(
                response.data.message ||
                "Trade completed successfully."
            );

            setQuantity(1);
        } catch (error) {
            console.error(
                "Trade error:",
                error
            );

            setTradeError(
                error.response?.data?.message ||
                "Trade could not be completed."
            );
        } finally {
            setTrading(false);
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">

                <div
                    className="spinner-border"
                    role="status"
                >
                    <span className="visually-hidden">
                        Loading...
                    </span>
                </div>

                <p className="mt-3">
                    Loading stock details...
                </p>

            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">

                <div className="alert alert-danger">
                    {error}
                </div>

                <Link
                    to="/market"
                    className="btn btn-primary"
                >
                    Back to Market
                </Link>

            </div>
        );
    }

    if (!stock) {
        return (
            <div className="container py-5">

                <div className="alert alert-warning">
                    Stock not found.
                </div>

                <Link
                    to="/market"
                    className="btn btn-primary"
                >
                    Back to Market
                </Link>

            </div>
        );
    }

    const dailyStats =
        stock.dailyStats || {};

    const change =
        Number(
            dailyStats.change || 0
        );

    const changePercent =
        Number(
            dailyStats.changePercent || 0
        );

    const isPositive =
        change >= 0;

    const historicalData =
        Array.isArray(
            stock.historicalData
        )
            ? stock.historicalData
            : [];

    return (
        <div className="container py-5">

            {/* Back button */}

            <div className="mb-4">

                <Link
                    to="/market"
                    className="btn btn-outline-secondary"
                >
                    ← Back to Market
                </Link>

            </div>

            {/* Stock Header */}

            <div className="card shadow-sm mb-4">

                <div className="card-body">

                    <div className="row align-items-center">

                        <div className="col-md-7">

                            <p className="text-muted mb-1">
                                {stock.symbol}
                            </p>

                            <h1 className="mb-2">
                                {stock.name}
                            </h1>

                            <h2 className="display-6">
                                $
                                {Number(
                                    stock.price
                                ).toFixed(2)}
                            </h2>

                        </div>

                        <div className="col-md-5 text-md-end">

                            <div
                                className={
                                    isPositive
                                        ? "text-success"
                                        : "text-danger"
                                }
                            >

                                <h4>
                                    {isPositive
                                        ? "+"
                                        : ""}
                                    {change.toFixed(2)}
                                </h4>

                                <p className="mb-0">
                                    {isPositive
                                        ? "+"
                                        : ""}
                                    {changePercent.toFixed(2)}
                                    %
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* Statistics */}

            <div className="row mb-4">

                <div className="col-md-3 mb-3">

                    <div className="card h-100 shadow-sm">

                        <div className="card-body">

                            <p className="text-muted mb-1">
                                Today's High
                            </p>

                            <h4>
                                $
                                {Number(
                                    dailyStats.high || 0
                                ).toFixed(2)}
                            </h4>

                        </div>

                    </div>

                </div>

                <div className="col-md-3 mb-3">

                    <div className="card h-100 shadow-sm">

                        <div className="card-body">

                            <p className="text-muted mb-1">
                                Today's Low
                            </p>

                            <h4>
                                $
                                {Number(
                                    dailyStats.low || 0
                                ).toFixed(2)}
                            </h4>

                        </div>

                    </div>

                </div>

                <div className="col-md-3 mb-3">

                    <div className="card h-100 shadow-sm">

                        <div className="card-body">

                            <p className="text-muted mb-1">
                                Volume
                            </p>

                            <h4>
                                {Number(
                                    dailyStats.volume || 0
                                ).toLocaleString()}
                            </h4>

                        </div>

                    </div>

                </div>

                <div className="col-md-3 mb-3">

                    <div className="card h-100 shadow-sm">

                        <div className="card-body">

                            <p className="text-muted mb-1">
                                Historical Records
                            </p>

                            <h4>
                                {historicalData.length}
                            </h4>

                        </div>

                    </div>

                </div>

            </div>

            {/* Chart */}

            <div className="card shadow-sm mb-4">

                <div className="card-body">

                    <h2 className="h4 mb-4">
                        Price History
                    </h2>

                    <StockChart
                        historicalData={
                            historicalData
                        }
                    />

                </div>

            </div>

            {/* Trading */}

            <div className="card shadow-sm">

                <div className="card-body">

                    <h2 className="h4">
                        Trade {stock.symbol}
                    </h2>

                    <p className="text-muted">
                        Current price: $
                        {Number(
                            stock.price
                        ).toFixed(2)}
                    </p>

                    {!user && (
                        <div className="alert alert-info">
                            Please log in to buy or
                            sell stocks.
                        </div>
                    )}

                    {tradeMessage && (
                        <div className="alert alert-success">
                            {tradeMessage}
                        </div>
                    )}

                    {tradeError && (
                        <div className="alert alert-danger">
                            {tradeError}
                        </div>
                    )}

                    <div className="row align-items-end">

                        <div className="col-md-4 mb-3">

                            <label
                                htmlFor="quantity"
                                className="form-label"
                            >
                                Quantity
                            </label>

                            <input
                                id="quantity"
                                type="number"
                                min="1"
                                step="1"
                                className="form-control"
                                value={quantity}
                                onChange={(event) =>
                                    setQuantity(
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="col-md-4 mb-3">

                            <label className="form-label">
                                Estimated Value
                            </label>

                            <div className="form-control bg-light">
                                $
                                {(
                                    Number(
                                        stock.price
                                    ) *
                                    Number(
                                        quantity || 0
                                    )
                                ).toFixed(2)}
                            </div>

                        </div>

                        <div className="col-md-2 mb-3">

                            <button
                                className="btn btn-success w-100"
                                onClick={() =>
                                    handleTrade(
                                        "BUY"
                                    )
                                }
                                disabled={
                                    trading
                                }
                            >
                                {trading
                                    ? "Processing..."
                                    : "Buy"}
                            </button>

                        </div>

                        <div className="col-md-2 mb-3">

                            <button
                                className="btn btn-danger w-100"
                                onClick={() =>
                                    handleTrade(
                                        "SELL"
                                    )
                                }
                                disabled={
                                    trading
                                }
                            >
                                {trading
                                    ? "Processing..."
                                    : "Sell"}
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default StockDetails;