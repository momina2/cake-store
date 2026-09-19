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
  Landmark,
  CreditCard,
  ScrollText,
  CircleCheck,
  X,
  FileText,
  Upload,
  Copy,
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
  // PAYMENT SETTINGS
  // ==========================================

  const [
    paymentSettings,
    setPaymentSettings,
  ] = useState(null);

  const [
    paymentLoading,
    setPaymentLoading,
  ] = useState(true);

  const [
    paymentError,
    setPaymentError,
  ] = useState("");

  const [
    paymentReceipt,
    setPaymentReceipt,
  ] = useState(null);

  const [
    paymentReceiptPath,
    setPaymentReceiptPath,
  ] = useState("");

  const [
    uploadingReceipt,
    setUploadingReceipt,
  ] = useState(false);

  const [
    copiedValue,
    setCopiedValue,
  ] = useState("");

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

      setFormData(
        (previous) => ({
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
        })
      );
    } catch (error) {
      console.error(
        "Customer loading error:",
        error
      );

      setCustomer(null);
    }
  }, []);

  // ==========================================
  // LOAD PAYMENT SETTINGS
  // ==========================================

  useEffect(() => {
    const loadPaymentSettings =
      async () => {
        try {
          setPaymentLoading(true);
          setPaymentError("");

          const response =
            await fetch(
              `${API_ROOT}/PaymentSettings/get.php`,
              { method: "GET" }
            );

          const result =
            await response.json();

          if (
            !response.ok ||
            result.status !== "success"
          ) {
            throw new Error(
              result.message ||
                "Unable to load payment details."
            );
          }

          const data =
            result.data || {};

          const accounts =
            Array.isArray(data.accounts)
              ? data.accounts.filter(
                  (account) =>
                    account &&
                    account.status === "Active"
                )
              : [];

          if (!accounts.length) {
            throw new Error(
              "No active payment account has been configured yet."
            );
          }

          setPaymentSettings({
            payment_method:
              data.payment_method ||
              "Advance Payment",
            instructions:
              data.instructions || "",
            accounts,
          });
        } catch (error) {
          console.error(
            "Payment settings loading error:",
            error
          );

          setPaymentSettings(null);

          setPaymentError(
            error.message ||
              "Unable to load payment details."
          );
        } finally {
          setPaymentLoading(false);
        }
      };

    loadPaymentSettings();
  }, []);

  // ==========================================
  // COPY PAYMENT VALUE
  // ==========================================

  const copyPaymentValue =
    async (value) => {
      if (!value) return;

      try {
        await navigator.clipboard.writeText(
          String(value)
        );

        setCopiedValue(String(value));

        window.setTimeout(
          () => setCopiedValue(""),
          1600
        );
      } catch {
        toast.error(
          "Unable to copy value."
        );
      }
    };

  // ==========================================
  // PAYMENT RECEIPT
  // ==========================================

  const handleReceiptChange =
    async (event) => {
      const file =
        event.target.files?.[0];

      if (!file) return;

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "application/pdf",
      ];

      if (
        !allowedTypes.includes(
          file.type
        )
      ) {
        toast.error(
          "Please upload JPG, PNG or PDF receipt."
        );
        event.target.value = "";
        return;
      }

      if (
        file.size >
        5 * 1024 * 1024
      ) {
        toast.error(
          "Receipt must be 5 MB or smaller."
        );
        event.target.value = "";
        return;
      }

      try {
        setUploadingReceipt(true);

        const body =
          new FormData();

        body.append(
          "receipt",
          file
        );

        const response =
          await fetch(
            `${API_ROOT}/PaymentReceipts/upload.php`,
            {
              method: "POST",
              body,
            }
          );

        const result =
          await response.json();

        if (
          !response.ok ||
          result.status !== "success"
        ) {
          throw new Error(
            result.message ||
              "Unable to upload receipt."
          );
        }

        const path =
          result.data?.path ||
          result.path ||
          "";

        if (!path) {
          throw new Error(
            "Receipt path was not returned."
          );
        }

        setPaymentReceipt(file);
        setPaymentReceiptPath(path);

        toast.success(
          "Payment receipt uploaded."
        );
      } catch (error) {
        console.error(
          "Receipt upload error:",
          error
        );

        setPaymentReceipt(null);
        setPaymentReceiptPath("");

        toast.error(
          error.message ||
            "Unable to upload receipt."
        );
      } finally {
        setUploadingReceipt(false);
        event.target.value = "";
      }
    };

  const removeReceipt = () => {
    setPaymentReceipt(null);
    setPaymentReceiptPath("");
  };

  // ==========================================
  // HANDLE CHANGE
  // ==========================================

  const handleChange = (
    event
  ) => {
    const { name, value } =
      event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    setErrors(
      (previous) => ({
        ...previous,
        [name]: "",
      })
    );
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

    if (
      !formData.deliveryDate
    ) {
      newErrors.deliveryDate =
        "Delivery date is required.";
    }

    if (
      !formData.deliveryTime
    ) {
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
      // LOGIN
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
      // PAYMENT
      // ======================================

      if (paymentLoading) {
        toast.error(
          "Payment details are still loading. Please wait."
        );

        return;
      }

      if (
        !paymentSettings ||
        paymentError
      ) {
        toast.error(
          "Payment details are currently unavailable. Please try again later."
        );

        return;
      }

      // ======================================
      // FORM
      // ======================================

      if (!validateForm()) {
        toast.error(
          "Please complete the required fields."
        );

        return;
      }

      // ======================================
      // CART
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

            const flavourId =
              Number(
                item.flavour_id ||
                  item.selectedFlavourId ||
                  0
              );

            return (
              cakeId <= 0 ||
              sizeId <= 0 ||
              flavourId <= 0
            );
          }
        );

      if (invalidItem) {
        toast.error(
          "Your cart contains old or incomplete cake data. Please remove the items and add them again."
        );

        return;
      }

      // ======================================
      // ORDER ITEMS
      // ======================================

      if (!paymentReceiptPath) {
        toast.error(
          "Please upload your payment receipt before placing the order."
        );
        return;
      }

      const orderItems =
        cartItems.map(
          (item) => {
            // ================================
            // CAKE
            // ================================

            const cakeId =
              Number(
                item.cake_id ||
                  item.id
              );

            // ================================
            // SIZE
            // ================================

            const sizeId =
              Number(
                item.size_id ||
                  item.selectedSizeId
              );

            // ================================
            // COLOR
            // ================================

            const rawColorId =
              item.color_id ??
              item.selectedColorId ??
              null;

            const colorId =
              rawColorId &&
              Number(
                rawColorId
              ) > 0
                ? Number(
                    rawColorId
                  )
                : null;

            // ================================
            // FLAVOUR
            // ================================

            const rawFlavourId =
              item.flavour_id ??
              item.selectedFlavourId ??
              null;

            const flavourId =
              rawFlavourId &&
              Number(
                rawFlavourId
              ) > 0
                ? Number(
                    rawFlavourId
                  )
                : null;

            // ================================
            // FILLING
            // ================================

            const rawFillingId =
              item.filling_id ??
              item.selectedFillingId ??
              null;

            const fillingId =
              rawFillingId &&
              Number(
                rawFillingId
              ) > 0
                ? Number(
                    rawFillingId
                  )
                : null;

            // ================================
            // REFERENCE IMAGE
            // ================================

            const referenceImage =
              item.reference_image ||
              item.referenceImage ||
              "";

            return {
              cake_id:
                cakeId,

              size_id:
                sizeId,

              color_id:
                colorId,

              // Backend validates flavour.
              flavour_id:
                flavourId,

              // Backend gets actual filling
              // name + charge from DB.
              filling_id:
                fillingId,

              reference_image:
                referenceImage,

              quantity:
                Number(
                  item.quantity ||
                    1
                ),

              special_instructions:
                item.cakeMessage ||
                "",
            };
          }
        );

      // ======================================
      // REQUEST
      // ======================================

      const payload = {
        customer_id:
          Number(
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
          paymentSettings?.payment_method ||
          "Advance Payment",

        payment_receipt:
          paymentReceiptPath,

        items:
          orderItems,
      };

      try {
        setSubmitting(true);

        const response =
          await fetch(
            `${API_ROOT}/Orders/add.php`,
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
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
        // ORDER DATA
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
        // LAST ORDER
        // ====================================

        localStorage.setItem(
          "lastCakeOrder",
          JSON.stringify({
            id:
              Number(orderId),

            order_id:
              Number(orderId),

            order_number:
              orderNumber,

            customer_id:
              Number(
                customer.id
              ),
          })
        );

        // ====================================
        // CLEAR CART
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

  if (
    cartItems.length === 0
  ) {
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
              continuing to
              checkout.
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

  // ==========================================
  // UI
  // ==========================================

  return (
    <>
      <Toaster position="top-right" />

      <section className="checkout-page">
        <div className="container">
          <Link
            to="/cart"
            className="checkout-back-link"
          >
            <ArrowLeft
              size={16}
            />

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
              Enter your delivery
              details and complete
              your advance payment.
            </p>
          </div>

          <form
            className="checkout-layout"
            onSubmit={
              handlePlaceOrder
            }
          >
            {/* ==================================
                LEFT
            ================================== */}

            <div className="checkout-form-side">

              {/* ================================
                  01 CONTACT
              ================================ */}

              <div className="checkout-card">
                <div className="checkout-card-heading">
                  <span>
                    01
                  </span>

                  <div>
                    <h2>
                      Contact Information
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

              {/* ================================
                  02 DELIVERY
              ================================ */}

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
                      Where and when
                      should we send
                      your order?
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

              {/* ================================
                  03 PAYMENT
              ================================ */}

              <div className="checkout-card checkout-payment-card">
                <div className="checkout-card-heading">
                  <span>
                    03
                  </span>

                  <div>
                    <h2>
                      Advance Payment
                    </h2>

                    <p>
                      Please transfer
                      the payment using
                      the account details
                      below.
                    </p>
                  </div>
                </div>

                {paymentLoading ? (
                  <div className="checkout-payment-loading">
                    <LoaderCircle
                      size={20}
                      className="checkout-payment-spinner"
                    />

                    <span>
                      Loading payment
                      details...
                    </span>
                  </div>
                ) : paymentError ? (
                  <div className="checkout-payment-error">
                    <strong>
                      Payment details
                      unavailable
                    </strong>

                    <p>
                      {paymentError}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="checkout-payment-banner">
                      <div className="checkout-payment-banner-icon">
                        <CircleCheck
                          size={20}
                        />
                      </div>

                      <div>
                        <strong>
                          {paymentSettings
                            ?.payment_method ||
                            "Advance Payment"}
                        </strong>

                        <p>
                          Transfer the
                          order amount
                          before placing
                          your order.
                        </p>
                      </div>
                    </div>

                    {paymentSettings
                      ?.instructions && (
                      <div className="checkout-payment-instructions checkout-payment-instructions-top">
                        <ScrollText size={18} />

                        <div>
                          <strong>
                            Payment Instructions
                          </strong>

                          <p>
                            {
                              paymentSettings.instructions
                            }
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="checkout-payment-accounts">
                      {paymentSettings
                        ?.accounts?.map(
                          (account, index) => (
                            <div
                              className="checkout-payment-account-card"
                              key={
                                account.id ||
                                `${account.account_number}-${index}`
                              }
                            >
                              <div className="checkout-payment-account-heading">
                                <div className="checkout-bank-icon">
                                  <Landmark size={18} />
                                </div>

                                <div>
                                  <span>
                                    Payment Account {index + 1}
                                  </span>

                                  <strong>
                                    {account.bank_name}
                                  </strong>
                                </div>
                              </div>

                              <div className="checkout-bank-details">
                                <div className="checkout-bank-detail">
                                  <div className="checkout-bank-icon">
                                    <User size={18} />
                                  </div>

                                  <div>
                                    <span>
                                      Account Title
                                    </span>
                                    <strong>
                                      {account.account_title}
                                    </strong>
                                  </div>
                                </div>

                                <div className="checkout-bank-detail">
                                  <div className="checkout-bank-icon">
                                    <CreditCard size={18} />
                                  </div>

                                  <div>
                                    <span>
                                      Account Number
                                    </span>

                                    <div className="checkout-copy-value-row">
                                      <strong>
                                        {account.account_number}
                                      </strong>

                                      <button
                                        type="button"
                                        className="checkout-copy-button"
                                        onClick={() =>
                                          copyPaymentValue(
                                            account.account_number
                                          )
                                        }
                                      >
                                        <Copy size={14} />
                                        <span>
                                          {copiedValue ===
                                          String(account.account_number)
                                            ? "Copied!"
                                            : "Copy"}
                                        </span>
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {account.iban && (
                                  <div className="checkout-bank-detail checkout-bank-detail-full">
                                    <div className="checkout-bank-icon">
                                      <Landmark size={18} />
                                    </div>

                                    <div>
                                      <span>IBAN</span>

                                      <div className="checkout-copy-value-row">
                                        <strong className="checkout-bank-long-value">
                                          {account.iban}
                                        </strong>

                                        <button
                                          type="button"
                                          className="checkout-copy-button"
                                          onClick={() =>
                                            copyPaymentValue(
                                              account.iban
                                            )
                                          }
                                        >
                                          <Copy size={14} />
                                          <span>
                                            {copiedValue ===
                                            String(account.iban)
                                              ? "Copied!"
                                              : "Copy"}
                                          </span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        )}
                    </div>

                    <div className="checkout-receipt-upload">
                      <div className="checkout-receipt-heading">
                        <div>
                          <span>
                            PAYMENT RECEIPT *
                          </span>
                          <strong>
                            Upload Payment Proof
                          </strong>
                          <p>
                            Transfer the amount, then upload your JPG,
                            PNG or PDF receipt before placing the order.
                          </p>
                        </div>
                      </div>

                      {!paymentReceiptPath ? (
                        <label className="checkout-receipt-dropzone">
                          {uploadingReceipt ? (
                            <LoaderCircle
                              size={22}
                              className="checkout-receipt-spinner"
                            />
                          ) : (
                            <Upload size={22} />
                          )}

                          <strong>
                            {uploadingReceipt
                              ? "Uploading receipt..."
                              : "Choose Receipt"}
                          </strong>

                          <span>
                            JPG, PNG or PDF · Max 5 MB
                          </span>

                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                            onChange={handleReceiptChange}
                            disabled={uploadingReceipt}
                          />
                        </label>
                      ) : (
                        <div className="checkout-receipt-file">
                          <div className="checkout-receipt-file-icon">
                            <FileText size={20} />
                          </div>

                          <div className="checkout-receipt-file-info">
                            <strong>
                              {paymentReceipt?.name ||
                                "Payment receipt"}
                            </strong>
                            <span>
                              Receipt uploaded successfully
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={removeReceipt}
                            aria-label="Remove receipt"
                            title="Remove receipt"
                          >
                            <X size={17} />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="checkout-payment-total">
                      <span>
                        Amount to
                        Transfer
                      </span>

                      <strong>
                        Rs.{" "}
                        {grandTotal.toLocaleString()}
                      </strong>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ==================================
                RIGHT - ORDER SUMMARY
            ================================== */}

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
                  ) => {
                    // ==========================
                    // FLAVOUR
                    // ==========================

                    const flavourName =
                      item.selectedFlavour ||
                      item.selected_flavour ||
                      "";

                    // ==========================
                    // FILLING
                    // ==========================

                    const fillingName =
                      item.selectedFilling ||
                      item.selected_filling ||
                      "";

                    const fillingCharge =
                      Number(
                        item.filling_charge ||
                          0
                      );

                    // ==========================
                    // REFERENCE IMAGE
                    // ==========================

                    const referenceImage =
                      item.reference_image ||
                      item.referenceImage ||
                      "";

                    return (
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
                        }-${
                          item.flavour_id ||
                          item.selectedFlavourId ||
                          flavourName ||
                          "no-flavour"
                        }-${
                          item.filling_id ||
                          item.selectedFillingId ||
                          fillingName ||
                          "no-filling"
                        }-${
                          referenceImage ||
                          "no-reference"
                        }-${index}`}
                      >
                        {/* CAKE IMAGE */}

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

                        {/* DETAILS */}

                        <div className="checkout-summary-info">
                          <h4>
                            {item.name}
                          </h4>

                          {/* SIZE + COLOR */}

                          <p>
                            {item.selectedSize ||
                              item.selected_size}

                            {(item.selectedColor ||
                              item.selected_color)
                              ? ` · ${
                                  item.selectedColor ||
                                  item.selected_color
                                }`
                              : ""}
                          </p>

                          {/* FLAVOUR */}

                          <p
                            style={{
                              marginTop:
                                "4px",
                            }}
                          >
                            Flavour:{" "}
                            <strong>
                              {flavourName ||
                                "—"}
                            </strong>
                          </p>

                          {/* FILLING */}

                          <p
                            style={{
                              marginTop:
                                "4px",
                            }}
                          >
                            Filling:{" "}
                            <strong>
                              {fillingName ||
                                "No Filling"}
                            </strong>

                            {fillingName &&
                            fillingCharge >
                              0
                              ? ` (+ Rs. ${fillingCharge.toLocaleString()})`
                              : ""}
                          </p>

                          {/* REFERENCE IMAGE */}

                          {referenceImage && (
                            <div
                              style={{
                                marginTop:
                                  "9px",
                              }}
                            >
                              <span
                                style={{
                                  display:
                                    "block",

                                  marginBottom:
                                    "5px",

                                  fontSize:
                                    "10px",

                                  color:
                                    "var(--text-soft)",
                                }}
                              >
                                Reference Cake
                              </span>

                              <a
                                href={
                                  referenceImage
                                }
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  display:
                                    "inline-block",
                                }}
                              >
                                <img
                                  src={
                                    referenceImage
                                  }
                                  alt="Cake reference"
                                  style={{
                                    display:
                                      "block",

                                    width:
                                      "72px",

                                    height:
                                      "72px",

                                    objectFit:
                                      "cover",

                                    borderRadius:
                                      "7px",

                                    border:
                                      "1px solid var(--border)",
                                  }}
                                />
                              </a>
                            </div>
                          )}

                          {/* MESSAGE */}

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

                        {/* PRICE */}

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
                    );
                  }
                )}
              </div>

              {/* ==================================
                  PRICES
              ================================== */}

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

              {/* ==================================
                  PAYMENT METHOD
              ================================== */}

              <div className="checkout-summary-payment-method">
                <span>
                  Payment Method
                </span>

                <strong>
                  {paymentSettings
                    ?.payment_method ||
                    "Advance Payment"}
                </strong>
              </div>

              {/* ==================================
                  PLACE ORDER
              ================================== */}

              <button
                type="submit"
                className="place-order-button"
                disabled={
                  submitting ||
                  paymentLoading ||
                  !paymentSettings ||
                  Boolean(
                    paymentError
                  )
                }
              >
                {submitting ? (
                  <>
                    <LoaderCircle
                      size={17}
                    />

                    Placing Order...
                  </>
                ) : paymentLoading ? (
                  <>
                    <LoaderCircle
                      size={17}
                    />

                    Loading Payment...
                  </>
                ) : (
                  <>
                    Place Order
                    <span>→</span>
                  </>
                )}
              </button>

              {paymentError && (
                <p className="checkout-payment-blocked">
                  Order placement is
                  temporarily unavailable
                  until payment details
                  are configured.
                </p>
              )}

              <p className="checkout-confirmation-note">
                By placing your order,
                you confirm that the
                delivery and payment
                details provided above
                are correct.
              </p>
            </aside>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;