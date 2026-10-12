import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import api from "../services/api";

import {
    useAuth
} from "../context/AuthContext";

import {
    useCart
} from "../context/CartContext";

function ProductDetails() {
    const {
        id
    } = useParams();

    const navigate =
        useNavigate();

    const {
        user
    } = useAuth();

    const {
        addToCart
    } = useCart();

    const [
        product,
        setProduct
    ] = useState(null);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState("");

    const [
        quantity,
        setQuantity
    ] = useState(1);

    // Reviews
    const [
        reviews,
        setReviews
    ] = useState([]);

    const [
        averageRating,
        setAverageRating
    ] = useState(0);

    const [
        reviewLoading,
        setReviewLoading
    ] = useState(true);

    const [
        reviewError,
        setReviewError
    ] = useState("");

    const [
        reviewSuccess,
        setReviewSuccess
    ] = useState("");

    const [
        rating,
        setRating
    ] = useState(5);

    const [
        comment,
        setComment
    ] = useState("");

    const [
        submittingReview,
        setSubmittingReview
    ] = useState(false);

    const [
        editingReviewId,
        setEditingReviewId
    ] = useState(null);

    const [
        editRating,
        setEditRating
    ] = useState(5);

    const [
        editComment,
        setEditComment
    ] = useState("");

    const loadProduct =
        async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await api.get(
                        `/products/${id}`
                    );

                setProduct(
                    response.data.product
                );
            } catch (error) {
                console.error(
                    "Could not load product:",
                    error
                );

                setError(
                    error.response?.data
                        ?.message ||
                    "Unable to load product."
                );
            } finally {
                setLoading(false);
            }
        };

    const loadReviews =
        async () => {
            try {
                setReviewLoading(true);
                setReviewError("");

                const response =
                    await api.get(
                        `/reviews/product/${id}`
                    );

                setReviews(
                    response.data.reviews ||
                    []
                );

                setAverageRating(
                    response.data.averageRating ||
                    0
                );
            } catch (error) {
                console.error(
                    "Could not load reviews:",
                    error
                );

                setReviewError(
                    error.response?.data
                        ?.message ||
                    "Unable to load reviews."
                );
            } finally {
                setReviewLoading(false);
            }
        };

    useEffect(() => {
        loadProduct();
        loadReviews();
    }, [id]);

    const getDiscountedPrice =
        () => {
            if (!product) {
                return 0;
            }

            return (
                Number(product.price) -
                (
                    Number(product.price) *
                    Number(
                        product.discount || 0
                    )
                ) /
                    100
            );
        };

    const discountedPrice =
        getDiscountedPrice();

    const handleAddToCart =
        () => {
            if (!product) {
                return;
            }

            addToCart(
                product,
                quantity
            );
        };

    const handleBuyNow =
        () => {
            if (!product) {
                return;
            }

            addToCart(
                product,
                quantity
            );

            navigate("/cart");
        };

    const renderStars =
        (
            value,
            interactive = false,
            onSelect = null
        ) => {
            return (
                <div
                    className="d-flex align-items-center"
                    aria-label={`Rating: ${value} out of 5`}
                >
                    {[1, 2, 3, 4, 5].map(
                        (star) => (
                            <button
                                key={star}
                                type={
                                    interactive
                                        ? "button"
                                        : undefined
                                }
                                className={
                                    interactive
                                        ? "btn btn-link p-0 me-1 text-decoration-none"
                                        : "btn btn-link p-0 me-1 text-decoration-none pe-none"
                                }
                                onClick={
                                    interactive
                                        ? () =>
                                              onSelect(
                                                  star
                                              )
                                        : undefined
                                }
                                style={{
                                    fontSize:
                                        "1.6rem",
                                    color:
                                        star <=
                                        Math.round(
                                            value
                                        )
                                            ? "#ffc107"
                                            : "#ced4da"
                                }}
                                aria-label={`${star} star`}
                            >
                                ★
                            </button>
                        )
                    )}
                </div>
            );
        };

    const handleSubmitReview =
        async (event) => {
            event.preventDefault();

            setReviewError("");
            setReviewSuccess("");

            if (!user) {
                setReviewError(
                    "Please log in before submitting a review."
                );

                return;
            }

            if (
                !comment.trim()
            ) {
                setReviewError(
                    "Please enter a review comment."
                );

                return;
            }

            try {
                setSubmittingReview(
                    true
                );

                await api.post(
                    `/reviews/product/${id}`,
                    {
                        rating,
                        comment:
                            comment.trim()
                    }
                );

                setComment("");
                setRating(5);

                setReviewSuccess(
                    "Your review was submitted successfully."
                );

                await loadReviews();
            } catch (error) {
                console.error(
                    "Could not submit review:",
                    error
                );

                setReviewError(
                    error.response?.data
                        ?.message ||
                    "Unable to submit review."
                );
            } finally {
                setSubmittingReview(
                    false
                );
            }
        };

    const startEditingReview =
        (review) => {
            setEditingReviewId(
                review._id
            );

            setEditRating(
                review.rating
            );

            setEditComment(
                review.comment
            );

            setReviewError("");
            setReviewSuccess("");
        };

    const cancelEditingReview =
        () => {
            setEditingReviewId(
                null
            );

            setEditRating(5);
            setEditComment("");
        };

    const handleUpdateReview =
        async (
            reviewId
        ) => {
            setReviewError("");
            setReviewSuccess("");

            if (
                !editComment.trim()
            ) {
                setReviewError(
                    "Review comment cannot be empty."
                );

                return;
            }

            try {
                setSubmittingReview(
                    true
                );

                await api.put(
                    `/reviews/${reviewId}`,
                    {
                        rating:
                            editRating,
                        comment:
                            editComment.trim()
                    }
                );

                setReviewSuccess(
                    "Your review was updated successfully."
                );

                cancelEditingReview();

                await loadReviews();
            } catch (error) {
                console.error(
                    "Could not update review:",
                    error
                );

                setReviewError(
                    error.response?.data
                        ?.message ||
                    "Unable to update review."
                );
            } finally {
                setSubmittingReview(
                    false
                );
            }
        };

    const handleDeleteReview =
        async (
            reviewId
        ) => {
            const confirmed =
                window.confirm(
                    "Are you sure you want to delete your review?"
                );

            if (!confirmed) {
                return;
            }

            setReviewError("");
            setReviewSuccess("");

            try {
                setSubmittingReview(
                    true
                );

                await api.delete(
                    `/reviews/${reviewId}`
                );

                setReviewSuccess(
                    "Your review was deleted successfully."
                );

                await loadReviews();
            } catch (error) {
                console.error(
                    "Could not delete review:",
                    error
                );

                setReviewError(
                    error.response?.data
                        ?.message ||
                    "Unable to delete review."
                );
            } finally {
                setSubmittingReview(
                    false
                );
            }
        };

    const isOwnReview =
        (review) => {
            return (
                user &&
                review.userId?._id ===
                    user.id
            );
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
                    Loading product...
                </p>

            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container py-5">

                <div className="alert alert-danger">
                    {error ||
                        "Product not found."}
                </div>

                <Link
                    to="/products"
                    className="btn btn-primary"
                >
                    Back to Products
                </Link>

            </div>
        );
    }

    return (
        <div className="container py-5">

            {/* Product Details */}

            <div className="row g-5">

                {/* Product Image */}

                <div className="col-md-6">

                    <div className="card shadow-sm border-0">

                        {product.images?.[0] ? (
                            <img
                                src={
                                    product
                                        .images[0]
                                }
                                className="card-img-top"
                                alt={
                                    product.title
                                }
                                style={{
                                    height:
                                        "450px",
                                    objectFit:
                                        "cover"
                                }}
                            />
                        ) : (
                            <div
                                className="d-flex align-items-center justify-content-center bg-light"
                                style={{
                                    height:
                                        "450px"
                                }}
                            >
                                <span className="text-muted">
                                    No image available
                                </span>
                            </div>
                        )}

                    </div>

                </div>

                {/* Product Information */}

                <div className="col-md-6">

                    <span className="badge bg-secondary mb-3">
                        {product.category}
                    </span>

                    <h1 className="fw-bold">
                        {product.title}
                    </h1>

                    <p className="text-muted mt-3">
                        {product.description}
                    </p>

                    <div className="d-flex align-items-center gap-2 mb-3">

                        {renderStars(
                            averageRating
                        )}

                        <span className="text-muted">
                            {averageRating.toFixed(
                                1
                            )} / 5
                            {" "}
                            ({reviews.length}{" "}
                            {reviews.length ===
                            1
                                ? "review"
                                : "reviews"})
                        </span>

                    </div>

                    <hr />

                    <div className="mb-4">

                        <div className="d-flex align-items-center gap-3">

                            <span className="fs-2 fw-bold">
                                ₹
                                {discountedPrice.toFixed(
                                    2
                                )}
                            </span>

                            {product.discount >
                                0 && (
                                <>
                                    <span className="text-muted text-decoration-line-through">
                                        ₹
                                        {Number(
                                            product.price
                                        ).toFixed(
                                            2
                                        )}
                                    </span>

                                    <span className="badge bg-danger">
                                        {
                                            product.discount
                                        }
                                        % OFF
                                    </span>
                                </>
                            )}

                        </div>

                    </div>

                    <div className="mb-4">

                        <span className="fw-semibold">
                            Stock:
                        </span>

                        {" "}

                        {product.stock >
                        0 ? (
                            <span className="text-success">
                                {product.stock}{" "}
                                available
                            </span>
                        ) : (
                            <span className="text-danger">
                                Out of stock
                            </span>
                        )}

                    </div>

                    {product.stock >
                        0 && (
                        <div className="row g-3 mb-4">

                            <div className="col-sm-4">

                                <label
                                    htmlFor="quantity"
                                    className="form-label fw-semibold"
                                >
                                    Quantity
                                </label>

                                <input
                                    id="quantity"
                                    type="number"
                                    min="1"
                                    max={
                                        product.stock
                                    }
                                    className="form-control"
                                    value={
                                        quantity
                                    }
                                    onChange={(
                                        event
                                    ) => {
                                        const value =
                                            Number(
                                                event
                                                    .target
                                                    .value
                                            );

                                        if (
                                            value >=
                                                1 &&
                                            value <=
                                                product.stock
                                        ) {
                                            setQuantity(
                                                value
                                            );
                                        }
                                    }}
                                />

                            </div>

                        </div>
                    )}

                    <div className="d-flex flex-wrap gap-2">

                        <button
                            className="btn btn-primary btn-lg"
                            onClick={
                                handleAddToCart
                            }
                            disabled={
                                product.stock <=
                                0
                            }
                        >
                            Add to Cart
                        </button>

                        <button
                            className="btn btn-success btn-lg"
                            onClick={
                                handleBuyNow
                            }
                            disabled={
                                product.stock <=
                                0
                            }
                        >
                            Buy Now
                        </button>

                        <Link
                            to="/products"
                            className="btn btn-outline-secondary btn-lg"
                        >
                            Back to Products
                        </Link>

                    </div>

                </div>

            </div>

            <hr className="my-5" />

            {/* Reviews Section */}

            <section>

                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">

                    <div>
                        <h2 className="fw-bold mb-1">
                            Customer Reviews
                        </h2>

                        <p className="text-muted mb-0">
                            See what customers think
                            about this product.
                        </p>
                    </div>

                    <div className="text-center mt-3 mt-md-0">

                        <div className="display-6 fw-bold">
                            {averageRating.toFixed(
                                1
                            )}
                        </div>

                        {renderStars(
                            averageRating
                        )}

                        <small className="text-muted">
                            Based on{" "}
                            {reviews.length}{" "}
                            reviews
                        </small>

                    </div>

                </div>

                {/* Review messages */}

                {reviewError && (
                    <div className="alert alert-danger">
                        {reviewError}
                    </div>
                )}

                {reviewSuccess && (
                    <div className="alert alert-success">
                        {reviewSuccess}
                    </div>
                )}

                {/* Write Review */}

                {user ? (
                    <div className="card shadow-sm mb-5">

                        <div className="card-body">

                            <h3 className="h5 fw-bold">
                                Write a Review
                            </h3>

                            <form
                                onSubmit={
                                    handleSubmitReview
                                }
                            >

                                <div className="mb-3">

                                    <label className="form-label fw-semibold">
                                        Rating
                                    </label>

                                    {renderStars(
                                        rating,
                                        true,
                                        setRating
                                    )}

                                    <div className="small text-muted">
                                        Selected rating:{" "}
                                        {rating} / 5
                                    </div>

                                </div>

                                <div className="mb-3">

                                    <label
                                        htmlFor="reviewComment"
                                        className="form-label fw-semibold"
                                    >
                                        Your Review
                                    </label>

                                    <textarea
                                        id="reviewComment"
                                        className="form-control"
                                        rows="4"
                                        maxLength="1000"
                                        placeholder="Share your experience with this product..."
                                        value={
                                            comment
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setComment(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                    />

                                    <div className="form-text">
                                        {comment.length}
                                        /1000 characters
                                    </div>

                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={
                                        submittingReview
                                    }
                                >
                                    {submittingReview
                                        ? "Submitting..."
                                        : "Submit Review"}
                                </button>

                            </form>

                        </div>

                    </div>
                ) : (
                    <div className="alert alert-info mb-5">

                        <strong>
                            Want to review this
                            product?
                        </strong>

                        {" "}

                        <Link to="/login">
                            Log in
                        </Link>

                        {" "}to write a review.

                    </div>
                )}

                {/* Existing Reviews */}

                {reviewLoading ? (
                    <div className="text-center py-4">

                        <div
                            className="spinner-border"
                            role="status"
                        >
                            <span className="visually-hidden">
                                Loading reviews...
                            </span>
                        </div>

                        <p className="mt-2 text-muted">
                            Loading reviews...
                        </p>

                    </div>
                ) : reviews.length ===
                  0 ? (
                    <div className="card border-0 bg-light">

                        <div className="card-body text-center py-5">

                            <h3 className="h5">
                                No reviews yet
                            </h3>

                            <p className="text-muted mb-0">
                                Be the first customer
                                to review this product.
                            </p>

                        </div>

                    </div>
                ) : (
                    <div className="row g-4">

                        {reviews.map(
                            (review) => (
                                <div
                                    className="col-12"
                                    key={
                                        review._id
                                    }
                                >

                                    <div className="card shadow-sm">

                                        <div className="card-body">

                                            {editingReviewId ===
                                            review._id ? (
                                                <div>

                                                    <h3 className="h6 fw-bold">
                                                        Edit Your
                                                        Review
                                                    </h3>

                                                    <div className="mb-3">

                                                        <label className="form-label">
                                                            Rating
                                                        </label>

                                                        {renderStars(
                                                            editRating,
                                                            true,
                                                            setEditRating
                                                        )}

                                                    </div>

                                                    <div className="mb-3">

                                                        <label className="form-label">
                                                            Comment
                                                        </label>

                                                        <textarea
                                                            className="form-control"
                                                            rows="4"
                                                            maxLength="1000"
                                                            value={
                                                                editComment
                                                            }
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                setEditComment(
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                        />

                                                    </div>

                                                    <div className="d-flex gap-2">

                                                        <button
                                                            className="btn btn-primary"
                                                            type="button"
                                                            disabled={
                                                                submittingReview
                                                            }
                                                            onClick={() =>
                                                                handleUpdateReview(
                                                                    review._id
                                                                )
                                                            }
                                                        >
                                                            Save Changes
                                                        </button>

                                                        <button
                                                            className="btn btn-outline-secondary"
                                                            type="button"
                                                            onClick={
                                                                cancelEditingReview
                                                            }
                                                        >
                                                            Cancel
                                                        </button>

                                                    </div>

                                                </div>
                                            ) : (
                                                <>

                                                    <div className="d-flex flex-wrap justify-content-between">

                                                        <div>

                                                            <h3 className="h6 fw-bold mb-1">
                                                                {review
                                                                    .userId
                                                                    ?.name ||
                                                                    "Customer"}
                                                            </h3>

                                                            {renderStars(
                                                                review.rating
                                                            )}

                                                        </div>

                                                        <small className="text-muted">
                                                            {new Date(
                                                                review.createdAt
                                                            ).toLocaleDateString()}
                                                        </small>

                                                    </div>

                                                    <p className="mt-3 mb-3">
                                                        {
                                                            review.comment
                                                        }
                                                    </p>

                                                    {isOwnReview(
                                                        review
                                                    ) && (
                                                        <div className="d-flex gap-2">

                                                            <button
                                                                className="btn btn-sm btn-outline-primary"
                                                                type="button"
                                                                onClick={() =>
                                                                    startEditingReview(
                                                                        review
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </button>

                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                type="button"
                                                                disabled={
                                                                    submittingReview
                                                                }
                                                                onClick={() =>
                                                                    handleDeleteReview(
                                                                        review._id
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </button>

                                                        </div>
                                                    )}

                                                </>
                                            )}

                                        </div>

                                    </div>

                                </div>
                            )
                        )}

                    </div>
                )}

            </section>

        </div>
    );
}

export default ProductDetails;