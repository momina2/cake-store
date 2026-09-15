import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cakeCart");

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          return parsedCart;
        }
      }

      return [];
    } catch (error) {
      console.error("Cart loading error:", error);
      localStorage.removeItem("cakeCart");
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cakeCart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Cart saving error:", error);
    }
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((previous) => {
      const existingItem = previous.find(
        (cartItem) =>
          cartItem.id === item.id &&
          cartItem.selectedSize === item.selectedSize &&
          cartItem.selectedColor === item.selectedColor
      );

      if (existingItem) {
        return previous.map((cartItem) =>
          cartItem.id === item.id &&
          cartItem.selectedSize === item.selectedSize &&
          cartItem.selectedColor === item.selectedColor
            ? {
                ...cartItem,
                quantity: cartItem.quantity + item.quantity,
              }
            : cartItem
        );
      }

      return [...previous, item];
    });
  };

  const removeFromCart = (index) => {
    setCartItems((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const updateQuantity = (index, quantity) => {
    if (quantity < 1) return;

    setCartItems((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  const cartTotal = cartItems.reduce(
    (total, item) =>
      total + (item.price || 0) * (item.quantity || 0),
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

export const useCart = () => useContext(CartContext);