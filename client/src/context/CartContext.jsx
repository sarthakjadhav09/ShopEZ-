import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart =
            localStorage.getItem("shopez_cart");

        if (!savedCart) {
            return [];
        }

        try {
            return JSON.parse(savedCart);
        } catch (error) {
            console.error(
                "Could not restore cart:",
                error
            );

            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(
            "shopez_cart",
            JSON.stringify(cartItems)
        );
    }, [cartItems]);

    const addToCart = (
        product,
        quantity = 1
    ) => {
        const numericQuantity =
            Number(quantity);

        if (
            !Number.isInteger(
                numericQuantity
            ) ||
            numericQuantity <= 0
        ) {
            return;
        }

        setCartItems((currentItems) => {
            const existingItem =
                currentItems.find(
                    (item) =>
                        item.productId ===
                        product._id
                );

            if (existingItem) {
                return currentItems.map(
                    (item) =>
                        item.productId ===
                        product._id
                            ? {
                                  ...item,
                                  quantity:
                                      item.quantity +
                                      numericQuantity
                              }
                            : item
                );
            }

            const discountedPrice =
                Number(product.price) -
                (
                    Number(product.price) *
                    Number(product.discount || 0)
                ) /
                    100;

            return [
                ...currentItems,
                {
                    productId:
                        product._id,

                    title:
                        product.title,

                    price:
                        discountedPrice,

                    originalPrice:
                        Number(
                            product.price
                        ),

                    discount:
                        Number(
                            product.discount || 0
                        ),

                    image:
                        product.images?.[0] ||
                        "",

                    quantity:
                        numericQuantity,

                    stock:
                        Number(
                            product.stock
                        )
                }
            ];
        });
    };

    const updateQuantity = (
        productId,
        quantity
    ) => {
        const numericQuantity =
            Number(quantity);

        if (
            !Number.isInteger(
                numericQuantity
            ) ||
            numericQuantity <= 0
        ) {
            return;
        }

        setCartItems((currentItems) =>
            currentItems.map(
                (item) =>
                    item.productId ===
                    productId
                        ? {
                              ...item,
                              quantity:
                                  Math.min(
                                      numericQuantity,
                                      item.stock
                                  )
                          }
                        : item
            )
        );
    };

    const removeFromCart = (
        productId
    ) => {
        setCartItems((currentItems) =>
            currentItems.filter(
                (item) =>
                    item.productId !==
                    productId
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartItemCount = () => {
        return cartItems.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );
    };

    const getCartTotal = () => {
        return cartItems.reduce(
            (total, item) =>
                total +
                item.price *
                    item.quantity,
            0
        );
    };

    const value = {
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartItemCount,
        getCartTotal
    };

    return (
        <CartContext.Provider
            value={value}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};