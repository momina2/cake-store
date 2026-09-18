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
  // NORMALIZE CART ITEM
  // ==========================================

  const normalizeCartItem = (item) => {
    // ========================================
    // CAKE
    // ========================================

    const cakeId = Number(
      item.cake_id ||
        item.id ||
        0
    );

    // ========================================
    // SIZE
    // ========================================

    const sizeId = Number(
      item.size_id ||
        item.selectedSizeId ||
        0
    );

    // ========================================
    // COLOR
    // ========================================

    const colorValue =
      item.color_id ??
      item.selectedColorId ??
      null;

    const colorId =
      colorValue !== null &&
      colorValue !== "" &&
      Number(colorValue) > 0
        ? Number(colorValue)
        : null;

    // ========================================
    // FILLING
    // ========================================

    const fillingValue =
      item.filling_id ??
      item.selectedFillingId ??
      null;

    const fillingId =
      fillingValue !== null &&
      fillingValue !== "" &&
      Number(fillingValue) > 0
        ? Number(fillingValue)
        : null;

    // ========================================
    // FLAVOUR
    // ========================================

    const flavourValue =
      item.flavour_id ??
      item.selectedFlavourId ??
      null;

    const flavourId =
      flavourValue !== null &&
      flavourValue !== "" &&
      Number(flavourValue) > 0
        ? Number(flavourValue)
        : null;

    // ========================================
    // REFERENCE IMAGE
    // ========================================

    const referenceImage =
      item.reference_image ||
      item.referenceImage ||
      "";

    // ========================================
    // RETURN NORMALIZED ITEM
    // ========================================

    return {
      ...item,

      // Cake
      id: cakeId,

      cake_id: cakeId,

      // Size
      size_id: sizeId,

      selectedSizeId:
        sizeId,

      selectedSize:
        item.selectedSize ||
        item.selected_size ||
        "",

      selected_size:
        item.selected_size ||
        item.selectedSize ||
        "",

      // Color
      color_id:
        colorId,

      selectedColorId:
        colorId,

      selectedColor:
        item.selectedColor ||
        item.selected_color ||
        "",

      selected_color:
        item.selected_color ||
        item.selectedColor ||
        "",

      // Filling
      filling_id:
        fillingId,

      selectedFillingId:
        fillingId,

      selectedFilling:
        item.selectedFilling ||
        item.selected_filling ||
        "",

      selected_filling:
        item.selected_filling ||
        item.selectedFilling ||
        "",

      filling_charge:
        Number(
          item.filling_charge ||
            0
        ),

      // Flavour
      flavour_id:
        flavourId,

      selectedFlavourId:
        flavourId,

      selectedFlavour:
        item.selectedFlavour ||
        item.selected_flavour ||
        "",

      selected_flavour:
        item.selected_flavour ||
        item.selectedFlavour ||
        "",

      // Reference Image
      reference_image:
        referenceImage,

      referenceImage:
        referenceImage,

      // Prices
      base_price:
        Number(
          item.base_price ||
            item.size_price ||
            0
        ),

      price:
        Number(
          item.price || 0
        ),

      // Quantity
      quantity:
        Math.max(
          1,
          Number(
            item.quantity ||
              1
          )
        ),
    };
  };

  // ==========================================
  // LOAD CART
  // ==========================================

  const [
    cartItems,
    setCartItems,
  ] = useState(() => {
    try {
      const savedCart =
        localStorage.getItem(
          "cakeCart"
        );

      if (!savedCart) {
        return [];
      }

      const parsedCart =
        JSON.parse(
          savedCart
        );

      if (
        !Array.isArray(
          parsedCart
        )
      ) {
        return [];
      }

      return parsedCart.map(
        (item) =>
          normalizeCartItem(
            item
          )
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
        JSON.stringify(
          cartItems
        )
      );
    } catch (error) {
      console.error(
        "Cart saving error:",
        error
      );
    }
  }, [cartItems]);

  // ==========================================
  // HELPER - GET OPTIONAL ID
  // ==========================================

  const getOptionalId = (
    value
  ) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      Number(value) <= 0
    ) {
      return null;
    }

    return Number(value);
  };

  // ==========================================
  // SAME CART ITEM
  // ==========================================

  const isSameCartItem = (
    first,
    second
  ) => {
    // ========================================
    // CAKE
    // ========================================

    const firstCakeId =
      Number(
        first.cake_id ||
          first.id ||
          0
      );

    const secondCakeId =
      Number(
        second.cake_id ||
          second.id ||
          0
      );

    // ========================================
    // SIZE
    // ========================================

    const firstSizeId =
      Number(
        first.size_id ||
          first.selectedSizeId ||
          0
      );

    const secondSizeId =
      Number(
        second.size_id ||
          second.selectedSizeId ||
          0
      );

    // ========================================
    // COLOR
    // ========================================

    const firstColorId =
      getOptionalId(
        first.color_id ??
          first.selectedColorId
      );

    const secondColorId =
      getOptionalId(
        second.color_id ??
          second.selectedColorId
      );

    // ========================================
    // FILLING
    // ========================================

    const firstFillingId =
      getOptionalId(
        first.filling_id ??
          first.selectedFillingId
      );

    const secondFillingId =
      getOptionalId(
        second.filling_id ??
          second.selectedFillingId
      );

    // ========================================
    // FLAVOUR
    // ========================================

    const firstFlavourId =
      getOptionalId(
        first.flavour_id ??
          first.selectedFlavourId
      );

    const secondFlavourId =
      getOptionalId(
        second.flavour_id ??
          second.selectedFlavourId
      );

    // ========================================
    // REFERENCE IMAGE
    // ========================================

    const firstReferenceImage =
      first.reference_image ||
      first.referenceImage ||
      "";

    const secondReferenceImage =
      second.reference_image ||
      second.referenceImage ||
      "";

    // ========================================
    // API-CONNECTED CART
    // ========================================

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
          secondColorId &&
        firstFillingId ===
          secondFillingId &&
        firstFlavourId ===
          secondFlavourId &&
        firstReferenceImage ===
          secondReferenceImage
      );
    }

    // ========================================
    // FALLBACK FOR OLD CART DATA
    // ========================================

    return (
      firstCakeId ===
        secondCakeId &&

      first.selectedSize ===
        second.selectedSize &&

      (first.selectedColor ||
        first.selected_color ||
        "") ===
        (second.selectedColor ||
          second.selected_color ||
          "") &&

      (first.selectedFilling ||
        first.selected_filling ||
        "") ===
        (second.selectedFilling ||
          second.selected_filling ||
          "") &&

      (first.selectedFlavour ||
        first.selected_flavour ||
        "") ===
        (second.selectedFlavour ||
          second.selected_flavour ||
          "") &&

      firstReferenceImage ===
        secondReferenceImage
    );
  };

  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = (
    item
  ) => {
    const normalizedItem =
      normalizeCartItem(
        item
      );

    setCartItems(
      (previous) => {
        const existingIndex =
          previous.findIndex(
            (cartItem) =>
              isSameCartItem(
                cartItem,
                normalizedItem
              )
          );

        // ======================================
        // SAME CONFIGURATION EXISTS
        // ======================================

        if (
          existingIndex !==
          -1
        ) {
          return previous.map(
            (
              cartItem,
              index
            ) =>
              index ===
              existingIndex
                ? {
                    ...cartItem,

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

        // ======================================
        // NEW CONFIGURATION
        // ======================================

        return [
          ...previous,
          normalizedItem,
        ];
      }
    );
  };

  // ==========================================
  // REMOVE FROM CART
  // ==========================================

  const removeFromCart = (
    index
  ) => {
    setCartItems(
      (previous) =>
        previous.filter(
          (
            _,
            itemIndex
          ) =>
            itemIndex !==
            index
        )
    );
  };

  // ==========================================
  // UPDATE QUANTITY
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

    setCartItems(
      (previous) =>
        previous.map(
          (
            item,
            itemIndex
          ) =>
            itemIndex ===
            index
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
  // CLEAR CART
  // ==========================================

  const clearCart = () => {
    setCartItems([]);
  };

  // ==========================================
  // CART COUNT
  // ==========================================

  const cartCount =
    cartItems.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item.quantity ||
            0
        ),
      0
    );

  // ==========================================
  // CART TOTAL
  // ==========================================

  const cartTotal =
    cartItems.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item.price ||
            0
        ) *
          Number(
            item.quantity ||
              0
          ),
      0
    );

  // ==========================================
  // PROVIDER
  // ==========================================

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

// ==========================================
// USE CART
// ==========================================

export const useCart = () =>
  useContext(
    CartContext
  );