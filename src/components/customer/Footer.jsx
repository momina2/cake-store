// import { Mail, MapPin, Phone } from "lucide-react";
// import { Link } from "react-router-dom";

// const Footer = () => {
//   return (
//     <footer className="footer">
//       <div className="container footer-grid">
//         <div className="footer-brand-column">
//           <div className="footer-brand">
//             <span>HANDCRAFTED</span>
//             <h3>Maison Cake</h3>
//           </div>

//           <p>
//             Thoughtfully handcrafted cakes created to make your most
//             beautiful moments even sweeter.
//           </p>

//           <div className="footer-social">
//             <span style={{ fontSize: "12px", fontWeight: "500" }}>
//               IG
//             </span>
//           </div>
//         </div>

//         <div>
//           <h4>Explore</h4>

//           <div className="footer-links">
//             <Link to="/">Home</Link>
//             <Link to="/cakes">Shop Cakes</Link>
//             <Link to="/my-orders">My Orders</Link>
//           </div>
//         </div>

//         <div>
//           <h4>Collections</h4>

//           <div className="footer-links">
//             <Link to="/cakes">Birthday Cakes</Link>
//             <Link to="/cakes">Wedding Cakes</Link>
//             <Link to="/cakes">Chocolate Cakes</Link>
//             <Link to="/cakes">Minimal Cakes</Link>
//           </div>
//         </div>

//         <div>
//           <h4>Contact</h4>

//           <div className="footer-contact">
//             <p>
//               <MapPin size={17} />
//               Lahore, Pakistan
//             </p>

//             <p>
//               <Phone size={17} />
//               +92 300 0000000
//             </p>

//             <p>
//               <Mail size={17} />
//               hello@maisoncake.pk
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="footer-bottom">
//         <div className="container">
//           <span>© {new Date().getFullYear()} Maison Cake.</span>
//           <span>Handmade with care.</span>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;


import {
  MapPin,
  Phone,
  ExternalLink,
} from "lucide-react";

import { Link } from "react-router-dom";

import logo from "../../assets/images/just-bake-it-logo.jpeg";

const GOOGLE_MAPS_URL =
  "https://maps.app.goo.gl/jjfX22Hk54bwR7oi6";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* =========================
            BRAND
        ========================= */}

        <div className="footer-brand-column">
          <div className="footer-brand footer-logo-brand">
            <img
              src={logo}
              alt="Just Bake It Official"
              className="footer-brand-logo"
            />

            <div>
              <span>FRESH & DELICIOUS</span>
              <h3>Just Bake It Official</h3>
            </div>
          </div>

          <p>
            Thoughtfully handcrafted cakes created to make your most
            beautiful moments even sweeter.
          </p>

          <div className="footer-social">
            <span
              style={{
                fontSize: "12px",
                fontWeight: "500",
              }}
            >
              IG
            </span>
          </div>
        </div>

        {/* =========================
            EXPLORE
        ========================= */}

        <div>
          <h4>Explore</h4>

          <div className="footer-links">
            <Link to="/">
              Home
            </Link>

            <Link to="/cakes">
              Shop Cakes
            </Link>

            <Link to="/my-orders">
              My Orders
            </Link>
          </div>
        </div>

        {/* =========================
            COLLECTIONS
        ========================= */}

        <div>
          <h4>Collections</h4>

          <div className="footer-links">
            <Link to="/cakes">
              Birthday Cakes
            </Link>

            <Link to="/cakes">
              Wedding Cakes
            </Link>

            <Link to="/cakes">
              Chocolate Cakes
            </Link>

            <Link to="/cakes">
              Minimal Cakes
            </Link>
          </div>
        </div>

        {/* =========================
            CONTACT
        ========================= */}

        <div>
          <h4>Contact</h4>

          <div className="footer-contact">

            {/* GOOGLE LOCATION */}

            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-location-link"
              aria-label="Open Just Bake It Official location on Google Maps"
            >
              <MapPin size={13} />

              <span>
                View on Google Maps
              </span>

              <ExternalLink
                size={13}
                className="footer-location-external-icon"
              />
            </a>

            {/* PHONE */}

            <p>
              <Phone size={17} />
              Contact details coming soon
            </p>
          </div>
        </div>
      </div>

      {/* =========================
          BOTTOM
      ========================= */}

      <div className="footer-bottom">
        <div className="container">
          <span>
            © {new Date().getFullYear()} Just Bake It Official.
          </span>

          <span>
            Fresh & Delicious Cakes.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;