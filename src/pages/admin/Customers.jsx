import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Search,
  ShoppingBag,
  UserRound,
  X,
  LoaderCircle,
} from "lucide-react";

import "./Customers.css";

const API_ROOT = "https://coreops.pk/cakes/api";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [summary, setSummary] = useState({
    total_customers: 0,
    active_customers: 0,
    inactive_customers: 0,
    blocked_customers: 0,
    customers_with_orders: 0,
    repeat_customers: 0,
    customer_revenue: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const getArray = (result, key) => {
    if (Array.isArray(result?.data)) return result.data;
    if (Array.isArray(result?.[key])) return result[key];
    if (Array.isArray(result?.data?.[key])) {
      return result.data[key];
    }
    return [];
  };

  const formatMoney = (value) => Number(value || 0).toLocaleString();

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

  // ==========================================
  // NORMALIZE ORDER ITEM
  // ==========================================

  const normalizeItem = (item) => ({
    id: Number(item.id || 0),
    cake_id: item.cake_id ? Number(item.cake_id) : null,

    name: item.cake_name || item.name || "",

    image: item.cake_image || item.image || "",

    selectedSize: item.selected_size || item.selectedSize || "",

    selectedColor: item.selected_color || item.selectedColor || "",

    price: Number(item.unit_price ?? item.price ?? 0),

    quantity: Number(item.quantity || 0),

    lineTotal: Number(
      item.line_total ??
        Number(item.unit_price ?? item.price ?? 0) * Number(item.quantity || 0),
    ),

    cakeMessage: item.special_instructions || item.cakeMessage || "",
  });

  // ==========================================
  // NORMALIZE ORDER
  // ==========================================

  const normalizeOrder = (order) => {
    const delivery =
      order.delivery && typeof order.delivery === "object"
        ? order.delivery
        : {};

    return {
      id: Number(order.id || 0),

      orderId: order.order_number || order.orderId || String(order.id || ""),

      status: order.status || "Pending",

      total: Number(order.total || 0),

      createdAt:
        order.created_at ||
        order.createdAt ||
        order.placed_at ||
        order.placedAt ||
        "",

      placedAt:
        order.placed_at ||
        order.placedAt ||
        order.created_at ||
        order.createdAt ||
        "",

      delivery: {
        address: order.delivery_address || delivery.address || "",
        city: order.delivery_city || delivery.city || "",
        date: order.delivery_date || delivery.date || "",
        time: order.delivery_time || delivery.time || "",
      },

      items: Array.isArray(order.items) ? order.items.map(normalizeItem) : [],
    };
  };

  // ==========================================
  // NORMALIZE CUSTOMER
  // ==========================================

  const normalizeCustomer = (customer) => {
    const orders = Array.isArray(customer.orders)
      ? customer.orders.map(normalizeOrder)
      : [];

    const totalOrders = Number(
      customer.total_orders ?? customer.totalOrders ?? orders.length ?? 0,
    );

    const totalSpent = Number(customer.total_spent ?? customer.totalSpent ?? 0);

    return {
      id: Number(customer.id || 0),
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      status: customer.status || "Active",

      email_verified_at: customer.email_verified_at || null,

      last_login_at: customer.last_login_at || null,

      created_at: customer.created_at || "",

      updated_at: customer.updated_at || "",

      totalOrders,
      totalSpent,

      lastOrderAt: customer.last_order_at || customer.lastOrderAt || "",

      orders,

      lastOrder:
        orders.length > 0
          ? [...orders].sort(
              (a, b) =>
                new Date(
                  (b.createdAt || "").replace?.(" ", "T") || b.createdAt,
                ) -
                new Date(
                  (a.createdAt || "").replace?.(" ", "T") || a.createdAt,
                ),
            )[0]
          : null,
    };
  };

  // ==========================================
  // GET ALL CUSTOMERS
  // ==========================================

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_ROOT}/AdminCustomers/getAll.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const result = await readJson(response);

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to fetch customers.");
      }

      const rows = getArray(result, "customers");

      setCustomers(rows.map(normalizeCustomer));

      const apiSummary = result.summary || result.data?.summary || {};

      setSummary({
        total_customers: Number(
          apiSummary.total_customers ?? apiSummary.total ?? rows.length ?? 0,
        ),

        active_customers: Number(
          apiSummary.active_customers ?? apiSummary.active ?? 0,
        ),

        inactive_customers: Number(
          apiSummary.inactive_customers ?? apiSummary.inactive ?? 0,
        ),

        blocked_customers: Number(
          apiSummary.blocked_customers ?? apiSummary.blocked ?? 0,
        ),

        customers_with_orders: Number(apiSummary.customers_with_orders ?? 0),

        repeat_customers: Number(
          apiSummary.repeat_customers ?? apiSummary.repeat ?? 0,
        ),

        customer_revenue: Number(
          apiSummary.customer_revenue ?? apiSummary.revenue ?? 0,
        ),
      });
    } catch (err) {
      console.error("Customers loading error:", err);

      setCustomers([]);

      setError(err.message || "Unable to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ==========================================
  // GET CUSTOMER DETAILS
  // ==========================================

  const openCustomerDetails = async (customer) => {
    try {
      setSelectedCustomer(customer);
      setDetailsLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_ROOT}/AdminCustomers/getDetails.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: Number(customer.id),
          }),
        },
      );

      const result = await readJson(response);

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to fetch customer details.");
      }

      const rawCustomer =
        result.customer ||
        result.data?.customer ||
        (result.data && !Array.isArray(result.data) ? result.data : null);

      if (!rawCustomer) {
        throw new Error("Customer details were not returned by the server.");
      }

      // getDetails.php returns customer, statistics and orders
      // as separate properties inside result.data.
      const detailOrders =
        result.orders || result.data?.orders || rawCustomer.orders || [];

      const customerWithOrders = {
        ...rawCustomer,
        orders: Array.isArray(detailOrders) ? detailOrders : [],
      };

      const normalized = normalizeCustomer(customerWithOrders);

      const statistics = result.statistics || result.data?.statistics || {};

      normalized.totalOrders = Number(
        statistics.total_orders ?? normalized.totalOrders,
      );

      normalized.totalSpent = Number(
        statistics.total_spent ?? normalized.totalSpent,
      );

      normalized.totalItemsPurchased = Number(
        statistics.total_items_purchased ?? 0,
      );

      setSelectedCustomer(normalized);
    } catch (err) {
      console.error("Customer details error:", err);

      setError(err.message || "Unable to load customer details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  // ==========================================
  // UPDATE CUSTOMER STATUS
  // ==========================================

  const updateCustomerStatus = async (customer, newStatus) => {
    if (!customer || newStatus === customer.status) {
      return;
    }

    try {
      setStatusUpdating(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_ROOT}/AdminCustomers/updateStatus.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: Number(customer.id),
            status: newStatus,
          }),
        },
      );

      const result = await readJson(response);

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to update customer status.");
      }

      setSuccess(`${customer.name} status updated to ${newStatus}.`);

      await fetchCustomers();

      if (selectedCustomer?.id === customer.id) {
        await openCustomerDetails({
          ...customer,
          status: newStatus,
        });
      }
    } catch (err) {
      console.error("Customer status error:", err);

      setError(err.message || "Unable to update customer status.");
    } finally {
      setStatusUpdating(false);
    }
  };

  // ==========================================
  // FILTER
  // ==========================================

  const filteredCustomers = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return customers;
    }

    return customers.filter((customer) => {
      const name = customer.name?.toLowerCase() || "";

      const email = customer.email?.toLowerCase() || "";

      const phone = customer.phone?.toLowerCase() || "";

      return (
        name.includes(search) ||
        email.includes(search) ||
        phone.includes(search)
      );
    });
  }, [customers, searchTerm]);

  // ==========================================
  // SUMMARY FALLBACKS
  // ==========================================

  const totalCustomers = summary.total_customers || customers.length;

  const customersWithOrders =
    summary.customers_with_orders ||
    customers.filter((customer) => customer.totalOrders > 0).length;

  const repeatCustomers =
    summary.repeat_customers ||
    customers.filter((customer) => customer.totalOrders > 1).length;

  const customerRevenue =
    summary.customer_revenue ||
    customers.reduce(
      (total, customer) => total + Number(customer.totalSpent || 0),
      0,
    );

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="admin-customers-page">
      <div className="admin-customers-heading">
        <div>
          <span>CUSTOMER MANAGEMENT</span>

          <h1>Customers</h1>

          <p>
            View registered customers, their order history and spending details.
          </p>
        </div>
      </div>

      {success && (
        <div
          style={{
            marginBottom: "18px",
            padding: "12px 16px",
            border: "1px solid var(--border)",
            background: "var(--background-soft)",
          }}
        >
          {success}
        </div>
      )}

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

      {/* SUMMARY CARDS */}

      <div className="admin-customers-summary">
        <div className="admin-customer-summary-card">
          <div className="admin-customer-summary-icon">
            <UserRound size={18} />
          </div>

          <div>
            <span>Total Customers</span>

            <strong>{totalCustomers}</strong>
          </div>
        </div>

        <div className="admin-customer-summary-card">
          <div className="admin-customer-summary-icon">
            <ShoppingBag size={18} />
          </div>

          <div>
            <span>Customers With Orders</span>

            <strong>{customersWithOrders}</strong>
          </div>
        </div>

        <div className="admin-customer-summary-card">
          <div className="admin-customer-summary-icon">
            <ShoppingBag size={18} />
          </div>

          <div>
            <span>Repeat Customers</span>

            <strong>{repeatCustomers}</strong>
          </div>
        </div>

        <div className="admin-customer-summary-card">
          <div className="admin-customer-summary-icon">
            <ShoppingBag size={18} />
          </div>

          <div>
            <span>Customer Revenue</span>

            <strong>Rs. {formatMoney(customerRevenue)}</strong>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}

      <div className="admin-customers-toolbar">
        <div className="admin-customers-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <span>{filteredCustomers.length} Customers</span>
      </div>

      {/* TABLE */}

      <div className="admin-customers-table-wrapper">
        {loading ? (
          <div
            className="admin-customers-empty"
            style={{
              padding: "45px 20px",
              textAlign: "center",
            }}
          >
            <LoaderCircle size={28} />
            <div>Loading customers...</div>
          </div>
        ) : (
          <table className="admin-customers-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Last Order</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="admin-customers-empty">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id || customer.email}>
                    <td>
                      <div className="admin-customer-info">
                        <div className="admin-customer-avatar">
                          {customer.name?.charAt(0).toUpperCase() || "U"}
                        </div>

                        <div>
                          <strong>{customer.name}</strong>

                          <span>{customer.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>{customer.phone || "—"}</td>

                    <td>
                      <span
                        className={`admin-customer-order-status ${getStatusClass(
                          customer.status,
                        )}`}
                      >
                        {customer.status}
                      </span>
                    </td>

                    <td>
                      <strong>{customer.totalOrders}</strong>
                    </td>

                    <td>Rs. {formatMoney(customer.totalSpent)}</td>

                    <td>
                      {customer.lastOrder ? (
                        <div className="admin-customer-last-order">
                          <strong>{customer.lastOrder.orderId}</strong>

                          <span>
                            {formatDate(customer.lastOrder.createdAt)}
                          </span>
                        </div>
                      ) : customer.lastOrderAt ? (
                        <span>{formatDate(customer.lastOrderAt)}</span>
                      ) : (
                        <span className="admin-customer-no-order">
                          No orders yet
                        </span>
                      )}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="admin-customer-view-btn"
                        onClick={() => openCustomerDetails(customer)}
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* CUSTOMER DETAILS DRAWER */}

      {selectedCustomer && (
        <div
          className="admin-customer-modal-overlay"
          onClick={() =>
            !detailsLoading && !statusUpdating && setSelectedCustomer(null)
          }
        >
          <div
            className="admin-customer-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-customer-modal-header">
              <div>
                <span>CUSTOMER DETAILS</span>

                <h2>{selectedCustomer.name}</h2>
              </div>

              <button
                type="button"
                disabled={detailsLoading || statusUpdating}
                onClick={() => setSelectedCustomer(null)}
              >
                <X size={18} />
              </button>
            </div>

            {detailsLoading ? (
              <div
                className="admin-customers-empty"
                style={{
                  padding: "45px 20px",
                  textAlign: "center",
                }}
              >
                <LoaderCircle size={28} />
                <div>Loading customer details...</div>
              </div>
            ) : (
              <>
                {/* PROFILE */}

                <div className="admin-customer-profile-card">
                  <div className="admin-customer-profile-avatar">
                    {selectedCustomer.name?.charAt(0).toUpperCase() || "U"}
                  </div>

                  <div>
                    <h3>{selectedCustomer.name}</h3>

                    <p>{selectedCustomer.email}</p>

                    <p>{selectedCustomer.phone || "No phone number"}</p>
                  </div>
                </div>

                {/* STATUS */}

                <div
                  style={{
                    marginBottom: "20px",
                    display: "grid",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                    }}
                  >
                    CUSTOMER STATUS
                  </span>

                  <select
                    value={selectedCustomer.status}
                    disabled={statusUpdating}
                    onChange={(event) =>
                      updateCustomerStatus(selectedCustomer, event.target.value)
                    }
                    style={{
                      width: "100%",
                      minHeight: "44px",
                      border: "1px solid var(--border)",
                      background: "white",
                      padding: "0 12px",
                    }}
                  >
                    <option value="Active">Active</option>

                    <option value="Inactive">Inactive</option>

                    <option value="Blocked">Blocked</option>
                  </select>
                </div>

                {/* STATS */}

                <div className="admin-customer-modal-stats">
                  <div>
                    <span>Total Orders</span>

                    <strong>{selectedCustomer.totalOrders}</strong>
                  </div>

                  <div>
                    <span>Total Spent</span>

                    <strong>
                      Rs. {formatMoney(selectedCustomer.totalSpent)}
                    </strong>
                  </div>
                </div>

                {/* ACCOUNT INFO */}

                <div
                  className="admin-customer-orders-section"
                  style={{
                    marginBottom: "24px",
                  }}
                >
                  <div className="admin-customer-orders-heading">
                    <span>ACCOUNT</span>
                    <h3>Account Information</h3>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: "14px",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          display: "block",
                          fontSize: "12px",
                          marginBottom: "4px",
                        }}
                      >
                        Joined
                      </span>

                      <strong>{formatDate(selectedCustomer.created_at)}</strong>
                    </div>

                    <div>
                      <span
                        style={{
                          display: "block",
                          fontSize: "12px",
                          marginBottom: "4px",
                        }}
                      >
                        Last Login
                      </span>

                      <strong>
                        {formatDate(selectedCustomer.last_login_at)}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* ORDER HISTORY */}

                <div className="admin-customer-orders-section">
                  <div className="admin-customer-orders-heading">
                    <span>ORDER HISTORY</span>

                    <h3>Customer Orders</h3>
                  </div>

                  {selectedCustomer.orders.length === 0 ? (
                    <div className="admin-customer-orders-empty">
                      This customer has not placed any orders yet.
                    </div>
                  ) : (
                    <div className="admin-customer-orders-list">
                      {selectedCustomer.orders.map((order) => (
                        <div
                          className="admin-customer-order-card"
                          key={order.id || order.orderId}
                        >
                          <div className="admin-customer-order-top">
                            <div>
                              <strong>{order.orderId}</strong>

                              <span>{formatDate(order.createdAt)}</span>
                            </div>

                            <span
                              className={`admin-customer-order-status ${getStatusClass(
                                order.status,
                              )}`}
                            >
                              {order.status}
                            </span>
                          </div>

                          <div className="admin-customer-order-meta">
                            <div>
                              <span>Items</span>

                              <strong>
                                {order.items.reduce(
                                  (total, item) =>
                                    total + Number(item.quantity || 0),
                                  0,
                                )}
                              </strong>
                            </div>

                            <div>
                              <span>Delivery</span>

                              <strong>{order.delivery?.date || "—"}</strong>
                            </div>

                            <div>
                              <span>Total</span>

                              <strong>Rs. {formatMoney(order.total)}</strong>
                            </div>
                          </div>

                          {order.items.length > 0 && (
                            <div className="admin-customer-order-items">
                              {order.items.map((item, index) => (
                                <div
                                  key={item.id || `${item.name}-${index}`}
                                  className="admin-customer-order-item"
                                >
                                  {item.image ? (
                                    <img src={item.image} alt={item.name} />
                                  ) : (
                                    <div
                                      style={{
                                        width: "58px",
                                        height: "58px",
                                        display: "grid",
                                        placeItems: "center",
                                        border: "1px solid var(--border)",
                                        fontSize: "10px",
                                      }}
                                    >
                                      No Image
                                    </div>
                                  )}

                                  <div>
                                    <strong>{item.name}</strong>

                                    <span>
                                      {[item.selectedSize, item.selectedColor]
                                        .filter(Boolean)
                                        .join(" • ") || "—"}
                                    </span>

                                    <small>Qty: {item.quantity}</small>

                                    {item.cakeMessage && (
                                      <small>{item.cakeMessage}</small>
                                    )}
                                  </div>

                                  <strong className="admin-customer-order-item-price">
                                    Rs.{" "}
                                    {formatMoney(
                                      item.lineTotal ||
                                        item.price * item.quantity,
                                    )}
                                  </strong>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
