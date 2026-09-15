import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand-column">
          <div className="footer-brand">
            <span>HANDCRAFTED</span>
            <h3>Maison Cake</h3>
          </div>

          <p>
            Thoughtfully handcrafted cakes created to make your most
            beautiful moments even sweeter.
          </p>

          <div className="footer-social">
            <span style={{ fontSize: "12px", fontWeight: "500" }}>
              IG
            </span>
          </div>
        </div>

        <div>
          <h4>Explore</h4>

          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/cakes">Shop Cakes</Link>
            <Link to="/my-orders">My Orders</Link>
          </div>
        </div>

        <div>
          <h4>Collections</h4>

          <div className="footer-links">
            <Link to="/cakes">Birthday Cakes</Link>
            <Link to="/cakes">Wedding Cakes</Link>
            <Link to="/cakes">Chocolate Cakes</Link>
            <Link to="/cakes">Minimal Cakes</Link>
          </div>
        </div>

        <div>
          <h4>Contact</h4>

          <div className="footer-contact">
            <p>
              <MapPin size={17} />
              Lahore, Pakistan
            </p>

            <p>
              <Phone size={17} />
              +92 300 0000000
            </p>

            <p>
              <Mail size={17} />
              hello@maisoncake.pk
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <span>© {new Date().getFullYear()} Maison Cake.</span>
          <span>Handmade with care.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;