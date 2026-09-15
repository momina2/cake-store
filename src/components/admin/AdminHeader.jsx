import { LogOut, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const navigate = useNavigate();

  const admin = JSON.parse(
    localStorage.getItem("cakeAdmin") || "{}"
  );

  const handleLogout = () => {
    localStorage.removeItem("cakeAdmin");

    navigate("/admin/login");
  };

  return (
    <header className="admin-header">
      <div className="admin-header-search">
        <Search size={17} />

        <input
          type="text"
          placeholder="Search anything..."
        />
      </div>

      <div className="admin-header-user">
        <div className="admin-header-avatar">
          A
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
    </header>
  );
};

export default AdminHeader;