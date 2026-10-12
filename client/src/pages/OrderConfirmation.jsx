import {
    Link,
    useLocation,
    useParams
} from "react-router-dom";

function OrderConfirmation() {
    const {
        id
    } = useParams();

    const location =
        useLocation();

    const order =
        location.state?.order;

    return (
        <div className="container py-5">

            <div className="row justify-content-center">

                <div className="col-lg-8">

                    <div className="card shadow-sm">

                        <div className="card-body text-center p-5">

                            <div
                                className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center mb-4"
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    fontSize: "40px"
                                }}
                            >
                                ✓
                            </div>

                            <h1>
                                Order Confirmed!
                            </h1>

                            <p className="lead text-muted">
                                Thank you for shopping
                                with ShopEZ.
                            </p>

                            <div className="alert alert-success text-start mt-4">

                                <strong>
                                    Order ID:
                                </strong>

                                <br />

                                {id}

                            </div>

                            {order && (
                                <div className="text-start mt-4">

                                    <h2 className="h5">
                                        Order Details
                                    </h2>

                                    <hr />

                                    {order.items?.map(
                                        (item) => (
                                            <div
                                                className="d-flex justify-content-between mb-2"
                                                key={
                                                    item.productId
                                                }
                                            >

                                                <span>
                                                    {
                                                        item.title
                                                    }{" "}
                                                    ×{" "}
                                                    {
                                                        item.quantity
                                                    }
                                                </span>

                                                <span>
                                                    ₹
                                                    {Number(
                                                        item.price *
                                                        item.quantity
                                                    ).toFixed(
                                                        2
                                                    )}
                                                </span>

                                            </div>
                                        )
                                    )}

                                    <hr />

                                    <div className="d-flex justify-content-between">

                                        <strong>
                                            Total
                                        </strong>

                                        <strong>
                                            ₹
                                            {Number(
                                                order.total
                                            ).toFixed(
                                                2
                                            )}
                                        </strong>

                                    </div>

                                    <div className="mt-4">

                                        <strong>
                                            Delivery Address
                                        </strong>

                                        <p className="text-muted mb-0">
                                            {
                                                order.address
                                            }
                                        </p>

                                    </div>

                                </div>
                            )}

                            <div className="d-flex justify-content-center gap-2 mt-5">

                                <Link
                                    to="/products"
                                    className="btn btn-primary"
                                >
                                    Continue Shopping
                                </Link>

                                <Link
                                    to="/dashboard"
                                    className="btn btn-outline-secondary"
                                >
                                    View My Orders
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default OrderConfirmation;