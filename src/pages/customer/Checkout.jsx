import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  Phone,
  User,
  LoaderCircle,
} from "lucide-react";

import toast, {
  Toaster,
} from "react-hot-toast";

import { useCart } from "../../context/CartContext";

const API_ROOT =
  "https://coreops.pk/cakes/api";

const Checkout = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    cartTotal,
    clearCart,
  } = useCart();

  // ==========================================
  // CUSTOMER
  // ==========================================

  const [customer, setCustomer] =
    useState(null);

  const [submitting, setSubmitting] =
    useState(false);

  // ==========================================
  // FORM
  // ==========================================

  const [formData, setFormData] =
    useState({
      customerName: "",
      email: "",
      phone: "",
      address: "",
      city: "Lahore",
      deliveryDate: "",
      deliveryTime: "",
      notes: "",
    });

  const [errors, setErrors] =
    useState({});

  const deliveryCharges = 250;

  const grandTotal =
    Number(cartTotal) +
    deliveryCharges;

  // ==========================================
  // LOAD LOGGED-IN CUSTOMER
  // ==========================================

  useEffect(() => {
    try {
      const savedUser =
        localStorage.getItem(
          "loggedInCakeUser"
        );

      if (!savedUser) {
        setCustomer(null);
        return;
      }

      const parsedUser =
        JSON.parse(savedUser);

      if (!parsedUser?.id) {
        setCustomer(null);
        return;
      }

      setCustomer(parsedUser);

      setFormData((previous) => ({
        ...previous,

        customerName:
          parsedUser.name ||
          previous.customerName,

        email:
          parsedUser.email ||
          previous.email,

        phone:
          parsedUser.phone ||
          previous.phone,
      }));
    } catch (error) {
      console.error(
        "Customer loading error:",
        error
      );

      setCustomer(null);
    }
  }, []);

  // ==========================================
  // HANDLE CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  // ==========================================
  // VALIDATION
  // ==========================================

  const validateForm = () => {
    const newErrors = {};

    if (
      !formData.customerName.trim()
    ) {
      newErrors.customerName =
        "Full name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email =
        "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      newErrors.email =
        "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone =
        "Phone number is required.";
    }

    if (!formData.address.trim()) {
      newErrors.address =
        "Delivery address is required.";
    }

    if (!formData.city.trim()) {
      newErrors.city =
        "City is required.";
    }

    if (!formData.deliveryDate) {
      newErrors.deliveryDate =
        "Delivery date is required.";
    }

    if (!formData.deliveryTime) {
      newErrors.deliveryTime =
        "Delivery time is required.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };

  // ==========================================
  // PLACE ORDER
  // ==========================================

  const handlePlaceOrder =
    async (event) => {
      event.preventDefault();

      if (submitting) {
        return;
      }

      // ======================================
      // LOGIN CHECK
      // ======================================

      if (!customer?.id) {
        toast.error(
          "Please sign in before placing your order."
        );

        setTimeout(() => {
          navigate("/login");
        }, 700);

        return;
      }

      // ======================================
      // FORM CHECK
      // ======================================

      if (!validateForm()) {
        toast.error(
          "Please complete the required fields."
        );

        return;
      }

      // ======================================
      // CART CHECK
      // ======================================

      if (
        !Array.isArray(
          cartItems
        ) ||
        cartItems.length === 0
      ) {
        toast.error(
          "Your cart is empty."
        );

        return;
      }

      // ======================================
      // VALIDATE API IDS
      // ======================================

      const invalidItem =
        cartItems.find(
          (item) => {
            const cakeId =
              Number(
                item.cake_id ||
                  item.id ||
                  0
              );

            const sizeId =
              Number(
                item.size_id ||
                  item.selectedSizeId ||
                  0
              );

            return (
              cakeId <= 0 ||
              sizeId <= 0
            );
          }
        );

      if (invalidItem) {
        toast.error(
          "Your cart contains old cake data. Please remove the items and add them again."
        );

        return;
      }

      // ======================================
      // ORDER ITEMS
      // ======================================

      const orderItems =
        cartItems.map((item) => {
          const cakeId =
            Number(
              item.cake_id ||
                item.id
            );

          const sizeId =
            Number(
              item.size_id ||
                item.selectedSizeId
            );

          const rawColorId =
            item.color_id ||
            item.selectedColorId ||
            null;

          const colorId =
            rawColorId
              ? Number(rawColorId)
              : null;

          return {
            cake_id: cakeId,

            size_id: sizeId,

            color_id: colorId,

            quantity: Number(
              item.quantity || 1
            ),

            special_instructions:
              item.cakeMessage ||
              "",
          };
        });

      // ======================================
      // REQUEST
      // ======================================

      const payload = {
        customer_id: Number(
          customer.id
        ),

        customer_name:
          formData.customerName.trim(),

        customer_email:
          formData.email
            .trim()
            .toLowerCase(),

        customer_phone:
          formData.phone.trim(),

        delivery_address:
          formData.address.trim(),

        delivery_city:
          formData.city.trim(),

        delivery_date:
          formData.deliveryDate,

        delivery_time:
          formData.deliveryTime,

        notes:
          formData.notes.trim(),

        delivery_charges:
          deliveryCharges,

        discount: 0,

        payment_method:
          "Cash on Delivery",

        items: orderItems,
      };

      try {
        setSubmitting(true);

        const response =
          await fetch(
            `${API_ROOT}/Orders/add.php`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                payload
              ),
            }
          );

        let result;

        try {
          result =
            await response.json();
        } catch {
          throw new Error(
            "Server returned an invalid response."
          );
        }

        console.log(
          "Order API response:",
          result
        );

        if (
          !response.ok ||
          result.status !==
            "success"
        ) {
          throw new Error(
            result.message ||
              "Unable to place order."
          );
        }

        // ====================================
        // ORDER DATA FROM API
        // ====================================

        const responseData =
          result.data || {};

        const orderId =
          responseData.order_id ||
          result.order_id ||
          responseData.id ||
          null;

        const orderNumber =
          responseData.order_number ||
          result.order_number ||
          "";

        if (!orderId) {
          throw new Error(
            "Order was created but order ID was not returned."
          );
        }

        // ====================================
        // SAVE ONLY LAST ORDER REFERENCE
        // ====================================

        localStorage.setItem(
          "lastCakeOrder",
          JSON.stringify({
            id: Number(orderId),

            order_id:
              Number(orderId),

            order_number:
              orderNumber,

            customer_id:
              Number(customer.id),
          })
        );

        // ====================================
        // CLEAR CART ONLY AFTER SUCCESS
        // ====================================

        clearCart();

        toast.success(
          orderNumber
            ? `Order ${orderNumber} placed successfully!`
            : "Order placed successfully!"
        );

        // ====================================
        // ORDER DETAILS
        // ====================================

        setTimeout(() => {
          navigate(
            `/my-orders/${orderId}`
          );
        }, 700);
      } catch (error) {
        console.error(
          "Place order error:",
          error
        );

        toast.error(
          error.message ||
            "Unable to place order."
        );
      } finally {
        setSubmitting(false);
      }
    };

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (cartItems.length === 0) {
    return (
      <>
        <Toaster position="top-right" />

        <section className="checkout-empty">
          <div>
            <h1>
              Your cart is empty.
            </h1>

            <p>
              Add a cake before
              continuing to checkout.
            </p>

            <Link
              to="/cakes"
              className="primary-button"
            >
              Shop Cakes
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" />

      <section className="checkout-page">
        <div className="container">
          <Link
            to="/cart"
            className="checkout-back-link"
          >
            <ArrowLeft size={16} />
            Back to Cart
          </Link>

          <div className="checkout-heading">
            <span className="section-kicker">
              ALMOST THERE
            </span>

            <h1>
              Checkout
            </h1>

            <p>
              Tell us where and when
              you'd like your cake
              delivered.
            </p>
          </div>

          <form
            className="checkout-layout"
            onSubmit={
              handlePlaceOrder
            }
          >
            {/* LEFT */}

            <div className="checkout-form-side">
              {/* CONTACT */}

              <div className="checkout-card">
                <div className="checkout-card-heading">
                  <span>
                    01
                  </span>

                  <div>
                    <h2>
                      Contact
                      Information
                    </h2>

                    <p>
                      We'll use these
                      details for your
                      order confirmation.
                    </p>
                  </div>
                </div>

                <div className="checkout-form-grid">
                  {/* NAME */}

                  <div className="form-group full-field">
                    <label>
                      Full Name *
                    </label>

                    <div className="checkout-input">
                      <User
                        size={17}
                      />

                      <input
                        type="text"
                        name="customerName"
                        placeholder="Your full name"
                        value={
                          formData.customerName
                        }
                        onChange={
                          handleChange
                        }
                        disabled={
                          submitting
                        }
                      />
                    </div>

                    {errors.customerName && (
                      <span className="checkout-error">
                        {
                          errors.customerName
                        }
                      </span>
                    )}
                  </div>

                  {/* EMAIL */}

                  <div className="form-group">
                    <label>
                      Email Address *
                    </label>

                    <div className="checkout-input">
                      <Mail
                        size={17}
                      />

                      <input
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={
                          formData.email
                        }
                        onChange={
                          handleChange
                        }
                        disabled={
                          submitting
                        }
                      />
                    </div>

                    {errors.email && (
                      <span className="checkout-error">
                        {
                          errors.email
                        }
                      </span>
                    )}
                  </div>

                  {/* PHONE */}

                  <div className="form-group">
                    <label>
                      Phone Number *
                    </label>

                    <div className="checkout-input">
                      <Phone
                        size={17}
                      />

                      <input
                        type="text"
                        name="phone"
                        placeholder="03XX XXXXXXX"
                        value={
                          formData.phone
                        }
                        onChange={
                          handleChange
                        }
                        disabled={
                          submitting
                        }
                      />
                    </div>

                    {errors.phone && (
                      <span className="checkout-error">
                        {
                          errors.phone
                        }
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* DELIVERY */}

              <div className="checkout-card">
                <div className="checkout-card-heading">
                  <span>
                    02
                  </span>

                  <div>
                    <h2>
                      Delivery Details
                    </h2>

                    <p>
                      Where should we
                      send your order?
                    </p>
                  </div>
                </div>

                <div className="checkout-form-grid">
                  {/* ADDRESS */}

                  <div className="form-group full-field">
                    <label>
                      Delivery Address *
                    </label>

                    <div className="checkout-input">
                      <MapPin
                        size={17}
                      />

                      <input
                        type="text"
                        name="address"
                        placeholder="House, street, area"
                        value={
                          formData.address
                        }
                        onChange={
                          handleChange
                        }
                        disabled={
                          submitting
                        }
                      />
                    </div>

                    {errors.address && (
                      <span className="checkout-error">
                        {
                          errors.address
                        }
                      </span>
                    )}
                  </div>

                  {/* CITY */}

                  <div className="form-group full-field">
                    <label>
                      City
                    </label>

                    <select
                      className="checkout-select"
                      name="city"
                      value={
                        formData.city
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        submitting
                      }
                    >
                      <option value="Lahore">
                        Lahore
                      </option>
                    </select>
                  </div>

                  {/* DATE */}

                  <div className="form-group">
                    <label>
                      Delivery Date *
                    </label>

                    <div className="checkout-input">
                      <CalendarDays
                        size={17}
                      />

                      <input
                        type="date"
                        name="deliveryDate"
                        value={
                          formData.deliveryDate
                        }
                        onChange={
                          handleChange
                        }
                        disabled={
                          submitting
                        }
                      />
                    </div>

                    {errors.deliveryDate && (
                      <span className="checkout-error">
                        {
                          errors.deliveryDate
                        }
                      </span>
                    )}
                  </div>

                  {/* TIME */}

                  <div className="form-group">
                    <label>
                      Preferred Time *
                    </label>

                    <div className="checkout-input">
                      <Clock3
                        size={17}
                      />

                      <select
                        name="deliveryTime"
                        value={
                          formData.deliveryTime
                        }
                        onChange={
                          handleChange
                        }
                        disabled={
                          submitting
                        }
                      >
                        <option value="">
                          Select time
                        </option>

                        <option value="10:00 AM - 12:00 PM">
                          10:00 AM -
                          12:00 PM
                        </option>

                        <option value="12:00 PM - 02:00 PM">
                          12:00 PM -
                          02:00 PM
                        </option>

                        <option value="02:00 PM - 04:00 PM">
                          02:00 PM -
                          04:00 PM
                        </option>

                        <option value="04:00 PM - 06:00 PM">
                          04:00 PM -
                          06:00 PM
                        </option>

                        <option value="06:00 PM - 08:00 PM">
                          06:00 PM -
                          08:00 PM
                        </option>
                      </select>
                    </div>

                    {errors.deliveryTime && (
                      <span className="checkout-error">
                        {
                          errors.deliveryTime
                        }
                      </span>
                    )}
                  </div>

                  {/* NOTES */}

                  <div className="form-group full-field">
                    <label>
                      Additional Notes
                    </label>

                    <textarea
                      className="checkout-textarea"
                      name="notes"
                      placeholder="Gate instructions, delivery notes or anything else we should know..."
                      rows="5"
                      value={
                        formData.notes
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        submitting
                      }
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

              <h2>
                Order Summary
              </h2>

              <div className="checkout-summary-items">
                {cartItems.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      className="checkout-summary-item"
                      key={`${
                        item.cake_id ||
                        item.id
                      }-${
                        item.size_id ||
                        item.selectedSizeId
                      }-${
                        item.color_id ||
                        item.selectedColorId ||
                        "no-color"
                      }-${index}`}
                    >
                      <div className="checkout-summary-image">
                        {item.image ? (
                          <img
                            src={
                              item.image
                            }
                            alt={
                              item.name
                            }
                          />
                        ) : (
                          <div>
                            No Image
                          </div>
                        )}

                        <span>
                          {
                            item.quantity
                          }
                        </span>
                      </div>

                      <div className="checkout-summary-info">
                        <h4>
                          {item.name}
                        </h4>

                        <p>
                          {
                            item.selectedSize
                          }

                          {item.selectedColor
                            ? ` · ${item.selectedColor}`
                            : ""}
                        </p>

                        {item.cakeMessage && (
                          <small>
                            "
                            {
                              item.cakeMessage
                            }
                            "
                          </small>
                        )}
                      </div>

                      <strong>
                        Rs.{" "}
                        {(
                          Number(
                            item.price ||
                              0
                          ) *
                          Number(
                            item.quantity ||
                              0
                          )
                        ).toLocaleString()}
                      </strong>
                    </div>
                  )
                )}
              </div>

              {/* PRICES */}

              <div className="checkout-price-breakdown">
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

                  <strong>
                    Rs.{" "}
                    {deliveryCharges.toLocaleString()}
                  </strong>
                </div>
              </div>

              <div className="checkout-grand-total">
                <span>
                  Total
                </span>

                <strong>
                  Rs.{" "}
                  {grandTotal.toLocaleString()}
                </strong>
              </div>

              {/* PLACE ORDER */}

              <button
                type="submit"
                className="place-order-button"
                disabled={
                  submitting
                }
              >
                {submitting ? (
                  <>
                    <LoaderCircle
                      size={17}
                    />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order
                    <span>→</span>
                  </>
                )}
              </button>

              <p className="checkout-confirmation-note">
                By placing your order,
                you confirm that the
                delivery details
                provided above are
                correct.
              </p>
            </aside>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;