// import { useEffect, useState } from "react";

// import {
//   MapPin,
//   Phone,
//   Mail,
//   ExternalLink,
// } from "lucide-react";

// import {
//   FaInstagram,
//   FaFacebookF,
//   FaTiktok,
//   FaYoutube,
//   FaWhatsapp,
// } from "react-icons/fa";

// import { Link } from "react-router-dom";

// import logo from "../../assets/images/just-bake-it-logo.jpeg";

// const API_ROOT = "https://coreops.pk/cakes/api";

// const Footer = () => {
//   const [settings, setSettings] = useState(null);

//   useEffect(() => {
//     const loadFooterSettings = async () => {
//       try {
//         const response = await fetch(
//           `${API_ROOT}/SocialMedia/get.php`
//         );

//         const result = await response.json();

//         if (
//           response.ok &&
//           result.status === "success"
//         ) {
//           setSettings(result.data || null);
//         }
//       } catch (error) {
//         console.error(
//           "Footer settings error:",
//           error
//         );
//       }
//     };

//     loadFooterSettings();
//   }, []);

//   const whatsappUrl = settings?.whatsapp_number
//     ? `https://wa.me/${String(
//         settings.whatsapp_number
//       ).replace(/\D/g, "")}`
//     : "";

//   const socialLinks = [
//     {
//       label: "Instagram",
//       url: settings?.instagram_url,
//       active: settings?.instagram_active,
//       Icon: FaInstagram,
//     },
//     {
//       label: "Facebook",
//       url: settings?.facebook_url,
//       active: settings?.facebook_active,
//       Icon: FaFacebookF,
//     },
//     {
//       label: "TikTok",
//       url: settings?.tiktok_url,
//       active: settings?.tiktok_active,
//       Icon: FaTiktok,
//     },
//     {
//       label: "YouTube",
//       url: settings?.youtube_url,
//       active: settings?.youtube_active,
//       Icon: FaYoutube,
//     },
//     {
//       label: "WhatsApp",
//       url: whatsappUrl,
//       active: settings?.whatsapp_active,
//       Icon: FaWhatsapp,
//     },
//   ].filter(
//     (item) =>
//       Number(item.active) === 1 &&
//       item.url
//   );

//   const showMaps =
//     Number(settings?.google_maps_active) === 1 &&
//     String(settings?.google_maps_url || "").trim();

//   const showPhone =
//     Number(settings?.phone_active) === 1 &&
//     String(settings?.phone_number || "").trim();

//   const showEmail =
//     Number(settings?.email_active) === 1 &&
//     String(settings?.email || "").trim();

//   const showAddress =
//     Number(settings?.address_active) === 1 &&
//     String(settings?.address || "").trim();

//   const hasContact =
//     showMaps ||
//     showPhone ||
//     showEmail ||
//     showAddress;

//   return (
//     <footer className="footer">
//       <div className="container footer-grid">
//         <div className="footer-brand-column">
//           <div className="footer-brand footer-logo-brand">
//             <img
//               src={logo}
//               alt="Just Bake It Official"
//               className="footer-brand-logo"
//             />

//             <div>
//               <span>FRESH & DELICIOUS</span>
//               <h3>Just Bake It Official</h3>
//             </div>
//           </div>

//           <p>
//             Thoughtfully handcrafted cakes
//             created to make your most beautiful
//             moments even sweeter.
//           </p>

//           {socialLinks.length > 0 && (
//             <div className="footer-social">
//               {socialLinks.map(
//                 ({ label, url, Icon }) => (
//                   <a
//                     key={label}
//                     href={url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     aria-label={label}
//                     title={label}
//                   >
//                     <Icon size={17} />
//                   </a>
//                 )
//               )}
//             </div>
//           )}
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
//             {showMaps && (
//               <a
//                 href={settings.google_maps_url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="footer-location-link"
//                 aria-label="Open location on Google Maps"
//               >
//                 <MapPin size={17} />

//                 <span>
//                   {settings.google_maps_text ||
//                     "View on Google Maps"}
//                 </span>

//                 <ExternalLink
//                   size={13}
//                   className="footer-location-external-icon"
//                 />
//               </a>
//             )}

//             {showPhone && (
//               <a
//                 href={`tel:${settings.phone_number}`}
//                 className="footer-contact-item"
//               >
//                 <Phone size={17} />
//                 <span>{settings.phone_number}</span>
//               </a>
//             )}

//             {showEmail && (
//               <a
//                 href={`mailto:${settings.email}`}
//                 className="footer-contact-item"
//               >
//                 <Mail size={17} />
//                 <span>{settings.email}</span>
//               </a>
//             )}

//             {showAddress && (
//               <p className="footer-contact-item">
//                 <MapPin size={17} />
//                 <span>{settings.address}</span>
//               </p>
//             )}

//             {!hasContact && (
//               <p>
//                 <Phone size={17} />
//                 Contact details coming soon
//               </p>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="footer-bottom">
//         <div className="container">
//           <span>
//             © {new Date().getFullYear()}{" "}
//             Just Bake It Official.
//           </span>

//           <span>
//             Fresh & Delicious Cakes.
//           </span>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;




import { useEffect, useState } from "react";

import {
  MapPin,
  Phone,
  Mail,
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

/* =========================================
   VALID VALUE CHECK
   Prevents empty / 0 / null values from
   appearing in the footer.
========================================= */

const hasRealValue = (value) => {
  if (value === null || value === undefined) {
    return false;
  }

  const cleaned = String(value).trim();

  return (
    cleaned !== "" &&
    cleaned !== "0" &&
    cleaned.toLowerCase() !== "null" &&
    cleaned.toLowerCase() !== "undefined"
  );
};

const Footer = () => {
  const [settings, setSettings] = useState(null);

  /* =========================================
     LOAD FOOTER SETTINGS
  ========================================= */

  useEffect(() => {
    const loadFooterSettings = async () => {
      try {
        const response = await fetch(
          `${API_ROOT}/SocialMedia/get.php`
        );

        const result = await response.json();

        if (
          response.ok &&
          result.status === "success"
        ) {
          setSettings(result.data || null);
        }
      } catch (error) {
        console.error(
          "Footer settings error:",
          error
        );
      }
    };

    loadFooterSettings();
  }, []);

  /* =========================================
     WHATSAPP URL
  ========================================= */

  const whatsappUrl =
    hasRealValue(settings?.whatsapp_number)
      ? `https://wa.me/${String(
          settings.whatsapp_number
        ).replace(/\D/g, "")}`
      : "";

  /* =========================================
     SOCIAL MEDIA LINKS
  ========================================= */

  const socialLinks = [
    {
      label: "Instagram",
      url: settings?.instagram_url,
      active: settings?.instagram_active,
      Icon: FaInstagram,
    },
    {
      label: "Facebook",
      url: settings?.facebook_url,
      active: settings?.facebook_active,
      Icon: FaFacebookF,
    },
    {
      label: "TikTok",
      url: settings?.tiktok_url,
      active: settings?.tiktok_active,
      Icon: FaTiktok,
    },
    {
      label: "YouTube",
      url: settings?.youtube_url,
      active: settings?.youtube_active,
      Icon: FaYoutube,
    },
    {
      label: "WhatsApp",
      url: whatsappUrl,
      active: settings?.whatsapp_active,
      Icon: FaWhatsapp,
    },
  ].filter(
    (item) =>
      Number(item.active) === 1 &&
      hasRealValue(item.url)
  );

  /* =========================================
     CONTACT VISIBILITY
  ========================================= */

  const showMaps =
    Number(settings?.google_maps_active) === 1 &&
    hasRealValue(settings?.google_maps_url);

  const showPhone =
    Number(settings?.phone_active) === 1 &&
    hasRealValue(settings?.phone_number);

  const showEmail =
    Number(settings?.email_active) === 1 &&
    hasRealValue(settings?.email);

  const showAddress =
    Number(settings?.address_active) === 1 &&
    hasRealValue(settings?.address);

  const hasContact =
    showMaps ||
    showPhone ||
    showEmail ||
    showAddress;

  const googleMapsText =
    hasRealValue(settings?.google_maps_text)
      ? settings.google_maps_text
      : "View on Google Maps";

  /* =========================================
     RENDER
  ========================================= */

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
              SOCIAL MEDIA
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

            {/* GOOGLE MAPS */}

            {showMaps && (
              <a
                href={settings.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-location-link"
                aria-label="Open location on Google Maps"
              >
                <MapPin size={17} />

                <span>
                  {googleMapsText}
                </span>

                <ExternalLink
                  size={13}
                  className="footer-location-external-icon"
                />
              </a>
            )}

            {/* PHONE */}

            {showPhone && (
              <a
                href={`tel:${settings.phone_number}`}
                className="footer-contact-item"
              >
                <Phone size={17} />

                <span>
                  {settings.phone_number}
                </span>
              </a>
            )}

            {/* EMAIL */}

            {showEmail && (
              <a
                href={`mailto:${settings.email}`}
                className="footer-contact-item"
              >
                <Mail size={17} />

                <span>
                  {settings.email}
                </span>
              </a>
            )}

            {/* ADDRESS */}

            {showAddress && (
              <p className="footer-contact-item">
                <MapPin size={17} />

                <span>
                  {settings.address}
                </span>
              </p>
            )}

            {/* FALLBACK */}

            {!hasContact && (
              <p className="footer-contact-item">
                <Phone size={17} />

                <span>
                  Contact details coming soon
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* =========================
          FOOTER BOTTOM
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
