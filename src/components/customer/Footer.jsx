import { useEffect, useState } from "react";

import {
  MapPin,
  Phone,
  ExternalLink,
} from "lucide-react";

import {
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import logo from "../../assets/images/just-bake-it-logo.jpeg";

const API_ROOT = "https://coreops.pk/cakes/api";

const GOOGLE_MAPS_URL =
  "https://maps.app.goo.gl/jjfX22Hk54bwR7oi6";

const Footer = () => {
  const [socials, setSocials] = useState(null);

  /* =========================================
     LOAD SOCIAL MEDIA SETTINGS
  ========================================= */

  useEffect(() => {
    const loadSocials = async () => {
      try {
        const response = await fetch(
          `${API_ROOT}/SocialMedia/get.php`
        );

        const result = await response.json();

        if (
          response.ok &&
          result.status === "success"
        ) {
          setSocials(result.data || null);
        }
      } catch (error) {
        console.error(
          "Footer social links error:",
          error
        );
      }
    };

    loadSocials();
  }, []);

  /* =========================================
     WHATSAPP URL
  ========================================= */

  const whatsappUrl = socials?.whatsapp_number
    ? `https://wa.me/${String(
        socials.whatsapp_number
      ).replace(/\D/g, "")}`
    : "";

  /* =========================================
     SOCIAL MEDIA LINKS
  ========================================= */

  const socialLinks = [
    {
      label: "Instagram",
      url: socials?.instagram_url,
      active: socials?.instagram_active,
      Icon: FaInstagram,
    },

    {
      label: "Facebook",
      url: socials?.facebook_url,
      active: socials?.facebook_active,
      Icon: FaFacebookF,
    },

    {
      label: "TikTok",
      url: socials?.tiktok_url,
      active: socials?.tiktok_active,
      Icon: FaTiktok,
    },

    {
      label: "YouTube",
      url: socials?.youtube_url,
      active: socials?.youtube_active,
      Icon: FaYoutube,
    },

    {
      label: "WhatsApp",
      url: whatsappUrl,
      active: socials?.whatsapp_active,
      Icon: FaWhatsapp,
    },
  ].filter(
    (item) =>
      Number(item.active) === 1 &&
      item.url
  );

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
              <span>
                FRESH & DELICIOUS
              </span>

              <h3>
                Just Bake It Official
              </h3>
            </div>

          </div>

          <p>
            Thoughtfully handcrafted cakes
            created to make your most beautiful
            moments even sweeter.
          </p>

          {/* =========================
              SOCIAL MEDIA ICONS
          ========================= */}

          {socialLinks.length > 0 && (
            <div className="footer-social">

              {socialLinks.map(
                ({
                  label,
                  url,
                  Icon,
                }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                  >
                    <Icon size={17} />
                  </a>
                )
              )}

            </div>
          )}

        </div>

        {/* =========================
            EXPLORE
        ========================= */}

        <div>

          <h4>
            Explore
          </h4>

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

          <h4>
            Collections
          </h4>

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

          <h4>
            Contact
          </h4>

          <div className="footer-contact">

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
            © {new Date().getFullYear()}{" "}
            Just Bake It Official.
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