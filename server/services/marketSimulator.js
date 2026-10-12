const Stock = require("../models/Stock");

const UPDATE_INTERVAL = 10000;
const MAX_HISTORY_POINTS = 30;

const getRandomChangePercent = () => {
    const movement =
        (Math.random() * 2 - 1) * 1.5;

    return movement;
};

const updateStockPrices = async () => {
    try {
        const stocks = await Stock.find();

        if (stocks.length === 0) {
            return;
        }

        for (const stock of stocks) {
            const oldPrice = stock.price;

            const changePercent =
                getRandomChangePercent();

            let newPrice =
                oldPrice *
                (1 + changePercent / 100);

            newPrice = Math.max(
                1,
                Number(newPrice.toFixed(2))
            );

            const actualChange =
                newPrice - oldPrice;

            const actualChangePercent =
                oldPrice > 0
                    ? (actualChange / oldPrice) * 100
                    : 0;

            const currentHigh =
                stock.dailyStats?.high || oldPrice;

            const currentLow =
                stock.dailyStats?.low || oldPrice;

            const currentVolume =
                stock.dailyStats?.volume || 0;

            stock.price = newPrice;

            stock.dailyStats = {
                change:
                    Number(
                        actualChange.toFixed(2)
                    ),

                changePercent:
                    Number(
                        actualChangePercent.toFixed(2)
                    ),

                high:
                    Number(
                        Math.max(
                            currentHigh,
                            newPrice
                        ).toFixed(2)
                    ),

                low:
                    Number(
                        Math.min(
                            currentLow,
                            newPrice
                        ).toFixed(2)
                    ),

                volume:
                    currentVolume +
                    Math.floor(
                        Math.random() * 10000
                    )
            };

            stock.historicalData.push({
                date: new Date(),

                open:
                    Number(
                        oldPrice.toFixed(2)
                    ),

                high:
                    Number(
                        Math.max(
                            oldPrice,
                            newPrice
                        ).toFixed(2)
                    ),

                low:
                    Number(
                        Math.min(
                            oldPrice,
                            newPrice
                        ).toFixed(2)
                    ),

                close:
                    Number(
                        newPrice.toFixed(2)
                    ),

                volume:
                    Math.floor(
                        Math.random() * 10000
                    )
            });

            if (
                stock.historicalData.length >
                MAX_HISTORY_POINTS
            ) {
                stock.historicalData =
                    stock.historicalData.slice(
                        -MAX_HISTORY_POINTS
                    );
            }

            await stock.save();
        }

        console.log(
            `Market simulation updated ${stocks.length} stock(s)`
        );
    } catch (error) {
        console.error(
            "Market simulation update failed:",
            error.message
        );
    }
};

const startMarketSimulator = () => {
    console.log(
        "Market simulator started."
    );

    setInterval(
        updateStockPrices,
        UPDATE_INTERVAL
    );
};

module.exports = {
    startMarketSimulator
};