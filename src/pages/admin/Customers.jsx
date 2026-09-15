import { useMemo, useState } from "react";
import {
  Eye,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import "./Customers.css";

const Customers = () => {
  // ==========================================
  // CUSTOMERS
  // ==========================================

  const [customers] = useState(() => {
    try {
      const saved = localStorage.getItem("cakeUsers");

      if (!saved) {
        return [];
      }

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed)
        ? parsed
        : [];
    } catch (error) {
      console.error(
        "Customers loading error:",
        error
      );

      return [];
    }
  });

  // ==========================================
  // ORDERS
  // ==========================================

  const [orders] = useState(() => {
    try {
      const saved = localStorage.getItem("cakeOrders");

      if (!saved) {
        return [];
      }

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed)
        ? parsed
        : [];
    } catch (error) {
      console.error(
        "Orders loading error:",
        error
      );

      return [];
    }
  });

  // ==========================================
  // SEARCH
  // ==========================================

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedCustomer, setSelectedCustomer] =
    useState(null);

  // ==========================================
  // CUSTOMER STATS
  // ==========================================

  const getCustomerOrders = (customer) => {
    return orders.filter((order) => {
      const orderEmail =
        order.customer?.email
          ?.trim()
          .toLowerCase();

      const customerEmail =
        customer.email
          ?.trim()
          .toLowerCase();

      return (
        orderEmail &&
        customerEmail &&
        orderEmail === customerEmail
      );
    });
  };

  const getTotalSpent = (customer) => {
    return getCustomerOrders(customer).reduce(
      (total, order) =>
        total + Number(order.total || 0),
      0
    );
  };

  const getLastOrder = (customer) => {
    const customerOrders =
      getCustomerOrders(customer);

    if (customerOrders.length === 0) {
      return null;
    }

    return [...customerOrders].sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )[0];
  };

  // ==========================================
  // CUSTOMER DATA
  // ==========================================

  const customerData = useMemo(() => {
    return customers.map((customer) => {
      const customerOrders =
        getCustomerOrders(customer);

      const totalSpent =
        customerOrders.reduce(
          (total, order) =>
            total +
            Number(order.total || 0),
          0
        );

      const sortedOrders = [
        ...customerOrders,
      ].sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );

      return {
        ...customer,

        totalOrders:
          customerOrders.length,

        totalSpent,

        lastOrder:
          sortedOrders[0] || null,

        orders:
          sortedOrders,
      };
    });
  }, [customers, orders]);

  // ==========================================
  // FILTER
  // ==========================================

  const filteredCustomers =
    useMemo(() => {
      const search =
        searchTerm.trim().toLowerCase();

      if (!search) {
        return customerData;
      }

      return customerData.filter(
        (customer) => {
          const name =
            customer.name?.toLowerCase() ||
            "";

          const email =
            customer.email?.toLowerCase() ||
            "";

          const phone =
            customer.phone?.toLowerCase() ||
            "";

          return (
            name.includes(search) ||
            email.includes(search) ||
            phone.includes(search)
          );
        }
      );
    }, [customerData, searchTerm]);

  // ==========================================
  // SUMMARY
  // ==========================================

  const totalCustomers =
    customerData.length;

  const customersWithOrders =
    customerData.filter(
      (customer) =>
        customer.totalOrders > 0
    ).length;

  const repeatCustomers =
    customerData.filter(
      (customer) =>
        customer.totalOrders > 1
    ).length;

  const customerRevenue =
    customerData.reduce(
      (total, customer) =>
        total + customer.totalSpent,
      0
    );

  // ==========================================
  // DATE
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

  return (
    <div className="admin-customers-page">
      {/* ======================================
          HEADING
      ====================================== */}

      <div className="admin-customers-heading">
        <div>
          <span>
            CUSTOMER MANAGEMENT
          </span>

          <h1>
            Customers
          </h1>

          <p>
            View registered customers,
            their order history and
            spending details.
          </p>
        </div>
      </div>

      {/* ======================================
          SUMMARY CARDS
      ====================================== */}

      <div className="admin-customers-summary">
        <div className="admin-customer-summary-card">
          <div className="admin-customer-summary-icon">
            <UserRound size={18} />
          </div>

          <div>
            <span>
              Total Customers
            </span>

            <strong>
              {totalCustomers}
            </strong>
          </div>
        </div>

        <div className="admin-customer-summary-card">
          <div className="admin-customer-summary-icon">
            <ShoppingBag size={18} />
          </div>

          <div>
            <span>
              Customers With Orders
            </span>

            <strong>
              {customersWithOrders}
            </strong>
          </div>
        </div>

        <div className="admin-customer-summary-card">
          <div className="admin-customer-summary-icon">
            <ShoppingBag size={18} />
          </div>

          <div>
            <span>
              Repeat Customers
            </span>

            <strong>
              {repeatCustomers}
            </strong>
          </div>
        </div>

        <div className="admin-customer-summary-card">
          <div className="admin-customer-summary-icon">
            <ShoppingBag size={18} />
          </div>

          <div>
            <span>
              Customer Revenue
            </span>

            <strong>
              Rs.{" "}
              {customerRevenue.toLocaleString()}
            </strong>
          </div>
        </div>
      </div>

      {/* ======================================
          TOOLBAR
      ====================================== */}

      <div className="admin-customers-toolbar">
        <div className="admin-customers-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />
        </div>

        <span>
          {filteredCustomers.length} Customers
        </span>
      </div>

      {/* ======================================
          TABLE
      ====================================== */}

      <div className="admin-customers-table-wrapper">
        <table className="admin-customers-table">
          <thead>
            <tr>
              <th>
                Customer
              </th>

              <th>
                Phone
              </th>

              <th>
                Orders
              </th>

              <th>
                Total Spent
              </th>

              <th>
                Last Order
              </th>

              <th>
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.length ===
            0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="admin-customers-empty"
                >
                  No customers found.
                </td>
              </tr>
            ) : (
              filteredCustomers.map(
                (customer) => (
                  <tr
                    key={
                      customer.id ||
                      customer.email
                    }
                  >
                    {/* CUSTOMER */}

                    <td>
                      <div className="admin-customer-info">
                        <div className="admin-customer-avatar">
                          {customer.name
                            ?.charAt(0)
                            .toUpperCase() ||
                            "U"}
                        </div>

                        <div>
                          <strong>
                            {customer.name}
                          </strong>

                          <span>
                            {customer.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* PHONE */}

                    <td>
                      {customer.phone ||
                        "—"}
                    </td>

                    {/* ORDERS */}

                    <td>
                      <strong>
                        {customer.totalOrders}
                      </strong>
                    </td>

                    {/* SPENT */}

                    <td>
                      Rs.{" "}
                      {customer.totalSpent.toLocaleString()}
                    </td>

                    {/* LAST ORDER */}

                    <td>
                      {customer.lastOrder ? (
                        <div className="admin-customer-last-order">
                          <strong>
                            {
                              customer
                                .lastOrder
                                .orderId
                            }
                          </strong>

                          <span>
                            {formatDate(
                              customer
                                .lastOrder
                                .createdAt
                            )}
                          </span>
                        </div>
                      ) : (
                        <span className="admin-customer-no-order">
                          No orders yet
                        </span>
                      )}
                    </td>

                    {/* ACTION */}

                    <td>
                      <button
                        type="button"
                        className="admin-customer-view-btn"
                        onClick={() =>
                          setSelectedCustomer(
                            customer
                          )
                        }
                      >
                        <Eye size={15} />

                        View
                      </button>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>

      {/* ======================================
          CUSTOMER DETAILS DRAWER
      ====================================== */}

      {selectedCustomer && (
        <div
          className="admin-customer-modal-overlay"
          onClick={() =>
            setSelectedCustomer(null)
          }
        >
          <div
            className="admin-customer-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* HEADER */}

            <div className="admin-customer-modal-header">
              <div>
                <span>
                  CUSTOMER DETAILS
                </span>

                <h2>
                  {selectedCustomer.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedCustomer(null)
                }
              >
                <X size={18} />
              </button>
            </div>

            {/* PROFILE */}

            <div className="admin-customer-profile-card">
              <div className="admin-customer-profile-avatar">
                {selectedCustomer.name
                  ?.charAt(0)
                  .toUpperCase() ||
                  "U"}
              </div>

              <div>
                <h3>
                  {selectedCustomer.name}
                </h3>

                <p>
                  {selectedCustomer.email}
                </p>

                <p>
                  {selectedCustomer.phone ||
                    "No phone number"}
                </p>
              </div>
            </div>

            {/* STATS */}

            <div className="admin-customer-modal-stats">
              <div>
                <span>
                  Total Orders
                </span>

                <strong>
                  {
                    selectedCustomer
                      .totalOrders
                  }
                </strong>
              </div>

              <div>
                <span>
                  Total Spent
                </span>

                <strong>
                  Rs.{" "}
                  {selectedCustomer.totalSpent.toLocaleString()}
                </strong>
              </div>
            </div>

            {/* ORDER HISTORY */}

            <div className="admin-customer-orders-section">
              <div className="admin-customer-orders-heading">
                <span>
                  ORDER HISTORY
                </span>

                <h3>
                  Customer Orders
                </h3>
              </div>

              {selectedCustomer.orders
                .length === 0 ? (
                <div className="admin-customer-orders-empty">
                  This customer has not
                  placed any orders yet.
                </div>
              ) : (
                <div className="admin-customer-orders-list">
                  {selectedCustomer.orders.map(
                    (order) => (
                      <div
                        className="admin-customer-order-card"
                        key={
                          order.orderId
                        }
                      >
                        <div className="admin-customer-order-top">
                          <div>
                            <strong>
                              {
                                order.orderId
                              }
                            </strong>

                            <span>
                              {formatDate(
                                order.createdAt
                              )}
                            </span>
                          </div>

                          <span
                            className={`admin-customer-order-status ${getStatusClass(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>

                        <div className="admin-customer-order-meta">
                          <div>
                            <span>
                              Items
                            </span>

                            <strong>
                              {order.items
                                ?.length ||
                                0}
                            </strong>
                          </div>

                          <div>
                            <span>
                              Delivery
                            </span>

                            <strong>
                              {order
                                .delivery
                                ?.date ||
                                "—"}
                            </strong>
                          </div>

                          <div>
                            <span>
                              Total
                            </span>

                            <strong>
                              Rs.{" "}
                              {Number(
                                order.total ||
                                  0
                              ).toLocaleString()}
                            </strong>
                          </div>
                        </div>

                        {/* ITEMS */}

                        {order.items &&
                          order.items
                            .length >
                            0 && (
                            <div className="admin-customer-order-items">
                              {order.items.map(
                                (
                                  item,
                                  index
                                ) => (
                                  <div
                                    key={`${item.id}-${index}`}
                                    className="admin-customer-order-item"
                                  >
                                    <img
                                      src={
                                        item.image
                                      }
                                      alt={
                                        item.name
                                      }
                                    />

                                    <div>
                                      <strong>
                                        {
                                          item.name
                                        }
                                      </strong>

                                      <span>
                                        {
                                          item.selectedSize
                                        }

                                        {item.selectedColor
                                          ? ` • ${item.selectedColor}`
                                          : ""}
                                      </span>

                                      <small>
                                        Qty:{" "}
                                        {
                                          item.quantity
                                        }
                                      </small>
                                    </div>

                                    <strong className="admin-customer-order-item-price">
                                      Rs.{" "}
                                      {(
                                        Number(
                                          item.price ||
                                            0
                                        ) *
                                        Number(
                                          item.quantity ||
                                            1
                                        )
                                      ).toLocaleString()}
                                    </strong>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;