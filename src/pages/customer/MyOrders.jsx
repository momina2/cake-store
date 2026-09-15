import { Link } from "react-router-dom";
import { Package, ArrowRight } from "lucide-react";

const MyOrders = () => {
  const orders = JSON.parse(
    localStorage.getItem("cakeOrders") || "[]"
  );

  if (orders.length === 0) {
    return (
      <section className="empty-orders-page">
        <div className="empty-orders-content">
          <div className="empty-orders-icon">
            <Package size={34} strokeWidth={1.5} />
          </div>

          <span className="section-kicker">MY ORDERS</span>

          <h1>No orders yet.</h1>

          <p>
            Your placed orders will appear here.
          </p>

          <Link to="/cakes" className="primary-button">
            Explore Cakes
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="my-orders-page">
      <div className="container">
        <div className="my-orders-heading">
          <span className="section-kicker">YOUR ORDERS</span>

          <h1>My Orders</h1>

          <p>
            Track your cake orders and view delivery details.
          </p>
        </div>

        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.orderId}>
              <div className="order-card-top">
                <div>
                  <span className="order-small-label">
                    Order Number
                  </span>

                  <h3>{order.orderId}</h3>
                </div>

                <span
                  className={`order-status-badge ${order.status
                    .toLowerCase()
                    .replaceAll(" ", "-")}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="order-card-info">
                <div>
                  <span>Order Date</span>

                  <strong>
                    {new Date(order.createdAt).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </strong>
                </div>

                <div>
                  <span>Delivery Date</span>

                  <strong>
                    {order.delivery.date}
                  </strong>
                </div>

                <div>
                  <span>Items</span>

                  <strong>
                    {order.items.reduce(
                      (total, item) =>
                        total + item.quantity,
                      0
                    )}
                  </strong>
                </div>

                <div>
                  <span>Total</span>

                  <strong>
                    Rs. {order.total.toLocaleString()}
                  </strong>
                </div>
              </div>

              <div className="order-card-products">
                {order.items.slice(0, 4).map((item, index) => (
                  <img
                    key={index}
                    src={item.image}
                    alt={item.name}
                  />
                ))}

                {order.items.length > 4 && (
                  <div className="more-products">
                    +{order.items.length - 4}
                  </div>
                )}
              </div>

              <Link
                to={`/my-orders/${order.orderId}`}
                className="order-view-button"
              >
                View Order Details

                <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MyOrders;