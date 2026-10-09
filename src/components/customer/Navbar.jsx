// import { Link, NavLink, useNavigate } from "react-router-dom";
// import {
//   Menu,
//   ShoppingBag,
//   X,
//   PackageSearch,
//   ShieldCheck,
//   ChevronDown,
//   LogOut,
//   User,
//   Package,
// } from "lucide-react";

// import { useEffect, useRef, useState } from "react";
// import { useCart } from "../../context/CartContext";
// import fallbackLogo from "../../assets/images/just-bake-it-logo.jpeg";

// const API_ROOT = "https://coreops.pk/cakes/api";

// const Navbar = () => {
//   const navigate = useNavigate();

//   const [menuOpen, setMenuOpen] = useState(false);
//   const [userMenuOpen, setUserMenuOpen] = useState(false);
//   const [branding, setBranding] = useState(null);

//   const [loggedInUser, setLoggedInUser] = useState(() => {
//     try {
//       const savedUser = localStorage.getItem("loggedInCakeUser");
//       return savedUser ? JSON.parse(savedUser) : null;
//     } catch {
//       return null;
//     }
//   });

//   const userMenuRef = useRef(null);
//   const { cartCount } = useCart();

//   const closeMenu = () => setMenuOpen(false);

//   useEffect(() => {
//     const loadBranding = async () => {
//       try {
//         const response = await fetch(
//           `${API_ROOT}/HomeBanner/get.php`
//         );

//         const result = await response.json();

//         if (
//           response.ok &&
//           result.status === "success" &&
//           result.data
//         ) {
//           setBranding(result.data);
//         }
//       } catch (error) {
//         console.error("Navbar branding error:", error);
//       }
//     };

//     loadBranding();
//   }, []);

//   useEffect(() => {
//     const handleStorageChange = () => {
//       try {
//         const savedUser = localStorage.getItem(
//           "loggedInCakeUser"
//         );

//         setLoggedInUser(
//           savedUser ? JSON.parse(savedUser) : null
//         );
//       } catch {
//         setLoggedInUser(null);
//       }
//     };

//     window.addEventListener(
//       "cakeUserChanged",
//       handleStorageChange
//     );

//     window.addEventListener(
//       "storage",
//       handleStorageChange
//     );

//     return () => {
//       window.removeEventListener(
//         "cakeUserChanged",
//         handleStorageChange
//       );

//       window.removeEventListener(
//         "storage",
//         handleStorageChange
//       );
//     };
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         userMenuRef.current &&
//         !userMenuRef.current.contains(event.target)
//       ) {
//         setUserMenuOpen(false);
//       }
//     };

//     document.addEventListener(
//       "mousedown",
//       handleClickOutside
//     );

//     return () => {
//       document.removeEventListener(
//         "mousedown",
//         handleClickOutside
//       );
//     };
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("loggedInCakeUser");

//     setLoggedInUser(null);
//     setUserMenuOpen(false);
//     closeMenu();

//     window.dispatchEvent(
//       new Event("cakeUserChanged")
//     );

//     navigate("/");
//   };

//   const navbarLogo =
//     branding?.navbar_logo_url || fallbackLogo;

//   const showLogo =
//     Number(branding?.navbar_show_logo ?? 1) === 1;

//   const showText =
//     Number(branding?.navbar_show_text ?? 1) === 1;

//   return (
//     <header className="navbar-wrapper">
//       <div className="navbar container">

//         {/* BRAND */}

//         <Link
//           to="/"
//           className="brand just-bake-brand"
//           onClick={closeMenu}
//         >
//           {showLogo && (
//             <img
//               src={navbarLogo}
//               alt={
//                 branding?.navbar_brand_title ||
//                 "Just Bake It Official"
//               }
//               className="navbar-brand-logo"
//               style={{
//                 width: `${
//                   Number(
//                     branding?.navbar_logo_size || 72
//                   )
//                 }px`,
//                 height: "auto",
//               }}
//             />
//           )}

//           {showText && (
//             <div className="navbar-brand-text">
//               <span
//                 className="brand-small"
//                 style={{
//                   fontSize: `${
//                     Number(
//                       branding?.navbar_small_text_size || 9
//                     )
//                   }px`,
//                 }}
//               >
//                 {branding?.navbar_small_text ||
//                   "FRESH & DELICIOUS"}
//               </span>

//               <span
//                 className="brand-main"
//                 style={{
//                   fontSize: `${
//                     Number(
//                       branding?.navbar_brand_title_size || 20
//                     )
//                   }px`,
//                 }}
//               >
//                 {branding?.navbar_brand_title ||
//                   "Just Bake It Official"}
//               </span>
//             </div>
//           )}
//         </Link>

//         {/* NAVIGATION */}

//         <nav
//           className={`nav-links ${
//             menuOpen ? "nav-open" : ""
//           }`}
//         >
//           <NavLink to="/" onClick={closeMenu}>
//             Home
//           </NavLink>

//           <NavLink to="/cakes" onClick={closeMenu}>
//             Shop Cakes
//           </NavLink>

//           <a href="/#about" onClick={closeMenu}>
//             Our Story
//           </a>

//           {/* MOBILE TRACK ORDER */}

//           <NavLink
//             to="/my-orders"
//             className="mobile-track-order-link"
//             onClick={closeMenu}
//           >
//             <PackageSearch size={17} />
//             Track Order
//           </NavLink>
//         </nav>

//         {/* NAVBAR ACTIONS */}

//         <div className="nav-actions">

//           {/* ADMIN PORTAL */}

//           <Link
//             to="/admin/login"
//             className="admin-portal-button"
//             title="Admin Portal"
//             onClick={closeMenu}
//           >
//             <ShieldCheck
//               size={16}
//               strokeWidth={1.8}
//             />
//             <span>Admin Portal</span>
//           </Link>

//           {/* CUSTOMER LOGIN / PROFILE */}

//           {!loggedInUser ? (
//             <Link
//               to="/login"
//               className="nav-icon"
//               aria-label="Customer Login"
//               title="Customer Login"
//               onClick={closeMenu}
//             >
//               <User
//                 size={20}
//                 strokeWidth={1.7}
//               />
//             </Link>
//           ) : (
//             <div
//               className="navbar-user"
//               ref={userMenuRef}
//             >
//               <button
//                 type="button"
//                 className="navbar-user-button"
//                 aria-expanded={userMenuOpen}
//                 onClick={() =>
//                   setUserMenuOpen((previous) => !previous)
//                 }
//               >
//                 <div className="navbar-user-avatar">
//                   {loggedInUser.name
//                     ?.charAt(0)
//                     .toUpperCase() || "U"}
//                 </div>

//                 <span className="navbar-user-name">
//                   {loggedInUser.name?.split(" ")[0]}
//                 </span>

//                 <ChevronDown
//                   size={14}
//                   className={
//                     userMenuOpen
//                       ? "user-arrow-open"
//                       : ""
//                   }
//                 />
//               </button>

//               {userMenuOpen && (
//                 <div className="navbar-user-dropdown">

//                   <div className="navbar-user-info">
//                     <strong>
//                       {loggedInUser.name}
//                     </strong>
//                     <span>
//                       {loggedInUser.email}
//                     </span>
//                   </div>

//                   <div className="navbar-dropdown-divider" />

//                   <Link
//                     to="/my-orders"
//                     onClick={() => {
//                       setUserMenuOpen(false);
//                       closeMenu();
//                     }}
//                   >
//                     <Package size={16} />
//                     My Orders
//                   </Link>

//                   <button
//                     type="button"
//                     onClick={handleLogout}
//                     className="navbar-logout-button"
//                   >
//                     <LogOut size={16} />
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* SHOPPING CART */}

//           <Link
//             to="/cart"
//             className="nav-icon cart-nav-icon"
//             aria-label="Shopping Cart"
//             title="Shopping Cart"
//             onClick={closeMenu}
//           >
//             <ShoppingBag
//               size={21}
//               strokeWidth={1.7}
//             />

//             {cartCount > 0 && (
//               <span className="cart-badge">
//                 {cartCount > 9
//                   ? "9+"
//                   : cartCount}
//               </span>
//             )}
//           </Link>

//           {/* MOBILE MENU */}

//           <button
//             type="button"
//             className="mobile-menu-button"
//             onClick={() =>
//               setMenuOpen((previous) => !previous)
//             }
//             aria-label="Toggle menu"
//             aria-expanded={menuOpen}
//           >
//             {menuOpen ? (
//               <X size={23} />
//             ) : (
//               <Menu size={23} />
//             )}
//           </button>

//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;






import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  ShoppingBag,
  X,
  PackageSearch,
  ShieldCheck,
  ChevronDown,
  LogOut,
  User,
  Package,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../../context/CartContext";
import fallbackLogo from "../../assets/images/just-bake-it-logo.jpeg";

const API_ROOT = "https://coreops.pk/cakes/api";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [branding, setBranding] = useState(null);

  const [loggedInUser, setLoggedInUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("loggedInCakeUser");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const userMenuRef = useRef(null);
  const { cartCount } = useCart();

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const loadBranding = async () => {
      try {
        const response = await fetch(`${API_ROOT}/HomeBanner/get.php`);
        const result = await response.json();

        if (
          response.ok &&
          result.status === "success" &&
          result.data
        ) {
          setBranding(result.data);
        }
      } catch (error) {
        console.error("Navbar branding error:", error);
      }
    };

    loadBranding();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const savedUser = localStorage.getItem("loggedInCakeUser");
        setLoggedInUser(savedUser ? JSON.parse(savedUser) : null);
      } catch {
        setLoggedInUser(null);
      }
    };

    window.addEventListener("cakeUserChanged", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("cakeUserChanged", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInCakeUser");
    setLoggedInUser(null);
    setUserMenuOpen(false);
    closeMenu();
    window.dispatchEvent(new Event("cakeUserChanged"));
    navigate("/");
  };

  const navbarLogo = branding?.navbar_logo_url || fallbackLogo;
  const showLogo = Number(branding?.navbar_show_logo ?? 1) === 1;
  const showText = Number(branding?.navbar_show_text ?? 1) === 1;

  return (
    <header className="navbar-wrapper">
      <div className="navbar container">
        <Link
          to="/"
          className="brand just-bake-brand"
          onClick={closeMenu}
        >
          {showLogo && (
            <img
              src={navbarLogo}
              alt={branding?.navbar_brand_title || "Just Bake It Official"}
              className="navbar-brand-logo"
              style={{
                width: `${Number(branding?.navbar_logo_size || 72)}px`,
                height: "auto",
              }}
            />
          )}

          {showText && (
            <div className="navbar-brand-text">
              <span
                className="brand-small"
                style={{
                  fontSize: `${Number(
                    branding?.navbar_small_text_size || 9
                  )}px`,
                }}
              >
                {branding?.navbar_small_text || "FRESH & DELICIOUS"}
              </span>
              <span
                className="brand-main"
                style={{
                  fontSize: `${Number(
                    branding?.navbar_brand_title_size || 20
                  )}px`,
                }}
              >
                {branding?.navbar_brand_title || "Just Bake It Official"}
              </span>
            </div>
          )}
        </Link>

        <nav className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
          <NavLink to="/" end onClick={closeMenu}>
            Home
          </NavLink>

          <NavLink to="/cakes" onClick={closeMenu}>
            Shop Cakes
          </NavLink>

          <a href="/#about" onClick={closeMenu}>
            Our Story
          </a>

          <NavLink
            to="/my-orders"
            className="track-order-nav-link"
            onClick={closeMenu}
          >
            <PackageSearch size={17} strokeWidth={1.8} />
            <span>Track Order</span>
          </NavLink>
        </nav>

        <div className="nav-actions">
          <Link
            to="/admin/login"
            className="admin-portal-button"
            title="Admin Portal"
            onClick={closeMenu}
          >
            <ShieldCheck size={16} strokeWidth={1.8} />
            <span>Admin Portal</span>
          </Link>

          {!loggedInUser ? (
            <Link
              to="/login"
              className="nav-icon"
              aria-label="Customer Login"
              title="Customer Login"
              onClick={closeMenu}
            >
              <User size={20} strokeWidth={1.7} />
            </Link>
          ) : (
            <div className="navbar-user" ref={userMenuRef}>
              <button
                type="button"
                className="navbar-user-button"
                aria-expanded={userMenuOpen}
                onClick={() => setUserMenuOpen((previous) => !previous)}
              >
                <div className="navbar-user-avatar">
                  {loggedInUser.name?.charAt(0).toUpperCase() || "U"}
                </div>

                <span className="navbar-user-name">
                  {loggedInUser.name?.split(" ")[0]}
                </span>

                <ChevronDown
                  size={14}
                  className={userMenuOpen ? "user-arrow-open" : ""}
                />
              </button>

              {userMenuOpen && (
                <div className="navbar-user-dropdown">
                  <div className="navbar-user-info">
                    <strong>{loggedInUser.name}</strong>
                    <span>{loggedInUser.email}</span>
                  </div>

                  <div className="navbar-dropdown-divider" />

                  <Link
                    to="/my-orders"
                    onClick={() => {
                      setUserMenuOpen(false);
                      closeMenu();
                    }}
                  >
                    <Package size={16} />
                    My Orders
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="navbar-logout-button"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <Link
            to="/cart"
            className="nav-icon cart-nav-icon"
            aria-label="Shopping Cart"
            title="Shopping Cart"
            onClick={closeMenu}
          >
            <ShoppingBag size={21} strokeWidth={1.7} />
            {cartCount > 0 && (
              <span className="cart-badge">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setMenuOpen((previous) => !previous)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
