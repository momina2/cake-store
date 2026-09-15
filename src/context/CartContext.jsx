import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext();

export const CartProvider = ({
  children,
}) => {
  // ==========================================
  // LOAD CART
  // ==========================================

  const [cartItems, setCartItems] =
    useState(() => {
      try {
        const savedCart =
          localStorage.getItem(
            "cakeCart"
          );

        if (!savedCart) {
          return [];
        }

        const parsedCart =
          JSON.parse(savedCart);

        if (!Array.isArray(parsedCart)) {
          return [];
        }

        return parsedCart.map(
          (item) => ({
            ...item,

            id: Number(
              item.id ||
                item.cake_id ||
                0
            ),

            cake_id: Number(
              item.cake_id ||
                item.id ||
                0
            ),

            size_id: Number(
              item.size_id ||
                item.selectedSizeId ||
                0
            ),

            selectedSizeId: Number(
              item.selectedSizeId ||
                item.size_id ||
                0
            ),

            color_id:
              item.color_id ||
              item.selectedColorId
                ? Number(
                    item.color_id ||
                      item.selectedColorId
                  )
                : null,

            selectedColorId:
              item.selectedColorId ||
              item.color_id
                ? Number(
                    item.selectedColorId ||
                      item.color_id
                  )
                : null,

            price: Number(
              item.price || 0
            ),

            quantity: Math.max(
              1,
              Number(
                item.quantity || 1
              )
            ),
          })
        );
      } catch (error) {
        console.error(
          "Cart loading error:",
          error
        );

        localStorage.removeItem(
          "cakeCart"
        );

        return [];
      }
    });

  // ==========================================
  // SAVE CART
  // ==========================================

  useEffect(() => {
    try {
      localStorage.setItem(
        "cakeCart",
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error(
        "Cart saving error:",
        error
      );
    }
  }, [cartItems]);

  // ==========================================
  // SAME CART ITEM
  // ==========================================

  const isSameCartItem = (
    first,
    second
  ) => {
    const firstCakeId = Number(
      first.cake_id ||
        first.id ||
        0
    );

    const secondCakeId = Number(
      second.cake_id ||
        second.id ||
        0
    );

    const firstSizeId = Number(
      first.size_id ||
        first.selectedSizeId ||
        0
    );

    const secondSizeId = Number(
      second.size_id ||
        second.selectedSizeId ||
        0
    );

    const firstColorId =
      first.color_id ||
      first.selectedColorId
        ? Number(
            first.color_id ||
              first.selectedColorId
          )
        : null;

    const secondColorId =
      second.color_id ||
      second.selectedColorId
        ? Number(
            second.color_id ||
              second.selectedColorId
          )
        : null;

    // New API-connected cart
    if (
      firstCakeId > 0 &&
      secondCakeId > 0 &&
      firstSizeId > 0 &&
      secondSizeId > 0
    ) {
      return (
        firstCakeId ===
          secondCakeId &&
        firstSizeId ===
          secondSizeId &&
        firstColorId ===
          secondColorId
      );
    }

    // Fallback for any old cart data
    return (
      firstCakeId ===
        secondCakeId &&
      first.selectedSize ===
        second.selectedSize &&
      (first.selectedColor ||
        "") ===
        (second.selectedColor ||
          "")
    );
  };

  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = (item) => {
    const normalizedItem = {
      ...item,

      id: Number(
        item.id ||
          item.cake_id ||
          0
      ),

      cake_id: Number(
        item.cake_id ||
          item.id ||
          0
      ),

      size_id: Number(
        item.size_id ||
          item.selectedSizeId ||
          0
      ),

      selectedSizeId: Number(
        item.selectedSizeId ||
          item.size_id ||
          0
      ),

      color_id:
        item.color_id ||
        item.selectedColorId
          ? Number(
              item.color_id ||
                item.selectedColorId
            )
          : null,

      selectedColorId:
        item.selectedColorId ||
        item.color_id
          ? Number(
              item.selectedColorId ||
                item.color_id
            )
          : null,

      price: Number(
        item.price || 0
      ),

      quantity: Math.max(
        1,
        Number(
          item.quantity || 1
        )
      ),
    };

    setCartItems((previous) => {
      const existingIndex =
        previous.findIndex(
          (cartItem) =>
            isSameCartItem(
              cartItem,
              normalizedItem
            )
        );

      if (existingIndex !== -1) {
        return previous.map(
          (cartItem, index) =>
            index === existingIndex
              ? {
                  ...cartItem,

                  // Keep newest API IDs
                  ...normalizedItem,

                  quantity:
                    Number(
                      cartItem.quantity ||
                        0
                    ) +
                    Number(
                      normalizedItem.quantity ||
                        0
                    ),
                }
              : cartItem
        );
      }

      return [
        ...previous,
        normalizedItem,
      ];
    });
  };

  // ==========================================
  // REMOVE
  // ==========================================

  const removeFromCart = (index) => {
    setCartItems((previous) =>
      previous.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  };

  // ==========================================
  // QUANTITY
  // ==========================================

  const updateQuantity = (
    index,
    quantity
  ) => {
    const newQuantity =
      Number(quantity);

    if (
      !Number.isFinite(
        newQuantity
      ) ||
      newQuantity < 1
    ) {
      return;
    }

    setCartItems((previous) =>
      previous.map(
        (item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                quantity:
                  newQuantity,
              }
            : item
      )
    );
  };

  // ==========================================
  // CLEAR
  // ==========================================

  const clearCart = () => {
    setCartItems([]);
  };

  // ==========================================
  // TOTALS
  // ==========================================

  const cartCount =
    cartItems.reduce(
      (total, item) =>
        total +
        Number(
          item.quantity || 0
        ),
      0
    );

  const cartTotal =
    cartItems.reduce(
      (total, item) =>
        total +
        Number(
          item.price || 0
        ) *
          Number(
            item.quantity || 0
          ),
      0
    );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () =>
  useContext(CartContext);