import { useMemo, useState } from "react";
import {
  Eye,
  Search,
  SlidersHorizontal,
} from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("cakeOrders") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedOrder, setSelectedOrder] = useState(null);

  const statuses = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Ready",
    "Out for Delivery",
    "Delivered",
  ];

  const updateStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) => {
      if (order.orderId !== orderId) {
        return order;
      }

      const history = Array.isArray(order.statusHistory)
        ? order.statusHistory
        : [];

      const statusHistory = [
        ...history,
        {
          status: newStatus,
          title: `Order ${newStatus}`,
          date: new Date().toISOString(),
          description: `Order status changed to ${newStatus}.`,
        },
      ];

      return {
        ...order,
        status: newStatus,
        statusHistory,
      };
    });

    setOrders(updatedOrders);

    localStorage.setItem(
      "cakeOrders",
      JSON.stringify(updatedOrders)
    );

    if (selectedOrder?.orderId === orderId) {
      const updatedSelected = updatedOrders.find(
        (order) => order.orderId === orderId
      );

      setSelectedOrder(updatedSelected);
    }
  };

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

  const getStatusClass = (status) =>
    status
      ?.toLowerCase()
      .replaceAll(" ", "-");

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

        {statuses.map((status) => (
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

            {statuses.map((status) => (
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
        {filteredOrders.length === 0 ? (
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
                  <tr key={order.orderId}>
                    <td>
                      <div className="admin-order-id">
                        <strong>
                          {order.orderId}
                        </strong>

                        <span>
                          {new Date(
                            order.createdAt
                          ).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
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
                          {order.delivery?.date}
                        </strong>

                        <span>
                          {order.delivery?.time}
                        </span>
                      </div>
                    </td>

                    <td>
                      <strong>
                        {order.items?.reduce(
                          (total, item) =>
                            total +
                            (item.quantity || 0),
                          0
                        )}
                      </strong>
                    </td>

                    <td>
                      <strong className="admin-order-price">
                        Rs.{" "}
                        {order.total?.toLocaleString()}
                      </strong>
                    </td>

                    <td>
                      <select
                        className={`admin-status-select ${getStatusClass(
                          order.status
                        )}`}
                        value={order.status}
                        onChange={(event) =>
                          updateStatus(
                            order.orderId,
                            event.target.value
                          )
                        }
                      >
                        {statuses.map((status) => (
                          <option
                            value={status}
                            key={status}
                          >
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="admin-order-view-button"
                        onClick={() =>
                          setSelectedOrder(order)
                        }
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
              >
                ×
              </button>
            </div>

            <div className="admin-order-modal-section">
              <div className="admin-order-modal-grid">
                <div>
                  <span>Customer</span>
                  <strong>
                    {
                      selectedOrder.customer
                        ?.name
                    }
                  </strong>
                </div>

                <div>
                  <span>Email</span>
                  <strong>
                    {
                      selectedOrder.customer
                        ?.email
                    }
                  </strong>
                </div>

                <div>
                  <span>Phone</span>
                  <strong>
                    {
                      selectedOrder.customer
                        ?.phone
                    }
                  </strong>
                </div>

                <div>
                  <span>Status</span>

                  <select
                    className="admin-modal-status-select"
                    value={
                      selectedOrder.status
                    }
                    onChange={(event) =>
                      updateStatus(
                        selectedOrder.orderId,
                        event.target.value
                      )
                    }
                  >
                    {statuses.map((status) => (
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
                    {
                      selectedOrder.delivery
                        ?.date
                    }
                  </strong>
                </div>

                <div>
                  <span>Time</span>
                  <strong>
                    {
                      selectedOrder.delivery
                        ?.time
                    }
                  </strong>
                </div>

                <div className="admin-order-modal-full">
                  <span>Address</span>
                  <strong>
                    {
                      selectedOrder.delivery
                        ?.address
                    }
                    ,{" "}
                    {
                      selectedOrder.delivery
                        ?.city
                    }
                  </strong>
                </div>
              </div>
            </div>

            <div className="admin-order-modal-section">
              <h3>Items</h3>

              <div className="admin-modal-items">
                {selectedOrder.items?.map(
                  (item, index) => (
                    <div
                      className="admin-modal-item"
                      key={index}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                      />

                      <div>
                        <strong>
                          {item.name}
                        </strong>

                        <span>
                          {item.selectedSize} ·{" "}
                          {
                            item.selectedColor
                          }
                        </span>

                        <span>
                          Qty:{" "}
                          {item.quantity}
                        </span>

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
                          item.price *
                          item.quantity
                        ).toLocaleString()}
                      </strong>
                    </div>
                  )
                )}
              </div>
            </div>

            {selectedOrder.notes && (
              <div className="admin-order-modal-section">
                <h3>
                  Customer Notes
                </h3>

                <p className="admin-order-customer-note">
                  {selectedOrder.notes}
                </p>
              </div>
            )}

            <div className="admin-modal-total">
              <span>Total</span>

              <strong>
                Rs.{" "}
                {selectedOrder.total?.toLocaleString()}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;