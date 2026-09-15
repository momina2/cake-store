import { NavLink } from "react-router-dom";
import {
  CakeSlice,
  LayoutDashboard,
  Package,
  Tags,
  Users,
  Palette,
  Ruler,
} from "lucide-react";

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <span>HANDCRAFTED</span>

        <h2>Maison Cake</h2>

        <small>ADMIN</small>
      </div>

      <nav className="admin-sidebar-nav">
        <NavLink to="/admin/dashboard">
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/admin/orders">
          <Package size={18} />
          Orders
        </NavLink>

        <NavLink to="/admin/cakes">
          <CakeSlice size={18} />
          Cakes
        </NavLink>

        <NavLink to="/admin/categories">
          <Tags size={18} />
          Categories
        </NavLink>

        <NavLink to="/admin/sizes">
          <Ruler size={18} />
          Sizes
        </NavLink>

        <NavLink to="/admin/colors">
          <Palette size={18} />
          Colors
        </NavLink>

        <NavLink to="/admin/customers">
          <Users size={18} />
          Customers
        </NavLink>
      </nav>

      <div className="admin-sidebar-bottom">
        <span>Maison Cake</span>
        <small>Management Portal</small>
      </div>
    </aside>
  );
};

export default AdminSidebar;