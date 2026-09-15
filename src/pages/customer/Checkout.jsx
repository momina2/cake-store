import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import { useCart } from "../../context/CartContext";

const Checkout = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    cartTotal,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "Lahore",
    deliveryDate: "",
    deliveryTime: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  const deliveryCharges = 250;
  const grandTotal = cartTotal + deliveryCharges;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Full name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    }

    if (
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Delivery address is required.";
    }

    if (!formData.deliveryDate) {
      newErrors.deliveryDate = "Delivery date is required.";
    }

    if (!formData.deliveryTime) {
      newErrors.deliveryTime = "Delivery time is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const generateOrderId = () => {
    const random = Math.floor(1000 + Math.random() * 9000);

    return `MC-${Date.now().toString().slice(-6)}${random}`;
  };

  const handlePlaceOrder = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Please complete the required fields.");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const newOrder = {
      orderId: generateOrderId(),

      customer: {
        name: formData.customerName,
        email: formData.email,
        phone: formData.phone,
      },

      delivery: {
        address: formData.address,
        city: formData.city,
        date: formData.deliveryDate,
        time: formData.deliveryTime,
      },

      notes: formData.notes,

      items: cartItems,

      subtotal: cartTotal,
      deliveryCharges,
      total: grandTotal,

      status: "Pending",

      statusHistory: [
        {
          status: "Pending",
          title: "Order Placed",
          date: new Date().toISOString(),
          description:
            "Your order has been received and is waiting for confirmation.",
        },
      ],

      createdAt: new Date().toISOString(),
    };

    const existingOrders = JSON.parse(
      localStorage.getItem("cakeOrders") || "[]"
    );

    localStorage.setItem(
      "cakeOrders",
      JSON.stringify([newOrder, ...existingOrders])
    );

    localStorage.setItem(
      "lastCakeOrder",
      JSON.stringify(newOrder)
    );

    clearCart();

    toast.success("Order placed successfully!");

    setTimeout(() => {
      navigate(`/my-orders/${newOrder.orderId}`);
    }, 700);
  };

  if (cartItems.length === 0) {
    return (
      <section className="checkout-empty">
        <div>
          <h1>Your cart is empty.</h1>

          <p>
            Add a cake before continuing to checkout.
          </p>

          <Link to="/cakes" className="primary-button">
            Shop Cakes
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <Toaster position="top-right" />

      <section className="checkout-page">
        <div className="container">
          <Link to="/cart" className="checkout-back-link">
            <ArrowLeft size={16} />
            Back to Cart
          </Link>

          <div className="checkout-heading">
            <span className="section-kicker">
              ALMOST THERE
            </span>

            <h1>Checkout</h1>

            <p>
              Tell us where and when you'd like your cake delivered.
            </p>
          </div>

          <form
            className="checkout-layout"
            onSubmit={handlePlaceOrder}
          >
            {/* LEFT */}

            <div className="checkout-form-side">
              {/* CONTACT */}

              <div className="checkout-card">
                <div className="checkout-card-heading">
                  <span>01</span>

                  <div>
                    <h2>Contact Information</h2>

                    <p>
                      We'll use these details for your order
                      confirmation.
                    </p>
                  </div>
                </div>

                <div className="checkout-form-grid">
                  <div className="form-group full-field">
                    <label>Full Name *</label>

                    <div className="checkout-input">
                      <User size={17} />

                      <input
                        type="text"
                        name="customerName"
                        placeholder="Your full name"
                        value={formData.customerName}
                        onChange={handleChange}
                      />
                    </div>

                    {errors.customerName && (
                      <span className="checkout-error">
                        {errors.customerName}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Email Address *</label>

                    <div className="checkout-input">
                      <Mail size={17} />

                      <input
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    {errors.email && (
                      <span className="checkout-error">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Phone Number *</label>

                    <div className="checkout-input">
                      <Phone size={17} />

                      <input
                        type="text"
                        name="phone"
                        placeholder="03XX XXXXXXX"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>

                    {errors.phone && (
                      <span className="checkout-error">
                        {errors.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* DELIVERY */}

              <div className="checkout-card">
                <div className="checkout-card-heading">
                  <span>02</span>

                  <div>
                    <h2>Delivery Details</h2>

                    <p>
                      Where should we send your order?
                    </p>
                  </div>
                </div>

                <div className="checkout-form-grid">
                  <div className="form-group full-field">
                    <label>Delivery Address *</label>

                    <div className="checkout-input">
                      <MapPin size={17} />

                      <input
                        type="text"
                        name="address"
                        placeholder="House, street, area"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>

                    {errors.address && (
                      <span className="checkout-error">
                        {errors.address}
                      </span>
                    )}
                  </div>

                  <div className="form-group full-field">
                    <label>City</label>

                    <select
                      className="checkout-select"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    >
                      <option value="Lahore">
                        Lahore
                      </option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Delivery Date *</label>

                    <div className="checkout-input">
                      <CalendarDays size={17} />

                      <input
                        type="date"
                        name="deliveryDate"
                        value={formData.deliveryDate}
                        onChange={handleChange}
                      />
                    </div>

                    {errors.deliveryDate && (
                      <span className="checkout-error">
                        {errors.deliveryDate}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Preferred Time *</label>

                    <div className="checkout-input">
                      <Clock3 size={17} />

                      <select
                        name="deliveryTime"
                        value={formData.deliveryTime}
                        onChange={handleChange}
                      >
                        <option value="">
                          Select time
                        </option>

                        <option value="10:00 AM - 12:00 PM">
                          10:00 AM - 12:00 PM
                        </option>

                        <option value="12:00 PM - 02:00 PM">
                          12:00 PM - 02:00 PM
                        </option>

                        <option value="02:00 PM - 04:00 PM">
                          02:00 PM - 04:00 PM
                        </option>

                        <option value="04:00 PM - 06:00 PM">
                          04:00 PM - 06:00 PM
                        </option>

                        <option value="06:00 PM - 08:00 PM">
                          06:00 PM - 08:00 PM
                        </option>
                      </select>
                    </div>

                    {errors.deliveryTime && (
                      <span className="checkout-error">
                        {errors.deliveryTime}
                      </span>
                    )}
                  </div>

                  <div className="form-group full-field">
                    <label>
                      Additional Notes
                    </label>

                    <textarea
                      className="checkout-textarea"
                      name="notes"
                      placeholder="Gate instructions, delivery notes or anything else we should know..."
                      rows="5"
                      value={formData.notes}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}

            <aside className="checkout-summary">
              <span className="section-kicker">
                YOUR ORDER
              </span>

              <h2>Order Summary</h2>

              <div className="checkout-summary-items">
                {cartItems.map((item, index) => (
                  <div
                    className="checkout-summary-item"
                    key={`${item.id}-${index}`}
                  >
                    <div className="checkout-summary-image">
                      <img
                        src={item.image}
                        alt={item.name}
                      />

                      <span>
                        {item.quantity}
                      </span>
                    </div>

                    <div className="checkout-summary-info">
                      <h4>{item.name}</h4>

                      <p>
                        {item.selectedSize} ·{" "}
                        {item.selectedColor}
                      </p>

                      {item.cakeMessage && (
                        <small>
                          "{item.cakeMessage}"
                        </small>
                      )}
                    </div>

                    <strong>
                      Rs.{" "}
                      {(
                        item.price * item.quantity
                      ).toLocaleString()}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="checkout-price-breakdown">
                <div>
                  <span>Subtotal</span>

                  <strong>
                    Rs. {cartTotal.toLocaleString()}
                  </strong>
                </div>

                <div>
                  <span>Delivery</span>

                  <strong>
                    Rs. {deliveryCharges.toLocaleString()}
                  </strong>
                </div>
              </div>

              <div className="checkout-grand-total">
                <span>Total</span>

                <strong>
                  Rs. {grandTotal.toLocaleString()}
                </strong>
              </div>

              <button
                type="submit"
                className="place-order-button"
              >
                Place Order

                <span>→</span>
              </button>

              <p className="checkout-confirmation-note">
                By placing your order, you confirm that the
                delivery details provided above are correct.
              </p>
            </aside>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;