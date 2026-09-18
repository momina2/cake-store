// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Eye, EyeOff, Lock, Mail } from "lucide-react";

// const AdminLogin = () => {
//   const navigate = useNavigate();

//   const [showPassword, setShowPassword] = useState(false);

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [error, setError] = useState("");

//   const handleSubmit = (event) => {
//     event.preventDefault();

//     setError("");

//     // TEMP ADMIN LOGIN
//     if (
//       email === "admin@maisoncake.pk" &&
//       password === "admin123"
//     ) {
//       localStorage.setItem(
//         "cakeAdmin",
//         JSON.stringify({
//           name: "Maison Admin",
//           email,
//         })
//       );

//       navigate("/admin/dashboard");
//       return;
//     }

//     setError("Invalid admin email or password.");
//   };

//   return (
//     <section className="admin-login-page">
//       <div className="admin-login-left">
//         <div className="admin-login-brand">
//           <span>HANDCRAFTED</span>
//           <h2>Maison Cake</h2>
//         </div>

//         <div className="admin-login-message">
//           <span>ADMINISTRATION</span>

//           <h1>
//             Manage every
//             <br />
//             sweet detail.
//           </h1>

//           <p>
//             Cakes, orders, collections and customers — all in one
//             beautifully simple workspace.
//           </p>
//         </div>
//       </div>

//       <div className="admin-login-right">
//         <form
//           className="admin-login-form"
//           onSubmit={handleSubmit}
//         >
//           <span className="section-kicker">
//             ADMIN PORTAL
//           </span>

//           <h2>Welcome back.</h2>

//           <p>
//             Sign in to manage Maison Cake.
//           </p>

//           <div className="admin-login-field">
//             <label>Email Address</label>

//             <div>
//               <Mail size={17} />

//               <input
//                 type="email"
//                 placeholder="admin@maisoncake.pk"
//                 value={email}
//                 onChange={(event) =>
//                   setEmail(event.target.value)
//                 }
//               />
//             </div>
//           </div>

//           <div className="admin-login-field">
//             <label>Password</label>

//             <div>
//               <Lock size={17} />

//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter password"
//                 value={password}
//                 onChange={(event) =>
//                   setPassword(event.target.value)
//                 }
//               />

//               <button
//                 type="button"
//                 onClick={() =>
//                   setShowPassword((previous) => !previous)
//                 }
//               >
//                 {showPassword ? (
//                   <EyeOff size={16} />
//                 ) : (
//                   <Eye size={16} />
//                 )}
//               </button>
//             </div>
//           </div>

//           {error && (
//             <span className="admin-login-error">
//               {error}
//             </span>
//           )}

//           <button
//             type="submit"
//             className="admin-login-button"
//           >
//             Sign In
//             <span>→</span>
//           </button>

//           <div className="admin-demo-details">
//             <strong>Demo Login</strong>

//             <span>
//               admin@maisoncake.pk
//             </span>

//             <span>admin123</span>
//           </div>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default AdminLogin;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  LoaderCircle,
} from "lucide-react";

import logo from "../../assets/images/just-bake-it-logo.jpeg";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://coreops.pk/cakes/api/Admin/login.php",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: cleanEmail,
            password,
          }),
        }
      );

      let result;

      try {
        result = await response.json();
      } catch {
        throw new Error("Server returned an invalid response.");
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(
          result.message || "Invalid admin email or password."
        );
      }

      if (!result.admin) {
        throw new Error(
          "Admin information was not returned by the server."
        );
      }

      if (
        !result.admin.id ||
        !result.admin.name ||
        !result.admin.email
      ) {
        throw new Error(
          "Incomplete admin information received."
        );
      }

      const admin = {
        id: Number(result.admin.id),
        name: result.admin.name,
        email: result.admin.email,
      };

      localStorage.setItem(
        "cakeAdmin",
        JSON.stringify(admin)
      );

      navigate("/admin/dashboard", {
        replace: true,
      });
    } catch (err) {
      console.error("Admin login error:", err);

      setError(
        err.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin-login-page">
      <div className="admin-login-left">
        <div className="admin-login-brand admin-login-logo-brand">
          <img
            src={logo}
            alt="Just Bake It Official"
            className="admin-login-logo"
          />

          <div>
            <span>FRESH & DELICIOUS</span>
            <h2>Just Bake It Official</h2>
          </div>
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
            Sign in to manage Just Bake It Official.
          </p>

          <div className="admin-login-field">
            <label htmlFor="admin-email">
              Email Address
            </label>

            <div>
              <Mail size={17} />

              <input
                id="admin-email"
                type="email"
                placeholder="Enter admin email"
                value={email}
                disabled={loading}
                autoComplete="email"
                onChange={(event) => {
                  setEmail(event.target.value);

                  if (error) {
                    setError("");
                  }
                }}
              />
            </div>
          </div>

          <div className="admin-login-field">
            <label htmlFor="admin-password">
              Password
            </label>

            <div>
              <Lock size={17} />

              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                disabled={loading}
                autoComplete="current-password"
                onChange={(event) => {
                  setPassword(event.target.value);

                  if (error) {
                    setError("");
                  }
                }}
              />

              <button
                type="button"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                disabled={loading}
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
            disabled={loading}
          >
            {loading ? (
              <>
                <LoaderCircle
                  size={18}
                  className="admin-login-spinner"
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
      </div>
    </section>
  );
};

export default AdminLogin;