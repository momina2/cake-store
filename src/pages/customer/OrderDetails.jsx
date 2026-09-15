import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Clock3,
  MapPin,
  Package,
} from "lucide-react";

const OrderDetails = () => {
  const { id } = useParams();

  const orders = JSON.parse(
    localStorage.getItem("cakeOrders") || "[]"
  );

  const order = orders.find(
    (item) => item.orderId === id
  );

  if (!order) {
    return (
      <section className="order-not-found">
        <div>
          <h1>Order not found.</h1>

          <Link to="/my-orders" className="primary-button">
            View My Orders
          </Link>
        </div>
      </section>
    );
  }

  const statuses = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Ready",
    "Out for Delivery",
    "Delivered",
  ];

  const currentStatusIndex = statuses.indexOf(
    order.status
  );

  return (
    <section className="order-details-page">
      <div className="container">
        <Link
          to="/my-orders"
          className="order-details-back"
        >
          <ArrowLeft size={16} />
          Back to My Orders
        </Link>

        <div className="order-details-header">
          <div>
            <span className="section-kicker">
              ORDER DETAILS
            </span>

            <h1>{order.orderId}</h1>

            <p>
              Placed on{" "}
              {new Date(
                order.createdAt
              ).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <span
            className={`order-status-badge large ${order.status
              .toLowerCase()
              .replaceAll(" ", "-")}`}
          >
            {order.status}
          </span>
        </div>

        {/* TRACKING */}

        <div className="order-tracking-card">
          <div className="tracking-heading">
            <div>
              <span className="section-kicker">
                ORDER PROGRESS
              </span>

              <h2>Track your order</h2>
            </div>

            <Clock3 size={21} />
          </div>

          <div className="tracking-progress">
            {statuses.map((status, index) => {
              const completed =
                index <= currentStatusIndex;

              return (
                <div
                  className={`tracking-step ${
                    completed ? "completed" : ""
                  }`}
                  key={status}
                >
                  <div className="tracking-circle">
                    {index < currentStatusIndex ? (
                      <Check size={15} />
                    ) : (
                      index + 1
                    )}
                  </div>

                  <span>{status}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="order-details-layout">
          {/* LEFT */}

          <div className="order-details-main">
            <div className="order-detail-card">
              <div className="order-detail-card-heading">
                <Package size={19} />

                <h2>Items Ordered</h2>
              </div>

              <div className="order-detail-items">
                {order.items.map((item, index) => (
                  <div
                    className="order-detail-item"
                    key={index}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                    />

                    <div className="order-detail-item-info">
                      <h3>{item.name}</h3>

                      <p>
                        {item.selectedSize} ·{" "}
                        {item.selectedColor}
                      </p>

                      <span>
                        Quantity: {item.quantity}
                      </span>

                      {item.cakeMessage && (
                        <small>
                          Cake message: "
                          {item.cakeMessage}"
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
            </div>

            <div className="order-detail-card">
              <div className="order-detail-card-heading">
                <MapPin size={19} />

                <h2>Delivery Information</h2>
              </div>

              <div className="delivery-detail-grid">
                <div>
                  <span>Customer</span>

                  <strong>
                    {order.customer.name}
                  </strong>
                </div>

                <div>
                  <span>Phone</span>

                  <strong>
                    {order.customer.phone}
                  </strong>
                </div>

                <div>
                  <span>Email</span>

                  <strong>
                    {order.customer.email}
                  </strong>
                </div>

                <div>
                  <span>Delivery Date</span>

                  <strong>
                    {order.delivery.date}
                  </strong>
                </div>

                <div>
                  <span>Delivery Time</span>

                  <strong>
                    {order.delivery.time}
                  </strong>
                </div>

                <div>
                  <span>City</span>

                  <strong>
                    {order.delivery.city}
                  </strong>
                </div>

                <div className="delivery-address-full">
                  <span>Address</span>

                  <strong>
                    {order.delivery.address}
                  </strong>
                </div>
              </div>

              {order.notes && (
                <div className="order-notes-box">
                  <span>Additional Notes</span>

                  <p>{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}

          <aside className="order-payment-summary">
            <span className="section-kicker">
              PAYMENT SUMMARY
            </span>

            <h2>Order Total</h2>

            <div className="order-summary-breakdown">
              <div>
                <span>Subtotal</span>

                <strong>
                  Rs.{" "}
                  {order.subtotal.toLocaleString()}
                </strong>
              </div>

              <div>
                <span>Delivery</span>

                <strong>
                  Rs.{" "}
                  {order.deliveryCharges.toLocaleString()}
                </strong>
              </div>
            </div>

            <div className="order-final-total">
              <span>Total</span>

              <strong>
                Rs. {order.total.toLocaleString()}
              </strong>
            </div>

            <div className="payment-method-box">
              <span>Payment Method</span>

              <strong>Cash on Delivery</strong>
            </div>

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