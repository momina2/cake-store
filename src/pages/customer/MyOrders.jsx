import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Package,
  ArrowRight,
  LoaderCircle,
} from "lucide-react";

const API_ROOT =
  "https://coreops.pk/cakes/api";

const MyOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // GET LOGGED-IN CUSTOMER
  // ==========================================

  const getLoggedInCustomer = () => {
    try {
      const savedUser =
        localStorage.getItem(
          "loggedInCakeUser"
        );

      if (!savedUser) {
        return null;
      }

      const customer =
        JSON.parse(savedUser);

      if (!customer?.id) {
        return null;
      }

      return customer;
    } catch (error) {
      console.error(
        "Customer loading error:",
        error
      );

      return null;
    }
  };

  // ==========================================
  // NORMALIZE ORDER
  // ==========================================

  const normalizeOrder = (order) => {
    const delivery =
      order.delivery || {};

    const items =
      Array.isArray(order.items)
        ? order.items
        : [];

    return {
      id: Number(
        order.id ||
          order.order_id ||
          0
      ),

      orderNumber:
        order.order_number ||
        order.orderNumber ||
        `Order #${order.id}`,

      status:
        order.status ||
        "Pending",

      createdAt:
        order.placed_at ||
        order.created_at ||
        order.createdAt ||
        "",

      delivery: {
        date:
          delivery.date ||
          order.delivery_date ||
          "",

        time:
          delivery.time ||
          order.delivery_time ||
          "",

        city:
          delivery.city ||
          order.delivery_city ||
          "",

        address:
          delivery.address ||
          order.delivery_address ||
          "",
      },

      items: items.map(
        (item) => ({
          ...item,

          image:
            item.cake_image ||
            item.image ||
            "",

          name:
            item.cake_name ||
            item.name ||
            "",

          quantity: Number(
            item.quantity || 0
          ),
        })
      ),

      totalItems: Number(
        order.total_quantity ||
          order.total_items ||
          items.reduce(
            (total, item) =>
              total +
              Number(
                item.quantity || 0
              ),
            0
          )
      ),

      total: Number(
        order.total || 0
      ),
    };
  };

  // ==========================================
  // LOAD ORDERS
  // ==========================================

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      const customer =
        getLoggedInCustomer();

      if (!customer) {
        setLoading(false);

        navigate("/login");

        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_ROOT}/Orders/getByCustomer.php`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              customer_id: Number(
                customer.id
              ),
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
          result.status !== "success"
        ) {
          throw new Error(
            result.message ||
              "Unable to load your orders."
          );
        }

        if (!active) {
          return;
        }

        // Supports:
        // result.data
        // result.data.orders
        // result.orders

        let orderRows = [];

        if (
          Array.isArray(result.data)
        ) {
          orderRows = result.data;
        } else if (
          Array.isArray(
            result.data?.orders
          )
        ) {
          orderRows =
            result.data.orders;
        } else if (
          Array.isArray(result.orders)
        ) {
          orderRows =
            result.orders;
        }

        setOrders(
          orderRows.map(
            normalizeOrder
          )
        );
      } catch (error) {
        console.error(
          "My orders error:",
          error
        );

        if (active) {
          setError(
            error.message ||
              "Unable to load your orders."
          );

          setOrders([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      active = false;
    };
  }, [navigate]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <section className="empty-orders-page">
        <div className="empty-orders-content">
          <div className="empty-orders-icon">
            <LoaderCircle
              size={34}
              strokeWidth={1.5}
            />
          </div>

          <span className="section-kicker">
            MY ORDERS
          </span>

          <h1>
            Loading your orders...
          </h1>

          <p>
            Fetching your latest cake
            orders.
          </p>
        </div>
      </section>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <section className="empty-orders-page">
        <div className="empty-orders-content">
          <div className="empty-orders-icon">
            <Package
              size={34}
              strokeWidth={1.5}
            />
          </div>

          <span className="section-kicker">
            MY ORDERS
          </span>

          <h1>
            Unable to load orders.
          </h1>

          <p>
            {error}
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
  // EMPTY
  // ==========================================

  if (orders.length === 0) {
    return (
      <section className="empty-orders-page">
        <div className="empty-orders-content">
          <div className="empty-orders-icon">
            <Package
              size={34}
              strokeWidth={1.5}
            />
          </div>

          <span className="section-kicker">
            MY ORDERS
          </span>

          <h1>
            No orders yet.
          </h1>

          <p>
            Your placed orders will
            appear here.
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
    <section className="my-orders-page">
      <div className="container">
        <div className="my-orders-heading">
          <span className="section-kicker">
            YOUR ORDERS
          </span>

          <h1>
            My Orders
          </h1>

          <p>
            Track your cake orders and
            view delivery details.
          </p>
        </div>

        <div className="orders-list">
          {orders.map((order) => (
            <div
              className="order-card"
              key={order.id}
            >
              <div className="order-card-top">
                <div>
                  <span className="order-small-label">
                    Order Number
                  </span>

                  <h3>
                    {order.orderNumber}
                  </h3>
                </div>

                <span
                  className={`order-status-badge ${order.status
                    .toLowerCase()
                    .replaceAll(
                      " ",
                      "-"
                    )}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="order-card-info">
                <div>
                  <span>
                    Order Date
                  </span>

                  <strong>
                    {order.createdAt
                      ? new Date(
                          order.createdAt
                        ).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "—"}
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
                    Items
                  </span>

                  <strong>
                    {order.totalItems}
                  </strong>
                </div>

                <div>
                  <span>
                    Total
                  </span>

                  <strong>
                    Rs.{" "}
                    {order.total.toLocaleString()}
                  </strong>
                </div>
              </div>

              {order.items.length >
                0 && (
                <div className="order-card-products">
                  {order.items
                    .slice(0, 4)
                    .map(
                      (
                        item,
                        index
                      ) =>
                        item.image ? (
                          <img
                            key={
                              index
                            }
                            src={
                              item.image
                            }
                            alt={
                              item.name
                            }
                          />
                        ) : (
                          <div
                            key={
                              index
                            }
                            className="more-products"
                          >
                            Cake
                          </div>
                        )
                    )}

                  {order.items.length >
                    4 && (
                    <div className="more-products">
                      +
                      {order.items
                        .length - 4}
                    </div>
                  )}
                </div>
              )}

              <Link
                to={`/my-orders/${order.id}`}
                className="order-view-button"
              >
                View Order Details

                <ArrowRight
                  size={16}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MyOrders;