import { useEffect, useState } from "react";

import {
  Save,
  RefreshCw,
  Share2,
  Eye,
} from "lucide-react";

import {
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";

const API_ROOT = "https://coreops.pk/cakes/api";

const initialForm = {
  id: 0,

  instagram_url: "",
  instagram_active: 0,

  facebook_url: "",
  facebook_active: 0,

  tiktok_url: "",
  tiktok_active: 0,

  youtube_url: "",
  youtube_active: 0,

  whatsapp_number: "",
  whatsapp_active: 0,
};

const platforms = [
  {
    key: "instagram",
    label: "Instagram",
    field: "instagram_url",
    active: "instagram_active",
    placeholder: "https://instagram.com/yourpage",
    Icon: FaInstagram,
  },
  {
    key: "facebook",
    label: "Facebook",
    field: "facebook_url",
    active: "facebook_active",
    placeholder: "https://facebook.com/yourpage",
    Icon: FaFacebookF,
  },
  {
    key: "tiktok",
    label: "TikTok",
    field: "tiktok_url",
    active: "tiktok_active",
    placeholder: "https://tiktok.com/@yourpage",
    Icon: FaTiktok,
  },
  {
    key: "youtube",
    label: "YouTube",
    field: "youtube_url",
    active: "youtube_active",
    placeholder: "https://youtube.com/@yourchannel",
    Icon: FaYoutube,
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    field: "whatsapp_number",
    active: "whatsapp_active",
    placeholder: "923001234567",
    Icon: FaWhatsapp,
  },
];

const SocialMedia = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  /* =========================================
     LOAD SETTINGS
  ========================================= */

  const loadSettings = async () => {
    try {
      setLoading(true);
      setMessage("");
      setMessageType("");

      const response = await fetch(
        `${API_ROOT}/SocialMedia/get.php`
      );

      const result = await response.json();

      if (
        !response.ok ||
        result.status !== "success"
      ) {
        throw new Error(
          result.message ||
            "Unable to load social media settings"
        );
      }

      if (result.data) {
        setForm({
          ...initialForm,
          ...result.data,

          id: Number(result.data.id || 0),

          instagram_active: Number(
            result.data.instagram_active || 0
          ),

          facebook_active: Number(
            result.data.facebook_active || 0
          ),

          tiktok_active: Number(
            result.data.tiktok_active || 0
          ),

          youtube_active: Number(
            result.data.youtube_active || 0
          ),

          whatsapp_active: Number(
            result.data.whatsapp_active || 0
          ),
        });
      } else {
        setForm(initialForm);
      }
    } catch (error) {
      console.error(
        "Social media settings load error:",
        error
      );

      setMessage(
        error.message ||
          "Unable to load social media settings."
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  /* =========================================
     INPUT CHANGE
  ========================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================================
     TOGGLE
  ========================================= */

  const toggle = (field) => {
    setForm((previous) => ({
      ...previous,
      [field]:
        Number(previous[field]) === 1
          ? 0
          : 1,
    }));
  };

  /* =========================================
     SAVE SETTINGS
  ========================================= */

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setMessageType("");

      const payload = {
        id: Number(form.id || 0),

        instagram_url:
          form.instagram_url?.trim() || "",

        instagram_active: Number(
          form.instagram_active || 0
        ),

        facebook_url:
          form.facebook_url?.trim() || "",

        facebook_active: Number(
          form.facebook_active || 0
        ),

        tiktok_url:
          form.tiktok_url?.trim() || "",

        tiktok_active: Number(
          form.tiktok_active || 0
        ),

        youtube_url:
          form.youtube_url?.trim() || "",

        youtube_active: Number(
          form.youtube_active || 0
        ),

        whatsapp_number:
          form.whatsapp_number?.trim() || "",

        whatsapp_active: Number(
          form.whatsapp_active || 0
        ),
      };

      const response = await fetch(
        `${API_ROOT}/SocialMedia/save.php`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (
        !response.ok ||
        result.status !== "success"
      ) {
        throw new Error(
          result.message ||
            "Unable to save social media settings"
        );
      }

      setForm((previous) => ({
        ...previous,
        id: Number(
          result.id ||
            previous.id ||
            0
        ),
      }));

      setMessage(
        "Social media settings saved successfully."
      );

      setMessageType("success");
    } catch (error) {
      console.error(
        "Social media settings save error:",
        error
      );

      setMessage(
        error.message ||
          "Unable to save social media settings."
      );

      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  /* =========================================
     LIVE PREVIEW
  ========================================= */

  const visiblePlatforms = platforms.filter(
    (item) => {
      const enabled =
        Number(form[item.active]) === 1;

      const value = String(
        form[item.field] || ""
      ).trim();

      return enabled && value;
    }
  );

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="social-admin-page">
        <div className="social-admin-loading">
          <RefreshCw
            size={22}
            className="social-spin"
          />

          <span>
            Loading social media settings...
          </span>
        </div>

        <style>{`
          .social-admin-loading {
            min-height: 300px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            color: #6f5a4f;
            font-size: 13px;
          }

          .social-spin {
            animation: socialSpin 1s linear infinite;
          }

          @keyframes socialSpin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="social-admin-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="social-admin-header">
        <div>
          <span className="social-admin-kicker">
            WEBSITE SETTINGS
          </span>

          <h1>Social Media</h1>

          <p>
            Manage the social media links displayed
            in the customer website footer.
          </p>
        </div>

        <button
          type="button"
          className="social-refresh-btn"
          onClick={loadSettings}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* =====================================
          MESSAGE
      ====================================== */}

      {message && (
        <div
          className={`social-admin-message ${
            messageType === "error"
              ? "error"
              : "success"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSave}>

        <div className="social-admin-workspace">

          {/* =================================
              LEFT SIDE SETTINGS
          ================================== */}

          <div className="social-admin-controls">

            <div className="social-admin-card">

              <div className="social-admin-card-title">
                <Share2 size={18} />

                <div>
                  <strong>
                    Social Media Links
                  </strong>

                  <span>
                    Enable only the platforms you
                    want to display.
                  </span>
                </div>
              </div>

              <div className="social-platform-list">

                {platforms.map(
                  ({
                    key,
                    label,
                    field,
                    active,
                    placeholder,
                    Icon,
                  }) => (
                    <div
                      className="social-platform-row"
                      key={key}
                    >

                      <div className="social-platform-heading">

                        <div className="social-platform-name">

                          <span className="social-platform-icon">
                            <Icon size={18} />
                          </span>

                          <div>
                            <strong>
                              {label}
                            </strong>

                            <small>
                              {Number(form[active]) === 1
                                ? "Visible in footer"
                                : "Hidden from footer"}
                            </small>
                          </div>

                        </div>

                        <button
                          type="button"
                          className={`social-toggle ${
                            Number(form[active]) === 1
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            toggle(active)
                          }
                          aria-label={`Toggle ${label}`}
                        >
                          <span />
                        </button>

                      </div>

                      <label htmlFor={field}>
                        {key === "whatsapp"
                          ? "WhatsApp Number"
                          : `${label} URL`}
                      </label>

                      <input
                        id={field}
                        type="text"
                        name={field}
                        value={form[field] || ""}
                        onChange={handleChange}
                        placeholder={placeholder}
                      />

                      {key === "whatsapp" && (
                        <small className="social-field-help">
                          Country code ke saath number
                          enter karein, without + or spaces.
                          Example: 923001234567
                        </small>
                      )}

                    </div>
                  )
                )}

              </div>
            </div>
          </div>

          {/* =================================
              RIGHT SIDE LIVE PREVIEW
          ================================== */}

          <div className="social-admin-preview-column">

            <div className="social-admin-preview-card">

              <div className="social-admin-preview-title">
                <Eye size={17} />

                <span>
                  Live Footer Preview
                </span>
              </div>

              <div className="social-footer-preview">

                <span className="social-preview-label">
                  FOLLOW US
                </span>

                <h3>
                  Just Bake It Official
                </h3>

                <p>
                  Enabled social accounts will appear
                  in the website footer like this.
                </p>

                <div className="social-preview-icons">

                  {visiblePlatforms.length === 0 ? (
                    <span className="social-no-icons">
                      No social media links enabled yet.
                    </span>
                  ) : (
                    visiblePlatforms.map(
                      ({
                        key,
                        label,
                        Icon,
                      }) => (
                        <span
                          key={key}
                          className="social-preview-icon"
                          title={label}
                        >
                          <Icon size={18} />
                        </span>
                      )
                    )
                  )}

                </div>

              </div>

              <div className="social-preview-note">
                Changes appear here instantly.
                Click Save Changes to publish them.
              </div>

            </div>

          </div>

        </div>

        {/* =================================
            SAVE BAR
        ================================== */}

        <div className="social-save-bar">

          <div>
            <strong>
              Footer Social Links
            </strong>

            <span>
              Save to publish these links on the
              customer website.
            </span>
          </div>

          <button
            type="submit"
            disabled={saving}
          >
            {saving ? (
              <>
                <RefreshCw
                  size={17}
                  className="social-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={17} />
                Save Changes
              </>
            )}
          </button>

        </div>

      </form>

      {/* =====================================
          CSS
      ====================================== */}

      <style>{`

        .social-admin-page {
          max-width: 1500px;
          margin: 0 auto;
          padding: 24px;
          color: #342720;
        }

        .social-admin-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 22px;
        }

        .social-admin-header h1 {
          margin: 4px 0 5px;
          font-size: 28px;
          color: #2d211c;
        }

        .social-admin-header p {
          margin: 0;
          color: #88766c;
          font-size: 13px;
        }

        .social-admin-kicker {
          color: #b9795d;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .social-refresh-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;

          padding: 11px 16px;

          border: 0;
          border-radius: 10px;

          background: #f4ece6;
          color: #59443a;

          font-size: 12px;
          font-weight: 700;

          cursor: pointer;
        }

        .social-admin-message {
          padding: 12px 15px;
          margin-bottom: 18px;
          border-radius: 10px;
          font-size: 12px;
        }

        .social-admin-message.success {
          border: 1px solid #cfe3d2;
          background: #f3faf4;
          color: #386143;
        }

        .social-admin-message.error {
          border: 1px solid #edcccc;
          background: #fff5f5;
          color: #9c4242;
        }

        .social-admin-workspace {
          display: grid;

          grid-template-columns:
            minmax(0, 1fr)
            minmax(390px, 0.85fr);

          gap: 24px;
          align-items: start;
        }

        .social-admin-card,
        .social-admin-preview-card {
          overflow: hidden;

          border: 1px solid #eadfd7;
          border-radius: 16px;

          background: #ffffff;

          box-shadow:
            0 8px 28px
            rgba(63, 43, 31, 0.04);
        }

        .social-admin-card-title {
          display: flex;
          align-items: center;
          gap: 10px;

          padding: 15px 17px;

          border-bottom:
            1px solid #eee4dc;

          background: #faf6f2;
        }

        .social-admin-card-title > div {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .social-admin-card-title strong {
          color: #49372e;
          font-size: 13px;
        }

        .social-admin-card-title span {
          color: #907d71;
          font-size: 11px;
        }

        .social-platform-list {
          display: flex;
          flex-direction: column;
          gap: 14px;

          padding: 16px;
        }

        .social-platform-row {
          padding: 16px;

          border: 1px solid #eee3db;
          border-radius: 13px;

          background: #fffdfb;
        }

        .social-platform-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 15px;

          margin-bottom: 14px;
        }

        .social-platform-name {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .social-platform-name > div {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .social-platform-name strong {
          color: #49372e;
          font-size: 13px;
        }

        .social-platform-name small {
          color: #99877c;
          font-size: 10px;
        }

        /* =================================
           ACTUAL SOCIAL ICONS
        ================================= */

        .social-platform-icon {
          width: 38px;
          height: 38px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border-radius: 50%;

          background: #f3e9e2;
          color: #765746;

          font-size: 18px;
        }

        .social-toggle {
          width: 43px;
          height: 24px;

          flex-shrink: 0;

          padding: 3px;

          border: 0;
          border-radius: 20px;

          background: #d8ccc4;

          cursor: pointer;

          transition: 0.2s ease;
        }

        .social-toggle span {
          display: block;

          width: 18px;
          height: 18px;

          border-radius: 50%;

          background: #ffffff;

          box-shadow:
            0 1px 3px
            rgba(0, 0, 0, 0.12);

          transition: 0.2s ease;
        }

        .social-toggle.active {
          background: #7a5948;
        }

        .social-toggle.active span {
          transform: translateX(19px);
        }

        .social-platform-row label {
          display: block;

          margin-bottom: 7px;

          color: #665248;

          font-size: 11px;
          font-weight: 800;
        }

        .social-platform-row input {
          width: 100%;
          height: 44px;

          box-sizing: border-box;

          padding: 0 13px;

          border: 1px solid #dfd2c8;
          border-radius: 9px;

          outline: none;

          background: #ffffff;
          color: #342720;

          font-size: 12px;

          transition: 0.2s ease;
        }

        .social-platform-row input:hover {
          border-color: #cbb7aa;
        }

        .social-platform-row input:focus {
          border-color: #b9795d;

          box-shadow:
            0 0 0 3px
            rgba(185, 121, 93, 0.11);
        }

        .social-field-help {
          display: block;

          margin-top: 7px;

          color: #99877c;

          font-size: 10px;
        }

        /* =================================
           PREVIEW
        ================================= */

        .social-admin-preview-card {
          position: sticky;
          top: 18px;
        }

        .social-admin-preview-title {
          display: flex;
          align-items: center;
          gap: 8px;

          padding: 13px 16px;

          border-bottom:
            1px solid #e7dcd3;

          background: #f4ece6;

          color: #5c463a;

          font-size: 12px;
          font-weight: 800;
        }

        .social-footer-preview {
          min-height: 350px;

          display: flex;
          flex-direction: column;
          justify-content: center;

          padding: 45px 38px;

          background: #30241f;
          color: #f7eee8;
        }

        .social-preview-label {
          color: #caa78f;

          font-size: 9px;
          font-weight: 700;

          letter-spacing: 3px;
        }

        .social-footer-preview h3 {
          margin: 8px 0 10px;

          color: #ffffff;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 28px;
          font-weight: 500;
        }

        .social-footer-preview p {
          max-width: 360px;

          margin: 0 0 25px;

          color: #cbbdb4;

          font-size: 12px;
          line-height: 1.7;
        }

        .social-preview-icons {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .social-preview-icon {
          width: 40px;
          height: 40px;

          display: flex;
          align-items: center;
          justify-content: center;

          border:
            1px solid
            rgba(255, 255, 255, 0.25);

          border-radius: 50%;

          color: #ffffff;

          font-size: 18px;

          transition:
            transform 0.2s ease,
            background 0.2s ease;
        }

        .social-preview-icon:hover {
          transform: translateY(-2px);

          background:
            rgba(255, 255, 255, 0.08);
        }

        .social-no-icons {
          color: #aa9990;
          font-size: 11px;
        }

        .social-preview-note {
          padding: 11px 15px;

          border-top:
            1px solid #e7dcd3;

          background: #fffdfb;

          color: #8a776c;

          font-size: 10px;
        }

        /* =================================
           SAVE BAR
        ================================= */

        .social-save-bar {
          position: sticky;
          bottom: 10px;
          z-index: 20;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;

          margin-top: 22px;
          padding: 13px 15px;

          border: 1px solid #e2d6cd;
          border-radius: 13px;

          background:
            rgba(255, 255, 255, 0.97);

          box-shadow:
            0 10px 30px
            rgba(55, 37, 28, 0.12);
        }

        .social-save-bar > div {
          display: flex;
          flex-direction: column;
        }

        .social-save-bar strong {
          color: #46342b;
          font-size: 12px;
        }

        .social-save-bar span {
          margin-top: 2px;
          color: #907e73;
          font-size: 10px;
        }

        .social-save-bar button {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          gap: 8px;

          padding: 11px 17px;

          border: 0;
          border-radius: 10px;

          background: #2d221d;
          color: #ffffff;

          font-size: 12px;
          font-weight: 700;

          cursor: pointer;
        }

        .social-save-bar button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .social-spin {
          animation:
            socialSpin
            1s linear infinite;
        }

        @keyframes socialSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 900px) {
          .social-admin-workspace {
            grid-template-columns: 1fr;
          }

          .social-admin-preview-column {
            order: -1;
          }

          .social-admin-preview-card {
            position: relative;
            top: auto;
          }

          .social-footer-preview {
            min-height: 260px;
          }
        }

        @media (max-width: 600px) {
          .social-admin-page {
            padding: 14px;
          }

          .social-admin-header {
            flex-direction: column;
            align-items: stretch;
          }

          .social-refresh-btn {
            align-self: flex-start;
          }

          .social-save-bar {
            flex-direction: column;
            align-items: stretch;
          }

          .social-save-bar button {
            width: 100%;
          }

          .social-footer-preview {
            padding: 35px 25px;
          }
        }

      `}</style>

    </div>
  );
};

export default SocialMedia;