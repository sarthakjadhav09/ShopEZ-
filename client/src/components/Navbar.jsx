import {
    Link,
    NavLink
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext";

function Navbar() {
    const {
        user,
        logout
    } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
            <div className="container">

                <Link
                    className="navbar-brand fw-bold"
                    to="/"
                >
                    ShopEZ
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="collapse navbar-collapse"
                    id="navbarContent"
                >

                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/"
                            >
                                Home
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/market"
                            >
                                Market
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/products"
                            >
                                Products
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/cart"
                            >
                                Cart
                            </NavLink>
                        </li>

                        {user && (
                            <li className="nav-item">
                                <NavLink
                                    className="nav-link"
                                    to="/portfolio"
                                >
                                    Portfolio
                                </NavLink>
                            </li>
                        )}

                        {user && (
                            <li className="nav-item">
                                <NavLink
                                    className="nav-link"
                                    to="/dashboard"
                                >
                                    Dashboard
                                </NavLink>
                            </li>
                        )}

                        {user?.role === "ADMIN" && (
                            <li className="nav-item">
                                <NavLink
                                    className="nav-link"
                                    to="/admin"
                                >
                                    Admin
                                </NavLink>
                            </li>
                        )}

                    </ul>

                    <div className="d-flex align-items-center">

                        {user ? (
                            <>
                                <span className="text-white me-3">
                                    Hi, {user.name}
                                </span>

                                {user.role === "ADMIN" && (
                                    <span className="badge bg-danger me-3">
                                        ADMIN
                                    </span>
                                )}

                                <button
                                    className="btn btn-outline-light btn-sm"
                                    onClick={logout}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    className="btn btn-outline-light btn-sm me-2"
                                    to="/login"
                                >
                                    Login
                                </Link>

                                <Link
                                    className="btn btn-primary btn-sm"
                                    to="/register"
                                >
                                    Register
                                </Link>
                            </>
                        )}

                    </div>

                </div>

            </div>
        </nav>
    );
}

export default Navbar;