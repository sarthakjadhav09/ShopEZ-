import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import api from "../services/api";

import {
    useAuth
} from "../context/AuthContext";

function Dashboard() {
    const {
        user
    } = useAuth();

    const [
        orders,
        setOrders
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
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await api.get(
                        "/orders/my-orders"
                    );

                setOrders(
                    response.data.orders || []
                );
            } catch (error) {
                console.error(
                    "Orders error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load your orders."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusClass = (
        status
    ) => {
        switch (status) {
            case "DELIVERED":
                return "bg-success";

            case "CANCELLED":
                return "bg-danger";

            case "SHIPPED":
                return "bg-primary";

            case "PROCESSING":
                return "bg-info";

            case "CONFIRMED":
                return "bg-success";

            default:
                return "bg-secondary";
        }
    };

    const getPaymentClass = (
        status
    ) => {
        switch (status) {
            case "PAID":
                return "bg-success";

            case "FAILED":
                return "bg-danger";

            case "REFUNDED":
                return "bg-warning text-dark";

            default:
                return "bg-secondary";
        }
    };

    return (
        <div className="container py-5">

            <div className="mb-5">

                <h1>
                    My Dashboard
                </h1>

                <p className="text-muted">
                    Welcome back, {user?.name}.
                </p>

            </div>

            <div className="row mb-5">

                <div className="col-md-4 mb-3">

                    <div className="card shadow-sm h-100">

                        <div className="card-body">

                            <p className="text-muted mb-1">
                                Account
                            </p>

                            <h4>
                                {user?.name}
                            </h4>

                            <p className="mb-0">
                                {user?.email}
                            </p>

                        </div>

                    </div>

                </div>

                <div className="col-md-4 mb-3">

                    <div className="card shadow-sm h-100">

                        <div className="card-body">

                            <p className="text-muted mb-1">
                                Orders
                            </p>

                            <h4>
                                {orders.length}
                            </h4>

                        </div>

                    </div>

                </div>

                <div className="col-md-4 mb-3">

                    <div className="card shadow-sm h-100">

                        <div className="card-body">

                            <p className="text-muted mb-1">
                                Shopping
                            </p>

                            <Link
                                to="/products"
                                className="btn btn-primary"
                            >
                                Browse Products
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

            <div className="card shadow-sm">

                <div className="card-body">

                    <div className="d-flex justify-content-between align-items-center mb-4">

                        <div>
                            <h2 className="h4 mb-1">
                                My Orders
                            </h2>

                            <p className="text-muted mb-0">
                                View your recent ShopEZ orders.
                            </p>
                        </div>

                        <Link
                            to="/products"
                            className="btn btn-outline-primary"
                        >
                            Continue Shopping
                        </Link>

                    </div>

                    {loading && (
                        <div className="text-center py-5">

                            <div
                                className="spinner-border"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </div>

                            <p className="mt-3">
                                Loading your orders...
                            </p>

                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        orders.length === 0 && (
                            <div className="alert alert-info">

                                You have not placed any
                                orders yet.

                                <div className="mt-3">

                                    <Link
                                        to="/products"
                                        className="btn btn-primary"
                                    >
                                        Start Shopping
                                    </Link>

                                </div>

                            </div>
                        )}

                    {!loading &&
                        !error &&
                        orders.length > 0 && (

                            <div className="table-responsive">

                                <table className="table table-hover align-middle">

                                    <thead>

                                        <tr>

                                            <th>
                                                Order
                                            </th>

                                            <th>
                                                Date
                                            </th>

                                            <th>
                                                Items
                                            </th>

                                            <th>
                                                Total
                                            </th>

                                            <th>
                                                Payment
                                            </th>

                                            <th>
                                                Status
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {orders.map(
                                            (
                                                order
                                            ) => (
                                                <tr
                                                    key={
                                                        order._id
                                                    }
                                                >

                                                    <td>

                                                        <Link
                                                            to={`/orders/${order._id}`}
                                                            className="fw-bold"
                                                        >
                                                            #
                                                            {order._id.slice(
                                                                -8
                                                            )}
                                                        </Link>

                                                    </td>

                                                    <td>
                                                        {new Date(
                                                            order.createdAt
                                                        ).toLocaleDateString()}
                                                    </td>

                                                    <td>
                                                        {
                                                            order.items
                                                                ?.length ||
                                                            0
                                                        }
                                                    </td>

                                                    <td>
                                                        ₹
                                                        {Number(
                                                            order.total ||
                                                            0
                                                        ).toFixed(
                                                            2
                                                        )}
                                                    </td>

                                                    <td>

                                                        <span
                                                            className={`badge ${getPaymentClass(
                                                                order.paymentStatus
                                                            )}`}
                                                        >
                                                            {
                                                                order.paymentStatus
                                                            }
                                                        </span>

                                                    </td>

                                                    <td>

                                                        <span
                                                            className={`badge ${getStatusClass(
                                                                order.status
                                                            )}`}
                                                        >
                                                            {
                                                                order.status
                                                            }
                                                        </span>

                                                    </td>

                                                </tr>
                                            )
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

export default Dashboard;