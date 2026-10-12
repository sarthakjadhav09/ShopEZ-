import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import api from "../services/api";

function ProductCatalog() {
    const [
        products,
        setProducts
    ] = useState([]);

    const [
        search,
        setSearch
    ] = useState("");

    const [
        category,
        setCategory
    ] = useState("ALL");

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await api.get(
                        "/products"
                    );

                setProducts(
                    response.data.products || []
                );
            } catch (error) {
                console.error(
                    "Product catalog error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load products."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const categories = [
        "ALL",
        ...new Set(
            products.map(
                (product) =>
                    product.category
            )
        )
    ];

    const filteredProducts =
        products.filter(
            (product) => {
                const searchText =
                    search.toLowerCase().trim();

                const matchesSearch =
                    product.title
                        ?.toLowerCase()
                        .includes(searchText) ||
                    product.description
                        ?.toLowerCase()
                        .includes(searchText);

                const matchesCategory =
                    category === "ALL" ||
                    product.category === category;

                return (
                    matchesSearch &&
                    matchesCategory
                );
            }
        );

    const calculateDiscountedPrice = (
        product
    ) => {
        const price =
            Number(product.price);

        const discount =
            Number(product.discount || 0);

        return (
            price -
            (price * discount) / 100
        );
    };

    return (
        <div className="container py-5">

            <div className="mb-4">

                <h1>
                    ShopEZ Products
                </h1>

                <p className="text-muted">
                    Browse our products and find
                    something you like.
                </p>

            </div>

            <div className="card shadow-sm mb-4">

                <div className="card-body">

                    <div className="row">

                        <div className="col-md-8 mb-3 mb-md-0">

                            <label
                                htmlFor="productSearch"
                                className="form-label"
                            >
                                Search Products
                            </label>

                            <input
                                id="productSearch"
                                type="search"
                                className="form-control"
                                placeholder="Search by product name or description..."
                                value={search}
                                onChange={(
                                    event
                                ) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="col-md-4">

                            <label
                                htmlFor="categoryFilter"
                                className="form-label"
                            >
                                Category
                            </label>

                            <select
                                id="categoryFilter"
                                className="form-select"
                                value={category}
                                onChange={(
                                    event
                                ) =>
                                    setCategory(
                                        event.target.value
                                    )
                                }
                            >

                                {categories.map(
                                    (
                                        item
                                    ) => (
                                        <option
                                            key={
                                                item
                                            }
                                            value={
                                                item
                                            }
                                        >
                                            {item ===
                                            "ALL"
                                                ? "All Categories"
                                                : item}
                                        </option>
                                    )
                                )}

                            </select>

                        </div>

                    </div>

                </div>

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
                        Loading products...
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
                filteredProducts.length === 0 && (
                    <div className="alert alert-info">
                        No products match your search.
                    </div>
                )}

            {!loading &&
                !error &&
                filteredProducts.length > 0 && (

                    <div className="row">

                        {filteredProducts.map(
                            (
                                product
                            ) => {

                                const discountedPrice =
                                    calculateDiscountedPrice(
                                        product
                                    );

                                return (
                                    <div
                                        className="col-md-6 col-lg-4 mb-4"
                                        key={
                                            product._id
                                        }
                                    >

                                        <div className="card h-100 shadow-sm">

                                            <div
                                                style={{
                                                    height: "220px",
                                                    overflow: "hidden"
                                                }}
                                            >

                                                {product.images?.[0] ? (
                                                    <img
                                                        src={
                                                            product.images[0]
                                                        }
                                                        alt={
                                                            product.title
                                                        }
                                                        className="w-100 h-100"
                                                        style={{
                                                            objectFit:
                                                                "cover"
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="bg-light h-100 d-flex align-items-center justify-content-center">
                                                        No Image
                                                    </div>
                                                )}

                                            </div>

                                            <div className="card-body d-flex flex-column">

                                                <span className="badge bg-secondary align-self-start mb-2">
                                                    {
                                                        product.category
                                                    }
                                                </span>

                                                <h5 className="card-title">
                                                    {
                                                        product.title
                                                    }
                                                </h5>

                                                <p className="card-text text-muted">
                                                    {
                                                        product.description
                                                    }
                                                </p>

                                                <div className="mt-auto">

                                                    <div className="mb-3">

                                                        {product.discount >
                                                            0 && (
                                                            <span className="text-muted text-decoration-line-through me-2">
                                                                ₹
                                                                {Number(
                                                                    product.price
                                                                ).toFixed(
                                                                    2
                                                                )}
                                                            </span>
                                                        )}

                                                        <strong className="fs-5">
                                                            ₹
                                                            {discountedPrice.toFixed(
                                                                2
                                                            )}
                                                        </strong>

                                                        {product.discount >
                                                            0 && (
                                                            <span className="badge bg-danger ms-2">
                                                                {
                                                                    product.discount
                                                                }
                                                                % OFF
                                                            </span>
                                                        )}

                                                    </div>

                                                    <p className="small text-muted">
                                                        {product.stock >
                                                        0
                                                            ? `${product.stock} in stock`
                                                            : "Out of stock"}
                                                    </p>

                                                    <Link
                                                        to={`/products/${product._id}`}
                                                        className="btn btn-primary w-100"
                                                    >
                                                        View Product
                                                    </Link>

                                                </div>

                                            </div>

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>

                )}

        </div>
    );
}

export default ProductCatalog;