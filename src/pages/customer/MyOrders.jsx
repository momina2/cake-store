// // import {
// //   useEffect,
// //   useState,
// // } from "react";

// // import {
// //   Link,
// //   useNavigate,
// // } from "react-router-dom";

// // import {
// //   Package,
// //   ArrowRight,
// //   LoaderCircle,
// // } from "lucide-react";

// // const API_ROOT =
// //   "https://coreops.pk/cakes/api";

// // const MyOrders = () => {
// //   const navigate = useNavigate();

// //   const [orders, setOrders] =
// //     useState([]);

// //   const [loading, setLoading] =
// //     useState(true);

// //   const [error, setError] =
// //     useState("");

// //   // ==========================================
// //   // GET LOGGED-IN CUSTOMER
// //   // ==========================================

// //   const getLoggedInCustomer = () => {
// //     try {
// //       const savedUser =
// //         localStorage.getItem(
// //           "loggedInCakeUser"
// //         );

// //       if (!savedUser) {
// //         return null;
// //       }

// //       const customer =
// //         JSON.parse(savedUser);

// //       if (!customer?.id) {
// //         return null;
// //       }

// //       return customer;
// //     } catch (error) {
// //       console.error(
// //         "Customer loading error:",
// //         error
// //       );

// //       return null;
// //     }
// //   };

// //   // ==========================================
// //   // NORMALIZE ORDER
// //   // ==========================================

// //   const normalizeOrder = (order) => {
// //     const delivery =
// //       order.delivery || {};

// //     const items =
// //       Array.isArray(order.items)
// //         ? order.items
// //         : [];

// //     return {
// //       id: Number(
// //         order.id ||
// //           order.order_id ||
// //           0
// //       ),

// //       orderNumber:
// //         order.order_number ||
// //         order.orderNumber ||
// //         `Order #${order.id}`,

// //       status:
// //         order.status ||
// //         "Pending",

// //       createdAt:
// //         order.placed_at ||
// //         order.created_at ||
// //         order.createdAt ||
// //         "",

// //       delivery: {
// //         date:
// //           delivery.date ||
// //           order.delivery_date ||
// //           "",

// //         time:
// //           delivery.time ||
// //           order.delivery_time ||
// //           "",

// //         city:
// //           delivery.city ||
// //           order.delivery_city ||
// //           "",

// //         address:
// //           delivery.address ||
// //           order.delivery_address ||
// //           "",
// //       },

// //       items: items.map(
// //         (item) => ({
// //           ...item,

// //           image:
// //             item.cake_image ||
// //             item.image ||
// //             "",

// //           name:
// //             item.cake_name ||
// //             item.name ||
// //             "",

// //           quantity: Number(
// //             item.quantity || 0
// //           ),
// //         })
// //       ),

// //       totalItems: Number(
// //         order.total_quantity ||
// //           order.total_items ||
// //           items.reduce(
// //             (total, item) =>
// //               total +
// //               Number(
// //                 item.quantity || 0
// //               ),
// //             0
// //           )
// //       ),

// //       total: Number(
// //         order.total || 0
// //       ),
// //     };
// //   };

// //   // ==========================================
// //   // LOAD ORDERS
// //   // ==========================================

// //   useEffect(() => {
// //     let active = true;

// //     const loadOrders = async () => {
// //       const customer =
// //         getLoggedInCustomer();

// //       if (!customer) {
// //         setLoading(false);

// //         navigate("/login");

// //         return;
// //       }

// //       try {
// //         setLoading(true);
// //         setError("");

// //         const response = await fetch(
// //           `${API_ROOT}/Orders/getByCustomer.php`,
// //           {
// //             method: "POST",

// //             headers: {
// //               "Content-Type":
// //                 "application/json",
// //             },

// //             body: JSON.stringify({
// //               customer_id: Number(
// //                 customer.id
// //               ),
// //             }),
// //           }
// //         );

// //         let result;

// //         try {
// //           result =
// //             await response.json();
// //         } catch {
// //           throw new Error(
// //             "Server returned an invalid response."
// //           );
// //         }

// //         if (
// //           !response.ok ||
// //           result.status !== "success"
// //         ) {
// //           throw new Error(
// //             result.message ||
// //               "Unable to load your orders."
// //           );
// //         }

// //         if (!active) {
// //           return;
// //         }

// //         // Supports:
// //         // result.data
// //         // result.data.orders
// //         // result.orders

// //         let orderRows = [];

// //         if (
// //           Array.isArray(result.data)
// //         ) {
// //           orderRows = result.data;
// //         } else if (
// //           Array.isArray(
// //             result.data?.orders
// //           )
// //         ) {
// //           orderRows =
// //             result.data.orders;
// //         } else if (
// //           Array.isArray(result.orders)
// //         ) {
// //           orderRows =
// //             result.orders;
// //         }

// //         setOrders(
// //           orderRows.map(
// //             normalizeOrder
// //           )
// //         );
// //       } catch (error) {
// //         console.error(
// //           "My orders error:",
// //           error
// //         );

// //         if (active) {
// //           setError(
// //             error.message ||
// //               "Unable to load your orders."
// //           );

// //           setOrders([]);
// //         }
// //       } finally {
// //         if (active) {
// //           setLoading(false);
// //         }
// //       }
// //     };

// //     loadOrders();

// //     return () => {
// //       active = false;
// //     };
// //   }, [navigate]);

// //   // ==========================================
// //   // LOADING
// //   // ==========================================

// //   if (loading) {
// //     return (
// //       <section className="empty-orders-page">
// //         <div className="empty-orders-content">
// //           <div className="empty-orders-icon">
// //             <LoaderCircle
// //               size={34}
// //               strokeWidth={1.5}
// //             />
// //           </div>

// //           <span className="section-kicker">
// //             MY ORDERS
// //           </span>

// //           <h1>
// //             Loading your orders...
// //           </h1>

// //           <p>
// //             Fetching your latest cake
// //             orders.
// //           </p>
// //         </div>
// //       </section>
// //     );
// //   }

// //   // ==========================================
// //   // ERROR
// //   // ==========================================

// //   if (error) {
// //     return (
// //       <section className="empty-orders-page">
// //         <div className="empty-orders-content">
// //           <div className="empty-orders-icon">
// //             <Package
// //               size={34}
// //               strokeWidth={1.5}
// //             />
// //           </div>

// //           <span className="section-kicker">
// //             MY ORDERS
// //           </span>

// //           <h1>
// //             Unable to load orders.
// //           </h1>

// //           <p>
// //             {error}
// //           </p>

// //           <Link
// //             to="/cakes"
// //             className="primary-button"
// //           >
// //             Explore Cakes
// //           </Link>
// //         </div>
// //       </section>
// //     );
// //   }

// //   // ==========================================
// //   // EMPTY
// //   // ==========================================

// //   if (orders.length === 0) {
// //     return (
// //       <section className="empty-orders-page">
// //         <div className="empty-orders-content">
// //           <div className="empty-orders-icon">
// //             <Package
// //               size={34}
// //               strokeWidth={1.5}
// //             />
// //           </div>

// //           <span className="section-kicker">
// //             MY ORDERS
// //           </span>

// //           <h1>
// //             No orders yet.
// //           </h1>

// //           <p>
// //             Your placed orders will
// //             appear here.
// //           </p>

// //           <Link
// //             to="/cakes"
// //             className="primary-button"
// //           >
// //             Explore Cakes
// //           </Link>
// //         </div>
// //       </section>
// //     );
// //   }

// //   // ==========================================
// //   // UI
// //   // ==========================================

// //   return (
// //     <section className="my-orders-page">
// //       <div className="container">
// //         <div className="my-orders-heading">
// //           <span className="section-kicker">
// //             YOUR ORDERS
// //           </span>

// //           <h1>
// //             My Orders
// //           </h1>

// //           <p>
// //             Track your cake orders and
// //             view delivery details.
// //           </p>
// //         </div>

// //         <div className="orders-list">
// //           {orders.map((order) => (
// //             <div
// //               className="order-card"
// //               key={order.id}
// //             >
// //               <div className="order-card-top">
// //                 <div>
// //                   <span className="order-small-label">
// //                     Order Number
// //                   </span>

// //                   <h3>
// //                     {order.orderNumber}
// //                   </h3>
// //                 </div>

// //                 <span
// //                   className={`order-status-badge ${order.status
// //                     .toLowerCase()
// //                     .replaceAll(
// //                       " ",
// //                       "-"
// //                     )}`}
// //                 >
// //                   {order.status}
// //                 </span>
// //               </div>

// //               <div className="order-card-info">
// //                 <div>
// //                   <span>
// //                     Order Date
// //                   </span>

// //                   <strong>
// //                     {order.createdAt
// //                       ? new Date(
// //                           order.createdAt
// //                         ).toLocaleDateString(
// //                           "en-GB",
// //                           {
// //                             day: "2-digit",
// //                             month: "short",
// //                             year: "numeric",
// //                           }
// //                         )
// //                       : "—"}
// //                   </strong>
// //                 </div>

// //                 <div>
// //                   <span>
// //                     Delivery Date
// //                   </span>

// //                   <strong>
// //                     {order.delivery
// //                       .date || "—"}
// //                   </strong>
// //                 </div>

// //                 <div>
// //                   <span>
// //                     Items
// //                   </span>

// //                   <strong>
// //                     {order.totalItems}
// //                   </strong>
// //                 </div>

// //                 <div>
// //                   <span>
// //                     Total
// //                   </span>

// //                   <strong>
// //                     Rs.{" "}
// //                     {order.total.toLocaleString()}
// //                   </strong>
// //                 </div>
// //               </div>

// //               {order.items.length >
// //                 0 && (
// //                 <div className="order-card-products">
// //                   {order.items
// //                     .slice(0, 4)
// //                     .map(
// //                       (
// //                         item,
// //                         index
// //                       ) =>
// //                         item.image ? (
// //                           <img
// //                             key={
// //                               index
// //                             }
// //                             src={
// //                               item.image
// //                             }
// //                             alt={
// //                               item.name
// //                             }
// //                           />
// //                         ) : (
// //                           <div
// //                             key={
// //                               index
// //                             }
// //                             className="more-products"
// //                           >
// //                             Cake
// //                           </div>
// //                         )
// //                     )}

// //                   {order.items.length >
// //                     4 && (
// //                     <div className="more-products">
// //                       +
// //                       {order.items
// //                         .length - 4}
// //                     </div>
// //                   )}
// //                 </div>
// //               )}

// //               <Link
// //                 to={`/my-orders/${order.id}`}
// //                 className="order-view-button"
// //               >
// //                 View Order Details

// //                 <ArrowRight
// //                   size={16}
// //                 />
// //               </Link>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </section>
// //   );
// // };

// // export default MyOrders;

// import { useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   Search,
//   History,
//   Package,
//   ArrowRight,
//   LoaderCircle,
// } from "lucide-react";

// const API_ROOT = "https://coreops.pk/cakes/api";

// export default function MyOrders() {
//   const [email, setEmail] = useState("");
//   const [orders, setOrders] = useState([]);
//   const [mode, setMode] = useState("track");
//   const [searched, setSearched] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [expanded, setExpanded] = useState(null);

//   async function lookup(nextMode = mode) {
//     const value = email.trim().toLowerCase();
//     setMode(nextMode);
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
//       setError("Please enter a valid email address.");
//       setSearched(false);
//       return;
//     }
//     setLoading(true);
//     setError("");
//     setSearched(false);
//     setExpanded(null);
//     try {
//       const response = await fetch(`${API_ROOT}/Orders/getByEmail.php`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: value }),
//       });
//       const result = await response.json();
//       if (!response.ok || result.status !== "success")
//         throw new Error(result.message || "Unable to find orders.");
//       setOrders(Array.isArray(result.data) ? result.data : []);
//       setSearched(true);
//     } catch (err) {
//       setError(err.message || "Something went wrong.");
//       setOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const shown = mode === "track" ? orders.slice(0, 1) : orders;
//   const money = (n) => `Rs. ${Number(n || 0).toLocaleString("en-PK")}`;

//   return (
//     <section
//       className="my-orders-page"
//       style={{ padding: "55px 16px", minHeight: "70vh" }}
//     >
//       <div className="container" style={{ maxWidth: 900, margin: "0 auto" }}>
//         <div
//           className="my-orders-heading"
//           style={{ textAlign: "center", marginBottom: 30 }}
//         >
//           <span className="section-kicker">JUST BAKE IT OFFICIAL</span>
//           <h1>Track Your Order</h1>
//           <p>Enter the email address used at checkout. No sign-in required.</p>
//         </div>
//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             lookup();
//           }}
//           style={{
//             padding: 24,
//             background: "#F6EDE5",
//             borderRadius: 12,
//             display: "grid",
//             gap: 14,
//           }}
//         >
//           <label htmlFor="tracking-email" style={{ fontWeight: 600 }}>
//             Email Address
//           </label>
//           <input
//             id="tracking-email"
//             type="email"
//             required
//             autoComplete="email"
//             value={email}
//             onChange={(e) => {
//               setEmail(e.target.value);
//               setSearched(false);
//               setError("");
//             }}
//             placeholder="you@example.com"
//             style={{
//               padding: 14,
//               border: "1px solid #d9c9be",
//               borderRadius: 6,
//               width: "100%",
//             }}
//           />
//           <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//             <button
//               type="submit"
//               disabled={loading}
//               className="primary-button"
//               onClick={() => setMode("track")}
//               style={{ display: "inline-flex", gap: 8, alignItems: "center" }}
//             >
//               <Search size={17} /> Track Order
//             </button>
//             <button
//               type="button"
//               disabled={loading}
//               className="outline-button"
//               onClick={() => lookup("history")}
//               style={{ display: "inline-flex", gap: 8, alignItems: "center" }}
//             >
//               <History size={17} /> Check Order History
//             </button>
//           </div>
//           {error && (
//             <p role="alert" style={{ color: "#a12727" }}>
//               {error}
//             </p>
//           )}
//         </form>
//         {loading && (
//           <p style={{ textAlign: "center", padding: 25 }}>
//             <LoaderCircle size={20} /> Loading orders...
//           </p>
//         )}
//         {searched && !loading && (
//           <div style={{ marginTop: 28 }}>
//             <h2 style={{ marginBottom: 18 }}>
//               {mode === "track"
//                 ? "Latest Order Tracking"
//                 : `Order History (${orders.length})`}
//             </h2>
//             {shown.length === 0 ? (
//               <div className="empty-orders-content">
//                 <Package size={30} />
//                 <h3>No orders found</h3>
//                 <p>Check that you entered the same email used at checkout.</p>
//                 <Link to="/cakes">
//                   Explore Cakes <ArrowRight size={15} />
//                 </Link>
//               </div>
//             ) : (
//               <div className="orders-list" style={{ display: "grid", gap: 18 }}>
//                 {shown.map((order) => (
//                   <article
//                     className="order-card"
//                     key={order.id}
//                     style={{
//                       padding: 22,
//                       border: "1px solid #e4d7cc",
//                       borderRadius: 10,
//                     }}
//                   >
//                     <div
//                       className="order-card-top"
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         gap: 10,
//                         flexWrap: "wrap",
//                       }}
//                     >
//                       <div>
//                         <small>Order Number</small>
//                         <h3>{order.order_number}</h3>
//                       </div>
//                       <span
//                         className={`order-status-badge ${String(
//                           order.status || "Pending",
//                         )
//                           .toLowerCase()
//                           .replaceAll(" ", "-")}`}
//                       >
//                         {order.status || "Pending"}
//                       </span>
//                     </div>
//                     <div
//                       className="order-card-info"
//                       style={{
//                         display: "flex",
//                         gap: 22,
//                         flexWrap: "wrap",
//                         margin: "18px 0",
//                       }}
//                     >
//                       <div>
//                         <small>Placed</small>
//                         <strong style={{ display: "block" }}>
//                           {order.placed_at
//                             ? new Date(order.placed_at).toLocaleDateString(
//                                 "en-GB",
//                               )
//                             : "—"}
//                         </strong>
//                       </div>
//                       <div>
//                         <small>Delivery/Pickup</small>
//                         <strong style={{ display: "block" }}>
//                           {order.delivery_date || "—"}
//                         </strong>
//                       </div>
//                       <div>
//                         <small>Payment</small>
//                         <strong style={{ display: "block" }}>
//                           {order.payment_status || "Pending"}
//                         </strong>
//                       </div>
//                       <div>
//                         <small>Total</small>
//                         <strong style={{ display: "block" }}>
//                           {money(order.total)}
//                         </strong>
//                       </div>
//                     </div>
//                     <button
//                       type="button"
//                       className="order-details-button"
//                       onClick={() =>
//                         setExpanded(expanded === order.id ? null : order.id)
//                       }
//                     >
//                       {expanded === order.id
//                         ? "Hide Cake Details"
//                         : "View Cake Details"}

//                       <ArrowRight size={16} />
//                     </button>
//                     {expanded === order.id && (
//                       <div
//                         style={{
//                           marginTop: 16,
//                           borderTop: "1px solid #e4d7cc",
//                           paddingTop: 14,
//                         }}
//                       >
//                         {(order.items || []).map((item, i) => (
//                           <p key={i} style={{ marginBottom: 9 }}>
//                             <strong>{item.cake_name}</strong> —{" "}
//                             {item.selected_size || ""}{" "}
//                             {item.selected_color
//                               ? `· ${item.selected_color}`
//                               : ""}{" "}
//                             · Qty {item.quantity} · {money(item.line_total)}
//                           </p>
//                         ))}
//                       </div>
//                     )}
//                   </article>
//                 ))}
//               </div>
//             )}
//             {mode === "track" && orders.length > 1 && (
//               <button
//                 className="outline-button"
//                 style={{ marginTop: 22 }}
//                 onClick={() => setMode("history")}
//               >
//                 Check Order History ({orders.length})
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  History,
  Package,
  ArrowRight,
  LoaderCircle,
} from "lucide-react";

const API_ROOT = "https://coreops.pk/cakes/api";

export default function MyOrders() {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState([]);
  const [mode, setMode] = useState("track");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);
  const trackedEmailRef = useRef("");
  const [lastUpdated, setLastUpdated] = useState(null);

  // Poll while this page is open; refresh order statuses without a page reload.
  useEffect(() => {
    if (!searched || !trackedEmailRef.current) return;
    let disposed = false;
    let inFlight = false;
    const refresh = async () => {
      if (disposed || inFlight || document.visibilityState === "hidden") return;
      inFlight = true;
      try {
        const response = await fetch(`${API_ROOT}/Orders/getByEmail.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: trackedEmailRef.current }),
          cache: "no-store",
        });
        const result = await response.json();
        if (!disposed && response.ok && result.status === "success") {
          setOrders(Array.isArray(result.data) ? result.data : []);
          setLastUpdated(new Date());
        }
      } catch (err) {
        console.warn("Background tracking update failed:", err);
      } finally {
        inFlight = false;
      }
    };
    const interval = setInterval(refresh, 15000);
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      disposed = true;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [searched]);

  const progressSteps = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Ready",
    "Completed",
  ];
  const getProgressIndex = (status) => {
    const key = String(status || "Pending")
      .trim()
      .toLowerCase();
    const aliases = {
      pending: 0,
      placed: 0,
      confirmed: 1,
      accepted: 1,
      preparing: 2,
      "in progress": 2,
      processing: 2,
      ready: 3,
      "ready for pickup": 3,
      "out for delivery": 3,
      dispatched: 3,
      completed: 4,
      delivered: 4,
      closed: 4,
    };
    return Object.prototype.hasOwnProperty.call(aliases, key)
      ? aliases[key]
      : 0;
  };

  async function lookup(nextMode = mode) {
    const value = email.trim().toLowerCase();
    setMode(nextMode);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Please enter a valid email address.");
      setSearched(false);
      return;
    }
    trackedEmailRef.current = "";
    setLoading(true);
    setError("");
    setSearched(false);
    setExpanded(null);
    try {
      const response = await fetch(`${API_ROOT}/Orders/getByEmail.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      const result = await response.json();
      if (!response.ok || result.status !== "success")
        throw new Error(result.message || "Unable to find orders.");
      setOrders(Array.isArray(result.data) ? result.data : []);
      trackedEmailRef.current = value;
      setLastUpdated(new Date());
      setSearched(true);
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  const shown = mode === "track" ? orders.slice(0, 1) : orders;
  const money = (n) => `Rs. ${Number(n || 0).toLocaleString("en-PK")}`;

  return (
    <section
      className="my-orders-page"
      style={{ padding: "55px 16px", minHeight: "70vh" }}
    >
      <div className="container" style={{ maxWidth: 900, margin: "0 auto" }}>
        <div
          className="my-orders-heading"
          style={{ textAlign: "center", marginBottom: 30 }}
        >
          <span className="section-kicker">JUST BAKE IT OFFICIAL</span>
          <h1>Track Your Order</h1>
          <p>Enter the email address used at checkout. No sign-in required.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            lookup();
          }}
          style={{
            padding: 24,
            background: "#F6EDE5",
            borderRadius: 12,
            display: "grid",
            gap: 14,
          }}
        >
          <label htmlFor="tracking-email" style={{ fontWeight: 600 }}>
            Email Address
          </label>
          <input
            id="tracking-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              trackedEmailRef.current = "";
              setSearched(false);
              setError("");
            }}
            placeholder="you@example.com"
            style={{
              padding: 14,
              border: "1px solid #d9c9be",
              borderRadius: 6,
              width: "100%",
            }}
          />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="submit"
              disabled={loading}
              className="primary-button"
              onClick={() => setMode("track")}
              style={{ display: "inline-flex", gap: 8, alignItems: "center" }}
            >
              <Search size={17} /> Track Order
            </button>
            <button
              type="button"
              disabled={loading}
              className="outline-button"
              onClick={() => lookup("history")}
              style={{ display: "inline-flex", gap: 8, alignItems: "center" }}
            >
              <History size={17} /> Check Order History
            </button>
          </div>
          {error && (
            <p role="alert" style={{ color: "#a12727" }}>
              {error}
            </p>
          )}
        </form>
        {loading && (
          <p style={{ textAlign: "center", padding: 25 }}>
            <LoaderCircle size={20} /> Loading orders...
          </p>
        )}
        {searched && !loading && (
          <div style={{ marginTop: 28 }}>
            <h2 style={{ marginBottom: 8 }}>
              {mode === "track"
                ? "Latest Order Tracking"
                : `Order History (${orders.length})`}
            </h2>
            <p
              style={{ fontSize: 12, color: "#755F54", marginBottom: 18 }}
              aria-live="polite"
            >
              <span style={{ color: "#8B5E3C" }}>●</span> Status updates
              automatically every 15 seconds
              {lastUpdated
                ? ` · Last checked ${lastUpdated.toLocaleTimeString()}`
                : ""}
            </p>
            {shown.length === 0 ? (
              <div className="empty-orders-content">
                <Package size={30} />
                <h3>No orders found</h3>
                <p>Check that you entered the same email used at checkout.</p>
                <Link to="/cakes">
                  Explore Cakes <ArrowRight size={15} />
                </Link>
              </div>
            ) : (
              <div className="orders-list" style={{ display: "grid", gap: 18 }}>
                {shown.map((order) => (
                  <article
                    className="order-card"
                    key={order.id}
                    style={{
                      padding: 22,
                      border: "1px solid #e4d7cc",
                      borderRadius: 10,
                    }}
                  >
                    <div
                      className="order-card-top"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <small>Order Number</small>
                        <h3>{order.order_number}</h3>
                      </div>
                      <span
                        className={`order-status-badge ${String(
                          order.status || "Pending",
                        )
                          .toLowerCase()
                          .replaceAll(" ", "-")}`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </div>
                    <div
                      className="order-card-info"
                      style={{
                        display: "flex",
                        gap: 22,
                        flexWrap: "wrap",
                        margin: "18px 0",
                      }}
                    >
                      <div>
                        <small>Placed</small>
                        <strong style={{ display: "block" }}>
                          {order.placed_at
                            ? new Date(order.placed_at).toLocaleDateString(
                                "en-GB",
                              )
                            : "—"}
                        </strong>
                      </div>
                      <div>
                        <small>Delivery/Pickup</small>
                        <strong style={{ display: "block" }}>
                          {order.delivery_date || "—"}
                        </strong>
                      </div>
                      <div>
                        <small>Payment</small>
                        <strong style={{ display: "block" }}>
                          {order.payment_status || "Pending"}
                        </strong>
                      </div>
                      <div>
                        <small>Total</small>
                        <strong style={{ display: "block" }}>
                          {money(order.total)}
                        </strong>
                      </div>
                    </div>
                    <div style={{ margin: "22px 0 20px" }}>
                      <h4
                        style={{
                          fontFamily: 'Georgia, "Times New Roman", serif',
                          fontSize: 17,
                          marginBottom: 16,
                          color: "#2C211C",
                        }}
                      >
                        Order Progress
                      </h4>
                      {!["cancelled", "canceled", "rejected"].includes(
                        String(order.status || "").toLowerCase(),
                      ) ? (
                        <div style={{ overflowX: "auto", paddingBottom: 10 }}>
                          <div
                            style={{ display: "flex", minWidth: 460 }}
                            role="list"
                            aria-label={`Order progress: ${order.status || "Pending"}`}
                          >
                            {progressSteps.map((step, index) => {
                              const current = getProgressIndex(order.status);
                              const done = index < current;
                              const reached = index <= current;
                              return (
                                <div
                                  key={step}
                                  role="listitem"
                                  style={{
                                    flex: 1,
                                    minWidth: 0,
                                    textAlign: "center",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <div
                                      style={{
                                        height: 3,
                                        flex: 1,
                                        background:
                                          index === 0
                                            ? "transparent"
                                            : index <= current
                                              ? "#8B5E3C"
                                              : "#e4d7cc",
                                      }}
                                    />
                                    <div
                                      style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: "50%",
                                        flexShrink: 0,
                                        display: "grid",
                                        placeItems: "center",
                                        background: reached
                                          ? "#8B5E3C"
                                          : "#eee6e0",
                                        color: reached ? "white" : "#755F54",
                                        fontSize: 12,
                                        fontWeight: 700,
                                      }}
                                    >
                                      {done ? "✓" : index + 1}
                                    </div>
                                    <div
                                      style={{
                                        height: 3,
                                        flex: 1,
                                        background:
                                          index === progressSteps.length - 1
                                            ? "transparent"
                                            : index < current
                                              ? "#8B5E3C"
                                              : "#e4d7cc",
                                      }}
                                    />
                                  </div>
                                  <div
                                    style={{
                                      fontSize: 11,
                                      marginTop: 9,
                                      fontWeight: reached ? 700 : 400,
                                      color: reached ? "#2C211C" : "#8c7b71",
                                    }}
                                  >
                                    {step}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <p style={{ color: "#a12727" }}>
                          Order {order.status}. Progress has stopped.
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      className="order-details-button"
                      onClick={() =>
                        setExpanded(expanded === order.id ? null : order.id)
                      }
                    >
                      {expanded === order.id
                        ? "Hide Cake Details"
                        : "View Cake Details"}

                      <ArrowRight size={16} />
                    </button>
                    {expanded === order.id && (
                      <div
                        style={{
                          marginTop: 16,
                          borderTop: "1px solid #e4d7cc",
                          paddingTop: 14,
                        }}
                      >
                        {(order.items || []).map((item, i) => (
                          <p key={i} style={{ marginBottom: 9 }}>
                            <strong>{item.cake_name}</strong> —{" "}
                            {item.selected_size || ""}{" "}
                            {item.selected_color
                              ? `· ${item.selected_color}`
                              : ""}{" "}
                            · Qty {item.quantity} · {money(item.line_total)}
                          </p>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
            {mode === "track" && orders.length > 1 && (
              <button
                className="outline-button"
                style={{ marginTop: 22 }}
                onClick={() => setMode("history")}
              >
                Check Order History ({orders.length})
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
