import { Link } from "react-router-dom";

function StockCard({ stock }) {
    const change =
        Number(stock.dailyStats?.change || 0);

    const changePercent =
        Number(
            stock.dailyStats?.changePercent || 0
        );

    const isPositive = change >= 0;

    return (
        <div className="stock-card">

            <div className="stock-card-header">

                <div>
                    <div className="stock-symbol">
                        {stock.symbol}
                    </div>

                    <div className="stock-name">
                        {stock.name}
                    </div>
                </div>

                <span
                    className={
                        isPositive
                            ? "stock-change-badge positive"
                            : "stock-change-badge negative"
                    }
                >
                    {isPositive ? "↑" : "↓"}{" "}
                    {Math.abs(changePercent).toFixed(2)}%
                </span>

            </div>

            <div className="stock-price">
                ${Number(stock.price).toFixed(2)}
            </div>

            <div
                className={
                    isPositive
                        ? "stock-change positive-text"
                        : "stock-change negative-text"
                }
            >
                {isPositive ? "+" : ""}
                {change.toFixed(2)}
            </div>

            <Link
                to={`/stocks/${stock.symbol}`}
                className="stock-details-button"
            >
                View Details
            </Link>

        </div>
    );
}

export default StockCard;