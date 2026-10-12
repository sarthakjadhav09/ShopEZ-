import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import api from "../services/api";

function AdminDashboard() {
    const [
        overview,
        setOverview
    ] = useState(null);

    const [
        users,
        setUsers
    ] = useState([]);

    const [
        products,
        setProducts
    ] = useState([]);

    const [
        stocks,
        setStocks
    ] = useState([]);

    const [
        editingStockId,
        setEditingStockId
        ] = useState(null);

    const [
        stockForm,
        setStockForm
        ] = useState({
        symbol: "",
        name: "",
        price: "",
        change: 0,
        changePercent: 0,
        high: "",
        low: "",
        volume: 0
    });

    const [
        stockSaving,
        setStockSaving
    ] = useState(false);

    const [
        stockMessage,
        setStockMessage
    ] = useState("");

    const [
        stockError,
        setStockError
    ] = useState("");

    const [
        orders,
        setOrders
    ] = useState([]);

    const [
        transactions,
        setTransactions
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState("");

    // Product form
    const [
        editingProductId,
        setEditingProductId
    ] = useState(null);

    const [
        productForm,
        setProductForm
    ] = useState({
        title: "",
        description: "",
        category: "",
        price: "",
        discount: 0,
        stock: 0,
        image: ""
    });

    const [
        productSaving,
        setProductSaving
    ] = useState(false);

    const [
        productMessage,
        setProductMessage
    ] = useState("");

    const [
        productError,
        setProductError
    ] = useState("");

    const loadAdminData =
        async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    overviewResponse,
                    usersResponse,
                    productsResponse,
                    stocksResponse,
                    ordersResponse,
                    transactionsResponse
                ] = await Promise.all([
                    api.get(
                        "/admin/overview"
                    ),
                    api.get(
                        "/admin/users"
                    ),
                    api.get(
                        "/products"
                    ),
                    api.get(
                        "/stocks/admin/all"
                    ),
                    api.get(
                        "/admin/orders"
                    ),
                    api.get(
                        "/admin/transactions"
                    )
                ]);

                setOverview(
                    overviewResponse.data.overview
                );

                setUsers(
                    usersResponse.data.users ||
                        []
                );

                setProducts(
                    productsResponse.data.products ||
                        []
                );

                setStocks(
                    stocksResponse.data.stocks ||
                        []
                );

                setOrders(
                    ordersResponse.data.orders ||
                        []
                );

                setTransactions(
                    transactionsResponse.data.transactions ||
                        []
                );
            } catch (error) {
                console.error(
                    "Could not load admin data:",
                    error
                );

                setError(
                    error.response?.data
                        ?.message ||
                    "Unable to load admin dashboard."
                );
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        loadAdminData();
    }, []);

    const handleProductChange =
        (event) => {
            const {
                name,
                value
            } = event.target;

            setProductForm(
                (currentForm) => ({
                    ...currentForm,
                    [name]: value
                })
            );
        };

    const handleStockChange =
    (event) => {
        const {
            name,
            value
        } = event.target;

        setStockForm(
            (currentForm) => ({
                ...currentForm,
                [name]: value
            })
        );
    };

const resetStockForm =
    () => {
        setEditingStockId(null);

        setStockForm({
            symbol: "",
            name: "",
            price: "",
            change: 0,
            changePercent: 0,
            high: "",
            low: "",
            volume: 0
        });

        setStockError("");
    };

const handleEditStock =
    (stock) => {
        setEditingStockId(
            stock._id
        );

        setStockForm({
            symbol:
                stock.symbol || "",
            name:
                stock.name || "",
            price:
                stock.price ?? "",
            change:
                stock.dailyStats?.change ??
                0,
            changePercent:
                stock.dailyStats
                    ?.changePercent ??
                0,
            high:
                stock.dailyStats?.high ??
                "",
            low:
                stock.dailyStats?.low ??
                "",
            volume:
                stock.dailyStats?.volume ??
                0
        });

        setStockMessage("");
        setStockError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

const handleSubmitStock =
    async (event) => {
        event.preventDefault();

        setStockError("");
        setStockMessage("");

        const symbol =
            stockForm.symbol
                .trim()
                .toUpperCase();

        const name =
            stockForm.name.trim();

        const price =
            Number(
                stockForm.price
            );

        const change =
            Number(
                stockForm.change
            );

        const changePercent =
            Number(
                stockForm.changePercent
            );

        const high =
            Number(
                stockForm.high
            );

        const low =
            Number(
                stockForm.low
            );

        const volume =
            Number(
                stockForm.volume
            );

        if (!symbol) {
            setStockError(
                "Stock symbol is required."
            );

            return;
        }

        if (!name) {
            setStockError(
                "Stock name is required."
            );

            return;
        }

        if (
            !Number.isFinite(price) ||
            price < 0
        ) {
            setStockError(
                "Price must be a valid non-negative number."
            );

            return;
        }

        if (
            !Number.isFinite(change)
        ) {
            setStockError(
                "Change must be a valid number."
            );

            return;
        }

        if (
            !Number.isFinite(
                changePercent
            )
        ) {
            setStockError(
                "Change percentage must be a valid number."
            );

            return;
        }

        if (
            !Number.isFinite(high) ||
            high < 0
        ) {
            setStockError(
                "High price must be a valid non-negative number."
            );

            return;
        }

        if (
            !Number.isFinite(low) ||
            low < 0
        ) {
            setStockError(
                "Low price must be a valid non-negative number."
            );

            return;
        }

        if (
            !Number.isInteger(
                volume
            ) ||
            volume < 0
        ) {
            setStockError(
                "Volume must be a non-negative whole number."
            );

            return;
        }

        if (
            low > high
        ) {
            setStockError(
                "Low price cannot be greater than high price."
            );

            return;
        }

        try {
            setStockSaving(true);

            const payload = {
                symbol,
                name,
                price,
                dailyStats: {
                    change,
                    changePercent,
                    high,
                    low,
                    volume
                }
            };

            if (
                editingStockId
            ) {
                const response =
                    await api.put(
                        `/stocks/${editingStockId}`,
                        payload
                    );

                setStockMessage(
                    response.data.message ||
                        "Stock updated successfully."
                );
            } else {
                const response =
                    await api.post(
                        "/stocks",
                        payload
                    );

                setStockMessage(
                    response.data.message ||
                        "Stock created successfully."
                );
            }

            resetStockForm();

            await loadAdminData();
        } catch (error) {
            console.error(
                "Could not save stock:",
                error
            );

            setStockError(
                error.response?.data
                    ?.message ||
                "Unable to save stock."
            );
        } finally {
            setStockSaving(
                false
            );
        }
    };

const handleDeleteStock =
    async (stock) => {
        const confirmed =
            window.confirm(
                `Are you sure you want to delete ${stock.symbol}?`
            );

        if (!confirmed) {
            return;
        }

        setStockError("");
        setStockMessage("");

        try {
            const response =
                await api.delete(
                    `/stocks/${stock._id}`
                );

            setStockMessage(
                response.data.message ||
                    "Stock deleted successfully."
            );

            await loadAdminData();
        } catch (error) {
            console.error(
                "Could not delete stock:",
                error
            );

            setStockError(
                error.response?.data
                    ?.message ||
                "Unable to delete stock."
            );
        }
    };

    const handleReactivateStock = async (
    stockId
) => {
    try {
        await api.put(
            `/stocks/${stockId}/reactivate`
        );

        await loadStocks();

        alert(
            "Stock reactivated successfully."
        );
    } catch (error) {
        console.error(
            "Could not reactivate stock:",
            error
        );

        alert(
            error.response?.data?.message ||
            "Could not reactivate stock."
        );
    }
};

    const resetProductForm =
        () => {
            setEditingProductId(
                null
            );

            setProductForm({
                title: "",
                description: "",
                category: "",
                price: "",
                discount: 0,
                stock: 0,
                image: ""
            });

            setProductError("");
        };

    const handleEditProduct =
        (product) => {
            setEditingProductId(
                product._id
            );

            setProductForm({
                title:
                    product.title ||
                    "",
                description:
                    product.description ||
                    "",
                category:
                    product.category ||
                    "",
                price:
                    product.price ??
                    "",
                discount:
                    product.discount ??
                    0,
                stock:
                    product.stock ??
                    0,
                image:
                    product.images?.[0] ||
                    ""
            });

            setProductMessage("");
            setProductError("");

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        };

    const handleSubmitProduct =
        async (event) => {
            event.preventDefault();

            setProductError("");
            setProductMessage("");

            const title =
                productForm.title.trim();

            const description =
                productForm.description.trim();

            const category =
                productForm.category.trim();

            const price =
                Number(
                    productForm.price
                );

            const discount =
                Number(
                    productForm.discount
                );

            const stock =
                Number(
                    productForm.stock
                );

            if (
                !title ||
                !description ||
                !category
            ) {
                setProductError(
                    "Title, description and category are required."
                );

                return;
            }

            if (
                !Number.isFinite(price) ||
                price < 0
            ) {
                setProductError(
                    "Price must be a valid non-negative number."
                );

                return;
            }

            if (
                !Number.isFinite(discount) ||
                discount < 0 ||
                discount > 100
            ) {
                setProductError(
                    "Discount must be between 0 and 100."
                );

                return;
            }

            if (
                !Number.isInteger(stock) ||
                stock < 0
            ) {
                setProductError(
                    "Stock must be a non-negative whole number."
                );

                return;
            }

            try {
                setProductSaving(true);

                const payload = {
                    title,
                    description,
                    category,
                    price,
                    discount,
                    stock,
                    images:
                        productForm.image.trim()
                            ? [
                                  productForm.image.trim()
                              ]
                            : []
                };

                if (
                    editingProductId
                ) {
                    const response =
                        await api.put(
                            `/products/${editingProductId}`,
                            payload
                        );

                    setProductMessage(
                        response.data.message ||
                            "Product updated successfully."
                    );
                } else {
                    const response =
                        await api.post(
                            "/products",
                            payload
                        );

                    setProductMessage(
                        response.data.message ||
                            "Product created successfully."
                    );
                }

                resetProductForm();

                await loadAdminData();
            } catch (error) {
                console.error(
                    "Could not save product:",
                    error
                );

                setProductError(
                    error.response?.data
                        ?.message ||
                    "Unable to save product."
                );
            } finally {
                setProductSaving(
                    false
                );
            }
        };

    const handleDeleteProduct =
        async (product) => {
            const confirmed =
                window.confirm(
                    `Are you sure you want to deactivate "${product.title}"?`
                );

            if (!confirmed) {
                return;
            }

            setProductError("");
            setProductMessage("");

            try {
                const response =
                    await api.delete(
                        `/products/${product._id}`
                    );

                setProductMessage(
                    response.data.message ||
                        "Product deactivated successfully."
                );

                await loadAdminData();
            } catch (error) {
                console.error(
                    "Could not delete product:",
                    error
                );

                setProductError(
                    error.response?.data
                        ?.message ||
                    "Unable to deactivate product."
                );
            }
        };

    const handleOrderStatusChange =
        async (
            orderId,
            status
        ) => {
            try {
                await api.put(
                    `/orders/${orderId}/status`,
                    {
                        status
                    }
                );

                await loadAdminData();
            } catch (error) {
                console.error(
                    "Could not update order:",
                    error
                );

                setError(
                    error.response?.data
                        ?.message ||
                    "Unable to update order status."
                );
            }
        };

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
                    Loading admin dashboard...
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
                    to="/"
                    className="btn btn-primary"
                >
                    Back Home
                </Link>

            </div>
        );
    }

    return (
        <div className="container py-5">

            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">

                <div>
                    <h1 className="fw-bold">
                        Admin Dashboard
                    </h1>

                    <p className="text-muted mb-0">
                        Manage ShopEZ users,
                        products, orders and
                        trading activity.
                    </p>
                </div>

            </div>

            {/* Overview */}

            <section className="mb-5">

                <h2 className="h4 fw-bold mb-3">
                    Overview
                </h2>

                <div className="row g-3">

                    {[
                        {
                            label: "Users",
                            value:
                                overview?.users ??
                                0
                        },
                        {
                            label: "Products",
                            value:
                                overview?.products ??
                                0
                        },
                        {
                            label: "Stocks",
                            value:
                                overview?.stocks ??
                                0
                        },
                        {
                            label: "Orders",
                            value:
                                overview?.orders ??
                                0
                        },
                        {
                            label: "Transactions",
                            value:
                                overview?.transactions ??
                                0
                        }
                    ].map(
                        (item) => (
                            <div
                                className="col-6 col-md-4 col-lg"
                                key={
                                    item.label
                                }
                            >

                                <div className="card shadow-sm h-100">

                                    <div className="card-body text-center">

                                        <div className="display-6 fw-bold">
                                            {
                                                item.value
                                            }
                                        </div>

                                        <div className="text-muted">
                                            {
                                                item.label
                                            }
                                        </div>

                                    </div>

                                </div>

                            </div>
                        )
                    )}

                </div>

            </section>

            {/* Product Management */}

            <section className="mb-5">

                <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">

                    <div>
                        <h2 className="h4 fw-bold mb-1">
                            Product Management
                        </h2>

                        <p className="text-muted mb-0">
                            Create and maintain
                            products available in
                            the ShopEZ catalog.
                        </p>
                    </div>

                    {editingProductId && (
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={
                                resetProductForm
                            }
                        >
                            Cancel Editing
                        </button>
                    )}

                </div>

                {productMessage && (
                    <div className="alert alert-success">
                        {productMessage}
                    </div>
                )}

                {productError && (
                    <div className="alert alert-danger">
                        {productError}
                    </div>
                )}

                {/* Product Form */}

                <div className="card shadow-sm mb-4">

                    <div className="card-body">

                        <h3 className="h5 fw-bold mb-3">

                            {editingProductId
                                ? "Edit Product"
                                : "Create Product"}

                        </h3>

                        <form
                            onSubmit={
                                handleSubmitProduct
                            }
                        >

                            <div className="row g-3">

                                <div className="col-md-6">

                                    <label
                                        htmlFor="title"
                                        className="form-label"
                                    >
                                        Product Title
                                    </label>

                                    <input
                                        id="title"
                                        name="title"
                                        type="text"
                                        className="form-control"
                                        value={
                                            productForm.title
                                        }
                                        onChange={
                                            handleProductChange
                                        }
                                        required
                                    />

                                </div>

                                <div className="col-md-6">

                                    <label
                                        htmlFor="category"
                                        className="form-label"
                                    >
                                        Category
                                    </label>

                                    <input
                                        id="category"
                                        name="category"
                                        type="text"
                                        className="form-control"
                                        placeholder="Electronics"
                                        value={
                                            productForm.category
                                        }
                                        onChange={
                                            handleProductChange
                                        }
                                        required
                                    />

                                </div>

                                <div className="col-12">

                                    <label
                                        htmlFor="description"
                                        className="form-label"
                                    >
                                        Description
                                    </label>

                                    <textarea
                                        id="description"
                                        name="description"
                                        rows="3"
                                        className="form-control"
                                        value={
                                            productForm.description
                                        }
                                        onChange={
                                            handleProductChange
                                        }
                                        required
                                    />

                                </div>

                                <div className="col-md-4">

                                    <label
                                        htmlFor="price"
                                        className="form-label"
                                    >
                                        Price (₹)
                                    </label>

                                    <input
                                        id="price"
                                        name="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className="form-control"
                                        value={
                                            productForm.price
                                        }
                                        onChange={
                                            handleProductChange
                                        }
                                        required
                                    />

                                </div>

                                <div className="col-md-4">

                                    <label
                                        htmlFor="discount"
                                        className="form-label"
                                    >
                                        Discount (%)
                                    </label>

                                    <input
                                        id="discount"
                                        name="discount"
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="1"
                                        className="form-control"
                                        value={
                                            productForm.discount
                                        }
                                        onChange={
                                            handleProductChange
                                        }
                                    />

                                </div>

                                <div className="col-md-4">

                                    <label
                                        htmlFor="stock"
                                        className="form-label"
                                    >
                                        Stock
                                    </label>

                                    <input
                                        id="stock"
                                        name="stock"
                                        type="number"
                                        min="0"
                                        step="1"
                                        className="form-control"
                                        value={
                                            productForm.stock
                                        }
                                        onChange={
                                            handleProductChange
                                        }
                                        required
                                    />

                                </div>

                                <div className="col-12">

                                    <label
                                        htmlFor="image"
                                        className="form-label"
                                    >
                                        Product Image URL
                                    </label>

                                    <input
                                        id="image"
                                        name="image"
                                        type="url"
                                        className="form-control"
                                        placeholder="https://..."
                                        value={
                                            productForm.image
                                        }
                                        onChange={
                                            handleProductChange
                                        }
                                    />

                                    <div className="form-text">
                                        Optional. Use a
                                        publicly accessible
                                        image URL.
                                    </div>

                                </div>

                            </div>

                            <div className="mt-4 d-flex gap-2">

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={
                                        productSaving
                                    }
                                >
                                    {productSaving
                                        ? "Saving..."
                                        : editingProductId
                                        ? "Update Product"
                                        : "Create Product"}
                                </button>

                                {editingProductId && (
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={
                                            resetProductForm
                                        }
                                    >
                                        Cancel
                                    </button>
                                )}

                            </div>

                        </form>

                    </div>

                </div>

                {/* Product Table */}

                <div className="card shadow-sm">

                    <div className="card-body">

                        <h3 className="h5 fw-bold mb-3">
                            Existing Products
                        </h3>

                        {products.length ===
                        0 ? (
                            <div className="alert alert-info">
                                No active products
                                found.
                            </div>
                        ) : (
                            <div className="table-responsive">

                                <table className="table table-hover align-middle">

                                    <thead>

                                        <tr>
                                            <th>
                                                Product
                                            </th>

                                            <th>
                                                Category
                                            </th>

                                            <th>
                                                Price
                                            </th>

                                            <th>
                                                Discount
                                            </th>

                                            <th>
                                                Stock
                                            </th>

                                            <th>
                                                Actions
                                            </th>
                                        </tr>

                                    </thead>

                                    <tbody>

                                        {products.map(
                                            (
                                                product
                                            ) => (
                                                <tr
                                                    key={
                                                        product._id
                                                    }
                                                >

                                                    <td>

                                                        <div className="d-flex align-items-center gap-2">

                                                            {product
                                                                .images?.[0] && (
                                                                <img
                                                                    src={
                                                                        product
                                                                            .images[0]
                                                                    }
                                                                    alt={
                                                                        product.title
                                                                    }
                                                                    width="50"
                                                                    height="50"
                                                                    className="rounded"
                                                                    style={{
                                                                        objectFit:
                                                                            "cover"
                                                                    }}
                                                                />
                                                            )}

                                                            <div>
                                                                <div className="fw-semibold">
                                                                    {
                                                                        product.title
                                                                    }
                                                                </div>

                                                                <small className="text-muted">
                                                                    #
                                                                    {
                                                                        product._id.slice(
                                                                            -8
                                                                        )
                                                                    }
                                                                </small>
                                                            </div>

                                                        </div>

                                                    </td>

                                                    <td>
                                                        {
                                                            product.category
                                                        }
                                                    </td>

                                                    <td>
                                                        ₹
                                                        {Number(
                                                            product.price
                                                        ).toFixed(
                                                            2
                                                        )}
                                                    </td>

                                                    <td>
                                                        {
                                                            product.discount
                                                        }
                                                        %
                                                    </td>

                                                    <td>
                                                        {
                                                            product.stock
                                                        }
                                                    </td>

                                                    <td>

                                                        <div className="d-flex flex-wrap gap-2">

                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-primary"
                                                                onClick={() =>
                                                                    handleEditProduct(
                                                                        product
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() =>
                                                                    handleDeleteProduct(
                                                                        product
                                                                    )
                                                                }
                                                            >
                                                                Deactivate
                                                            </button>

                                                        </div>

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

            </section>

            {/* Stock Management */}

<section className="mb-5">

    <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">

        <div>
            <h2 className="h4 fw-bold mb-1">
                Stock Management
            </h2>

            <p className="text-muted mb-0">
                Create and maintain stocks
                available in the trading market.
            </p>
        </div>

        {editingStockId && (
            <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={
                    resetStockForm
                }
            >
                Cancel Editing
            </button>
        )}

    </div>

    {stockMessage && (
        <div className="alert alert-success">
            {stockMessage}
        </div>
    )}

    {stockError && (
        <div className="alert alert-danger">
            {stockError}
        </div>
    )}

    {/* Stock Form */}

    <div className="card shadow-sm mb-4">

        <div className="card-body">

            <h3 className="h5 fw-bold mb-3">

                {editingStockId
                    ? "Edit Stock"
                    : "Create Stock"}

            </h3>

            <form
                onSubmit={
                    handleSubmitStock
                }
            >

                <div className="row g-3">

                    <div className="col-md-4">

                        <label
                            htmlFor="symbol"
                            className="form-label"
                        >
                            Symbol
                        </label>

                        <input
                            id="symbol"
                            name="symbol"
                            type="text"
                            className="form-control"
                            placeholder="AAPL"
                            value={
                                stockForm.symbol
                            }
                            onChange={
                                handleStockChange
                            }
                            maxLength="10"
                            required
                        />

                    </div>

                    <div className="col-md-8">

                        <label
                            htmlFor="name"
                            className="form-label"
                        >
                            Company / Stock Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            className="form-control"
                            placeholder="Apple Inc."
                            value={
                                stockForm.name
                            }
                            onChange={
                                handleStockChange
                            }
                            required
                        />

                    </div>

                    <div className="col-md-4">

                        <label
                            htmlFor="price"
                            className="form-label"
                        >
                            Current Price
                        </label>

                        <input
                            id="price"
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            className="form-control"
                            value={
                                stockForm.price
                            }
                            onChange={
                                handleStockChange
                            }
                            required
                        />

                    </div>

                    <div className="col-md-4">

                        <label
                            htmlFor="change"
                            className="form-label"
                        >
                            Daily Change
                        </label>

                        <input
                            id="change"
                            name="change"
                            type="number"
                            step="0.01"
                            className="form-control"
                            value={
                                stockForm.change
                            }
                            onChange={
                                handleStockChange
                            }
                        />

                    </div>

                    <div className="col-md-4">

                        <label
                            htmlFor="changePercent"
                            className="form-label"
                        >
                            Change %
                        </label>

                        <input
                            id="changePercent"
                            name="changePercent"
                            type="number"
                            step="0.01"
                            className="form-control"
                            value={
                                stockForm.changePercent
                            }
                            onChange={
                                handleStockChange
                            }
                        />

                    </div>

                    <div className="col-md-4">

                        <label
                            htmlFor="high"
                            className="form-label"
                        >
                            Daily High
                        </label>

                        <input
                            id="high"
                            name="high"
                            type="number"
                            min="0"
                            step="0.01"
                            className="form-control"
                            value={
                                stockForm.high
                            }
                            onChange={
                                handleStockChange
                            }
                            required
                        />

                    </div>

                    <div className="col-md-4">

                        <label
                            htmlFor="low"
                            className="form-label"
                        >
                            Daily Low
                        </label>

                        <input
                            id="low"
                            name="low"
                            type="number"
                            min="0"
                            step="0.01"
                            className="form-control"
                            value={
                                stockForm.low
                            }
                            onChange={
                                handleStockChange
                            }
                            required
                        />

                    </div>

                    <div className="col-md-4">

                        <label
                            htmlFor="volume"
                            className="form-label"
                        >
                            Volume
                        </label>

                        <input
                            id="volume"
                            name="volume"
                            type="number"
                            min="0"
                            step="1"
                            className="form-control"
                            value={
                                stockForm.volume
                            }
                            onChange={
                                handleStockChange
                            }
                            required
                        />

                    </div>

                </div>

                <div className="mt-4 d-flex gap-2">

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={
                            stockSaving
                        }
                    >
                        {stockSaving
                            ? "Saving..."
                            : editingStockId
                            ? "Update Stock"
                            : "Create Stock"}
                    </button>

                    {editingStockId && (
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={
                                resetStockForm
                            }
                        >
                            Cancel
                        </button>
                    )}

                </div>

            </form>

        </div>

    </div>

    {/* Existing Stocks */}

    <div className="card shadow-sm">

        <div className="card-body">

            <h3 className="h5 fw-bold mb-3">
                Existing Stocks
            </h3>

            {stocks.length ===
            0 ? (
                <div className="alert alert-info">
                    No stocks found.
                </div>
            ) : (
                <div className="table-responsive">

                    <table className="table table-hover align-middle">

                        <thead>

                            <tr>

                                <th>
                                    Symbol
                                </th>

                                <th>
                                    Name
                                </th>

                                <th>
                                    Price
                                </th>

                                <th>
                                    Change
                                </th>

                                <th>
                                    High
                                </th>

                                <th>
                                    Low
                                </th>

                                <th>
                                    Volume
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {stocks.map(
                                (
                                    stock
                                ) => (
                                    <tr
                                        key={
                                            stock._id
                                        }
                                    >

                                        <td className="fw-bold">
                                            {
                                                stock.symbol
                                            }
                                        </td>

                                        <td>
                                            {
                                                stock.name
                                            }
                                        </td>

                                        <td>
                                            ₹
                                            {Number(
                                                stock.price
                                            ).toFixed(
                                                2
                                            )}
                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    Number(
                                                        stock
                                                            .dailyStats
                                                            ?.changePercent ||
                                                            0
                                                    ) >=
                                                    0
                                                        ? "text-success"
                                                        : "text-danger"
                                                }
                                            >
                                                {Number(
                                                    stock
                                                        .dailyStats
                                                        ?.changePercent ||
                                                        0
                                                ).toFixed(
                                                    2
                                                )}
                                                %
                                            </span>

                                        </td>

                                        <td>
                                            ₹
                                            {Number(
                                                stock
                                                    .dailyStats
                                                    ?.high ||
                                                    0
                                            ).toFixed(
                                                2
                                            )}
                                        </td>

                                        <td>
                                            ₹
                                            {Number(
                                                stock
                                                    .dailyStats
                                                    ?.low ||
                                                    0
                                            ).toFixed(
                                                2
                                            )}
                                        </td>

                                        <td>
                                            {Number(
                                                stock
                                                    .dailyStats
                                                    ?.volume ||
                                                    0
                                            ).toLocaleString()}
                                        </td>

                                        <td>

                                            <div className="d-flex flex-wrap gap-2">

                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() =>
                                                        handleEditStock(
                                                            stock
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>
                                                {stock.isActive ? (
                                                    <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() =>
                                                        handleDeleteStock(stock._id)
                                                        }
                                                >
                                                    Deactivate
                                                </button>
                                                ) : (
                                                <button
                                                    className="btn btn-outline-success btn-sm"
                                                    onClick={() =>
                                                        handleReactivateStock(
                                                            stock._id
                                                        )
                                                    }
                                                >
                                                    Reactivate
                                                </button>
                                            )}

                                            </div>

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

</section>

            {/* Orders */}

            <section className="mb-5">

                <h2 className="h4 fw-bold mb-3">
                    Orders
                </h2>

                <div className="card shadow-sm">

                    <div className="card-body">

                        {orders.length ===
                        0 ? (
                            <p className="text-muted mb-0">
                                No orders found.
                            </p>
                        ) : (
                            <div className="table-responsive">

                                <table className="table table-hover align-middle">

                                    <thead>

                                        <tr>
                                            <th>
                                                Order
                                            </th>

                                            <th>
                                                Customer
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

                                            <th>
                                                Date
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
                                                        #
                                                        {order._id.slice(
                                                            -8
                                                        )}
                                                    </td>

                                                    <td>
                                                        <div className="fw-semibold">
                                                            {
                                                                order
                                                                    .userId
                                                                    ?.name
                                                            }
                                                        </div>

                                                        <small className="text-muted">
                                                            {
                                                                order
                                                                    .userId
                                                                    ?.email
                                                            }
                                                        </small>
                                                    </td>

                                                    <td>
                                                        ₹
                                                        {Number(
                                                            order.total
                                                        ).toFixed(
                                                            2
                                                        )}
                                                    </td>

                                                    <td>
                                                        <span className="badge bg-secondary">
                                                            {
                                                                order.paymentStatus
                                                            }
                                                        </span>
                                                    </td>

                                                    <td>

                                                        <select
                                                            className="form-select form-select-sm"
                                                            value={
                                                                order.status
                                                            }
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                handleOrderStatusChange(
                                                                    order._id,
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                        >

                                                            {[
                                                                "PENDING",
                                                                "CONFIRMED",
                                                                "PROCESSING",
                                                                "SHIPPED",
                                                                "DELIVERED",
                                                                "CANCELLED"
                                                            ].map(
                                                                (
                                                                    status
                                                                ) => (
                                                                    <option
                                                                        key={
                                                                            status
                                                                        }
                                                                        value={
                                                                            status
                                                                        }
                                                                    >
                                                                        {
                                                                            status
                                                                        }
                                                                    </option>
                                                                )
                                                            )}

                                                        </select>

                                                    </td>

                                                    <td>
                                                        {new Date(
                                                            order.createdAt
                                                        ).toLocaleDateString()}
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

            </section>

            {/* Trading Transactions */}

            <section>

                <h2 className="h4 fw-bold mb-3">
                    Trading Activity
                </h2>

                <div className="card shadow-sm">

                    <div className="card-body">

                        {transactions.length ===
                        0 ? (
                            <p className="text-muted mb-0">
                                No trading transactions
                                found.
                            </p>
                        ) : (
                            <div className="table-responsive">

                                <table className="table table-hover">

                                    <thead>

                                        <tr>
                                            <th>
                                                User
                                            </th>

                                            <th>
                                                Stock
                                            </th>

                                            <th>
                                                Type
                                            </th>

                                            <th>
                                                Quantity
                                            </th>

                                            <th>
                                                Price
                                            </th>

                                            <th>
                                                Total
                                            </th>

                                            <th>
                                                Date
                                            </th>
                                        </tr>

                                    </thead>

                                    <tbody>

                                        {transactions.map(
                                            (
                                                transaction
                                            ) => (
                                                <tr
                                                    key={
                                                        transaction._id
                                                    }
                                                >

                                                    <td>
                                                        {
                                                            transaction
                                                                .userId
                                                                ?.email
                                                        }
                                                    </td>

                                                    <td className="fw-semibold">
                                                        {
                                                            transaction
                                                                .stockId
                                                                ?.symbol
                                                        }
                                                    </td>

                                                    <td>

                                                        <span
                                                            className={
                                                                transaction.type ===
                                                                "BUY"
                                                                    ? "badge bg-success"
                                                                    : "badge bg-danger"
                                                            }
                                                        >
                                                            {
                                                                transaction.type
                                                            }
                                                        </span>

                                                    </td>

                                                    <td>
                                                        {
                                                            transaction.quantity
                                                        }
                                                    </td>

                                                    <td>
                                                        ₹
                                                        {Number(
                                                            transaction.price
                                                        ).toFixed(
                                                            2
                                                        )}
                                                    </td>

                                                    <td>
                                                        ₹
                                                        {Number(
                                                            transaction.total
                                                        ).toFixed(
                                                            2
                                                        )}
                                                    </td>

                                                    <td>
                                                        {new Date(
                                                            transaction.timestamp
                                                        ).toLocaleString()}
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

            </section>

        </div>
    );
}

export default AdminDashboard;