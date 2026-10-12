import {
    useState
} from "react";

import {
    Link,
    Navigate,
    useNavigate
} from "react-router-dom";

import api from "../services/api";

import {
    useAuth
} from "../context/AuthContext";

import {
    useCart
} from "../context/CartContext";

function Checkout() {
    const {
        user
    } = useAuth();

    const {
        cartItems,
        getCartTotal,
        clearCart
    } = useCart();

    const navigate =
        useNavigate();

    const [
        address,
        setAddress
    ] = useState("");

    const [
        placingOrder,
        setPlacingOrder
    ] = useState(false);

    const [
        error,
        setError
    ] = useState("");

    const total =
        getCartTotal();

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="container py-5">

                <div className="text-center">

                    <h1>
                        Checkout
                    </h1>

                    <div className="alert alert-info mt-4">
                        Your cart is empty.
                    </div>

                    <Link
                        to="/products"
                        className="btn btn-primary"
                    >
                        Continue Shopping
                    </Link>

                </div>

            </div>
        );
    }

    const handlePlaceOrder = async (
        event
    ) => {
        event.preventDefault();

        setError("");

        if (!address.trim()) {
            setError(
                "Please enter your delivery address."
            );

            return;
        }

        try {
            setPlacingOrder(true);

            const orderItems =
                cartItems.map(
                    (item) => ({
                        productId:
                            item.productId,

                        quantity:
                            item.quantity
                    })
                );

            const response =
                await api.post(
                    "/orders",
                    {
                        items:
                            orderItems,

                        address:
                            address.trim()
                    }
                );

            const order =
                response.data.order;

            clearCart();

            navigate(
                `/order-confirmation/${order._id}`,
                {
                    state: {
                        order
                    }
                }
            );
        } catch (error) {
            console.error(
                "Checkout error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to place your order."
            );
        } finally {
            setPlacingOrder(false);
        }
    };

    return (
        <div className="container py-5">

            <div className="mb-4">

                <Link
                    to="/cart"
                    className="btn btn-outline-secondary"
                >
                    ← Back to Cart
                </Link>

            </div>

            <h1 className="mb-4">
                Checkout
            </h1>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <div className="row">

                <div className="col-lg-7 mb-4">

                    <div className="card shadow-sm">

                        <div className="card-body">

                            <h2 className="h4 mb-4">
                                Delivery Information
                            </h2>

                            <form
                                onSubmit={
                                    handlePlaceOrder
                                }
                            >

                                <div className="mb-4">

                                    <label
                                        htmlFor="customerName"
                                        className="form-label"
                                    >
                                        Customer Name
                                    </label>

                                    <input
                                        id="customerName"
                                        type="text"
                                        className="form-control"
                                        value={
                                            user.name
                                        }
                                        disabled
                                    />

                                </div>

                                <div className="mb-4">

                                    <label
                                        htmlFor="customerEmail"
                                        className="form-label"
                                    >
                                        Email
                                    </label>

                                    <input
                                        id="customerEmail"
                                        type="email"
                                        className="form-control"
                                        value={
                                            user.email
                                        }
                                        disabled
                                    />

                                </div>

                                <div className="mb-4">

                                    <label
                                        htmlFor="address"
                                        className="form-label"
                                    >
                                        Delivery Address
                                    </label>

                                    <textarea
                                        id="address"
                                        className="form-control"
                                        rows="5"
                                        placeholder="Enter your complete delivery address..."
                                        value={
                                            address
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setAddress(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        required
                                    />

                                </div>

                                <div className="alert alert-secondary">

                                    <strong>
                                        Payment:
                                    </strong>{" "}

                                    This project currently
                                    uses simulated checkout.
                                    No real payment is charged.

                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-success btn-lg w-100"
                                    disabled={
                                        placingOrder
                                    }
                                >
                                    {placingOrder
                                        ? "Placing Order..."
                                        : "Place Order"}
                                </button>

                            </form>

                        </div>

                    </div>

                </div>

                <div className="col-lg-5">

                    <div className="card shadow-sm">

                        <div className="card-body">

                            <h2 className="h4 mb-4">
                                Order Summary
                            </h2>

                            {cartItems.map(
                                (item) => (
                                    <div
                                        className="d-flex justify-content-between border-bottom pb-3 mb-3"
                                        key={
                                            item.productId
                                        }
                                    >

                                        <div>

                                            <strong>
                                                {
                                                    item.title
                                                }
                                            </strong>

                                            <div className="text-muted small">
                                                Quantity:{" "}
                                                {
                                                    item.quantity
                                                }
                                            </div>

                                        </div>

                                        <span>
                                            ₹
                                            {(
                                                item.price *
                                                item.quantity
                                            ).toFixed(
                                                2
                                            )}
                                        </span>

                                    </div>
                                )
                            )}

                            <div className="d-flex justify-content-between">

                                <strong>
                                    Total
                                </strong>

                                <strong>
                                    ₹
                                    {total.toFixed(
                                        2
                                    )}
                                </strong>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Checkout;