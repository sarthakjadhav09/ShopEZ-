import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useParams
} from "react-router-dom";

import api from "../services/api";

function OrderDetails() {
    const {
        id
    } = useParams();

    const [
        order,
        setOrder
    ] = useState(null);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await api.get(
                        `/orders/${id}`
                    );

                setOrder(
                    response.data.order
                );
            } catch (error) {
                console.error(
                    "Order details error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load order."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

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
                    Loading order...
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
                    to="/dashboard"
                    className="btn btn-primary"
                >
                    Back to Dashboard
                </Link>

            </div>
        );
    }

    if (!order) {
        return (
            <div className="container py-5">

                <div className="alert alert-warning">
                    Order not found.
                </div>

                <Link
                    to="/dashboard"
                    className="btn btn-primary"
                >
                    Back to Dashboard
                </Link>

            </div>
        );
    }

    return (
        <div className="container py-5">

            <div className="mb-4">

                <Link
                    to="/dashboard"
                    className="btn btn-outline-secondary"
                >
                    ← Back to Orders
                </Link>

            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h1>
                        Order Details
                    </h1>

                    <p className="text-muted mb-0">
                        Order #{order._id}
                    </p>

                </div>

                <span className="badge bg-success fs-6">
                    {order.status}
                </span>

            </div>

            <div className="row">

                <div className="col-lg-8 mb-4">

                    <div className="card shadow-sm">

                        <div className="card-body">

                            <h2 className="h4 mb-4">
                                Ordered Products
                            </h2>

                            {order.items?.map(
                                (item) => (
                                    <div
                                        className="d-flex justify-content-between border-bottom pb-3 mb-3"
                                        key={
                                            item.productId?._id ||
                                            item.productId
                                        }
                                    >

                                        <div>

                                            <strong>
                                                {
                                                    item.title
                                                }
                                            </strong>

                                            <div className="text-muted">
                                                Quantity:{" "}
                                                {
                                                    item.quantity
                                                }
                                            </div>

                                        </div>

                                        <div>
                                            ₹
                                            {Number(
                                                item.price *
                                                item.quantity
                                            ).toFixed(
                                                2
                                            )}
                                        </div>

                                    </div>
                                )
                            )}

                            <div className="d-flex justify-content-between">

                                <strong>
                                    Order Total
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

                        </div>

                    </div>

                </div>

                <div className="col-lg-4">

                    <div className="card shadow-sm mb-4">

                        <div className="card-body">

                            <h2 className="h5">
                                Delivery Address
                            </h2>

                            <p className="text-muted">
                                {
                                    order.address
                                }
                            </p>

                        </div>

                    </div>

                    <div className="card shadow-sm">

                        <div className="card-body">

                            <h2 className="h5">
                                Order Information
                            </h2>

                            <p className="mb-2">

                                <strong>
                                    Status:
                                </strong>{" "}

                                {order.status}

                            </p>

                            <p className="mb-2">

                                <strong>
                                    Payment:
                                </strong>{" "}

                                {order.paymentStatus}

                            </p>

                            <p className="mb-0">

                                <strong>
                                    Date:
                                </strong>{" "}

                                {new Date(
                                    order.createdAt
                                ).toLocaleString()}

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default OrderDetails;