import {
    Link
} from "react-router-dom";

import {
    useCart
} from "../context/CartContext";

function Cart() {
    const {
        cartItems,
        updateQuantity,
        removeFromCart,
        getCartTotal
    } = useCart();

    const total =
        getCartTotal();

    if (cartItems.length === 0) {
        return (
            <div className="container py-5">

                <div className="text-center">

                    <h1>
                        Your Cart
                    </h1>

                    <div className="alert alert-info mt-4">
                        Your shopping cart is empty.
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

    return (
        <div className="container py-5">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h1>
                        Your Cart
                    </h1>

                    <p className="text-muted mb-0">
                        Review your selected products.
                    </p>
                </div>

                <Link
                    to="/products"
                    className="btn btn-outline-primary"
                >
                    Continue Shopping
                </Link>

            </div>

            <div className="row">

                <div className="col-lg-8">

                    {cartItems.map(
                        (item) => {

                            const itemTotal =
                                item.price *
                                item.quantity;

                            return (
                                <div
                                    className="card shadow-sm mb-3"
                                    key={
                                        item.productId
                                    }
                                >

                                    <div className="card-body">

                                        <div className="row align-items-center">

                                            <div className="col-md-2 mb-3 mb-md-0">

                                                {item.image ? (
                                                    <img
                                                        src={
                                                            item.image
                                                        }
                                                        alt={
                                                            item.title
                                                        }
                                                        className="img-fluid rounded"
                                                        style={{
                                                            height:
                                                                "100px",
                                                            width:
                                                                "100%",
                                                            objectFit:
                                                                "cover"
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        className="bg-light d-flex align-items-center justify-content-center rounded"
                                                        style={{
                                                            height:
                                                                "100px"
                                                        }}
                                                    >
                                                        No Image
                                                    </div>
                                                )}

                                            </div>

                                            <div className="col-md-4">

                                                <h5>
                                                    {
                                                        item.title
                                                    }
                                                </h5>

                                                <p className="text-muted mb-0">
                                                    ₹
                                                    {Number(
                                                        item.price
                                                    ).toFixed(
                                                        2
                                                    )}{" "}
                                                    each
                                                </p>

                                            </div>

                                            <div className="col-md-2">

                                                <label className="form-label small">
                                                    Quantity
                                                </label>

                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={
                                                        item.stock
                                                    }
                                                    className="form-control"
                                                    value={
                                                        item.quantity
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateQuantity(
                                                            item.productId,
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                />

                                            </div>

                                            <div className="col-md-2 mt-3 mt-md-0">

                                                <strong>
                                                    ₹
                                                    {itemTotal.toFixed(
                                                        2
                                                    )}
                                                </strong>

                                            </div>

                                            <div className="col-md-2 mt-3 mt-md-0">

                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() =>
                                                        removeFromCart(
                                                            item.productId
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                </div>
                            );
                        }
                    )}

                </div>

                <div className="col-lg-4">

                    <div className="card shadow-sm">

                        <div className="card-body">

                            <h2 className="h4">
                                Order Summary
                            </h2>

                            <hr />

                            <div className="d-flex justify-content-between mb-2">

                                <span>
                                    Items
                                </span>

                                <span>
                                    {
                                        cartItems.reduce(
                                            (
                                                count,
                                                item
                                            ) =>
                                                count +
                                                item.quantity,
                                            0
                                        )
                                    }
                                </span>

                            </div>

                            <div className="d-flex justify-content-between mb-3">

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

                            <Link
                                to="/checkout"
                                className="btn btn-primary w-100"
                            >
                                Proceed to Checkout
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Cart;