const Portfolio = require("../models/Portfolio");

// Get My Portfolio
const getMyPortfolio = async (
    req,
    res,
    next
) => {
    try {
        const portfolio =
            await Portfolio.findOne({
                userId: req.user.id
            }).populate(
                "holdings.stockId",
                "symbol name price dailyStats"
            );

        if (!portfolio) {
            return res.status(200).json({
                success: true,
                message:
                    "Portfolio has not been created yet",
                portfolio: {
                    balance: 100000,
                    holdings: [],
                    totalInvested: 0,
                    totalPortfolioValue: 0,
                    realizedProfitLoss: 0,
                    profitLoss: 0
                }
            });
        }

        let totalPortfolioValue = 0;

        const holdings =
            portfolio.holdings.map(
                (holding) => {
                    const currentPrice =
                        holding.stockId?.price ||
                        holding.averageBuyPrice;

                    const currentValue =
                        holding.quantity *
                        currentPrice;

                    const investedValue =
                        holding.quantity *
                        holding.averageBuyPrice;

                    const profitLoss =
                        currentValue -
                        investedValue;

                    totalPortfolioValue +=
                        currentValue;

                    return {
                        stockId:
                            holding.stockId?._id,

                        symbol:
                            holding.stockId?.symbol ||
                            holding.symbol,

                        name:
                            holding.stockId?.name ||
                            "",

                        quantity:
                            holding.quantity,

                        averageBuyPrice:
                            holding.averageBuyPrice,

                        currentPrice,

                        investedValue,

                        currentValue,

                        profitLoss
                    };
                }
            );

        const unrealizedProfitLoss =
            totalPortfolioValue -
            portfolio.totalInvested;

        const totalProfitLoss =
            unrealizedProfitLoss +
            portfolio.realizedProfitLoss;

        res.status(200).json({
            success: true,

            portfolio: {
                id: portfolio._id,

                balance:
                    portfolio.balance,

                holdings,

                totalInvested:
                    portfolio.totalInvested,

                totalPortfolioValue:
                    Number(
                        totalPortfolioValue.toFixed(2)
                    ),

                realizedProfitLoss:
                    portfolio.realizedProfitLoss,

                profitLoss:
                    Number(
                        totalProfitLoss.toFixed(2)
                    )
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get Portfolio Summary
const getPortfolioSummary = async (
    req,
    res,
    next
) => {
    try {
        const portfolio =
            await Portfolio.findOne({
                userId: req.user.id
            }).populate(
                "holdings.stockId",
                "symbol name price"
            );

        if (!portfolio) {
            return res.status(200).json({
                success: true,

                summary: {
                    balance: 100000,
                    invested: 0,
                    portfolioValue: 0,
                    totalValue: 100000,
                    realizedProfitLoss: 0,
                    profitLoss: 0,
                    holdingsCount: 0
                }
            });
        }

        let portfolioValue = 0;

        portfolio.holdings.forEach(
            (holding) => {
                const currentPrice =
                    holding.stockId?.price ||
                    holding.averageBuyPrice;

                portfolioValue +=
                    holding.quantity *
                    currentPrice;
            }
        );

        const unrealizedProfitLoss =
            portfolioValue -
            portfolio.totalInvested;

        const profitLoss =
            unrealizedProfitLoss +
            portfolio.realizedProfitLoss;

        const totalValue =
            portfolio.balance +
            portfolioValue;

        res.status(200).json({
            success: true,

            summary: {
                balance:
                    portfolio.balance,

                invested:
                    portfolio.totalInvested,

                portfolioValue,

                totalValue,

                realizedProfitLoss:
                    portfolio.realizedProfitLoss,

                profitLoss,

                holdingsCount:
                    portfolio.holdings.length
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMyPortfolio,
    getPortfolioSummary
};