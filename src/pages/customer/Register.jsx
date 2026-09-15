import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) return;

    const existingUsers = JSON.parse(localStorage.getItem("cakeUsers") || "[]");

    const alreadyExists = existingUsers.some(
      (user) => user.email.toLowerCase() === formData.email.toLowerCase(),
    );

    if (alreadyExists) {
      toast.error("An account with this email already exists.");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    };

    localStorage.setItem(
      "cakeUsers",
      JSON.stringify([...existingUsers, newUser]),
    );

    localStorage.setItem(
      "loggedInCakeUser",
      JSON.stringify({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
      }),
    );

    window.dispatchEvent(new Event("cakeUserChanged"));

    toast.success("Account created successfully!");

    setTimeout(() => {
      navigate("/");
    }, 700);
  };

  return (
    <>
      <Toaster position="top-right" />

      <section className="auth-page">
        <div className="auth-wrapper">
          <div className="auth-image-side">
            <img
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=90"
              alt="Cake"
            />

            <div className="auth-image-overlay"></div>

            <div className="auth-image-content">
              <span>MAISON CAKE</span>

              <h2>
                Sweet moments,
                <br />
                made especially for you.
              </h2>
            </div>
          </div>

          <div className="auth-form-side">
            <div className="auth-form-box">
              <span className="section-kicker">CREATE ACCOUNT</span>

              <h1>Join us.</h1>

              <p className="auth-subtitle">
                Create an account to keep track of your favourite cakes and
                orders.
              </p>

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-form-group">
                  <label>Full Name</label>

                  <div className="auth-input">
                    <User size={17} />

                    <input
                      type="text"
                      name="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  {errors.name && (
                    <span className="auth-error">{errors.name}</span>
                  )}
                </div>

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

                  {errors.email && (
                    <span className="auth-error">{errors.email}</span>
                  )}
                </div>

                <div className="auth-form-group">
                  <label>Phone Number</label>

                  <div className="auth-input">
                    <Phone size={17} />

                    <input
                      type="text"
                      name="phone"
                      placeholder="03XX XXXXXXX"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  {errors.phone && (
                    <span className="auth-error">{errors.phone}</span>
                  )}
                </div>

                <div className="auth-form-group">
                  <label>Password</label>

                  <div className="auth-input">
                    <Lock size={17} />

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Minimum 6 characters"
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

                  {errors.password && (
                    <span className="auth-error">{errors.password}</span>
                  )}
                </div>

                <button type="submit" className="auth-submit-button">
                  Create Account
                  <span>→</span>
                </button>
              </form>

              <div className="auth-switch">
                Already have an account?
                <Link to="/login">Sign In</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
