import { Link } from "react-router-dom";

import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";

import { useCart } from "../../context/CartContext";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart();

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (cartItems.length === 0) {
    return (
      <section className="empty-cart-page">
        <div className="empty-cart-content">
          <div className="empty-cart-icon">
            <ShoppingBag
              size={34}
              strokeWidth={1.5}
            />
          </div>

          <span className="section-kicker">
            YOUR CART
          </span>

          <h1>
            Your cart is empty.
          </h1>

          <p>
            Looks like you haven't
            added anything sweet yet.
          </p>

          <Link
            to="/cakes"
            className="primary-button"
          >
            Explore Cakes
          </Link>
        </div>
      </section>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <section className="cart-page">
      <div className="container">

        <Link
          to="/cakes"
          className="cart-back-link"
        >
          <ArrowLeft size={16} />
          Continue Shopping
        </Link>

        <div className="cart-page-heading">
          <div>
            <span className="section-kicker">
              YOUR SELECTION
            </span>

            <h1>
              Shopping Cart
            </h1>
          </div>

          <span className="cart-items-count">
            {cartItems.length}{" "}
            {cartItems.length === 1
              ? "item"
              : "items"}
          </span>
        </div>

        <div className="cart-layout">

          {/* ==================================
              LEFT
          ================================== */}

          <div className="cart-items-list">

            {cartItems.map(
              (item, index) => {
                // ==============================
                // BASIC DATA
                // ==============================

                const cakeId =
                  Number(
                    item.cake_id ||
                      item.id
                  );

                const itemPrice =
                  Number(
                    item.price || 0
                  );

                const quantity =
                  Number(
                    item.quantity || 1
                  );

                const lineTotal =
                  itemPrice *
                  quantity;

                // ==============================
                // FILLING
                // ==============================

                const fillingId =
                  item.filling_id ||
                  item.selectedFillingId ||
                  null;

                const fillingName =
                  item.selectedFilling ||
                  item.selected_filling ||
                  "";

                const fillingCharge =
                  Number(
                    item.filling_charge ||
                      0
                  );

                // ==============================
                // FLAVOUR
                // ==============================

                const flavourId =
                  item.flavour_id ||
                  item.selectedFlavourId ||
                  null;

                const flavourName =
                  item.selectedFlavour ||
                  item.selected_flavour ||
                  "";

                // ==============================
                // REFERENCE IMAGE
                // ==============================

                const referenceImage =
                  item.reference_image ||
                  item.referenceImage ||
                  "";

                return (
                  <div
                    className="cart-item"
                    key={`${cakeId}-${
                      item.size_id ||
                      item.selectedSizeId ||
                      item.selectedSize
                    }-${
                      item.color_id ||
                      item.selectedColorId ||
                      item.selectedColor ||
                      "no-color"
                    }-${
                      flavourId ||
                      flavourName ||
                      "no-flavour"
                    }-${
                      fillingId ||
                      fillingName ||
                      "no-filling"
                    }-${
                      referenceImage ||
                      "no-reference"
                    }-${index}`}
                  >

                    {/* ==========================
                        CAKE IMAGE
                    ========================== */}

                    <Link
                      to={`/cake/${cakeId}`}
                      className="cart-item-image"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                        />
                      ) : (
                        <div>
                          No Image
                        </div>
                      )}
                    </Link>

                    {/* ==========================
                        DETAILS
                    ========================== */}

                    <div className="cart-item-details">

                      <div className="cart-item-top">

                        <div>
                          <Link
                            to={`/cake/${cakeId}`}
                          >
                            <h3>
                              {item.name}
                            </h3>
                          </Link>

                          {/* ====================
                              OPTIONS
                          ==================== */}

                          <div className="cart-item-options">

                            {/* SIZE */}

                            <span>
                              Size:{" "}
                              <strong>
                                {item.selectedSize ||
                                  item.selected_size ||
                                  "—"}
                              </strong>
                            </span>

                            {/* COLOR */}

                            {(item.selectedColor ||
                              item.selected_color) && (
                              <>
                                <span className="option-divider" />

                                <span>
                                  Color:{" "}
                                  <strong>
                                    {item.selectedColor ||
                                      item.selected_color}
                                  </strong>
                                </span>
                              </>
                            )}

                            {/* FLAVOUR */}

                            <span className="option-divider" />

                            <span>
                              Flavour:{" "}
                              <strong>
                                {flavourName ||
                                  "—"}
                              </strong>
                            </span>

                            {/* FILLING */}

                            <span className="option-divider" />

                            <span>
                              Filling:{" "}
                              <strong>
                                {fillingName ||
                                  "No Filling"}
                              </strong>

                              {fillingName &&
                                fillingCharge >
                                  0 && (
                                  <>
                                    {" "}
                                    (+ Rs.{" "}
                                    {fillingCharge.toLocaleString()}
                                    )
                                  </>
                                )}
                            </span>

                          </div>
                        </div>

                        {/* REMOVE */}

                        <button
                          type="button"
                          className="remove-cart-button"
                          onClick={() =>
                            removeFromCart(
                              index
                            )
                          }
                          aria-label="Remove item"
                        >
                          <Trash2
                            size={17}
                          />
                        </button>
                      </div>

                      {/* ========================
                          REFERENCE IMAGE
                      ======================== */}

                      {referenceImage && (
                        <div
                          style={{
                            marginTop: "14px",
                            padding: "12px",
                            border:
                              "1px solid var(--border)",
                            borderRadius: "10px",
                            background:
                              "var(--background-soft)",
                            maxWidth: "390px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent:
                                "space-between",
                              gap: "12px",
                              marginBottom: "9px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "7px",
                              }}
                            >
                              <ImageIcon
                                size={15}
                              />

                              <strong
                                style={{
                                  fontSize:
                                    "11px",
                                }}
                              >
                                Reference Cake
                                Image
                              </strong>
                            </div>

                            <a
                              href={
                                referenceImage
                              }
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: "flex",
                                alignItems:
                                  "center",
                                gap: "4px",
                                fontSize:
                                  "10px",
                                color:
                                  "var(--accent-dark)",
                                textDecoration:
                                  "none",
                              }}
                            >
                              View Full

                              <ExternalLink
                                size={11}
                              />
                            </a>
                          </div>

                          <a
                            href={
                              referenceImage
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              src={
                                referenceImage
                              }
                              alt="Customer cake reference"
                              style={{
                                display:
                                  "block",
                                width:
                                  "100%",
                                maxWidth:
                                  "220px",
                                height:
                                  "145px",
                                objectFit:
                                  "cover",
                                borderRadius:
                                  "8px",
                                border:
                                  "1px solid var(--border)",
                              }}
                            />
                          </a>
                        </div>
                      )}

                      {/* ========================
                          CAKE MESSAGE
                      ======================== */}

                      {item.cakeMessage && (
                        <div className="cart-cake-message">
                          <span>
                            Message on cake
                          </span>

                          <p>
                            "
                            {
                              item.cakeMessage
                            }
                            "
                          </p>
                        </div>
                      )}

                      {/* ========================
                          PRICE BREAKDOWN
                      ======================== */}

                      {fillingName &&
                        fillingCharge >
                          0 && (
                        <div
                          style={{
                            marginTop:
                              "10px",

                            fontSize:
                              "12px",

                            color:
                              "var(--text-soft)",

                            display:
                              "flex",

                            flexWrap:
                              "wrap",

                            gap:
                              "6px 14px",
                          }}
                        >
                          {Number(
                            item.base_price ||
                              0
                          ) > 0 && (
                            <span>
                              Cake: Rs.{" "}
                              {Number(
                                item.base_price
                              ).toLocaleString()}
                            </span>
                          )}

                          <span>
                            Filling: + Rs.{" "}
                            {fillingCharge.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {/* ========================
                          BOTTOM
                      ======================== */}

                      <div className="cart-item-bottom">

                        {/* QUANTITY */}

                        <div className="cart-quantity-selector">

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                index,
                                quantity -
                                  1
                              )
                            }
                            disabled={
                              quantity <= 1
                            }
                          >
                            <Minus
                              size={14}
                            />
                          </button>

                          <span>
                            {quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                index,
                                quantity +
                                  1
                              )
                            }
                          >
                            <Plus
                              size={14}
                            />
                          </button>

                        </div>

                        {/* PRICE */}

                        <div className="cart-item-price">
                          <span>
                            Rs.{" "}
                            {itemPrice.toLocaleString()}{" "}
                            each
                          </span>

                          <strong>
                            Rs.{" "}
                            {lineTotal.toLocaleString()}
                          </strong>
                        </div>

                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>

          {/* ==================================
              RIGHT
          ================================== */}

          <aside className="cart-summary">

            <span className="section-kicker">
              ORDER SUMMARY
            </span>

            <h2>
              Your Order
            </h2>

            <div className="cart-summary-lines">

              <div>
                <span>
                  Subtotal
                </span>

                <strong>
                  Rs.{" "}
                  {Number(
                    cartTotal
                  ).toLocaleString()}
                </strong>
              </div>

              <div>
                <span>
                  Delivery
                </span>

                <span className="summary-muted">
                  Calculated at
                  checkout
                </span>
              </div>

            </div>

            <div className="cart-summary-total">
              <span>
                Total
              </span>

              <strong>
                Rs.{" "}
                {Number(
                  cartTotal
                ).toLocaleString()}
              </strong>
            </div>

            <Link
              to="/checkout"
              className="cart-checkout-button"
            >
              Proceed to Checkout
              <span>→</span>
            </Link>

            <p className="cart-summary-note">
              Delivery charges and
              final order details will
              be confirmed during
              checkout.
            </p>

            <div className="cart-summary-features">

              <div>
                <strong>
                  Freshly baked
                </strong>

                <span>
                  Made fresh for your
                  order.
                </span>
              </div>

              <div>
                <strong>
                  Custom cakes
                </strong>

                <span>
                  Your selected flavour,
                  filling and reference
                  design stay with your
                  order.
                </span>
              </div>

              <div>
                <strong>
                  Secure checkout
                </strong>

                <span>
                  Your order details
                  stay protected.
                </span>
              </div>

            </div>

          </aside>
        </div>
      </div>
    </section>
  );
};

export default Cart;