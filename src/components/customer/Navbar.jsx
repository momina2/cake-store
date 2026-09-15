import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  LogOut,
  Menu,
  ShoppingBag,
  User,
  X,
  Package,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

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

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const savedUser = localStorage.getItem(
          "loggedInCakeUser"
        );

        setLoggedInUser(
          savedUser ? JSON.parse(savedUser) : null
        );
      } catch {
        setLoggedInUser(null);
      }
    };

    window.addEventListener(
      "cakeUserChanged",
      handleStorageChange
    );

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "cakeUserChanged",
        handleStorageChange
      );

      window.removeEventListener(
        "storage",
        handleStorageChange
      );
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

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInCakeUser");

    setLoggedInUser(null);
    setUserMenuOpen(false);

    window.dispatchEvent(
      new Event("cakeUserChanged")
    );

    navigate("/");
  };

  return (
    <header className="navbar-wrapper">
      <div className="navbar container">
        <Link to="/" className="brand">
          <span className="brand-small">
            HANDCRAFTED
          </span>

          <span className="brand-main">
            Maison Cake
          </span>
        </Link>

        <nav
          className={`nav-links ${
            menuOpen ? "nav-open" : ""
          }`}
        >
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>

          <NavLink
            to="/cakes"
            onClick={() => setMenuOpen(false)}
          >
            Shop Cakes
          </NavLink>

          <a
            href="/#categories"
            onClick={() => setMenuOpen(false)}
          >
            Collections
          </a>

          <a
            href="/#about"
            onClick={() => setMenuOpen(false)}
          >
            Our Story
          </a>
        </nav>

        <div className="nav-actions">
          {/* USER */}

          {!loggedInUser ? (
            <Link
              to="/login"
              className="nav-icon"
              aria-label="Login"
            >
              <User
                size={20}
                strokeWidth={1.7}
              />
            </Link>
          ) : (
            <div
              className="navbar-user"
              ref={userMenuRef}
            >
              <button
                type="button"
                className="navbar-user-button"
                onClick={() =>
                  setUserMenuOpen(
                    (previous) => !previous
                  )
                }
              >
                <div className="navbar-user-avatar">
                  {loggedInUser.name
                    ?.charAt(0)
                    .toUpperCase() || "U"}
                </div>

                <span className="navbar-user-name">
                  {loggedInUser.name?.split(" ")[0]}
                </span>

                <ChevronDown
                  size={14}
                  className={
                    userMenuOpen
                      ? "user-arrow-open"
                      : ""
                  }
                />
              </button>

              {userMenuOpen && (
                <div className="navbar-user-dropdown">
                  <div className="navbar-user-info">
                    <strong>
                      {loggedInUser.name}
                    </strong>

                    <span>
                      {loggedInUser.email}
                    </span>
                  </div>

                  <div className="navbar-dropdown-divider"></div>

                  <Link
                    to="/my-orders"
                    onClick={() =>
                      setUserMenuOpen(false)
                    }
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

          {/* CART */}

          <Link
            to="/cart"
            className="nav-icon cart-nav-icon"
          >
            <ShoppingBag
              size={21}
              strokeWidth={1.7}
            />

            {cartCount > 0 && (
              <span className="cart-badge">
                {cartCount > 9
                  ? "9+"
                  : cartCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="mobile-menu-button"
            onClick={() =>
              setMenuOpen(
                (previous) => !previous
              )
            }
          >
            {menuOpen ? (
              <X size={23} />
            ) : (
              <Menu size={23} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;