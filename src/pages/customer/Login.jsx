import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please enter email and password.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("cakeUsers") || "[]");

    const foundUser = users.find(
      (user) =>
        user.email.toLowerCase() === formData.email.toLowerCase() &&
        user.password === formData.password,
    );

    if (!foundUser) {
      toast.error("Invalid email or password.");
      return;
    }

    localStorage.setItem(
      "loggedInCakeUser",
      JSON.stringify({
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        phone: foundUser.phone,
      }),
    );
    window.dispatchEvent(new Event("cakeUserChanged"));

    toast.success("Welcome back!");

    setTimeout(() => {
      navigate("/");
    }, 600);
  };

  return (
    <>
      <Toaster position="top-right" />

      <section className="auth-page">
        <div className="auth-wrapper">
          <div className="auth-image-side">
            <img
              src="https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=1200&q=90"
              alt="Cake"
            />

            <div className="auth-image-overlay"></div>

            <div className="auth-image-content">
              <span>WELCOME BACK</span>

              <h2>
                Something sweet
                <br />
                is waiting.
              </h2>
            </div>
          </div>

          <div className="auth-form-side">
            <div className="auth-form-box">
              <span className="section-kicker">CUSTOMER LOGIN</span>

              <h1>Sign in.</h1>

              <p className="auth-subtitle">
                Sign in to view your orders and continue your cake journey.
              </p>

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-form-group">
                  <label>Email Address</label>

                  <div className="auth-input">
                    <Mail size={17} />

                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="auth-form-group">
                  <div className="auth-label-row">
                    <label>Password</label>

                    <button type="button" className="forgot-password">
                      Forgot password?
                    </button>
                  </div>

                  <div className="auth-input">
                    <Lock size={17} />

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Your password"
                      value={formData.password}
                      onChange={handleChange}
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword((previous) => !previous)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="auth-submit-button">
                  Sign In
                  <span>→</span>
                </button>
              </form>

              <div className="auth-switch">
                Don't have an account?
                <Link to="/register">Create Account</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
