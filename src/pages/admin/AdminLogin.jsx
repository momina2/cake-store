import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    // TEMP ADMIN LOGIN
    if (
      email === "admin@maisoncake.pk" &&
      password === "admin123"
    ) {
      localStorage.setItem(
        "cakeAdmin",
        JSON.stringify({
          name: "Maison Admin",
          email,
        })
      );

      navigate("/admin/dashboard");
      return;
    }

    setError("Invalid admin email or password.");
  };

  return (
    <section className="admin-login-page">
      <div className="admin-login-left">
        <div className="admin-login-brand">
          <span>HANDCRAFTED</span>
          <h2>Maison Cake</h2>
        </div>

        <div className="admin-login-message">
          <span>ADMINISTRATION</span>

          <h1>
            Manage every
            <br />
            sweet detail.
          </h1>

          <p>
            Cakes, orders, collections and customers — all in one
            beautifully simple workspace.
          </p>
        </div>
      </div>

      <div className="admin-login-right">
        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >
          <span className="section-kicker">
            ADMIN PORTAL
          </span>

          <h2>Welcome back.</h2>

          <p>
            Sign in to manage Maison Cake.
          </p>

          <div className="admin-login-field">
            <label>Email Address</label>

            <div>
              <Mail size={17} />

              <input
                type="email"
                placeholder="admin@maisoncake.pk"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
              />
            </div>
          </div>

          <div className="admin-login-field">
            <label>Password</label>

            <div>
              <Lock size={17} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((previous) => !previous)
                }
              >
                {showPassword ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <span className="admin-login-error">
              {error}
            </span>
          )}

          <button
            type="submit"
            className="admin-login-button"
          >
            Sign In
            <span>→</span>
          </button>

          <div className="admin-demo-details">
            <strong>Demo Login</strong>

            <span>
              admin@maisoncake.pk
            </span>

            <span>admin123</span>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AdminLogin;