import {
    Link
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext";

function Home() {
    const {
        user
    } = useAuth();

    return (
        <div>

            <section className="bg-dark text-white py-5">
                <div className="container py-5">

                    <div className="row align-items-center">

                        <div className="col-lg-7">

                            <h1 className="display-4 fw-bold">
                                Welcome to ShopEZ
                            </h1>

                            <p className="lead mt-3">
                                Explore stocks, monitor
                                market trends, execute
                                virtual trades, and manage
                                your investment portfolio.
                            </p>

                            <div className="mt-4">

                                <Link
                                    to="/market"
                                    className="btn btn-primary btn-lg me-2"
                                >
                                    Explore Market
                                </Link>

                                {!user && (
                                    <Link
                                        to="/register"
                                        className="btn btn-outline-light btn-lg"
                                    >
                                        Create Account
                                    </Link>
                                )}

                            </div>

                        </div>

                    </div>

                </div>
            </section>

            <section className="py-5">

                <div className="container">

                    <h2 className="text-center mb-5">
                        ShopEZ Features
                    </h2>

                    <div className="row">

                        <div className="col-md-4 mb-4">

                            <div className="card h-100 shadow-sm">
                                <div className="card-body">

                                    <h3 className="h5">
                                        Market Dashboard
                                    </h3>

                                    <p className="text-muted">
                                        Explore available
                                        stocks and monitor
                                        their current prices
                                        and daily changes.
                                    </p>

                                </div>
                            </div>

                        </div>

                        <div className="col-md-4 mb-4">

                            <div className="card h-100 shadow-sm">
                                <div className="card-body">

                                    <h3 className="h5">
                                        Virtual Trading
                                    </h3>

                                    <p className="text-muted">
                                        Buy and sell stocks
                                        using your virtual
                                        trading balance.
                                    </p>

                                </div>
                            </div>

                        </div>

                        <div className="col-md-4 mb-4">

                            <div className="card h-100 shadow-sm">
                                <div className="card-body">

                                    <h3 className="h5">
                                        Portfolio Tracking
                                    </h3>

                                    <p className="text-muted">
                                        Track your holdings,
                                        investment value,
                                        and profit or loss.
                                    </p>

                                </div>
                            </div>

                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default Home;