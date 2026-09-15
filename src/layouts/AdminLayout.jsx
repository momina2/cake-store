import { Navigate, Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";

const AdminLayout = () => {
  const admin = localStorage.getItem("cakeAdmin");

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <AdminHeader />

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;