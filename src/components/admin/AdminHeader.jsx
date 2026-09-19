// import {
//   Bell,
//   Clock3,
//   LogOut,
//   Search,
//   ShoppingBag,
//   X,
// } from "lucide-react";

// import {
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";

// import {
//   useNavigate,
// } from "react-router-dom";

// const API_ROOT =
//   "https://coreops.pk/cakes/api";

// const AdminHeader = () => {
//   const navigate = useNavigate();

//   const reminderRef = useRef(null);
//   const notificationRef = useRef(null);

//   const admin = JSON.parse(
//     localStorage.getItem("cakeAdmin") || "{}"
//   );

//   const [notifications, setNotifications] = useState([]);
//   const [notificationOpen, setNotificationOpen] = useState(false);
//   const [loadingNotifications, setLoadingNotifications] = useState(true);
//   const [notificationError, setNotificationError] = useState("");
//   const [unreadCount, setUnreadCount] = useState(0);

//   const [reminders, setReminders] =
//     useState([]);

//   const [reminderOpen, setReminderOpen] =
//     useState(false);

//   const [loadingReminders, setLoadingReminders] =
//     useState(true);

//   const [reminderError, setReminderError] =
//     useState("");

//   // Used to refresh countdown every second.
//   const [currentTime, setCurrentTime] =
//     useState(Date.now());

//   // ==========================================
//   // LOGOUT
//   // ==========================================

//   const handleLogout = () => {
//     localStorage.removeItem("cakeAdmin");

//     navigate("/admin/login");
//   };

//   // ==========================================
//   // NOTIFICATIONS
//   // ==========================================

//   const loadNotifications = async (showLoading = false) => {
//     try {
//       if (showLoading) setLoadingNotifications(true);
//       setNotificationError("");
//       const response = await fetch(`${API_ROOT}/AdminNotifications/getAll.php`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({}),
//       });
//       const result = await response.json();
//       if (!response.ok || result.status !== "success") {
//         throw new Error(result.message || "Unable to load notifications.");
//       }
//       setNotifications(Array.isArray(result.data) ? result.data : []);
//       setUnreadCount(Number(result.unread_count || 0));
//     } catch (error) {
//       console.error("Notification loading error:", error);
//       setNotificationError(error.message || "Unable to load notifications.");
//     } finally {
//       setLoadingNotifications(false);
//     }
//   };

//   const markNotificationAsRead = async (notification) => {
//     // Close dropdown immediately so the click feels responsive.
//     setNotificationOpen(false);
//     setNotificationError("");

//     // Optimistically mark the notification as read in the UI.
//     if (Number(notification.is_read) === 0) {
//       setNotifications((previous) =>
//         previous.map((item) =>
//           Number(item.id) === Number(notification.id)
//             ? { ...item, is_read: 1 }
//             : item
//         )
//       );

//       setUnreadCount((previous) =>
//         Math.max(0, previous - 1)
//       );
//     }

//     // Open Orders immediately. The read API must never block navigation.
//     navigate("/admin/orders", {
//       state: {
//         orderId: notification.order_id,
//         orderNumber: notification.order_number,
//       },
//     });

//     // Persist read state in the background.
//     if (Number(notification.is_read) === 0) {
//       try {
//         const response = await fetch(
//           `${API_ROOT}/AdminNotifications/markRead.php`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               notification_id: Number(notification.id),
//             }),
//           }
//         );

//         let result = null;

//         try {
//           result = await response.json();
//         } catch {
//           console.error(
//             "Server returned an invalid mark-read response."
//           );
//           return;
//         }

//         if (
//           !response.ok ||
//           result.status !== "success"
//         ) {
//           console.error(
//             "Unable to mark notification as read:",
//             result.message || "Unknown server error"
//           );
//         }
//       } catch (error) {
//         console.error(
//           "Mark notification read error:",
//           error
//         );
//       }
//     }
//   };

//   const markAllNotificationsAsRead = async () => {
//     try {
//       setNotificationError("");

//       const response = await fetch(
//         `${API_ROOT}/AdminNotifications/markAllRead.php`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({}),
//         }
//       );

//       let result;

//       try {
//         result = await response.json();
//       } catch {
//         throw new Error(
//           "Server returned an invalid mark-all-read response."
//         );
//       }

//       if (
//         !response.ok ||
//         result.status !== "success"
//       ) {
//         throw new Error(
//           result.message ||
//             "Unable to mark all notifications as read."
//         );
//       }

//       setNotifications((previous) =>
//         previous.map((item) => ({
//           ...item,
//           is_read: 1,
//         }))
//       );

//       setUnreadCount(0);
//     } catch (error) {
//       console.error(
//         "Mark all notifications error:",
//         error
//       );

//       setNotificationError(
//         error.message ||
//           "Unable to mark all notifications as read."
//       );
//     }
//   };

//   // ==========================================
//   // LOAD REMINDERS
//   // ==========================================

//   const loadReminders = async (
//     showLoading = false
//   ) => {
//     try {
//       if (showLoading) {
//         setLoadingReminders(true);
//       }

//       setReminderError("");

//       const response = await fetch(
//         `${API_ROOT}/AdminOrders/getUpcomingReminders.php`,
//         {
//           method: "POST",

//           headers: {
//             "Content-Type": "application/json",
//           },

//           body: JSON.stringify({}),
//         }
//       );

//       let result;

//       try {
//         result = await response.json();
//       } catch {
//         throw new Error(
//           "Server returned an invalid reminder response."
//         );
//       }

//       if (
//         !response.ok ||
//         result.status !== "success"
//       ) {
//         throw new Error(
//           result.message ||
//             "Unable to load order reminders."
//         );
//       }

//       setReminders(
//         Array.isArray(result.data)
//           ? result.data
//           : []
//       );
//     } catch (error) {
//       console.error(
//         "Reminder loading error:",
//         error
//       );

//       setReminderError(
//         error.message ||
//           "Unable to load reminders."
//       );
//     } finally {
//       setLoadingReminders(false);
//     }
//   };

//   // ==========================================
//   // INITIAL LOAD + AUTO REFRESH API
//   // ==========================================

//   useEffect(() => {
//     loadNotifications(true);
//     loadReminders(true);

//     const apiInterval = setInterval(() => {
//       loadNotifications(false);
//       loadReminders(false);
//     }, 60000);

//     return () => {
//       clearInterval(apiInterval);
//     };
//   }, []);

//   // ==========================================
//   // LIVE COUNTDOWN
//   // ==========================================

//   useEffect(() => {
//     const clockInterval = setInterval(() => {
//       setCurrentTime(Date.now());
//     }, 1000);

//     return () => {
//       clearInterval(clockInterval);
//     };
//   }, []);

//   // ==========================================
//   // CLOSE DROPDOWN OUTSIDE
//   // ==========================================

//   useEffect(() => {
//     const handleOutsideClick = (event) => {
//       if (
//         reminderRef.current &&
//         !reminderRef.current.contains(
//           event.target
//         )
//       ) {
//         setReminderOpen(false);
//       }

//       if (notificationRef.current && !notificationRef.current.contains(event.target)) {
//         setNotificationOpen(false);
//       }
//     };

//     document.addEventListener(
//       "mousedown",
//       handleOutsideClick
//     );

//     return () => {
//       document.removeEventListener(
//         "mousedown",
//         handleOutsideClick
//       );
//     };
//   }, []);

//   // ==========================================
//   // PARSE DELIVERY DATETIME
//   // ==========================================

//   const parseDeliveryDateTime = (
//     reminder
//   ) => {
//     const value =
//       reminder.delivery_datetime;

//     if (!value) {
//       return null;
//     }

//     // PHP returns:
//     // 2026-09-20 16:00:00

//     const parsed = new Date(
//       value.replace(" ", "T")
//     );

//     if (
//       Number.isNaN(parsed.getTime())
//     ) {
//       return null;
//     }

//     return parsed;
//   };

//   // ==========================================
//   // COUNTDOWN
//   // ==========================================

//   const getCountdown = (reminder) => {
//     const deliveryDate =
//       parseDeliveryDateTime(reminder);

//     if (!deliveryDate) {
//       return "Delivery time unavailable";
//     }

//     const difference =
//       deliveryDate.getTime() -
//       currentTime;

//     const absoluteDifference =
//       Math.abs(difference);

//     const totalMinutes = Math.floor(
//       absoluteDifference / 60000
//     );

//     const days = Math.floor(
//       totalMinutes / 1440
//     );

//     const hours = Math.floor(
//       (totalMinutes % 1440) / 60
//     );

//     const minutes =
//       totalMinutes % 60;

//     if (difference < 0) {
//       if (days > 0) {
//         return `Overdue by ${days}d ${hours}h ${minutes}m`;
//       }

//       return `Overdue by ${hours}h ${minutes}m`;
//     }

//     if (days > 0) {
//       return `${days}d ${hours}h ${minutes}m remaining`;
//     }

//     return `${hours}h ${minutes}m remaining`;
//   };

//   // ==========================================
//   // FORMAT DATE
//   // ==========================================

//   const formatDeliveryDate = (
//     dateValue
//   ) => {
//     if (!dateValue) {
//       return "—";
//     }

//     const parsed = new Date(
//       `${dateValue}T00:00:00`
//     );

//     if (
//       Number.isNaN(parsed.getTime())
//     ) {
//       return dateValue;
//     }

//     return parsed.toLocaleDateString(
//       "en-PK",
//       {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       }
//     );
//   };

//   // ==========================================
//   // COUNTS
//   // ==========================================

//   const reminderSummary = useMemo(() => {
//     let overdue = 0;
//     let urgent = 0;
//     let upcoming = 0;

//     reminders.forEach((reminder) => {
//       if (
//         reminder.reminder_type ===
//         "overdue"
//       ) {
//         overdue += 1;
//       } else if (
//         reminder.reminder_type ===
//         "urgent"
//       ) {
//         urgent += 1;
//       } else {
//         upcoming += 1;
//       }
//     });

//     return {
//       overdue,
//       urgent,
//       upcoming,
//     };
//   }, [reminders]);

//   // ==========================================
//   // OPEN ORDER
//   // ==========================================

//   const handleOpenOrder = (
//     reminder
//   ) => {
//     setReminderOpen(false);

//     /*
//       Your admin orders are already handled
//       through /admin/orders.

//       Opening Orders page keeps this compatible
//       with the existing Orders.jsx.
//     */

//     navigate("/admin/orders", {
//       state: {
//         orderId: reminder.id,
//         orderNumber:
//           reminder.order_number,
//       },
//     });
//   };

//   return (
//     <header className="admin-header">
//       {/* ======================================
//           SEARCH
//       ====================================== */}

//       <div className="admin-header-search">
//         <Search size={17} />

//         <input
//           type="text"
//           placeholder="Search anything..."
//         />
//       </div>

//       {/* ======================================
//           RIGHT SIDE
//       ====================================== */}

//       <div className="admin-header-actions">

//         {/* NOTIFICATIONS */}
//         <div className="admin-reminder-wrapper" ref={notificationRef}>
//           <button
//             type="button"
//             className={`admin-reminder-button ${unreadCount > 0 ? "has-reminders" : ""}`}
//             onClick={() => {
//               setNotificationOpen((previous) => !previous);
//               setReminderOpen(false);
//             }}
//             aria-label="Notifications"
//           >
//             <Bell size={20} />
//             {unreadCount > 0 && (
//               <span className="admin-reminder-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
//             )}
//           </button>

//           {notificationOpen && (
//             <div className="admin-reminder-dropdown">
//               <div className="admin-reminder-dropdown-header">
//                 <div>
//                   <span className="admin-reminder-kicker">NOTIFICATIONS</span>
//                   <h3>Admin Notifications</h3>
//                 </div>
//                 <button type="button" className="admin-reminder-close" onClick={() => setNotificationOpen(false)}>
//                   <X size={17} />
//                 </button>
//               </div>

//               {unreadCount > 0 && (
//                 <button type="button" className="admin-reminder-view-orders" onClick={markAllNotificationsAsRead}>
//                   Mark all as read ({unreadCount})
//                 </button>
//               )}

//               {loadingNotifications ? (
//                 <div className="admin-reminder-empty"><Bell size={23} /><strong>Loading notifications...</strong></div>
//               ) : notificationError ? (
//                 <div className="admin-reminder-error">
//                   <strong>Unable to load notifications</strong><span>{notificationError}</span>
//                   <button type="button" onClick={() => loadNotifications(true)}>Try Again</button>
//                 </div>
//               ) : notifications.length === 0 ? (
//                 <div className="admin-reminder-empty"><Bell size={26} /><strong>No notifications</strong><span>New order activity will appear here.</span></div>
//               ) : (
//                 <div className="admin-reminder-list">
//                   {notifications.map((notification) => (
//                     <button
//                       type="button"
//                       key={notification.id}
//                       className={`admin-reminder-item ${Number(notification.is_read) === 0 ? "urgent" : ""}`}
//                       onClick={() => markNotificationAsRead(notification)}
//                     >
//                       <div className="admin-reminder-item-icon"><ShoppingBag size={18} /></div>
//                       <div className="admin-reminder-item-content">
//                         <div className="admin-reminder-item-top">
//                           <strong>{notification.title || notification.order_number || `Notification #${notification.id}`}</strong>
//                           {Number(notification.is_read) === 0 && <span className="admin-reminder-status urgent">NEW</span>}
//                         </div>
//                         <p>{notification.message || notification.customer_name || "Order notification"}</p>
//                         {notification.order_number && <div className="admin-reminder-delivery"><span>{notification.order_number}</span><span>{notification.customer_name || ""}</span></div>}
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               )}

//               <button type="button" className="admin-reminder-view-orders" onClick={() => { setNotificationOpen(false); navigate("/admin/orders"); }}>
//                 View All Orders
//               </button>
//             </div>
//           )}
//         </div>

//         {/* ==================================
//             REMINDER BELL
//         ================================== */}

//         <div
//           className="admin-reminder-wrapper"
//           ref={reminderRef}
//         >
//           <button
//             type="button"
//             className={`admin-reminder-button ${
//               reminders.length > 0
//                 ? "has-reminders"
//                 : ""
//             }`}
//             onClick={() => {
//               setNotificationOpen(false);
//               setReminderOpen(
//                 (previous) => !previous
//               );
//             }}
//             aria-label="Order reminders"
//           >
//             <Clock3 size={20} />

//             {reminders.length > 0 && (
//               <span className="admin-reminder-badge">
//                 {reminders.length > 99
//                   ? "99+"
//                   : reminders.length}
//               </span>
//             )}
//           </button>

//           {/* ==================================
//               DROPDOWN
//           ================================== */}

//           {reminderOpen && (
//             <div className="admin-reminder-dropdown">

//               {/* HEADER */}

//               <div className="admin-reminder-dropdown-header">
//                 <div>
//                   <span className="admin-reminder-kicker">
//                     DELIVERY ALERTS
//                   </span>

//                   <h3>
//                     Upcoming Orders
//                   </h3>
//                 </div>

//                 <button
//                   type="button"
//                   className="admin-reminder-close"
//                   onClick={() =>
//                     setReminderOpen(false)
//                   }
//                 >
//                   <X size={17} />
//                 </button>
//               </div>

//               {/* SUMMARY */}

//               {reminders.length > 0 && (
//                 <div className="admin-reminder-summary">
//                   <div>
//                     <strong>
//                       {
//                         reminderSummary.upcoming
//                       }
//                     </strong>

//                     <span>
//                       Upcoming
//                     </span>
//                   </div>

//                   <div>
//                     <strong>
//                       {
//                         reminderSummary.urgent
//                       }
//                     </strong>

//                     <span>
//                       Urgent
//                     </span>
//                   </div>

//                   <div>
//                     <strong>
//                       {
//                         reminderSummary.overdue
//                       }
//                     </strong>

//                     <span>
//                       Overdue
//                     </span>
//                   </div>
//                 </div>
//               )}

//               {/* LOADING */}

//               {loadingReminders && (
//                 <div className="admin-reminder-empty">
//                   <Clock3 size={23} />

//                   <strong>
//                     Loading reminders...
//                   </strong>
//                 </div>
//               )}

//               {/* ERROR */}

//               {!loadingReminders &&
//                 reminderError && (
//                   <div className="admin-reminder-error">
//                     <strong>
//                       Unable to load reminders
//                     </strong>

//                     <span>
//                       {reminderError}
//                     </span>

//                     <button
//                       type="button"
//                       onClick={() =>
//                         loadReminders(true)
//                       }
//                     >
//                       Try Again
//                     </button>
//                   </div>
//                 )}

//               {/* EMPTY */}

//               {!loadingReminders &&
//                 !reminderError &&
//                 reminders.length === 0 && (
//                   <div className="admin-reminder-empty">
//                     <Clock3 size={26} />

//                     <strong>
//                       No upcoming deliveries
//                     </strong>

//                     <span>
//                       Orders due within the
//                       next 24 hours will
//                       appear here.
//                     </span>
//                   </div>
//                 )}

//               {/* REMINDERS */}

//               {!loadingReminders &&
//                 !reminderError &&
//                 reminders.length > 0 && (
//                   <div className="admin-reminder-list">
//                     {reminders.map(
//                       (reminder) => (
//                         <button
//                           type="button"
//                           key={
//                             reminder.id
//                           }
//                           className={`admin-reminder-item ${
//                             reminder.reminder_type ||
//                             "upcoming"
//                           }`}
//                           onClick={() =>
//                             handleOpenOrder(
//                               reminder
//                             )
//                           }
//                         >
//                           <div className="admin-reminder-item-icon">
//                             <ShoppingBag
//                               size={18}
//                             />
//                           </div>

//                           <div className="admin-reminder-item-content">

//                             <div className="admin-reminder-item-top">
//                               <strong>
//                                 {reminder.order_number ||
//                                   `Order #${reminder.id}`}
//                               </strong>

//                               <span
//                                 className={`admin-reminder-status ${
//                                   reminder.reminder_type ||
//                                   "upcoming"
//                                 }`}
//                               >
//                                 {reminder.reminder_type ===
//                                 "overdue"
//                                   ? "OVERDUE"
//                                   : reminder.reminder_type ===
//                                       "urgent"
//                                     ? "URGENT"
//                                     : "UPCOMING"}
//                               </span>
//                             </div>

//                             <p>
//                               {reminder.customer_name ||
//                                 "Customer"}
//                             </p>

//                             <div className="admin-reminder-delivery">
//                               <span>
//                                 {formatDeliveryDate(
//                                   reminder.delivery_date
//                                 )}
//                               </span>

//                               <span>
//                                 {
//                                   reminder.delivery_time
//                                 }
//                               </span>
//                             </div>

//                             <div
//                               className={`admin-reminder-countdown ${
//                                 reminder.reminder_type ||
//                                 "upcoming"
//                               }`}
//                             >
//                               <Clock3
//                                 size={14}
//                               />

//                               <strong>
//                                 {getCountdown(
//                                   reminder
//                                 )}
//                               </strong>
//                             </div>
//                           </div>
//                         </button>
//                       )
//                     )}
//                   </div>
//                 )}

//               {/* FOOTER */}

//               <button
//                 type="button"
//                 className="admin-reminder-view-orders"
//                 onClick={() => {
//                   setReminderOpen(false);

//                   navigate(
//                     "/admin/orders"
//                   );
//                 }}
//               >
//                 View All Orders
//               </button>
//             </div>
//           )}
//         </div>

//         {/* ==================================
//             ADMIN USER
//         ================================== */}

//         <div className="admin-header-user">
//           <div className="admin-header-avatar">
//             {(
//               admin.name ||
//               "Admin"
//             )
//               .charAt(0)
//               .toUpperCase()}
//           </div>

//           <div className="admin-header-user-info">
//             <strong>
//               {admin.name || "Admin"}
//             </strong>

//             <span>
//               {admin.email}
//             </span>
//           </div>

//           <button
//             type="button"
//             onClick={handleLogout}
//             className="admin-header-logout"
//           >
//             <LogOut size={17} />
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default AdminHeader;





import {
  Bell,
  Clock3,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

const API_ROOT =
  "https://coreops.pk/cakes/api";

const AdminHeader = ({ onMenuClick }) => {
  const navigate = useNavigate();

  const reminderRef = useRef(null);
  const notificationRef = useRef(null);

  const admin = JSON.parse(
    localStorage.getItem("cakeAdmin") || "{}"
  );

  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [notificationError, setNotificationError] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const [reminders, setReminders] =
    useState([]);

  const [reminderOpen, setReminderOpen] =
    useState(false);

  const [loadingReminders, setLoadingReminders] =
    useState(true);

  const [reminderError, setReminderError] =
    useState("");

  // Used to refresh countdown every second.
  const [currentTime, setCurrentTime] =
    useState(Date.now());

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("cakeAdmin");

    navigate("/admin/login");
  };

  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  const loadNotifications = async (showLoading = false) => {
    try {
      if (showLoading) setLoadingNotifications(true);
      setNotificationError("");
      const response = await fetch(`${API_ROOT}/AdminNotifications/getAll.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const result = await response.json();
      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load notifications.");
      }
      setNotifications(Array.isArray(result.data) ? result.data : []);
      setUnreadCount(Number(result.unread_count || 0));
    } catch (error) {
      console.error("Notification loading error:", error);
      setNotificationError(error.message || "Unable to load notifications.");
    } finally {
      setLoadingNotifications(false);
    }
  };

  const markNotificationAsRead = async (notification) => {
    // Close dropdown immediately so the click feels responsive.
    setNotificationOpen(false);
    setNotificationError("");

    // Optimistically mark the notification as read in the UI.
    if (Number(notification.is_read) === 0) {
      setNotifications((previous) =>
        previous.map((item) =>
          Number(item.id) === Number(notification.id)
            ? { ...item, is_read: 1 }
            : item
        )
      );

      setUnreadCount((previous) =>
        Math.max(0, previous - 1)
      );
    }

    // Open Orders immediately. The read API must never block navigation.
    navigate("/admin/orders", {
      state: {
        orderId: notification.order_id,
        orderNumber: notification.order_number,
      },
    });

    // Persist read state in the background.
    if (Number(notification.is_read) === 0) {
      try {
        const response = await fetch(
          `${API_ROOT}/AdminNotifications/markRead.php`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              notification_id: Number(notification.id),
            }),
          }
        );

        let result = null;

        try {
          result = await response.json();
        } catch {
          console.error(
            "Server returned an invalid mark-read response."
          );
          return;
        }

        if (
          !response.ok ||
          result.status !== "success"
        ) {
          console.error(
            "Unable to mark notification as read:",
            result.message || "Unknown server error"
          );
        }
      } catch (error) {
        console.error(
          "Mark notification read error:",
          error
        );
      }
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      setNotificationError("");

      const response = await fetch(
        `${API_ROOT}/AdminNotifications/markAllRead.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      let result;

      try {
        result = await response.json();
      } catch {
        throw new Error(
          "Server returned an invalid mark-all-read response."
        );
      }

      if (
        !response.ok ||
        result.status !== "success"
      ) {
        throw new Error(
          result.message ||
            "Unable to mark all notifications as read."
        );
      }

      setNotifications((previous) =>
        previous.map((item) => ({
          ...item,
          is_read: 1,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Mark all notifications error:",
        error
      );

      setNotificationError(
        error.message ||
          "Unable to mark all notifications as read."
      );
    }
  };

  // ==========================================
  // LOAD REMINDERS
  // ==========================================

  const loadReminders = async (
    showLoading = false
  ) => {
    try {
      if (showLoading) {
        setLoadingReminders(true);
      }

      setReminderError("");

      const response = await fetch(
        `${API_ROOT}/AdminOrders/getUpcomingReminders.php`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({}),
        }
      );

      let result;

      try {
        result = await response.json();
      } catch {
        throw new Error(
          "Server returned an invalid reminder response."
        );
      }

      if (
        !response.ok ||
        result.status !== "success"
      ) {
        throw new Error(
          result.message ||
            "Unable to load order reminders."
        );
      }

      setReminders(
        Array.isArray(result.data)
          ? result.data
          : []
      );
    } catch (error) {
      console.error(
        "Reminder loading error:",
        error
      );

      setReminderError(
        error.message ||
          "Unable to load reminders."
      );
    } finally {
      setLoadingReminders(false);
    }
  };

  // ==========================================
  // INITIAL LOAD + AUTO REFRESH API
  // ==========================================

  useEffect(() => {
    loadNotifications(true);
    loadReminders(true);

    const apiInterval = setInterval(() => {
      loadNotifications(false);
      loadReminders(false);
    }, 60000);

    return () => {
      clearInterval(apiInterval);
    };
  }, []);

  // ==========================================
  // LIVE COUNTDOWN
  // ==========================================

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => {
      clearInterval(clockInterval);
    };
  }, []);

  // ==========================================
  // CLOSE DROPDOWN OUTSIDE
  // ==========================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        reminderRef.current &&
        !reminderRef.current.contains(
          event.target
        )
      ) {
        setReminderOpen(false);
      }

      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // ==========================================
  // PARSE DELIVERY DATETIME
  // ==========================================

  const parseDeliveryDateTime = (
    reminder
  ) => {
    const value =
      reminder.delivery_datetime;

    if (!value) {
      return null;
    }

    // PHP returns:
    // 2026-09-20 16:00:00

    const parsed = new Date(
      value.replace(" ", "T")
    );

    if (
      Number.isNaN(parsed.getTime())
    ) {
      return null;
    }

    return parsed;
  };

  // ==========================================
  // COUNTDOWN
  // ==========================================

  const getCountdown = (reminder) => {
    const deliveryDate =
      parseDeliveryDateTime(reminder);

    if (!deliveryDate) {
      return "Delivery time unavailable";
    }

    const difference =
      deliveryDate.getTime() -
      currentTime;

    const absoluteDifference =
      Math.abs(difference);

    const totalMinutes = Math.floor(
      absoluteDifference / 60000
    );

    const days = Math.floor(
      totalMinutes / 1440
    );

    const hours = Math.floor(
      (totalMinutes % 1440) / 60
    );

    const minutes =
      totalMinutes % 60;

    if (difference < 0) {
      if (days > 0) {
        return `Overdue by ${days}d ${hours}h ${minutes}m`;
      }

      return `Overdue by ${hours}h ${minutes}m`;
    }

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m remaining`;
    }

    return `${hours}h ${minutes}m remaining`;
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDeliveryDate = (
    dateValue
  ) => {
    if (!dateValue) {
      return "—";
    }

    const parsed = new Date(
      `${dateValue}T00:00:00`
    );

    if (
      Number.isNaN(parsed.getTime())
    ) {
      return dateValue;
    }

    return parsed.toLocaleDateString(
      "en-PK",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // COUNTS
  // ==========================================

  const reminderSummary = useMemo(() => {
    let overdue = 0;
    let urgent = 0;
    let upcoming = 0;

    reminders.forEach((reminder) => {
      if (
        reminder.reminder_type ===
        "overdue"
      ) {
        overdue += 1;
      } else if (
        reminder.reminder_type ===
        "urgent"
      ) {
        urgent += 1;
      } else {
        upcoming += 1;
      }
    });

    return {
      overdue,
      urgent,
      upcoming,
    };
  }, [reminders]);

  // ==========================================
  // OPEN ORDER
  // ==========================================

  const handleOpenOrder = (
    reminder
  ) => {
    setReminderOpen(false);

    /*
      Your admin orders are already handled
      through /admin/orders.

      Opening Orders page keeps this compatible
      with the existing Orders.jsx.
    */

    navigate("/admin/orders", {
      state: {
        orderId: reminder.id,
        orderNumber:
          reminder.order_number,
      },
    });
  };

  return (
    <header className="admin-header">
      <button
        type="button"
        className="admin-mobile-menu-button"
        onClick={onMenuClick}
        aria-label="Open admin menu"
      >
        <Menu size={21} />
      </button>

      {/* ======================================
          SEARCH
      ====================================== */}

      <div className="admin-header-search">
        <Search size={17} />

        <input
          type="text"
          placeholder="Search anything..."
        />
      </div>

      {/* ======================================
          RIGHT SIDE
      ====================================== */}

      <div className="admin-header-actions">

        {/* NOTIFICATIONS */}
        <div className="admin-reminder-wrapper" ref={notificationRef}>
          <button
            type="button"
            className={`admin-reminder-button ${unreadCount > 0 ? "has-reminders" : ""}`}
            onClick={() => {
              setNotificationOpen((previous) => !previous);
              setReminderOpen(false);
            }}
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="admin-reminder-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
            )}
          </button>

          {notificationOpen && (
            <div className="admin-reminder-dropdown">
              <div className="admin-reminder-dropdown-header">
                <div>
                  <span className="admin-reminder-kicker">NOTIFICATIONS</span>
                  <h3>Admin Notifications</h3>
                </div>
                <button type="button" className="admin-reminder-close" onClick={() => setNotificationOpen(false)}>
                  <X size={17} />
                </button>
              </div>

              {unreadCount > 0 && (
                <button type="button" className="admin-reminder-view-orders" onClick={markAllNotificationsAsRead}>
                  Mark all as read ({unreadCount})
                </button>
              )}

              {loadingNotifications ? (
                <div className="admin-reminder-empty"><Bell size={23} /><strong>Loading notifications...</strong></div>
              ) : notificationError ? (
                <div className="admin-reminder-error">
                  <strong>Unable to load notifications</strong><span>{notificationError}</span>
                  <button type="button" onClick={() => loadNotifications(true)}>Try Again</button>
                </div>
              ) : notifications.length === 0 ? (
                <div className="admin-reminder-empty"><Bell size={26} /><strong>No notifications</strong><span>New order activity will appear here.</span></div>
              ) : (
                <div className="admin-reminder-list">
                  {notifications.map((notification) => (
                    <button
                      type="button"
                      key={notification.id}
                      className={`admin-reminder-item ${Number(notification.is_read) === 0 ? "urgent" : ""}`}
                      onClick={() => markNotificationAsRead(notification)}
                    >
                      <div className="admin-reminder-item-icon"><ShoppingBag size={18} /></div>
                      <div className="admin-reminder-item-content">
                        <div className="admin-reminder-item-top">
                          <strong>{notification.title || notification.order_number || `Notification #${notification.id}`}</strong>
                          {Number(notification.is_read) === 0 && <span className="admin-reminder-status urgent">NEW</span>}
                        </div>
                        <p>{notification.message || notification.customer_name || "Order notification"}</p>
                        {notification.order_number && <div className="admin-reminder-delivery"><span>{notification.order_number}</span><span>{notification.customer_name || ""}</span></div>}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <button type="button" className="admin-reminder-view-orders" onClick={() => { setNotificationOpen(false); navigate("/admin/orders"); }}>
                View All Orders
              </button>
            </div>
          )}
        </div>

        {/* ==================================
            REMINDER BELL
        ================================== */}

        <div
          className="admin-reminder-wrapper"
          ref={reminderRef}
        >
          <button
            type="button"
            className={`admin-reminder-button ${
              reminders.length > 0
                ? "has-reminders"
                : ""
            }`}
            onClick={() => {
              setNotificationOpen(false);
              setReminderOpen(
                (previous) => !previous
              );
            }}
            aria-label="Order reminders"
          >
            <Clock3 size={20} />

            {reminders.length > 0 && (
              <span className="admin-reminder-badge">
                {reminders.length > 99
                  ? "99+"
                  : reminders.length}
              </span>
            )}
          </button>

          {/* ==================================
              DROPDOWN
          ================================== */}

          {reminderOpen && (
            <div className="admin-reminder-dropdown">

              {/* HEADER */}

              <div className="admin-reminder-dropdown-header">
                <div>
                  <span className="admin-reminder-kicker">
                    DELIVERY ALERTS
                  </span>

                  <h3>
                    Upcoming Orders
                  </h3>
                </div>

                <button
                  type="button"
                  className="admin-reminder-close"
                  onClick={() =>
                    setReminderOpen(false)
                  }
                >
                  <X size={17} />
                </button>
              </div>

              {/* SUMMARY */}

              {reminders.length > 0 && (
                <div className="admin-reminder-summary">
                  <div>
                    <strong>
                      {
                        reminderSummary.upcoming
                      }
                    </strong>

                    <span>
                      Upcoming
                    </span>
                  </div>

                  <div>
                    <strong>
                      {
                        reminderSummary.urgent
                      }
                    </strong>

                    <span>
                      Urgent
                    </span>
                  </div>

                  <div>
                    <strong>
                      {
                        reminderSummary.overdue
                      }
                    </strong>

                    <span>
                      Overdue
                    </span>
                  </div>
                </div>
              )}

              {/* LOADING */}

              {loadingReminders && (
                <div className="admin-reminder-empty">
                  <Clock3 size={23} />

                  <strong>
                    Loading reminders...
                  </strong>
                </div>
              )}

              {/* ERROR */}

              {!loadingReminders &&
                reminderError && (
                  <div className="admin-reminder-error">
                    <strong>
                      Unable to load reminders
                    </strong>

                    <span>
                      {reminderError}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        loadReminders(true)
                      }
                    >
                      Try Again
                    </button>
                  </div>
                )}

              {/* EMPTY */}

              {!loadingReminders &&
                !reminderError &&
                reminders.length === 0 && (
                  <div className="admin-reminder-empty">
                    <Clock3 size={26} />

                    <strong>
                      No upcoming deliveries
                    </strong>

                    <span>
                      Orders due within the
                      next 24 hours will
                      appear here.
                    </span>
                  </div>
                )}

              {/* REMINDERS */}

              {!loadingReminders &&
                !reminderError &&
                reminders.length > 0 && (
                  <div className="admin-reminder-list">
                    {reminders.map(
                      (reminder) => (
                        <button
                          type="button"
                          key={
                            reminder.id
                          }
                          className={`admin-reminder-item ${
                            reminder.reminder_type ||
                            "upcoming"
                          }`}
                          onClick={() =>
                            handleOpenOrder(
                              reminder
                            )
                          }
                        >
                          <div className="admin-reminder-item-icon">
                            <ShoppingBag
                              size={18}
                            />
                          </div>

                          <div className="admin-reminder-item-content">

                            <div className="admin-reminder-item-top">
                              <strong>
                                {reminder.order_number ||
                                  `Order #${reminder.id}`}
                              </strong>

                              <span
                                className={`admin-reminder-status ${
                                  reminder.reminder_type ||
                                  "upcoming"
                                }`}
                              >
                                {reminder.reminder_type ===
                                "overdue"
                                  ? "OVERDUE"
                                  : reminder.reminder_type ===
                                      "urgent"
                                    ? "URGENT"
                                    : "UPCOMING"}
                              </span>
                            </div>

                            <p>
                              {reminder.customer_name ||
                                "Customer"}
                            </p>

                            <div className="admin-reminder-delivery">
                              <span>
                                {formatDeliveryDate(
                                  reminder.delivery_date
                                )}
                              </span>

                              <span>
                                {
                                  reminder.delivery_time
                                }
                              </span>
                            </div>

                            <div
                              className={`admin-reminder-countdown ${
                                reminder.reminder_type ||
                                "upcoming"
                              }`}
                            >
                              <Clock3
                                size={14}
                              />

                              <strong>
                                {getCountdown(
                                  reminder
                                )}
                              </strong>
                            </div>
                          </div>
                        </button>
                      )
                    )}
                  </div>
                )}

              {/* FOOTER */}

              <button
                type="button"
                className="admin-reminder-view-orders"
                onClick={() => {
                  setReminderOpen(false);

                  navigate(
                    "/admin/orders"
                  );
                }}
              >
                View All Orders
              </button>
            </div>
          )}
        </div>

        {/* ==================================
            ADMIN USER
        ================================== */}

        <div className="admin-header-user">
          <div className="admin-header-avatar">
            {(
              admin.name ||
              "Admin"
            )
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="admin-header-user-info">
            <strong>
              {admin.name || "Admin"}
            </strong>

            <span>
              {admin.email}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="admin-header-logout"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;