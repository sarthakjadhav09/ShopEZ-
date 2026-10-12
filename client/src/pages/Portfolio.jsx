import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import api from "../services/api";

function Portfolio() {
    const [
        portfolio,
        setPortfolio
    ] = useState(null);

    const [
        transactions,
        setTransactions
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState("");

    useEffect(() => {
        const fetchPortfolioData = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    portfolioResponse,
                    transactionResponse
                ] = await Promise.all([
                    api.get("/portfolio"),
                    api.get("/trades/transactions")
                ]);

                setPortfolio(
                    portfolioResponse.data.portfolio
                );

                setTransactions(
                    transactionResponse.data.transactions || []
                );
            } catch (error) {
                console.error(
                    "Portfolio error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load portfolio."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolioData();
    }, []);

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
                    Loading your portfolio...
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
                    Go to Market
                </Link>

            </div>
        );
    }

    const safePortfolio = portfolio || {
        balance: 100000,
        holdings: [],
        totalInvested: 0,
        totalPortfolioValue: 0,
        profitLoss: 0
    };

    const balance =
        Number(
            safePortfolio.balance || 0
        );

    const totalInvested =
        Number(
            safePortfolio.totalInvested || 0
        );

    const portfolioValue =
        Number(
            safePortfolio.totalPortfolioValue || 0
        );

    const profitLoss =
        Number(
            safePortfolio.profitLoss || 0
        );

    const totalAccountValue =
        balance + portfolioValue;

    const profitIsPositive =
        profitLoss >= 0;

    return (
        <div className="container py-5">

            {/* Page Header */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h1>
                        My Portfolio
                    </h1>

                    <p className="text-muted mb-0">
                        Track your virtual investments
                        and trading activity.
                    </p>
                </div>

                <Link
                    to="/market"
                    className="btn btn-primary"
                >
                    Explore Market
                </Link>

            </div>

            {/* Summary Cards */}

            <div className="row mb-4">

                <div className="col-md-6 col-lg-3 mb-3">

                    <div className="card h-100 shadow-sm">

                        <div className="card-body">

                            <p className="text-muted mb-1">
                                Available Balance
                            </p>

                            <h3>
                                $
                                {balance.toFixed(2)}
                            </h3>

                        </div>

                    </div>

                </div>

                <div className="col-md-6 col-lg-3 mb-3">

                    <div className="card h-100 shadow-sm">

                        <div className="card-body">

                            <p className="text-muted mb-1">
                                Portfolio Value
                            </p>

                            <h3>
                                $
                                {portfolioValue.toFixed(2)}
                            </h3>

                        </div>

                    </div>

                </div>

                <div className="col-md-6 col-lg-3 mb-3">

                    <div className="card h-100 shadow-sm">

                        <div className="card-body">

                            <p className="text-muted mb-1">
                                Total Account Value
                            </p>

                            <h3>
                                $
                                {totalAccountValue.toFixed(2)}
                            </h3>

                        </div>

                    </div>

                </div>

                <div className="col-md-6 col-lg-3 mb-3">

                    <div className="card h-100 shadow-sm">

                        <div className="card-body">

                            <p className="text-muted mb-1">
                                Profit / Loss
                            </p>

                            <h3
                                className={
                                    profitIsPositive
                                        ? "text-success"
                                        : "text-danger"
                                }
                            >
                                {profitIsPositive
                                    ? "+"
                                    : ""}
                                $
                                {profitLoss.toFixed(2)}
                            </h3>

                        </div>

                    </div>

                </div>

            </div>

            {/* Investment Summary */}

            <div className="card shadow-sm mb-4">

                <div className="card-body">

                    <div className="row">

                        <div className="col-md-4 mb-3 mb-md-0">

                            <p className="text-muted mb-1">
                                Total Invested
                            </p>

                            <h4>
                                $
                                {totalInvested.toFixed(2)}
                            </h4>

                        </div>

                        <div className="col-md-4 mb-3 mb-md-0">

                            <p className="text-muted mb-1">
                                Holdings
                            </p>

                            <h4>
                                {
                                    safePortfolio
                                        .holdings
                                        ?.length || 0
                                }
                            </h4>

                        </div>

                        <div className="col-md-4">

                            <p className="text-muted mb-1">
                                Transactions
                            </p>

                            <h4>
                                {transactions.length}
                            </h4>

                        </div>

                    </div>

                </div>

            </div>

            {/* Holdings */}

            <div className="card shadow-sm mb-4">

                <div className="card-body">

                    <div className="d-flex justify-content-between align-items-center mb-3">

                        <h2 className="h4 mb-0">
                            My Holdings
                        </h2>

                    </div>

                    {!safePortfolio.holdings ||
                        safePortfolio.holdings.length === 0 ? (

                        <div className="alert alert-info mb-0">

                            You do not own any stocks yet.

                            <div className="mt-3">

                                <Link
                                    to="/market"
                                    className="btn btn-primary"
                                >
                                    Browse Stocks
                                </Link>

                            </div>

                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-hover align-middle">

                                <thead>

                                    <tr>

                                        <th>
                                            Stock
                                        </th>

                                        <th>
                                            Quantity
                                        </th>

                                        <th>
                                            Avg. Buy Price
                                        </th>

                                        <th>
                                            Current Price
                                        </th>

                                        <th>
                                            Invested
                                        </th>

                                        <th>
                                            Current Value
                                        </th>

                                        <th>
                                            P/L
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {safePortfolio.holdings.map(
                                        (holding) => {

                                            const holdingProfit =
                                                Number(
                                                    holding.profitLoss || 0
                                                );

                                            const isHoldingPositive =
                                                holdingProfit >= 0;

                                            return (
                                                <tr
                                                    key={
                                                        holding.stockId ||
                                                        holding.symbol
                                                    }
                                                >

                                                    <td>

                                                        <Link
                                                            to={`/stocks/${holding.symbol}`}
                                                            className="fw-bold"
                                                        >
                                                            {
                                                                holding.symbol
                                                            }
                                                        </Link>

                                                        <div className="text-muted small">
                                                            {
                                                                holding.name
                                                            }
                                                        </div>

                                                    </td>

                                                    <td>
                                                        {
                                                            holding.quantity
                                                        }
                                                    </td>

                                                    <td>
                                                        $
                                                        {Number(
                                                            holding.averageBuyPrice ||
                                                            0
                                                        ).toFixed(2)}
                                                    </td>

                                                    <td>
                                                        $
                                                        {Number(
                                                            holding.currentPrice ||
                                                            0
                                                        ).toFixed(2)}
                                                    </td>

                                                    <td>
                                                        $
                                                        {Number(
                                                            holding.investedValue ||
                                                            0
                                                        ).toFixed(2)}
                                                    </td>

                                                    <td>
                                                        $
                                                        {Number(
                                                            holding.currentValue ||
                                                            0
                                                        ).toFixed(2)}
                                                    </td>

                                                    <td
                                                        className={
                                                            isHoldingPositive
                                                                ? "text-success fw-bold"
                                                                : "text-danger fw-bold"
                                                        }
                                                    >
                                                        {isHoldingPositive
                                                            ? "+"
                                                            : ""}
                                                        $
                                                        {holdingProfit.toFixed(
                                                            2
                                                        )}
                                                    </td>

                                                </tr>
                                            );
                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

            {/* Transactions */}

            <div className="card shadow-sm">

                <div className="card-body">

                    <h2 className="h4 mb-3">
                        Transaction History
                    </h2>

                    {transactions.length === 0 ? (

                        <div className="alert alert-info mb-0">
                            No transactions yet.
                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-hover align-middle">

                                <thead>

                                    <tr>

                                        <th>
                                            Date
                                        </th>

                                        <th>
                                            Stock
                                        </th>

                                        <th>
                                            Type
                                        </th>

                                        <th>
                                            Quantity
                                        </th>

                                        <th>
                                            Price
                                        </th>

                                        <th>
                                            Total
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {transactions.map(
                                        (transaction) => {

                                            const isBuy =
                                                transaction.type ===
                                                "BUY";

                                            return (
                                                <tr
                                                    key={
                                                        transaction._id
                                                    }
                                                >

                                                    <td>
                                                        {new Date(
                                                            transaction.timestamp
                                                        ).toLocaleString()}
                                                    </td>

                                                    <td>

                                                        <strong>
                                                            {
                                                                transaction
                                                                    .stockId
                                                                    ?.symbol ||
                                                                "Unknown"
                                                            }
                                                        </strong>

                                                        <div className="text-muted small">
                                                            {
                                                                transaction
                                                                    .stockId
                                                                    ?.name ||
                                                                ""
                                                            }
                                                        </div>

                                                    </td>

                                                    <td>

                                                        <span
                                                            className={
                                                                isBuy
                                                                    ? "badge bg-success"
                                                                    : "badge bg-danger"
                                                            }
                                                        >
                                                            {
                                                                transaction.type
                                                            }
                                                        </span>

                                                    </td>

                                                    <td>
                                                        {
                                                            transaction.quantity
                                                        }
                                                    </td>

                                                    <td>
                                                        $
                                                        {Number(
                                                            transaction.price ||
                                                            0
                                                        ).toFixed(2)}
                                                    </td>

                                                    <td>
                                                        $
                                                        {Number(
                                                            transaction.total ||
                                                            0
                                                        ).toFixed(2)}
                                                    </td>

                                                </tr>
                                            );
                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default Portfolio;