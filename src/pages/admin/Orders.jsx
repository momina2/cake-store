import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Search,
  SlidersHorizontal,
  LoaderCircle,
} from "lucide-react";

const API_ROOT = "https://coreops.pk/cakes/api";

const STATUSES = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const PAYMENT_STATUSES = [
  "Pending",
  "Paid",
  "Failed",
  "Refunded",
];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [paymentUpdating, setPaymentUpdating] = useState(false);

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

  const getAdminId = () => {
    try {
      const admin = JSON.parse(
        localStorage.getItem("cakeAdmin") || "null"
      );

      return Number(admin?.id || 0);
    } catch {
      return 0;
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

  const formatMoney = (value) =>
    Number(value || 0).toLocaleString();

  const formatDate = (value) => {
    if (!value) return "—";

    const normalized =
      typeof value === "string"
        ? value.replace(" ", "T")
        : value;

    const date = new Date(normalized);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) =>
    status?.toLowerCase().replaceAll(" ", "-") || "";

  // ==========================================
  // NORMALIZE ORDER ITEM
  // ==========================================

  const normalizeItem = (item) => ({
    id: Number(item.id || 0),
    cake_id: item.cake_id ? Number(item.cake_id) : null,

    name:
      item.cake_name ||
      item.name ||
      "",

    image:
      item.cake_image ||
      item.image ||
      "",

    selectedSize:
      item.selected_size ||
      item.selectedSize ||
      "",

    selectedColor:
      item.selected_color ||
      item.selectedColor ||
      "",

    price: Number(
      item.unit_price ??
      item.price ??
      0
    ),

    quantity: Number(item.quantity || 0),

    lineTotal: Number(
      item.line_total ??
      (
        Number(item.unit_price ?? item.price ?? 0) *
        Number(item.quantity || 0)
      )
    ),

    cakeMessage:
      item.special_instructions ||
      item.cakeMessage ||
      "",
  });

  // ==========================================
  // NORMALIZE ORDER
  // ==========================================

  const normalizeOrder = (order) => {
    const customerObject =
      order.customer &&
      typeof order.customer === "object"
        ? order.customer
        : {};

    const deliveryObject =
      order.delivery &&
      typeof order.delivery === "object"
        ? order.delivery
        : {};

    const items = Array.isArray(order.items)
      ? order.items.map(normalizeItem)
      : [];

    const historyRaw =
      order.status_history ||
      order.statusHistory ||
      order.history ||
      [];

    const statusHistory = Array.isArray(historyRaw)
      ? historyRaw.map((history) => ({
          id: Number(history.id || 0),
          old_status:
            history.old_status ||
            history.oldStatus ||
            "",
          status:
            history.new_status ||
            history.status ||
            "",
          title:
            history.title ||
            `Order ${
              history.new_status ||
              history.status ||
              ""
            }`,
          date:
            history.created_at ||
            history.date ||
            "",
          description:
            history.remarks ||
            history.description ||
            "",
          changed_by_type:
            history.changed_by_type || "",
        }))
      : [];

    return {
      id: Number(order.id || 0),

      orderId:
        order.order_number ||
        order.orderId ||
        String(order.id || ""),

      customer_id: order.customer_id
        ? Number(order.customer_id)
        : null,

      customer: {
        name:
          order.customer_name ||
          customerObject.name ||
          "",
        email:
          order.customer_email ||
          customerObject.email ||
          "",
        phone:
          order.customer_phone ||
          customerObject.phone ||
          "",
      },

      delivery: {
        address:
          order.delivery_address ||
          deliveryObject.address ||
          "",
        city:
          order.delivery_city ||
          deliveryObject.city ||
          "",
        date:
          order.delivery_date ||
          deliveryObject.date ||
          "",
        time:
          order.delivery_time ||
          deliveryObject.time ||
          "",
      },

      notes: order.notes || "",

      subtotal: Number(order.subtotal || 0),
      deliveryCharges: Number(
        order.delivery_charges ??
        order.deliveryCharges ??
        0
      ),
      discount: Number(order.discount || 0),
      total: Number(order.total || 0),

      paymentMethod:
        order.payment_method ||
        order.paymentMethod ||
        "",

      paymentStatus:
        order.payment_status ||
        order.paymentStatus ||
        "Pending",

      status: order.status || "Pending",

      placedAt:
        order.placed_at ||
        order.placedAt ||
        order.created_at ||
        order.createdAt ||
        "",

      createdAt:
        order.created_at ||
        order.createdAt ||
        order.placed_at ||
        order.placedAt ||
        "",

      updatedAt:
        order.updated_at ||
        order.updatedAt ||
        "",

      items,
      statusHistory,

      availableNextStatuses:
        order.available_next_statuses ||
        order.availableNextStatuses ||
        [],
    };
  };

  // ==========================================
  // GET ALL ORDERS
  // ==========================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_ROOT}/AdminOrders/getAll.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      const result = await readJson(response);

      if (!response.ok || result.status !== "success") {
        throw new Error(
          result.message || "Unable to fetch orders."
        );
      }

      const rows = getArray(result, "orders");

      setOrders(rows.map(normalizeOrder));
    } catch (err) {
      console.error("Fetch orders error:", err);
      setOrders([]);
      setError(
        err.message || "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ==========================================
  // GET ORDER DETAILS
  // ==========================================

  const openOrderDetails = async (order) => {
    try {
      setDetailsLoading(true);
      setError("");
      setSuccess("");

      // Open immediately with the list data,
      // then replace it with full DB details.
      setSelectedOrder(order);

      const response = await fetch(
        `${API_ROOT}/AdminOrders/getDetails.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: Number(order.id),
          }),
        }
      );

      const result = await readJson(response);

      if (!response.ok || result.status !== "success") {
        throw new Error(
          result.message ||
            "Unable to fetch order details."
        );
      }

      const rawOrder =
        result.order ||
        result.data?.order ||
        (
          result.data &&
          !Array.isArray(result.data)
            ? result.data
            : null
        );

      if (!rawOrder) {
        throw new Error(
          "Order details were not returned by the server."
        );
      }

      setSelectedOrder(normalizeOrder(rawOrder));
    } catch (err) {
      console.error("Order details error:", err);
      setError(
        err.message ||
          "Unable to load order details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // ==========================================
  // UPDATE ORDER STATUS
  // ==========================================

  const updateStatus = async (order, newStatus) => {
    if (!order || newStatus === order.status) {
      return;
    }

    const adminId = getAdminId();

    if (!adminId) {
      setError(
        "Admin login information was not found. Please login again."
      );
      return;
    }

    try {
      setUpdatingOrderId(order.id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_ROOT}/AdminOrders/updateStatus.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: Number(order.id),
            admin_id: adminId,
            status: newStatus,
            remarks: `Order status changed to ${newStatus} by admin`,
          }),
        }
      );

      const result = await readJson(response);

      if (!response.ok || result.status !== "success") {
        throw new Error(
          result.message ||
            "Unable to update order status."
        );
      }

      setSuccess(
        `Order ${order.orderId} status updated to ${newStatus}.`
      );

      await fetchOrders();

      // If modal is open, fetch full fresh details again.
      if (selectedOrder?.id === order.id) {
        await openOrderDetails({
          ...order,
          status: newStatus,
        });
      }
    } catch (err) {
      console.error("Update order status error:", err);
      setError(
        err.message ||
          "Unable to update order status."
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // ==========================================
  // UPDATE PAYMENT STATUS
  // ==========================================

  const updatePaymentStatus = async (
    order,
    newPaymentStatus
  ) => {
    if (
      !order ||
      newPaymentStatus === order.paymentStatus
    ) {
      return;
    }

    const adminId = getAdminId();

    if (!adminId) {
      setError(
        "Admin login information was not found. Please login again."
      );
      return;
    }

    try {
      setPaymentUpdating(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_ROOT}/AdminOrders/updatePaymentStatus.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: Number(order.id),
            admin_id: adminId,
            payment_status: newPaymentStatus,
          }),
        }
      );

      const result = await readJson(response);

      if (!response.ok || result.status !== "success") {
        throw new Error(
          result.message ||
            "Unable to update payment status."
        );
      }

      setSuccess(
        `Payment status updated to ${newPaymentStatus}.`
      );

      await fetchOrders();
      await openOrderDetails(order);
    } catch (err) {
      console.error(
        "Update payment status error:",
        err
      );
      setError(
        err.message ||
          "Unable to update payment status."
      );
    } finally {
      setPaymentUpdating(false);
    }
  };

  // ==========================================
  // FILTERS
  // ==========================================

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const search =
        searchTerm.trim().toLowerCase();

      const matchesSearch =
        !search ||
        order.orderId
          ?.toLowerCase()
          .includes(search) ||
        order.customer?.name
          ?.toLowerCase()
          .includes(search) ||
        order.customer?.phone
          ?.toLowerCase()
          .includes(search) ||
        order.customer?.email
          ?.toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // ==========================================
  // STATUS OPTIONS
  // ==========================================

  const getAllowedStatuses = (order) => {
    const apiStatuses =
      order?.availableNextStatuses;

    if (
      Array.isArray(apiStatuses) &&
      apiStatuses.length > 0
    ) {
      return [
        order.status,
        ...apiStatuses.filter(
          (status) => status !== order.status
        ),
      ];
    }

    const transitions = {
      Pending: [
        "Pending",
        "Confirmed",
        "Cancelled",
      ],
      Confirmed: [
        "Confirmed",
        "Preparing",
        "Cancelled",
      ],
      Preparing: [
        "Preparing",
        "Ready",
        "Cancelled",
      ],
      Ready: [
        "Ready",
        "Out for Delivery",
        "Cancelled",
      ],
      "Out for Delivery": [
        "Out for Delivery",
        "Delivered",
      ],
      Delivered: ["Delivered"],
      Cancelled: ["Cancelled"],
    };

    return transitions[order?.status] || [
      order?.status || "Pending",
    ];
  };

  const getAllowedPaymentStatuses = (status) => {
    const transitions = {
      Pending: ["Pending", "Paid", "Failed"],
      Failed: ["Failed", "Pending", "Paid"],
      Paid: ["Paid", "Refunded"],
      Refunded: ["Refunded"],
    };

    return (
      transitions[status] ||
      PAYMENT_STATUSES
    );
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="admin-orders-page">
      <div className="admin-page-heading admin-orders-heading">
        <div>
          <span>ORDER MANAGEMENT</span>

          <h1>Orders</h1>

          <p>
            View customer orders and manage their
            preparation and delivery status.
          </p>
        </div>

        <div className="admin-order-total-badge">
          {orders.length} Orders
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

      {/* SUMMARY */}

      <div className="admin-order-status-cards">
        <button
          className={
            statusFilter === "All"
              ? "active"
              : ""
          }
          onClick={() => setStatusFilter("All")}
        >
          <span>Total</span>
          <strong>{orders.length}</strong>
        </button>

        {STATUSES.map((status) => (
          <button
            key={status}
            className={
              statusFilter === status
                ? "active"
                : ""
            }
            onClick={() =>
              setStatusFilter(status)
            }
          >
            <span>{status}</span>

            <strong>
              {
                orders.filter(
                  (order) =>
                    order.status === status
                ).length
              }
            </strong>
          </button>
        ))}
      </div>

      {/* FILTERS */}

      <div className="admin-orders-toolbar">
        <div className="admin-orders-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search order, customer, phone or email..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <div className="admin-orders-filter">
          <SlidersHorizontal size={16} />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="All">
              All Statuses
            </option>

            {STATUSES.map((status) => (
              <option
                value={status}
                key={status}
              >
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}

      <div className="admin-orders-table-wrapper">
        {loading ? (
          <div className="admin-orders-empty">
            <LoaderCircle size={28} />
            <h3>Loading orders...</h3>
            <p>
              Fetching orders from the database.
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="admin-orders-empty">
            <h3>No orders found.</h3>

            <p>
              Try changing your search or status
              filter.
            </p>
          </div>
        ) : (
          <div className="admin-orders-table-scroll">
            <table className="admin-orders-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Delivery</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div className="admin-order-id">
                        <strong>
                          {order.orderId}
                        </strong>

                        <span>
                          {formatDate(
                            order.placedAt ||
                            order.createdAt
                          )}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="admin-order-customer">
                        <strong>
                          {order.customer?.name}
                        </strong>

                        <span>
                          {order.customer?.phone}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="admin-order-delivery">
                        <strong>
                          {order.delivery?.date || "—"}
                        </strong>

                        <span>
                          {order.delivery?.time || "—"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <strong>
                        {order.items?.reduce(
                          (total, item) =>
                            total +
                            Number(
                              item.quantity || 0
                            ),
                          0
                        )}
                      </strong>
                    </td>

                    <td>
                      <strong className="admin-order-price">
                        Rs. {formatMoney(order.total)}
                      </strong>
                    </td>

                    <td>
                      <select
                        className={`admin-status-select ${getStatusClass(
                          order.status
                        )}`}
                        value={order.status}
                        disabled={
                          updatingOrderId === order.id
                        }
                        onChange={(event) =>
                          updateStatus(
                            order,
                            event.target.value
                          )
                        }
                      >
                        {getAllowedStatuses(order).map(
                          (status) => (
                            <option
                              value={status}
                              key={status}
                            >
                              {status}
                            </option>
                          )
                        )}
                      </select>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="admin-order-view-button"
                        onClick={() =>
                          openOrderDetails(order)
                        }
                        title="View Order"
                      >
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ORDER MODAL */}

      {selectedOrder && (
        <div
          className="admin-order-modal-overlay"
          onClick={() =>
            !detailsLoading &&
            !paymentUpdating &&
            setSelectedOrder(null)
          }
        >
          <div
            className="admin-order-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="admin-order-modal-header">
              <div>
                <span>ORDER DETAILS</span>

                <h2>
                  {selectedOrder.orderId}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
                disabled={
                  detailsLoading ||
                  paymentUpdating
                }
              >
                ×
              </button>
            </div>

            {detailsLoading ? (
              <div
                className="admin-orders-empty"
                style={{ padding: "45px 20px" }}
              >
                <LoaderCircle size={28} />
                <h3>Loading order details...</h3>
              </div>
            ) : (
              <>
                <div className="admin-order-modal-section">
                  <div className="admin-order-modal-grid">
                    <div>
                      <span>Customer</span>
                      <strong>
                        {selectedOrder.customer?.name || "—"}
                      </strong>
                    </div>

                    <div>
                      <span>Email</span>
                      <strong>
                        {selectedOrder.customer?.email || "—"}
                      </strong>
                    </div>

                    <div>
                      <span>Phone</span>
                      <strong>
                        {selectedOrder.customer?.phone || "—"}
                      </strong>
                    </div>

                    <div>
                      <span>Status</span>

                      <select
                        className="admin-modal-status-select"
                        value={selectedOrder.status}
                        disabled={
                          updatingOrderId ===
                          selectedOrder.id
                        }
                        onChange={(event) =>
                          updateStatus(
                            selectedOrder,
                            event.target.value
                          )
                        }
                      >
                        {getAllowedStatuses(
                          selectedOrder
                        ).map((status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span>Payment Method</span>
                      <strong>
                        {selectedOrder.paymentMethod || "—"}
                      </strong>
                    </div>

                    <div>
                      <span>Payment Status</span>

                      <select
                        className="admin-modal-status-select"
                        value={
                          selectedOrder.paymentStatus
                        }
                        disabled={paymentUpdating}
                        onChange={(event) =>
                          updatePaymentStatus(
                            selectedOrder,
                            event.target.value
                          )
                        }
                      >
                        {getAllowedPaymentStatuses(
                          selectedOrder.paymentStatus
                        ).map((status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="admin-order-modal-section">
                  <h3>Delivery Details</h3>

                  <div className="admin-order-modal-grid">
                    <div>
                      <span>Date</span>
                      <strong>
                        {selectedOrder.delivery?.date || "—"}
                      </strong>
                    </div>

                    <div>
                      <span>Time</span>
                      <strong>
                        {selectedOrder.delivery?.time || "—"}
                      </strong>
                    </div>

                    <div className="admin-order-modal-full">
                      <span>Address</span>
                      <strong>
                        {[
                          selectedOrder.delivery?.address,
                          selectedOrder.delivery?.city,
                        ]
                          .filter(Boolean)
                          .join(", ") || "—"}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="admin-order-modal-section">
                  <h3>Items</h3>

                  <div className="admin-modal-items">
                    {selectedOrder.items?.length > 0 ? (
                      selectedOrder.items.map(
                        (item, index) => (
                          <div
                            className="admin-modal-item"
                            key={
                              item.id ||
                              `${item.name}-${index}`
                            }
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "64px",
                                  height: "64px",
                                  display: "grid",
                                  placeItems: "center",
                                  border:
                                    "1px solid var(--border)",
                                  fontSize: "11px",
                                }}
                              >
                                No Image
                              </div>
                            )}

                            <div>
                              <strong>
                                {item.name}
                              </strong>

                              <span>
                                {[
                                  item.selectedSize,
                                  item.selectedColor,
                                ]
                                  .filter(Boolean)
                                  .join(" · ") || "—"}
                              </span>

                              <span>
                                Qty: {item.quantity}
                              </span>

                              {item.cakeMessage && (
                                <small>
                                  "{item.cakeMessage}"
                                </small>
                              )}
                            </div>

                            <strong>
                              Rs.{" "}
                              {formatMoney(
                                item.lineTotal ||
                                item.price *
                                  item.quantity
                              )}
                            </strong>
                          </div>
                        )
                      )
                    ) : (
                      <p>No order items found.</p>
                    )}
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div className="admin-order-modal-section">
                    <h3>Customer Notes</h3>

                    <p className="admin-order-customer-note">
                      {selectedOrder.notes}
                    </p>
                  </div>
                )}

                {selectedOrder.statusHistory?.length > 0 && (
                  <div className="admin-order-modal-section">
                    <h3>Status History</h3>

                    <div
                      style={{
                        display: "grid",
                        gap: "12px",
                      }}
                    >
                      {selectedOrder.statusHistory.map(
                        (history, index) => (
                          <div
                            key={
                              history.id ||
                              `${history.status}-${index}`
                            }
                            style={{
                              padding: "12px 14px",
                              border:
                                "1px solid var(--border)",
                            }}
                          >
                            <strong>
                              {history.status ||
                                history.title}
                            </strong>

                            <div
                              style={{
                                marginTop: "4px",
                                fontSize: "13px",
                              }}
                            >
                              {formatDate(history.date)}
                              {history.description
                                ? ` — ${history.description}`
                                : ""}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                <div className="admin-order-modal-section">
                  <div className="admin-order-modal-grid">
                    <div>
                      <span>Subtotal</span>
                      <strong>
                        Rs.{" "}
                        {formatMoney(
                          selectedOrder.subtotal
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Delivery Charges</span>
                      <strong>
                        Rs.{" "}
                        {formatMoney(
                          selectedOrder.deliveryCharges
                        )}
                      </strong>
                    </div>

                    {selectedOrder.discount > 0 && (
                      <div>
                        <span>Discount</span>
                        <strong>
                          Rs.{" "}
                          {formatMoney(
                            selectedOrder.discount
                          )}
                        </strong>
                      </div>
                    )}
                  </div>
                </div>

                <div className="admin-modal-total">
                  <span>Total</span>

                  <strong>
                    Rs.{" "}
                    {formatMoney(
                      selectedOrder.total
                    )}
                  </strong>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
