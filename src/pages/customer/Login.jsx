import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  LoaderCircle,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const API_ROOT = "https://coreops.pk/cakes/api";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.email.trim() ||
      !formData.password
    ) {
      toast.error(
        "Please enter email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_ROOT}/Customers/login.php`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email: formData.email
              .trim()
              .toLowerCase(),

            password: formData.password,
          }),
        }
      );

      let result;

      try {
        result = await response.json();
      } catch {
        throw new Error(
          "Server returned an invalid response."
        );
      }

      if (
        !response.ok ||
        result.status !== "success"
      ) {
        throw new Error(
          result.message ||
            "Invalid email or password."
        );
      }

      // Supports:
      // result.customer
      // result.data.customer
      // result.data
      const customer =
        result.customer ||
        result.data?.customer ||
        result.data;

      if (!customer?.id) {
        throw new Error(
          "Customer information was not returned by the server."
        );
      }

      // ======================================
      // STORE LOGGED-IN CUSTOMER
      // ======================================

      const loggedInUser = {
        id: Number(customer.id),

        name: customer.name || "",

        email: customer.email || "",

        phone: customer.phone || "",

        status:
          customer.status || "Active",
      };

      localStorage.setItem(
        "loggedInCakeUser",
        JSON.stringify(loggedInUser)
      );

      window.dispatchEvent(
        new Event("cakeUserChanged")
      );

      toast.success(
        result.message || "Welcome back!"
      );

      setTimeout(() => {
        navigate("/");
      }, 600);
    } catch (error) {
      console.error(
        "Customer login error:",
        error
      );

      toast.error(
        error.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <>
      <Toaster position="top-right" />

      <section className="auth-page">
        <div className="auth-wrapper">
          {/* IMAGE */}

          <div className="auth-image-side">
            <img
              src="https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=1200&q=90"
              alt="Cake"
            />

            <div className="auth-image-overlay" />

            <div className="auth-image-content">
              <span>
                WELCOME BACK
              </span>

              <h2>
                Something sweet
                <br />
                is waiting.
              </h2>
            </div>
          </div>

          {/* FORM */}

          <div className="auth-form-side">
            <div className="auth-form-box">
              <span className="section-kicker">
                CUSTOMER LOGIN
              </span>

              <h1>
                Sign in.
              </h1>

              <p className="auth-subtitle">
                Sign in to view your
                orders and continue your
                cake journey.
              </p>

              <form
                className="auth-form"
                onSubmit={handleSubmit}
              >
                {/* EMAIL */}

                <div className="auth-form-group">
                  <label>
                    Email Address
                  </label>

                  <div className="auth-input">
                    <Mail size={17} />

                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* PASSWORD */}

                <div className="auth-form-group">
                  <div className="auth-label-row">
                    <label>
                      Password
                    </label>

                    <button
                      type="button"
                      className="forgot-password"
                      disabled={loading}
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="auth-input">
                    <Lock size={17} />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      placeholder="Your password"
                      value={
                        formData.password
                      }
                      onChange={handleChange}
                      disabled={loading}
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      disabled={loading}
                      onClick={() =>
                        setShowPassword(
                          (previous) =>
                            !previous
                        )
                      }
                    >
                      {showPassword ? (
                        <EyeOff
                          size={16}
                        />
                      ) : (
                        <Eye
                          size={16}
                        />
                      )}
                    </button>
                  </div>
                </div>

                {/* SUBMIT */}

                <button
                  type="submit"
                  className="auth-submit-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <LoaderCircle
                        size={17}
                      />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <span>→</span>
                    </>
                  )}
                </button>
              </form>

              <div className="auth-switch">
                Don't have an account?
                <Link to="/register">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;