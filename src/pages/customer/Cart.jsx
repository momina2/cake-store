import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import { useCart } from "../../context/CartContext";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <section className="empty-cart-page">
        <div className="empty-cart-content">
          <div className="empty-cart-icon">
            <ShoppingBag size={34} strokeWidth={1.5} />
          </div>

          <span className="section-kicker">YOUR CART</span>

          <h1>Your cart is empty.</h1>

          <p>
            Looks like you haven't added anything sweet yet.
          </p>

          <Link to="/cakes" className="primary-button">
            Explore Cakes
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="container">
        <Link to="/cakes" className="cart-back-link">
          <ArrowLeft size={16} />
          Continue Shopping
        </Link>

        <div className="cart-page-heading">
          <div>
            <span className="section-kicker">YOUR SELECTION</span>
            <h1>Shopping Cart</h1>
          </div>

          <span className="cart-items-count">
            {cartItems.length}{" "}
            {cartItems.length === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="cart-layout">
          {/* LEFT SIDE */}

          <div className="cart-items-list">
            {cartItems.map((item, index) => (
              <div
                className="cart-item"
                key={`${item.id}-${item.selectedSize}-${item.selectedColor}-${index}`}
              >
                <Link
                  to={`/cake/${item.id}`}
                  className="cart-item-image"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                  />
                </Link>

                <div className="cart-item-details">
                  <div className="cart-item-top">
                    <div>
                      <Link to={`/cake/${item.id}`}>
                        <h3>{item.name}</h3>
                      </Link>

                      <div className="cart-item-options">
                        <span>
                          Size: <strong>{item.selectedSize}</strong>
                        </span>

                        <span className="option-divider"></span>

                        <span>
                          Color:{" "}
                          <strong>{item.selectedColor}</strong>
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="remove-cart-button"
                      onClick={() => removeFromCart(index)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  {item.cakeMessage && (
                    <div className="cart-cake-message">
                      <span>Message on cake</span>
                      <p>"{item.cakeMessage}"</p>
                    </div>
                  )}

                  <div className="cart-item-bottom">
                    <div className="cart-quantity-selector">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            index,
                            item.quantity - 1
                          )
                        }
                      >
                        <Minus size={14} />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            index,
                            item.quantity + 1
                          )
                        }
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="cart-item-price">
                      <span>
                        Rs. {item.price.toLocaleString()} each
                      </span>

                      <strong>
                        Rs.{" "}
                        {(
                          item.price * item.quantity
                        ).toLocaleString()}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE */}

          <aside className="cart-summary">
            <span className="section-kicker">
              ORDER SUMMARY
            </span>

            <h2>Your Order</h2>

            <div className="cart-summary-lines">
              <div>
                <span>Subtotal</span>
                <strong>
                  Rs. {cartTotal.toLocaleString()}
                </strong>
              </div>

              <div>
                <span>Delivery</span>
                <span className="summary-muted">
                  Calculated at checkout
                </span>
              </div>
            </div>

            <div className="cart-summary-total">
              <span>Total</span>

              <strong>
                Rs. {cartTotal.toLocaleString()}
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
              Delivery charges and final order details will be
              confirmed during checkout.
            </p>

            <div className="cart-summary-features">
              <div>
                <strong>Freshly baked</strong>
                <span>Made fresh for your order.</span>
              </div>

              <div>
                <strong>Secure checkout</strong>
                <span>Your order details stay protected.</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Cart;