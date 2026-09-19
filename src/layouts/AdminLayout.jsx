// import { Navigate, Outlet } from "react-router-dom";
// import AdminSidebar from "../components/admin/AdminSidebar";
// import AdminHeader from "../components/admin/AdminHeader";

// const AdminLayout = () => {
//   const admin = localStorage.getItem("cakeAdmin");

//   if (!admin) {
//     return <Navigate to="/admin/login" replace />;
//   }

//   return (
//     <div className="admin-layout">
//       <AdminSidebar />

//       <div className="admin-main">
//         <AdminHeader />

//         <main className="admin-content">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;





import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";

const AdminLayout = () => {
  const admin = localStorage.getItem("cakeAdmin");
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!sidebarOpen) {
      document.body.style.overflow = "";
      return;
    }

    const isMobile = window.matchMedia("(max-width: 900px)").matches;

    if (isMobile) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen && (
        <button
          type="button"
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close admin menu"
        />
      )}

      <div className="admin-main">
        <AdminHeader
          onMenuClick={() =>
            setSidebarOpen((previous) => !previous)
          }
        />

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
