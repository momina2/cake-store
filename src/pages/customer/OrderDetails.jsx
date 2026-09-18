import { useEffect, useState } from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Check,
  Clock3,
  MapPin,
  Package,
  LoaderCircle,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";

const API_ROOT =
  "https://coreops.pk/cakes/api";

const SITE_ROOT =
  "https://coreops.pk/cakes";


// ==========================================
// REFERENCE IMAGE URL
// ==========================================

const getReferenceImageUrl = (value) => {
  if (!value) {
    return "";
  }

  const image = String(value).trim();

  if (!image) {
    return "";
  }

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  return `${SITE_ROOT}/${image.replace(
    /^\/+/,
    ""
  )}`;
};


const OrderDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [order, setOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================
  // STATUSES
  // ==========================================

  const statuses = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Ready",
    "Out for Delivery",
    "Delivered",
  ];


  // ==========================================
  // GET CUSTOMER
  // ==========================================

  const getLoggedInCustomer = () => {
    try {
      const saved =
        localStorage.getItem(
          "loggedInCakeUser"
        );

      if (!saved) {
        return null;
      }

      const customer =
        JSON.parse(saved);

      return customer?.id
        ? customer
        : null;

    } catch {
      return null;
    }
  };


  // ==========================================
  // NORMALIZE ORDER
  // ==========================================

  const normalizeOrder = (
    rawOrder
  ) => {

    const customerSnapshot =
      rawOrder.customer_snapshot ||
      rawOrder.customer ||
      {};

    const delivery =
      rawOrder.delivery || {};

    const rawItems =
      Array.isArray(rawOrder.items)
        ? rawOrder.items
        : [];


    // ========================================
    // NORMALIZE ITEMS
    // ========================================

    const items = rawItems.map(
      (item) => {

        const fillingId = Number(
          item.filling_id ||
            item.fillingId ||
            0
        );

        const fillingName =
          item.selected_filling ||
          item.selectedFilling ||
          "";

        const fillingCharge =
          Number(
            item.filling_charge ||
              item.fillingCharge ||
              0
          );


        const flavourId = Number(
          item.flavour_id ||
            item.flavourId ||
            0
        );

        const flavourName =
          item.selected_flavour ||
          item.selectedFlavour ||
          "";


        const rawReferenceImage =
          item.reference_image_url ||
          item.reference_image ||
          item.referenceImage ||
          "";

        const referenceImage =
          getReferenceImageUrl(
            rawReferenceImage
          );


        const unitPrice =
          Number(
            item.unit_price ||
              item.price ||
              0
          );

        const quantity =
          Number(
            item.quantity || 0
          );

        const lineTotal =
          Number(
            item.line_total ||
              unitPrice *
                quantity
          );


        return {

          id: Number(
            item.id || 0
          ),

          cakeId: Number(
            item.cake_id || 0
          ),

          name:
            item.cake_name ||
            item.name ||
            "",

          image:
            item.cake_image ||
            item.image ||
            "",


          // ==================================
          // SIZE + COLOR
          // ==================================

          selectedSize:
            item.selected_size ||
            item.selectedSize ||
            "",

          selectedColor:
            item.selected_color ||
            item.selectedColor ||
            "",


          // ==================================
          // FILLING
          // ==================================

          fillingId,

          fillingName,

          fillingCharge,


          // ==================================
          // FLAVOUR
          // ==================================

          flavourId,

          flavourName,


          // ==================================
          // REFERENCE IMAGE
          // ==================================

          referenceImage,


          // ==================================
          // PRICE
          // ==================================

          price:
            unitPrice,

          quantity,

          lineTotal,


          // ==================================
          // MESSAGE
          // ==================================

          cakeMessage:
            item.special_instructions ||
            item.cakeMessage ||
            "",
        };
      }
    );


    // ========================================
    // NORMALIZED ORDER
    // ========================================

    return {

      id: Number(
        rawOrder.id ||
          rawOrder.order_id ||
          0
      ),

      orderNumber:
        rawOrder.order_number ||
        rawOrder.orderNumber ||
        "",


      // ======================================
      // CUSTOMER
      // ======================================

      customer: {

        name:
          customerSnapshot.name ||
          rawOrder.customer_name ||
          "",

        email:
          customerSnapshot.email ||
          rawOrder.customer_email ||
          "",

        phone:
          customerSnapshot.phone ||
          rawOrder.customer_phone ||
          "",
      },


      // ======================================
      // DELIVERY
      // ======================================

      delivery: {

        address:
          delivery.address ||
          rawOrder.delivery_address ||
          "",

        city:
          delivery.city ||
          rawOrder.delivery_city ||
          "",

        date:
          delivery.date ||
          rawOrder.delivery_date ||
          "",

        time:
          delivery.time ||
          rawOrder.delivery_time ||
          "",
      },


      notes:
        rawOrder.notes || "",


      items,


      // ======================================
      // TOTALS
      // ======================================

      subtotal:
        Number(
          rawOrder.subtotal || 0
        ),

      deliveryCharges:
        Number(
          rawOrder.delivery_charges ||
            rawOrder.deliveryCharges ||
            0
        ),

      discount:
        Number(
          rawOrder.discount || 0
        ),

      total:
        Number(
          rawOrder.total || 0
        ),


      // ======================================
      // PAYMENT
      // ======================================

      paymentMethod:
        rawOrder.payment_method ||
        "Advance Payment",

      paymentStatus:
        rawOrder.payment_status ||
        "Pending",


      // ======================================
      // STATUS
      // ======================================

      status:
        rawOrder.status ||
        "Pending",


      // ======================================
      // DATE
      // ======================================

      createdAt:
        rawOrder.placed_at ||
        rawOrder.created_at ||
        rawOrder.createdAt ||
        "",


      // ======================================
      // HISTORY
      // ======================================

      statusHistory:
        Array.isArray(
          rawOrder.status_history
        )
          ? rawOrder.status_history
          : [],
    };
  };


  // ==========================================
  // FETCH ORDER + AUTO REFRESH
  // ==========================================

  useEffect(() => {

    let active = true;

    let intervalId = null;

    let firstLoad = true;


    const loadOrder = async (
      silent = false
    ) => {

      const customer =
        getLoggedInCustomer();


      if (!customer) {

        if (active) {

          setLoading(false);

          navigate("/login");
        }

        return;
      }


      const orderId =
        Number(id);


      if (
        !Number.isFinite(
          orderId
        ) ||
        orderId <= 0
      ) {

        if (active) {

          setError(
            "Invalid order ID."
          );

          setLoading(false);
        }

        return;
      }


      try {

        // ====================================
        // INITIAL LOADING ONLY
        // ====================================

        if (
          firstLoad &&
          !silent
        ) {

          setLoading(true);

          setError("");
        }


        // ====================================
        // API
        // ====================================

        const response =
          await fetch(
            `${API_ROOT}/Orders/getDetails.php`,
            {

              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                customer_id:
                  Number(
                    customer.id
                  ),

                order_id:
                  orderId,
              }),
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


        if (
          !response.ok ||
          result.status !==
            "success"
        ) {

          throw new Error(
            result.message ||
              "Order not found."
          );
        }


        if (!active) {
          return;
        }


        const rawOrder =
          result.data?.order ||
          result.order ||
          result.data;


        if (
          !rawOrder ||
          typeof rawOrder !==
            "object"
        ) {

          throw new Error(
            "Order details were not returned."
          );
        }


        const updatedOrder =
          normalizeOrder(
            rawOrder
          );


        // ====================================
        // UPDATE SCREEN
        // ====================================

        setOrder(
          updatedOrder
        );

        setError("");


      } catch (error) {

        console.error(
          "Order details error:",
          error
        );


        if (!active) {
          return;
        }


        // ====================================
        // FIRST LOAD ERROR ONLY
        // ====================================

        if (firstLoad) {

          setOrder(null);

          setError(
            error.message ||
              "Order not found."
          );
        }


      } finally {

        if (
          active &&
          firstLoad
        ) {

          firstLoad = false;

          setLoading(false);
        }
      }
    };


    // ========================================
    // FIRST LOAD
    // ========================================

    loadOrder(false);


    // ========================================
    // AUTO REFRESH EVERY 5 SECONDS
    // ========================================

    intervalId =
      window.setInterval(
        () => {

          loadOrder(true);

        },
        5000
      );


    // ========================================
    // CLEANUP
    // ========================================

    return () => {

      active = false;

      if (intervalId) {

        window.clearInterval(
          intervalId
        );
      }
    };

  }, [id, navigate]);


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <section className="order-not-found">

        <div>

          <LoaderCircle
            size={32}
          />

          <h1>
            Loading order...
          </h1>

          <p>
            Fetching your order
            details.
          </p>

        </div>

      </section>
    );
  }


  // ==========================================
  // NOT FOUND
  // ==========================================

  if (!order) {

    return (

      <section className="order-not-found">

        <div>

          <h1>
            Order not found.
          </h1>

          {error && (
            <p>
              {error}
            </p>
          )}

          <Link
            to="/my-orders"
            className="primary-button"
          >
            View My Orders
          </Link>

        </div>

      </section>
    );
  }


  // ==========================================
  // TRACKING STATUS
  // ==========================================

  const currentStatusIndex =
    statuses.indexOf(
      order.status
    );

  const isCancelled =
    order.status ===
    "Cancelled";


  // ==========================================
  // UI
  // ==========================================

  return (

    <section className="order-details-page">

      <div className="container">

        {/* ====================================
            BACK
        ==================================== */}

        <Link
          to="/my-orders"
          className="order-details-back"
        >

          <ArrowLeft
            size={16}
          />

          Back to My Orders

        </Link>


        {/* ====================================
            HEADER
        ==================================== */}

        <div className="order-details-header">

          <div>

            <span className="section-kicker">
              ORDER DETAILS
            </span>

            <h1>

              {order.orderNumber ||
                `Order #${order.id}`}

            </h1>

            <p>

              Placed on{" "}

              {order.createdAt
                ? new Date(
                    order.createdAt
                  ).toLocaleDateString(
                    "en-GB",
                    {
                      day:
                        "2-digit",

                      month:
                        "long",

                      year:
                        "numeric",
                    }
                  )
                : "—"}

            </p>

          </div>


          <span
            className={`order-status-badge large ${order.status
              .toLowerCase()
              .replaceAll(
                " ",
                "-"
              )}`}
          >

            {order.status}

          </span>

        </div>


        {/* ====================================
            TRACKING
        ==================================== */}

        <div className="order-tracking-card">

          <div className="tracking-heading">

            <div>

              <span className="section-kicker">
                ORDER PROGRESS
              </span>

              <h2>
                Track your order
              </h2>

            </div>


            <Clock3
              size={21}
            />

          </div>


          {isCancelled ? (

            <div className="order-notes-box">

              <span>
                ORDER CANCELLED
              </span>

              <p>
                This order has been
                cancelled.
              </p>

            </div>

          ) : (

            <div className="tracking-progress">

              {statuses.map(
                (
                  status,
                  index
                ) => {

                  const completed =
                    currentStatusIndex >=
                      0 &&
                    index <=
                      currentStatusIndex;


                  return (

                    <div
                      className={`tracking-step ${
                        completed
                          ? "completed"
                          : ""
                      }`}
                      key={status}
                    >

                      <div className="tracking-circle">

                        {index <
                        currentStatusIndex ? (

                          <Check
                            size={15}
                          />

                        ) : (

                          index + 1

                        )}

                      </div>


                      <span>
                        {status}
                      </span>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </div>


        {/* ====================================
            CONTENT
        ==================================== */}

        <div className="order-details-layout">


          {/* ==================================
              LEFT
          ================================== */}

          <div className="order-details-main">


            {/* ================================
                ITEMS
            ================================ */}

            <div className="order-detail-card">

              <div className="order-detail-card-heading">

                <Package
                  size={19}
                />

                <h2>
                  Items Ordered
                </h2>

              </div>


              <div className="order-detail-items">

                {order.items.map(
                  (
                    item,
                    index
                  ) => (

                    <div
                      className="order-detail-item"
                      key={
                        item.id ||
                        index
                      }
                    >

                      {/* ========================
                          CAKE IMAGE
                      ======================== */}

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

                        <div className="order-detail-no-image">
                          Cake
                        </div>

                      )}


                      {/* ========================
                          ITEM INFORMATION
                      ======================== */}

                      <div className="order-detail-item-info">

                        <h3>
                          {item.name}
                        </h3>


                        {/* SIZE */}

                        <p>

                          <strong>
                            Size:
                          </strong>{" "}

                          {item.selectedSize ||
                            "—"}

                        </p>


                        {/* COLOR */}

                        {item.selectedColor && (

                          <p>

                            <strong>
                              Color:
                            </strong>{" "}

                            {
                              item.selectedColor
                            }

                          </p>
                        )}


                        {/* FLAVOUR */}

                        {item.flavourName && (

                          <p>

                            <strong>
                              Flavour:
                            </strong>{" "}

                            {
                              item.flavourName
                            }

                          </p>
                        )}


                        {/* FILLING */}

                        {item.fillingName && (

                          <p>

                            <strong>
                              Filling:
                            </strong>{" "}

                            {
                              item.fillingName
                            }

                            {item.fillingCharge >
                              0 && (
                              <>

                                {" "}

                                <span>
                                  (+
                                  Rs.{" "}
                                  {item.fillingCharge.toLocaleString()}
                                  )
                                </span>

                              </>
                            )}

                          </p>
                        )}


                        {/* QUANTITY */}

                        <span>

                          Quantity:{" "}

                          {
                            item.quantity
                          }

                        </span>


                        {/* CAKE MESSAGE */}

                        {item.cakeMessage && (

                          <small>

                            Cake message:
                            {' "'}

                            {
                              item.cakeMessage
                            }

                            "

                          </small>
                        )}


                        {/* ======================
                            REFERENCE IMAGE
                        ====================== */}

                        {item.referenceImage && (

                          <div
                            style={{
                              marginTop:
                                "14px",

                              padding:
                                "12px",

                              border:
                                "1px solid var(--border)",

                              borderRadius:
                                "12px",

                              background:
                                "var(--background-soft)",
                            }}
                          >

                            <div
                              style={{
                                display:
                                  "flex",

                                alignItems:
                                  "center",

                                gap:
                                  "6px",

                                marginBottom:
                                  "9px",

                                fontSize:
                                  "12px",

                                fontWeight:
                                  "700",

                                letterSpacing:
                                  "0.05em",

                                color:
                                  "var(--text-soft)",
                              }}
                            >

                              <ImageIcon
                                size={15}
                              />

                              REFERENCE CAKE IMAGE

                            </div>


                            <div
                              style={{
                                display:
                                  "flex",

                                alignItems:
                                  "center",

                                gap:
                                  "12px",

                                flexWrap:
                                  "wrap",
                              }}
                            >

                              <a
                                href={
                                  item.referenceImage
                                }
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  display:
                                    "block",
                                }}
                              >

                                <img
                                  src={
                                    item.referenceImage
                                  }
                                  alt="Customer cake reference"
                                  style={{
                                    width:
                                      "90px",

                                    height:
                                      "90px",

                                    objectFit:
                                      "cover",

                                    borderRadius:
                                      "10px",

                                    border:
                                      "1px solid var(--border)",
                                  }}
                                />

                              </a>


                              <a
                                href={
                                  item.referenceImage
                                }
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  display:
                                    "inline-flex",

                                  alignItems:
                                    "center",

                                  gap:
                                    "5px",

                                  fontSize:
                                    "13px",

                                  fontWeight:
                                    "700",

                                  color:
                                    "var(--accent-dark)",

                                  textDecoration:
                                    "none",
                                }}
                              >

                                View Full Image

                                <ExternalLink
                                  size={14}
                                />

                              </a>

                            </div>

                          </div>
                        )}

                      </div>


                      {/* ========================
                          ITEM TOTAL
                      ======================== */}

                      <strong>

                        Rs.{" "}

                        {item.lineTotal.toLocaleString()}

                      </strong>

                    </div>
                  )
                )}

              </div>

            </div>


            {/* ================================
                DELIVERY
            ================================ */}

            <div className="order-detail-card">

              <div className="order-detail-card-heading">

                <MapPin
                  size={19}
                />

                <h2>
                  Delivery Information
                </h2>

              </div>


              <div className="delivery-detail-grid">


                <div>

                  <span>
                    Customer
                  </span>

                  <strong>
                    {order.customer
                      .name || "—"}
                  </strong>

                </div>


                <div>

                  <span>
                    Phone
                  </span>

                  <strong>
                    {order.customer
                      .phone || "—"}
                  </strong>

                </div>


                <div>

                  <span>
                    Email
                  </span>

                  <strong>
                    {order.customer
                      .email || "—"}
                  </strong>

                </div>


                <div>

                  <span>
                    Delivery Date
                  </span>

                  <strong>
                    {order.delivery
                      .date || "—"}
                  </strong>

                </div>


                <div>

                  <span>
                    Delivery Time
                  </span>

                  <strong>
                    {order.delivery
                      .time || "—"}
                  </strong>

                </div>


                <div>

                  <span>
                    City
                  </span>

                  <strong>
                    {order.delivery
                      .city || "—"}
                  </strong>

                </div>


                <div className="delivery-address-full">

                  <span>
                    Address
                  </span>

                  <strong>
                    {order.delivery
                      .address || "—"}
                  </strong>

                </div>

              </div>


              {/* ==============================
                  ADDITIONAL NOTES
              ============================== */}

              {order.notes && (

                <div className="order-notes-box">

                  <span>
                    Additional Notes
                  </span>

                  <p>
                    {order.notes}
                  </p>

                </div>
              )}

            </div>

          </div>


          {/* ==================================
              RIGHT
          ================================== */}

          <aside className="order-payment-summary">

            <span className="section-kicker">
              PAYMENT SUMMARY
            </span>

            <h2>
              Order Total
            </h2>


            <div className="order-summary-breakdown">


              {/* SUBTOTAL */}

              <div>

                <span>
                  Subtotal
                </span>

                <strong>

                  Rs.{" "}

                  {order.subtotal.toLocaleString()}

                </strong>

              </div>


              {/* DELIVERY */}

              <div>

                <span>
                  Delivery
                </span>

                <strong>

                  Rs.{" "}

                  {order.deliveryCharges.toLocaleString()}

                </strong>

              </div>


              {/* DISCOUNT */}

              {order.discount >
                0 && (

                <div>

                  <span>
                    Discount
                  </span>

                  <strong>

                    - Rs.{" "}

                    {order.discount.toLocaleString()}

                  </strong>

                </div>
              )}

            </div>


            {/* ================================
                FINAL TOTAL
            ================================ */}

            <div className="order-final-total">

              <span>
                Total
              </span>

              <strong>

                Rs.{" "}

                {order.total.toLocaleString()}

              </strong>

            </div>


            {/* ================================
                PAYMENT METHOD
            ================================ */}

            <div className="payment-method-box">

              <span>
                Payment Method
              </span>

              <strong>
                {order.paymentMethod}
              </strong>

            </div>


            {/* ================================
                PAYMENT STATUS
            ================================ */}

            <div className="payment-method-box">

              <span>
                Payment Status
              </span>

              <strong>
                {order.paymentStatus}
              </strong>

            </div>


            {/* ================================
                ORDER MORE
            ================================ */}

            <Link
              to="/cakes"
              className="order-more-button"
            >

              Order More Cakes

            </Link>

          </aside>

        </div>

      </div>

    </section>
  );
};


export default OrderDetails;