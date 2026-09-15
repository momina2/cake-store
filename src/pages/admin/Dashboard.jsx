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
  LoaderCircle,
} from "lucide-react";

import "./Dashboard.css";

const API_ROOT = "https://coreops.pk/cakes/api";

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({
    cards: {},
    order_status: {},
    revenue: {},
    payment_status: {},
    customers: {},
    catalog: {},
    recent_orders: [],
    recent_customers: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // HELPERS
  // ==========================================

  const readJson = async (response) => {
    try {
      return await response.json();
    } catch {
      throw new Error("Server returned an invalid response.");
    }
  };

  const numberValue = (value) => Number(value || 0);

  const formatMoney = (value) => numberValue(value).toLocaleString();

  const formatDate = (dateValue) => {
    if (!dateValue) return "—";

    const normalized =
      typeof dateValue === "string" ? dateValue.replace(" ", "T") : dateValue;

    const date = new Date(normalized);

    if (Number.isNaN(date.getTime())) {
      return dateValue || "—";
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) =>
    status?.toLowerCase().replace(/\s+/g, "-") || "pending";

  const pick = (object, keys, fallback = 0) => {
    for (const key of keys) {
      if (object && object[key] !== undefined && object[key] !== null) {
        return object[key];
      }
    }

    return fallback;
  };

  // ==========================================
  // NORMALIZE API RESPONSE
  // ==========================================

  const normalizeDashboard = (result) => {
    const root =
      result?.data &&
      typeof result.data === "object" &&
      !Array.isArray(result.data)
        ? result.data
        : result || {};

    return {
      cards: root.cards || {},
      order_status: root.order_status || root.orderStatus || {},
      revenue: root.revenue || {},
      payment_status: root.payment_status || root.paymentStatus || {},
      customers: root.customers || {},
      catalog: root.catalog || {},
      recent_orders: root.recent_orders || root.recentOrders || [],
      recent_customers: root.recent_customers || root.recentCustomers || [],
    };
  };

  // ==========================================
  // LOAD DASHBOARD API
  // ==========================================

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_ROOT}/Dashboard/getDashboard.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const result = await readJson(response);

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load dashboard.");
      }

      setDashboard(normalizeDashboard(result));
    } catch (err) {
      console.error("Dashboard loading error:", err);

      setError(err.message || "Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();

    const refresh = () => {
      loadDashboardData();
    };

    window.addEventListener("cakesChanged", refresh);
    window.addEventListener("categoriesChanged", refresh);
    window.addEventListener("sizesChanged", refresh);
    window.addEventListener("colorsChanged", refresh);

    return () => {
      window.removeEventListener("cakesChanged", refresh);
      window.removeEventListener("categoriesChanged", refresh);
      window.removeEventListener("sizesChanged", refresh);
      window.removeEventListener("colorsChanged", refresh);
    };
  }, []);

  // ==========================================
  // CARDS
  // ==========================================

  const cards = dashboard.cards || {};
  const catalog = dashboard.catalog || {};
  const customerStats = dashboard.customers || {};
  const revenue = dashboard.revenue || {};
  const orderStatus = dashboard.order_status || {};

  const totalOrders = numberValue(pick(cards, ["total_orders", "orders"]));

  const pendingOrders = numberValue(pick(cards, ["pending_orders", "pending"]));

  const totalRevenue = numberValue(
    pick(
      cards,
      ["total_revenue", "revenue"],
      pick(revenue, ["total_revenue", "total", "non_cancelled_revenue"]),
    ),
  );

  const totalCustomers = numberValue(
    pick(
      cards,
      ["total_customers", "customers"],
      pick(customerStats, ["total_customers", "total"]),
    ),
  );

  const totalCakes = numberValue(
    pick(
      cards,
      ["total_cakes", "cakes"],
      pick(catalog?.cakes, ["total", "total_cakes"]),
    ),
  );

  const totalCategories = numberValue(
    pick(
      cards,
      ["categories", "total_categories"],
      pick(catalog?.categories, ["total", "total_categories"]),
    ),
  );

  const totalSizes = numberValue(
    pick(
      cards,
      ["sizes", "total_sizes"],
      pick(catalog?.sizes, ["total", "total_sizes"]),
    ),
  );

  const totalColors = numberValue(
    pick(
      cards,
      ["colors", "total_colors"],
      pick(catalog?.colors, ["total", "total_colors"]),
    ),
  );

  const activeCakes = numberValue(
    pick(catalog?.cakes, ["active", "active_cakes"]),
  );

  const activeCategories = numberValue(
    pick(catalog?.categories, ["active", "active_categories"]),
  );

  const activeSizes = numberValue(
    pick(catalog?.sizes, ["active", "active_sizes"]),
  );

  const activeColors = numberValue(
    pick(catalog?.colors, ["active", "active_colors"]),
  );

  const deliveredOrders = numberValue(
    pick(orderStatus, ["Delivered", "delivered"]),
  );

  // ==========================================
  // RECENT ORDERS
  // ==========================================

  const recentOrders = useMemo(() => {
    const rows = Array.isArray(dashboard.recent_orders)
      ? dashboard.recent_orders
      : [];

    return rows.slice(0, 6).map((order) => {
      const customer =
        order.customer && typeof order.customer === "object"
          ? order.customer
          : {};

      return {
        id: Number(order.id || 0),
        orderId: order.order_number || order.orderId || String(order.id || ""),
        customer: {
          name: order.customer_name || customer.name || "Customer",
          email: order.customer_email || customer.email || "—",
        },
        total: numberValue(order.total),
        status: order.status || "Pending",
        createdAt: order.placed_at || order.created_at || order.createdAt || "",
      };
    });
  }, [dashboard.recent_orders]);

  // ==========================================
  // STATUS OVERVIEW
  // ==========================================

  const statusData = useMemo(() => {
    return ORDER_STATUSES.map((status) => {
      const lower = status.toLowerCase().replaceAll(" ", "_");

      return {
        status,
        count: numberValue(pick(orderStatus, [status, lower])),
      };
    });
  }, [orderStatus]);

  const statusTotal = useMemo(
    () => statusData.reduce((total, item) => total + item.count, 0),
    [statusData],
  );

  // ==========================================
  // DASHBOARD CARD CONFIG
  // ==========================================

  const dashboardCards = [
    {
      title: "Total Orders",
      value: totalOrders,
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
      value: `Rs. ${formatMoney(totalRevenue)}`,
      subtitle: "Non-cancelled orders",
      icon: CircleDollarSign,
    },
    {
      title: "Customers",
      value: totalCustomers,
      subtitle: "Registered users",
      icon: Users,
    },
    {
      title: "Cakes",
      value: totalCakes,
      subtitle: `${activeCakes} active`,
      icon: CakeSlice,
    },
    {
      title: "Categories",
      value: totalCategories,
      subtitle: `${activeCategories} active`,
      icon: Layers3,
    },
    {
      title: "Sizes",
      value: totalSizes,
      subtitle: `${activeSizes} active`,
      icon: Ruler,
    },
    {
      title: "Colors",
      value: totalColors,
      subtitle: `${activeColors} active`,
      icon: Palette,
    },
  ];

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-heading">
        <div>
          <span>ADMIN OVERVIEW</span>

          <h1>Dashboard</h1>

          <p>
            Track orders, sales, customers and product activity from one place.
          </p>
        </div>

        <div className="admin-dashboard-live">
          <span />
          Live Overview
        </div>
      </div>

      {error && (
        <div
          style={{
            marginBottom: "18px",
            padding: "12px 16px",
            border: "1px solid var(--border)",
            background: "var(--background-soft)",
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div
          className="admin-dashboard-empty"
          style={{
            minHeight: "260px",
          }}
        >
          <LoaderCircle size={28} />

          <h3>Loading Dashboard...</h3>

          <p>Fetching latest store data from the database.</p>
        </div>
      ) : (
        <>
          {/* TOP CARDS */}

          <div className="admin-dashboard-cards">
            {dashboardCards.map((card) => {
              const Icon = card.icon;

              return (
                <div className="admin-dashboard-card" key={card.title}>
                  <div className="admin-dashboard-card-top">
                    <div className="admin-dashboard-card-icon">
                      <Icon size={18} />
                    </div>

                    <span>{card.title}</span>
                  </div>

                  <strong>{card.value}</strong>

                  <small>{card.subtitle}</small>
                </div>
              );
            })}
          </div>

          {/* MAIN CONTENT */}

          <div className="admin-dashboard-main-grid">
            {/* RECENT ORDERS */}

            <section className="admin-dashboard-panel admin-dashboard-orders-panel">
              <div className="admin-dashboard-panel-heading">
                <div>
                  <span>LATEST ACTIVITY</span>

                  <h2>Recent Orders</h2>
                </div>

                <PackageCheck size={20} />
              </div>

              {recentOrders.length === 0 ? (
                <div className="admin-dashboard-empty">
                  <ShoppingBag size={25} />

                  <h3>No orders yet</h3>

                  <p>New customer orders will appear here.</p>
                </div>
              ) : (
                <div className="admin-dashboard-orders-table-wrapper">
                  <table className="admin-dashboard-orders-table">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id || order.orderId}>
                          <td>
                            <strong>{order.orderId}</strong>
                          </td>

                          <td>
                            <div className="admin-dashboard-customer-cell">
                              <strong>{order.customer?.name}</strong>

                              <span>{order.customer?.email}</span>
                            </div>
                          </td>

                          <td>{formatDate(order.createdAt)}</td>

                          <td>
                            <strong>Rs. {formatMoney(order.total)}</strong>
                          </td>

                          <td>
                            <span
                              className={`admin-dashboard-order-status ${getStatusClass(
                                order.status,
                              )}`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* STATUS OVERVIEW */}

            <section className="admin-dashboard-panel">
              <div className="admin-dashboard-panel-heading">
                <div>
                  <span>ORDER FLOW</span>

                  <h2>Status Overview</h2>
                </div>
              </div>

              <div className="admin-dashboard-status-list">
                {statusData.map((item) => {
                  const percentage =
                    statusTotal > 0
                      ? Math.round((item.count / statusTotal) * 100)
                      : 0;

                  return (
                    <div
                      className="admin-dashboard-status-item"
                      key={item.status}
                    >
                      <div className="admin-dashboard-status-top">
                        <div>
                          <span
                            className={`admin-dashboard-status-dot ${getStatusClass(
                              item.status,
                            )}`}
                          />

                          <strong>{item.status}</strong>
                        </div>

                        <div>
                          <strong>{item.count}</strong>

                          <span>{percentage}%</span>
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
                })}
              </div>
            </section>
          </div>

          {/* STORE OVERVIEW */}

          <section className="admin-dashboard-store-section">
            <div className="admin-dashboard-store-heading">
              <div>
                <span>CATALOG</span>

                <h2>Store Overview</h2>
              </div>
            </div>

            <div className="admin-dashboard-store-grid">
              <div>
                <span>Cakes</span>

                <strong>{totalCakes}</strong>

                <small>{activeCakes} active</small>
              </div>

              <div>
                <span>Categories</span>

                <strong>{totalCategories}</strong>

                <small>{activeCategories} active</small>
              </div>

              <div>
                <span>Sizes</span>

                <strong>{totalSizes}</strong>

                <small>{activeSizes} active</small>
              </div>

              <div>
                <span>Colors</span>

                <strong>{totalColors}</strong>

                <small>{activeColors} active</small>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;
