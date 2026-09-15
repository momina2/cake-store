import { useEffect, useMemo, useState } from "react";
import {
  CakeSlice,
  CircleDollarSign,
  Clock3,
  Layers3,
  Palette,
  PackageCheck,
  Ruler,
  ShoppingBag,
  Users,
} from "lucide-react";

import "./Dashboard.css";

const Dashboard = () => {
  // ==========================================
  // STATE
  // ==========================================

  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cakes, setCakes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);

  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================

  const loadDashboardData = () => {
    try {
      const savedOrders =
        JSON.parse(
          localStorage.getItem("cakeOrders")
        ) || [];

      const savedCustomers =
        JSON.parse(
          localStorage.getItem("cakeUsers")
        ) || [];

      const savedCakes =
        JSON.parse(
          localStorage.getItem("adminCakes")
        ) || [];

      const savedCategories =
        JSON.parse(
          localStorage.getItem(
            "cakeCategories"
          )
        ) || [];

      const savedSizes =
        JSON.parse(
          localStorage.getItem("cakeSizes")
        ) || [];

      const savedColors =
        JSON.parse(
          localStorage.getItem("cakeColors")
        ) || [];

      setOrders(
        Array.isArray(savedOrders)
          ? savedOrders
          : []
      );

      setCustomers(
        Array.isArray(savedCustomers)
          ? savedCustomers
          : []
      );

      setCakes(
        Array.isArray(savedCakes)
          ? savedCakes
          : []
      );

      setCategories(
        Array.isArray(savedCategories)
          ? savedCategories
          : []
      );

      setSizes(
        Array.isArray(savedSizes)
          ? savedSizes
          : []
      );

      setColors(
        Array.isArray(savedColors)
          ? savedColors
          : []
      );
    } catch (error) {
      console.error(
        "Dashboard data loading error:",
        error
      );
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadDashboardData();

    // If cake data changes
    window.addEventListener(
      "cakesChanged",
      loadDashboardData
    );

    // Browser localStorage changes
    window.addEventListener(
      "storage",
      loadDashboardData
    );

    return () => {
      window.removeEventListener(
        "cakesChanged",
        loadDashboardData
      );

      window.removeEventListener(
        "storage",
        loadDashboardData
      );
    };
  }, []);

  // ==========================================
  // TOTAL REVENUE
  // ==========================================

  const totalRevenue = useMemo(() => {
    return orders.reduce(
      (total, order) =>
        total +
        Number(order.total || 0),
      0
    );
  }, [orders]);

  // ==========================================
  // PENDING ORDERS
  // ==========================================

  const pendingOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        order.status === "Pending"
    ).length;
  }, [orders]);

  // ==========================================
  // DELIVERED ORDERS
  // ==========================================

  const deliveredOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        order.status === "Delivered"
    ).length;
  }, [orders]);

  // ==========================================
  // ACTIVE PRODUCTS
  // ==========================================

  const activeCakes = useMemo(() => {
    return cakes.filter(
      (cake) =>
        !cake.status ||
        cake.status === "Active"
    ).length;
  }, [cakes]);

  const activeCategories =
    useMemo(() => {
      return categories.filter(
        (category) =>
          !category.status ||
          category.status === "Active"
      ).length;
    }, [categories]);

  const activeSizes = useMemo(() => {
    return sizes.filter(
      (size) =>
        !size.status ||
        size.status === "Active"
    ).length;
  }, [sizes]);

  const activeColors = useMemo(() => {
    return colors.filter(
      (color) =>
        !color.status ||
        color.status === "Active"
    ).length;
  }, [colors]);

  // ==========================================
  // RECENT ORDERS
  // ==========================================

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )
      .slice(0, 6);
  }, [orders]);

  // ==========================================
  // ORDER STATUSES
  // ==========================================

  const orderStatuses = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Ready",
    "Out for Delivery",
    "Delivered",
  ];

  const statusData = useMemo(() => {
    return orderStatuses.map(
      (status) => ({
        status,

        count: orders.filter(
          (order) =>
            order.status === status
        ).length,
      })
    );
  }, [orders]);

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "—";
    }

    const date = new Date(dateValue);

    if (
      Number.isNaN(date.getTime())
    ) {
      return "—";
    }

    return date.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    return (
      status
        ?.toLowerCase()
        .replace(/\s+/g, "-") ||
      "pending"
    );
  };

  // ==========================================
  // DASHBOARD CARDS
  // ==========================================

  const dashboardCards = [
    {
      title: "Total Orders",
      value: orders.length,
      subtitle: `${deliveredOrders} delivered`,
      icon: ShoppingBag,
    },

    {
      title: "Pending Orders",
      value: pendingOrders,
      subtitle: "Need attention",
      icon: Clock3,
    },

    {
      title: "Total Revenue",
      value: `Rs. ${totalRevenue.toLocaleString()}`,
      subtitle: "All orders",
      icon: CircleDollarSign,
    },

    {
      title: "Customers",
      value: customers.length,
      subtitle: "Registered users",
      icon: Users,
    },

    {
      title: "Cakes",
      value: cakes.length,
      subtitle: `${activeCakes} active`,
      icon: CakeSlice,
    },

    {
      title: "Categories",
      value: categories.length,
      subtitle: `${activeCategories} active`,
      icon: Layers3,
    },

    {
      title: "Sizes",
      value: sizes.length,
      subtitle: `${activeSizes} active`,
      icon: Ruler,
    },

    {
      title: "Colors",
      value: colors.length,
      subtitle: `${activeColors} active`,
      icon: Palette,
    },
  ];

  return (
    <div className="admin-dashboard-page">
      {/* =====================================
          HEADING
      ===================================== */}

      <div className="admin-dashboard-heading">
        <div>
          <span>
            ADMIN OVERVIEW
          </span>

          <h1>
            Dashboard
          </h1>

          <p>
            Track orders, sales,
            customers and product
            activity from one place.
          </p>
        </div>

        <div className="admin-dashboard-live">
          <span />

          Live Overview
        </div>
      </div>

      {/* =====================================
          TOP CARDS
      ===================================== */}

      <div className="admin-dashboard-cards">
        {dashboardCards.map(
          (card) => {
            const Icon =
              card.icon;

            return (
              <div
                className="admin-dashboard-card"
                key={card.title}
              >
                <div className="admin-dashboard-card-top">
                  <div className="admin-dashboard-card-icon">
                    <Icon size={18} />
                  </div>

                  <span>
                    {card.title}
                  </span>
                </div>

                <strong>
                  {card.value}
                </strong>

                <small>
                  {card.subtitle}
                </small>
              </div>
            );
          }
        )}
      </div>

      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <div className="admin-dashboard-main-grid">
        {/* ==================================
            RECENT ORDERS
        ================================== */}

        <section className="admin-dashboard-panel admin-dashboard-orders-panel">
          <div className="admin-dashboard-panel-heading">
            <div>
              <span>
                LATEST ACTIVITY
              </span>

              <h2>
                Recent Orders
              </h2>
            </div>

            <PackageCheck
              size={20}
            />
          </div>

          {recentOrders.length ===
          0 ? (
            <div className="admin-dashboard-empty">
              <ShoppingBag
                size={25}
              />

              <h3>
                No orders yet
              </h3>

              <p>
                New customer orders
                will appear here.
              </p>
            </div>
          ) : (
            <div className="admin-dashboard-orders-table-wrapper">
              <table className="admin-dashboard-orders-table">
                <thead>
                  <tr>
                    <th>
                      Order
                    </th>

                    <th>
                      Customer
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Total
                    </th>

                    <th>
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map(
                    (order) => (
                      <tr
                        key={
                          order.orderId
                        }
                      >
                        <td>
                          <strong>
                            {
                              order.orderId
                            }
                          </strong>
                        </td>

                        <td>
                          <div className="admin-dashboard-customer-cell">
                            <strong>
                              {order
                                .customer
                                ?.name ||
                                "Customer"}
                            </strong>

                            <span>
                              {order
                                .customer
                                ?.email ||
                                "—"}
                            </span>
                          </div>
                        </td>

                        <td>
                          {formatDate(
                            order.createdAt
                          )}
                        </td>

                        <td>
                          <strong>
                            Rs.{" "}
                            {Number(
                              order.total ||
                                0
                            ).toLocaleString()}
                          </strong>
                        </td>

                        <td>
                          <span
                            className={`admin-dashboard-order-status ${getStatusClass(
                              order.status
                            )}`}
                          >
                            {
                              order.status
                            }
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ==================================
            STATUS OVERVIEW
        ================================== */}

        <section className="admin-dashboard-panel">
          <div className="admin-dashboard-panel-heading">
            <div>
              <span>
                ORDER FLOW
              </span>

              <h2>
                Status Overview
              </h2>
            </div>
          </div>

          <div className="admin-dashboard-status-list">
            {statusData.map(
              (item) => {
                const percentage =
                  orders.length > 0
                    ? Math.round(
                        (item.count /
                          orders.length) *
                          100
                      )
                    : 0;

                return (
                  <div
                    className="admin-dashboard-status-item"
                    key={
                      item.status
                    }
                  >
                    <div className="admin-dashboard-status-top">
                      <div>
                        <span
                          className={`admin-dashboard-status-dot ${getStatusClass(
                            item.status
                          )}`}
                        />

                        <strong>
                          {
                            item.status
                          }
                        </strong>
                      </div>

                      <div>
                        <strong>
                          {
                            item.count
                          }
                        </strong>

                        <span>
                          {percentage}%
                        </span>
                      </div>
                    </div>

                    <div className="admin-dashboard-progress">
                      <div
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </section>
      </div>

      {/* =====================================
          STORE OVERVIEW
      ===================================== */}

      <section className="admin-dashboard-store-section">
        <div className="admin-dashboard-store-heading">
          <div>
            <span>
              CATALOG
            </span>

            <h2>
              Store Overview
            </h2>
          </div>
        </div>

        <div className="admin-dashboard-store-grid">
          {/* CAKES */}

          <div>
            <span>
              Cakes
            </span>

            <strong>
              {cakes.length}
            </strong>

            <small>
              {activeCakes} active
            </small>
          </div>

          {/* CATEGORIES */}

          <div>
            <span>
              Categories
            </span>

            <strong>
              {categories.length}
            </strong>

            <small>
              {activeCategories} active
            </small>
          </div>

          {/* SIZES */}

          <div>
            <span>
              Sizes
            </span>

            <strong>
              {sizes.length}
            </strong>

            <small>
              {activeSizes} active
            </small>
          </div>

          {/* COLORS */}

          <div>
            <span>
              Colors
            </span>

            <strong>
              {colors.length}
            </strong>

            <small>
              {activeColors} active
            </small>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;