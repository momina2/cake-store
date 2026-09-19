// // import {
// //   NavLink,
// // } from "react-router-dom";

// // import {
// //   CakeSlice,
// //   LayoutDashboard,
// //   Package,
// //   Tags,
// //   Users,
// //   Palette,
// //   Ruler,
// //   CreditCard,
// //   Sandwich,
// //   Cherry,
// // } from "lucide-react";

// // import logo from "../../assets/images/just-bake-it-logo.jpeg";

// // const AdminSidebar = () => {
// //   return (
// //     <aside className="admin-sidebar">
// //       <div className="admin-sidebar-brand">
// //         <div className="admin-sidebar-logo-row">
// //           <img
// //             src={logo}
// //             alt="Just Bake It Official"
// //             className="admin-sidebar-logo"
// //           />

// //           <div>
// //             <span>
// //               FRESH & DELICIOUS
// //             </span>

// //             <h2>
// //               Just Bake It Official
// //             </h2>
// //           </div>
// //         </div>

// //         <small>
// //           ADMIN
// //         </small>
// //       </div>

// //       <nav className="admin-sidebar-nav">

// //         <NavLink to="/admin/dashboard">
// //           <LayoutDashboard
// //             size={18}
// //           />
// //           Dashboard
// //         </NavLink>

// //         <NavLink to="/admin/orders">
// //           <Package
// //             size={18}
// //           />
// //           Orders
// //         </NavLink>

// //         <NavLink to="/admin/cakes">
// //           <CakeSlice
// //             size={18}
// //           />
// //           Cakes
// //         </NavLink>

// //         <NavLink to="/admin/categories">
// //           <Tags
// //             size={18}
// //           />
// //           Categories
// //         </NavLink>

// //         <NavLink to="/admin/sizes">
// //           <Ruler
// //             size={18}
// //           />
// //           Sizes
// //         </NavLink>

// //         <NavLink to="/admin/colors">
// //           <Palette
// //             size={18}
// //           />
// //           Colors
// //         </NavLink>

// //         {/* FILLINGS */}

// //         <NavLink to="/admin/fillings">
// //           <Sandwich
// //             size={18}
// //           />
// //           Fillings
// //         </NavLink>

// //         {/* FLAVOURS */}

// //         <NavLink to="/admin/flavours">
// //           <Cherry
// //             size={18}
// //           />
// //           Flavours
// //         </NavLink>

// //         <NavLink to="/admin/customers">
// //           <Users
// //             size={18}
// //           />
// //           Customers
// //         </NavLink>

// //         <NavLink to="/admin/payment-settings">
// //           <CreditCard
// //             size={18}
// //           />
// //           Payment Settings
// //         </NavLink>
// //       </nav>

// //       <div className="admin-sidebar-bottom">
// //         <span>
// //           Just Bake It Official
// //         </span>

// //         <small>
// //           Management Portal
// //         </small>
// //       </div>
// //     </aside>
// //   );
// // };

// // export default AdminSidebar;

// import { NavLink } from "react-router-dom";

// import {
//   CakeSlice,
//   LayoutDashboard,
//   Package,
//   Tags,
//   Users,
//   Palette,
//   Ruler,
//   CreditCard,
//   Sandwich,
//   Cherry,
//   Image,
// } from "lucide-react";

// import logo from "../../assets/images/just-bake-it-logo.jpeg";

// const AdminSidebar = () => {
//   return (
//     <aside className="admin-sidebar">
//       <div className="admin-sidebar-brand">
//         <div className="admin-sidebar-logo-row">
//           <img
//             src={logo}
//             alt="Just Bake It Official"
//             className="admin-sidebar-logo"
//           />

//           <div>
//             <span>FRESH & DELICIOUS</span>

//             <h2>Just Bake It Official</h2>
//           </div>
//         </div>

//         <small>ADMIN</small>
//       </div>

//       <nav className="admin-sidebar-nav">
//         <NavLink to="/admin/dashboard">
//           <LayoutDashboard size={18} />
//           Dashboard
//         </NavLink>

//         {/* HOME BANNER */}

//         <NavLink to="/admin/home-banner">
//           <Image size={18} />
//           Home Banner
//         </NavLink>

//         <NavLink to="/admin/orders">
//           <Package size={18} />
//           Orders
//         </NavLink>

//         <NavLink to="/admin/cakes">
//           <CakeSlice size={18} />
//           Cakes
//         </NavLink>

//         <NavLink to="/admin/categories">
//           <Tags size={18} />
//           Categories
//         </NavLink>

//         <NavLink to="/admin/sizes">
//           <Ruler size={18} />
//           Sizes
//         </NavLink>

//         <NavLink to="/admin/colors">
//           <Palette size={18} />
//           Colors
//         </NavLink>

//         {/* FILLINGS */}

//         <NavLink to="/admin/fillings">
//           <Sandwich size={18} />
//           Fillings
//         </NavLink>

//         {/* FLAVOURS */}

//         <NavLink to="/admin/flavours">
//           <Cherry size={18} />
//           Flavours
//         </NavLink>

//         <NavLink to="/admin/customers">
//           <Users size={18} />
//           Customers
//         </NavLink>

//         <NavLink to="/admin/payment-settings">
//           <CreditCard size={18} />
//           Payment Settings
//         </NavLink>

//         <NavLink to="/admin/home-banner">
//           <Image size={18} />
//           Home Banner
//         </NavLink>
//       </nav>

//       <div className="admin-sidebar-bottom">
//         <span>Just Bake It Official</span>

//         <small>Management Portal</small>
//       </div>
//     </aside>
//   );
// };

// export default AdminSidebar;





import { NavLink } from "react-router-dom";

import {
  CakeSlice,
  LayoutDashboard,
  Package,
  Tags,
  Users,
  Palette,
  Ruler,
  CreditCard,
  Sandwich,
  Cherry,
  Image,
  X,
} from "lucide-react";

import logo from "../../assets/images/just-bake-it-logo.jpeg";

const AdminSidebar = ({
  isOpen = false,
  onClose = () => {},
}) => {
  const handleLinkClick = () => {
    onClose();
  };

  return (
    <aside
      className={`admin-sidebar ${
        isOpen ? "is-open" : ""
      }`}
    >
      <button
        type="button"
        className="admin-sidebar-mobile-close"
        onClick={onClose}
        aria-label="Close menu"
      >
        <X size={20} />
      </button>

      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-logo-row">
          <img
            src={logo}
            alt="Just Bake It Official"
            className="admin-sidebar-logo"
          />

          <div>
            <span>FRESH & DELICIOUS</span>
            <h2>Just Bake It Official</h2>
          </div>
        </div>

        <small>ADMIN</small>
      </div>

      <nav className="admin-sidebar-nav">
        <NavLink
          to="/admin/dashboard"
          onClick={handleLinkClick}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/home-banner"
          onClick={handleLinkClick}
        >
          <Image size={18} />
          Home Banner
        </NavLink>

        <NavLink
          to="/admin/orders"
          onClick={handleLinkClick}
        >
          <Package size={18} />
          Orders
        </NavLink>

        <NavLink
          to="/admin/cakes"
          onClick={handleLinkClick}
        >
          <CakeSlice size={18} />
          Cakes
        </NavLink>

        <NavLink
          to="/admin/categories"
          onClick={handleLinkClick}
        >
          <Tags size={18} />
          Categories
        </NavLink>

        <NavLink
          to="/admin/sizes"
          onClick={handleLinkClick}
        >
          <Ruler size={18} />
          Sizes
        </NavLink>

        <NavLink
          to="/admin/colors"
          onClick={handleLinkClick}
        >
          <Palette size={18} />
          Colors
        </NavLink>

        <NavLink
          to="/admin/fillings"
          onClick={handleLinkClick}
        >
          <Sandwich size={18} />
          Fillings
        </NavLink>

        <NavLink
          to="/admin/flavours"
          onClick={handleLinkClick}
        >
          <Cherry size={18} />
          Flavours
        </NavLink>

        <NavLink
          to="/admin/customers"
          onClick={handleLinkClick}
        >
          <Users size={18} />
          Customers
        </NavLink>

        <NavLink
          to="/admin/payment-settings"
          onClick={handleLinkClick}
        >
          <CreditCard size={18} />
          Payment Settings
        </NavLink>
      </nav>

      <div className="admin-sidebar-bottom">
        <span>Just Bake It Official</span>
        <small>Management Portal</small>
      </div>
    </aside>
  );
};

export default AdminSidebar;
