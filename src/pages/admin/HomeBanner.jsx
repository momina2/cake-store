import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Image as ImageIcon,
  Upload,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  X,
  Type,
  Link as LinkIcon,
  CakeSlice,
  Sparkles,
} from "lucide-react";

const API_ROOT =
  "https://coreops.pk/cakes/api";

const emptyForm = {
  id: 0,

  image: "",
  image_url: "",

  secondary_image: "",
  secondary_image_url: "",

  brand_small_text:
    "JUST BAKE IT OFFICIAL",

  brand_title:
    "Fresh & Delicious Cakes",

  eyebrow_text:
    "HANDCRAFTED IN LAHORE",

  heading:
    "Cakes made for",

  heading_highlight:
    "beautiful moments.",

  subheading:
    "Elegant, handcrafted cakes made fresh with thoughtful details, premium ingredients and a little bit of magic.",

  button_text:
    "Explore Cakes",

  button_link:
    "/cakes",

  secondary_button_text:
    "Browse Collections",

  secondary_button_link:
    "/cakes",

  vertical_text:
    "made with love",

  product_label:
    "OUR FAVOURITE",

  product_title:
    "Lotus three milk cake",

  product_price:
    "Rs. 2,200",

  feature_one:
    "Freshly Baked",

  feature_two:
    "Made With Love",

  feature_three:
    "Custom Designs",

  is_active: 1,
};

const HomeBanner = () => {
  const mainImageInputRef =
    useRef(null);

  const secondaryImageInputRef =
    useRef(null);

  const [form, setForm] =
    useState(emptyForm);

  const [mainFile, setMainFile] =
    useState(null);

  const [
    secondaryFile,
    setSecondaryFile,
  ] = useState(null);

  const [
    mainPreview,
    setMainPreview,
  ] = useState("");

  const [
    secondaryPreview,
    setSecondaryPreview,
  ] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  /*
  |--------------------------------------------------------------------------
  | LOAD HERO
  |--------------------------------------------------------------------------
  */

  const loadBanner = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch(
        `${API_ROOT}/HomeBanner/get.php`
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        result.status !== "success"
      ) {
        throw new Error(
          result.message ||
            "Unable to load home hero."
        );
      }

      if (result.data) {
        setForm({
          ...emptyForm,
          ...result.data,

          id: Number(
            result.data.id || 0
          ),

          is_active:
            Number(
              result.data.is_active
            ) === 1
              ? 1
              : 0,

          image:
            result.data.image || "",

          image_url:
            result.data.image_url || "",

          secondary_image:
            result.data
              .secondary_image || "",

          secondary_image_url:
            result.data
              .secondary_image_url || "",
        });
      }
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error.message ||
          "Unable to load home hero."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanner();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | CLEAN PREVIEWS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      if (mainPreview) {
        URL.revokeObjectURL(
          mainPreview
        );
      }
    };
  }, [mainPreview]);

  useEffect(() => {
    return () => {
      if (secondaryPreview) {
        URL.revokeObjectURL(
          secondaryPreview
        );
      }
    };
  }, [secondaryPreview]);

  /*
  |--------------------------------------------------------------------------
  | TEXT INPUT
  |--------------------------------------------------------------------------
  */

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccessMessage("");
    setErrorMessage("");
  };

  /*
  |--------------------------------------------------------------------------
  | IMAGE VALIDATION
  |--------------------------------------------------------------------------
  */

  const validateImage = (file) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setErrorMessage(
        "Only JPG, PNG and WEBP images are allowed."
      );

      return false;
    }

    if (
      file.size >
      8 * 1024 * 1024
    ) {
      setErrorMessage(
        "Image must be smaller than 8 MB."
      );

      return false;
    }

    return true;
  };

  /*
  |--------------------------------------------------------------------------
  | MAIN IMAGE
  |--------------------------------------------------------------------------
  */

  const handleMainImage = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (!validateImage(file)) {
      event.target.value = "";
      return;
    }

    if (mainPreview) {
      URL.revokeObjectURL(
        mainPreview
      );
    }

    setMainFile(file);

    setMainPreview(
      URL.createObjectURL(file)
    );

    setSuccessMessage("");
    setErrorMessage("");
  };

  /*
  |--------------------------------------------------------------------------
  | SECONDARY IMAGE
  |--------------------------------------------------------------------------
  */

  const handleSecondaryImage = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (!validateImage(file)) {
      event.target.value = "";
      return;
    }

    if (secondaryPreview) {
      URL.revokeObjectURL(
        secondaryPreview
      );
    }

    setSecondaryFile(file);

    setSecondaryPreview(
      URL.createObjectURL(file)
    );

    setSuccessMessage("");
    setErrorMessage("");
  };

  /*
  |--------------------------------------------------------------------------
  | UPLOAD IMAGE
  |--------------------------------------------------------------------------
  */

  const uploadImage = async (
    file
  ) => {
    if (!file) {
      return null;
    }

    const data =
      new FormData();

    data.append(
      "image",
      file
    );

    const response =
      await fetch(
        `${API_ROOT}/HomeBanner/upload.php`,
        {
          method: "POST",
          body: data,
        }
      );

    const result =
      await response.json();

    if (
      !response.ok ||
      result.status !== "success"
    ) {
      throw new Error(
        result.message ||
          "Unable to upload image."
      );
    }

    return result;
  };

  /*
  |--------------------------------------------------------------------------
  | REMOVE NEW MAIN SELECTION
  |--------------------------------------------------------------------------
  */

  const removeMainSelection = () => {
    if (mainPreview) {
      URL.revokeObjectURL(
        mainPreview
      );
    }

    setMainFile(null);
    setMainPreview("");

    if (
      mainImageInputRef.current
    ) {
      mainImageInputRef.current.value =
        "";
    }
  };

  /*
  |--------------------------------------------------------------------------
  | REMOVE SECONDARY SELECTION
  |--------------------------------------------------------------------------
  */

  const removeSecondarySelection =
    () => {
      if (secondaryPreview) {
        URL.revokeObjectURL(
          secondaryPreview
        );
      }

      setSecondaryFile(null);

      setSecondaryPreview("");

      if (
        secondaryImageInputRef.current
      ) {
        secondaryImageInputRef.current.value =
          "";
      }
    };

  /*
  |--------------------------------------------------------------------------
  | STATUS
  |--------------------------------------------------------------------------
  */

  const toggleStatus = () => {
    setForm((previous) => ({
      ...previous,

      is_active:
        previous.is_active === 1
          ? 0
          : 1,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | SAVE
  |--------------------------------------------------------------------------
  */

  const handleSave = async (
    event
  ) => {
    event.preventDefault();

    if (saving) return;

    try {
      setSaving(true);

      setSuccessMessage("");
      setErrorMessage("");

      let mainImage =
        form.image;

      let mainImageUrl =
        form.image_url;

      let secondImage =
        form.secondary_image;

      let secondImageUrl =
        form.secondary_image_url;

      /*
      | MAIN IMAGE
      */

      if (mainFile) {
        const uploaded =
          await uploadImage(
            mainFile
          );

        mainImage =
          uploaded.file_name;

        mainImageUrl =
          uploaded.image_url;
      }

      /*
      | SECONDARY IMAGE
      */

      if (secondaryFile) {
        const uploaded =
          await uploadImage(
            secondaryFile
          );

        secondImage =
          uploaded.file_name;

        secondImageUrl =
          uploaded.image_url;
      }

      /*
      | SAVE TEXT + IMAGE NAMES
      */

      const payload = {
        id: Number(
          form.id || 0
        ),

        image:
          mainImage || "",

        secondary_image:
          secondImage || "",

        brand_small_text:
          form.brand_small_text.trim(),

        brand_title:
          form.brand_title.trim(),

        eyebrow_text:
          form.eyebrow_text.trim(),

        heading:
          form.heading.trim(),

        heading_highlight:
          form.heading_highlight.trim(),

        subheading:
          form.subheading.trim(),

        button_text:
          form.button_text.trim(),

        button_link:
          form.button_link.trim(),

        secondary_button_text:
          form.secondary_button_text.trim(),

        secondary_button_link:
          form.secondary_button_link.trim(),

        vertical_text:
          form.vertical_text.trim(),

        product_label:
          form.product_label.trim(),

        product_title:
          form.product_title.trim(),

        product_price:
          form.product_price.trim(),

        feature_one:
          form.feature_one.trim(),

        feature_two:
          form.feature_two.trim(),

        feature_three:
          form.feature_three.trim(),

        is_active:
          Number(
            form.is_active
          ),
      };

      const response =
        await fetch(
          `${API_ROOT}/HomeBanner/save.php`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              payload
            ),
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        result.status !== "success"
      ) {
        throw new Error(
          result.message ||
            "Unable to save home hero."
        );
      }

      setForm(
        (previous) => ({
          ...previous,

          id: Number(
            result.id ||
              previous.id
          ),

          image:
            mainImage,

          image_url:
            mainImageUrl,

          secondary_image:
            secondImage,

          secondary_image_url:
            secondImageUrl,
        })
      );

      setMainFile(null);
      setSecondaryFile(null);

      setMainPreview("");
      setSecondaryPreview("");

      if (
        mainImageInputRef.current
      ) {
        mainImageInputRef.current.value =
          "";
      }

      if (
        secondaryImageInputRef.current
      ) {
        secondaryImageInputRef.current.value =
          "";
      }

      setSuccessMessage(
        "Home hero updated successfully."
      );

      await loadBanner();

      setSuccessMessage(
        "Home hero updated successfully."
      );
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error.message ||
          "Unable to save home hero."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | REFRESH
  |--------------------------------------------------------------------------
  */

  const handleRefresh =
    async () => {
      removeMainSelection();
      removeSecondarySelection();

      setSuccessMessage("");
      setErrorMessage("");

      await loadBanner();
    };

  const mainImageSrc =
    mainPreview ||
    form.image_url ||
    "";

  const secondaryImageSrc =
    secondaryPreview ||
    form.secondary_image_url ||
    "";

  if (loading) {
    return (
      <div className="hero-admin-loading">
        <RefreshCw
          size={30}
          className="hero-admin-spin"
        />

        <span>
          Loading Home Hero...
        </span>
      </div>
    );
  }

  return (
    <div className="hero-admin-page">

      {/* HEADER */}

      <div className="hero-admin-header">

        <div>
          <div className="hero-admin-heading-row">

            <div className="hero-admin-heading-icon">
              <ImageIcon
                size={22}
              />
            </div>

            <div>
              <h1>
                Home Hero
              </h1>

              <p>
                Manage the complete
                hero section displayed
                on your website.
              </p>
            </div>

          </div>
        </div>

        <button
          type="button"
          className="hero-admin-refresh"
          onClick={
            handleRefresh
          }
          disabled={saving}
        >
          <RefreshCw
            size={17}
          />

          Refresh
        </button>

      </div>

      {/* MESSAGES */}

      {successMessage && (
        <div className="hero-admin-alert success">
          <CheckCircle2
            size={18}
          />

          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="hero-admin-alert error">
          <AlertCircle
            size={18}
          />

          {errorMessage}
        </div>
      )}

      <form
        onSubmit={
          handleSave
        }
      >

        {/* =========================
            IMAGES
        ========================== */}

        <div className="hero-admin-section">

          <div className="hero-admin-section-title">
            <ImageIcon
              size={19}
            />

            <div>
              <h2>
                Hero Images
              </h2>

              <p>
                Manage the two images
                displayed on the right
                side of the home hero.
              </p>
            </div>
          </div>

          <div className="hero-admin-image-grid">

            {/* MAIN */}

            <div className="hero-admin-image-box">

              <div className="hero-admin-field-title">
                Main Cake Image
              </div>

              <div className="hero-admin-main-preview">

                {mainImageSrc ? (
                  <img
                    src={
                      mainImageSrc
                    }
                    alt="Main Hero"
                  />
                ) : (
                  <ImageIcon
                    size={45}
                  />
                )}

                {mainFile && (
                  <button
                    type="button"
                    className="hero-admin-remove"
                    onClick={
                      removeMainSelection
                    }
                  >
                    <X size={16} />
                  </button>
                )}

              </div>

              <input
                ref={
                  mainImageInputRef
                }
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                onChange={
                  handleMainImage
                }
              />

              <button
                type="button"
                className="hero-admin-upload"
                onClick={() =>
                  mainImageInputRef.current?.click()
                }
              >
                <Upload
                  size={17}
                />

                {mainImageSrc
                  ? "Change Main Image"
                  : "Upload Main Image"}
              </button>

              <small>
                Recommended portrait /
                square cake image.
              </small>

            </div>

            {/* SECONDARY */}

            <div className="hero-admin-image-box">

              <div className="hero-admin-field-title">
                Secondary Image
              </div>

              <div className="hero-admin-secondary-preview">

                {secondaryImageSrc ? (
                  <img
                    src={
                      secondaryImageSrc
                    }
                    alt="Secondary Hero"
                  />
                ) : (
                  <ImageIcon
                    size={40}
                  />
                )}

                {secondaryFile && (
                  <button
                    type="button"
                    className="hero-admin-remove"
                    onClick={
                      removeSecondarySelection
                    }
                  >
                    <X size={16} />
                  </button>
                )}

              </div>

              <input
                ref={
                  secondaryImageInputRef
                }
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                onChange={
                  handleSecondaryImage
                }
              />

              <button
                type="button"
                className="hero-admin-upload"
                onClick={() =>
                  secondaryImageInputRef.current?.click()
                }
              >
                <Upload
                  size={17}
                />

                {secondaryImageSrc
                  ? "Change Secondary Image"
                  : "Upload Secondary Image"}
              </button>

              <small>
                This is the smaller
                overlapping image.
              </small>

            </div>

          </div>
        </div>

        {/* =========================
            MAIN CONTENT
        ========================== */}

        <div className="hero-admin-section">

          <div className="hero-admin-section-title">
            <Type size={19} />

            <div>
              <h2>
                Main Hero Content
              </h2>

              <p>
                Edit the main text shown
                on the left side.
              </p>
            </div>
          </div>

          <div className="hero-admin-form-grid">

            <Field
              label="Small Brand Text"
              name="brand_small_text"
              value={
                form.brand_small_text
              }
              onChange={
                handleChange
              }
              placeholder="JUST BAKE IT OFFICIAL"
            />

            <Field
              label="Brand Title"
              name="brand_title"
              value={
                form.brand_title
              }
              onChange={
                handleChange
              }
              placeholder="Fresh & Delicious Cakes"
            />

            <Field
              label="Eyebrow Text"
              name="eyebrow_text"
              value={
                form.eyebrow_text
              }
              onChange={
                handleChange
              }
              placeholder="HANDCRAFTED IN LAHORE"
            />

            <Field
              label="Main Heading"
              name="heading"
              value={
                form.heading
              }
              onChange={
                handleChange
              }
              placeholder="Cakes made for"
            />

            <Field
              label="Highlighted Heading"
              name="heading_highlight"
              value={
                form.heading_highlight
              }
              onChange={
                handleChange
              }
              placeholder="beautiful moments."
            />

            <Field
              label="Vertical Text"
              name="vertical_text"
              value={
                form.vertical_text
              }
              onChange={
                handleChange
              }
              placeholder="made with love"
            />

            <div className="hero-admin-field full">
              <label>
                Description
              </label>

              <textarea
                name="subheading"
                value={
                  form.subheading
                }
                onChange={
                  handleChange
                }
                rows={4}
                placeholder="Hero description..."
              />
            </div>

          </div>
        </div>

        {/* =========================
            BUTTONS
        ========================== */}

        <div className="hero-admin-section">

          <div className="hero-admin-section-title">
            <LinkIcon
              size={19}
            />

            <div>
              <h2>
                Hero Buttons
              </h2>

              <p>
                Control button text
                and destinations.
              </p>
            </div>
          </div>

          <div className="hero-admin-form-grid">

            <Field
              label="Primary Button Text"
              name="button_text"
              value={
                form.button_text
              }
              onChange={
                handleChange
              }
              placeholder="Explore Cakes"
            />

            <Field
              label="Primary Button Link"
              name="button_link"
              value={
                form.button_link
              }
              onChange={
                handleChange
              }
              placeholder="/cakes"
            />

            <Field
              label="Secondary Button Text"
              name="secondary_button_text"
              value={
                form.secondary_button_text
              }
              onChange={
                handleChange
              }
              placeholder="Browse Collections"
            />

            <Field
              label="Secondary Button Link"
              name="secondary_button_link"
              value={
                form.secondary_button_link
              }
              onChange={
                handleChange
              }
              placeholder="/cakes"
            />

          </div>
        </div>

        {/* =========================
            PRODUCT CARD
        ========================== */}

        <div className="hero-admin-section">

          <div className="hero-admin-section-title">
            <CakeSlice
              size={19}
            />

            <div>
              <h2>
                Featured Cake Card
              </h2>

              <p>
                Edit the small card
                displayed over the main
                cake image.
              </p>
            </div>
          </div>

          <div className="hero-admin-form-grid">

            <Field
              label="Card Label"
              name="product_label"
              value={
                form.product_label
              }
              onChange={
                handleChange
              }
              placeholder="OUR FAVOURITE"
            />

            <Field
              label="Cake Name"
              name="product_title"
              value={
                form.product_title
              }
              onChange={
                handleChange
              }
              placeholder="Lotus three milk cake"
            />

            <Field
              label="Price"
              name="product_price"
              value={
                form.product_price
              }
              onChange={
                handleChange
              }
              placeholder="Rs. 2,200"
            />

          </div>
        </div>

        {/* =========================
            FEATURES
        ========================== */}

        <div className="hero-admin-section">

          <div className="hero-admin-section-title">
            <Sparkles
              size={19}
            />

            <div>
              <h2>
                Bottom Features
              </h2>

              <p>
                Edit the three short
                features below the
                hero buttons.
              </p>
            </div>
          </div>

          <div className="hero-admin-form-grid three">

            <Field
              label="Feature 1"
              name="feature_one"
              value={
                form.feature_one
              }
              onChange={
                handleChange
              }
              placeholder="Freshly Baked"
            />

            <Field
              label="Feature 2"
              name="feature_two"
              value={
                form.feature_two
              }
              onChange={
                handleChange
              }
              placeholder="Made With Love"
            />

            <Field
              label="Feature 3"
              name="feature_three"
              value={
                form.feature_three
              }
              onChange={
                handleChange
              }
              placeholder="Custom Designs"
            />

          </div>
        </div>

        {/* =========================
            STATUS
        ========================== */}

        <div className="hero-admin-section">

          <div className="hero-admin-status">

            <div className="hero-admin-status-left">

              <div
                className={`hero-admin-status-icon ${
                  form.is_active === 1
                    ? "active"
                    : ""
                }`}
              >
                {form.is_active === 1 ? (
                  <Eye
                    size={20}
                  />
                ) : (
                  <EyeOff
                    size={20}
                  />
                )}
              </div>

              <div>
                <strong>
                  Hero Status
                </strong>

                <span>
                  {form.is_active === 1
                    ? "Hero section is active and visible."
                    : "Hero section is currently hidden."}
                </span>
              </div>

            </div>

            <button
              type="button"
              onClick={
                toggleStatus
              }
              className={`hero-admin-toggle ${
                form.is_active === 1
                  ? "active"
                  : ""
              }`}
            >
              <span />
            </button>

          </div>

        </div>

        {/* =========================
            LIVE PREVIEW
        ========================== */}

        <div className="hero-admin-section">

          <div className="hero-admin-section-title">
            <Eye size={19} />

            <div>
              <h2>
                Content Preview
              </h2>

              <p>
                Preview your current
                hero content before
                saving.
              </p>
            </div>
          </div>

          <div className="hero-admin-live-preview">

            <div className="hero-admin-preview-left">

              <small>
                {form.brand_small_text}
              </small>

              <h4>
                {form.brand_title}
              </h4>

              <span className="hero-admin-eyebrow">
                {form.eyebrow_text}
              </span>

              <h2>
                {form.heading}
                <em>
                  {
                    form.heading_highlight
                  }
                </em>
              </h2>

              <p>
                {form.subheading}
              </p>

              <div className="hero-admin-preview-buttons">

                {form.button_text && (
                  <span className="primary">
                    {
                      form.button_text
                    }
                  </span>
                )}

                {form.secondary_button_text && (
                  <span className="secondary">
                    {
                      form.secondary_button_text
                    }
                  </span>
                )}

              </div>

              <div className="hero-admin-preview-features">

                <span>
                  {form.feature_one}
                </span>

                <span>
                  {form.feature_two}
                </span>

                <span>
                  {form.feature_three}
                </span>

              </div>

            </div>

            <div className="hero-admin-preview-right">

              {mainImageSrc ? (
                <img
                  className="hero-admin-preview-main-image"
                  src={
                    mainImageSrc
                  }
                  alt=""
                />
              ) : (
                <div className="hero-admin-preview-no-image">
                  <ImageIcon
                    size={40}
                  />
                </div>
              )}

              <span className="hero-admin-preview-vertical">
                {form.vertical_text}
              </span>

              <div className="hero-admin-preview-product">
                <small>
                  {
                    form.product_label
                  }
                </small>

                <strong>
                  {
                    form.product_title
                  }
                </strong>

                <span>
                  Starting from
                  <b>
                    {
                      form.product_price
                    }
                  </b>
                </span>
              </div>

              {secondaryImageSrc && (
                <img
                  className="hero-admin-preview-secondary"
                  src={
                    secondaryImageSrc
                  }
                  alt=""
                />
              )}

            </div>

          </div>

        </div>

        {/* SAVE */}

        <div className="hero-admin-save-bar">

          <div>
            <strong>
              Home Hero Settings
            </strong>

            <span>
              Save changes to update
              the home page.
            </span>
          </div>

          <button
            type="submit"
            disabled={saving}
          >
            {saving ? (
              <>
                <RefreshCw
                  size={18}
                  className="hero-admin-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <Save
                  size={18}
                />
                Save Changes
              </>
            )}
          </button>

        </div>

      </form>

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| REUSABLE FIELD
|--------------------------------------------------------------------------
*/

const Field = ({
  label,
  name,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="hero-admin-field">

      <label>
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={
          placeholder
        }
      />

    </div>
  );
};

export default HomeBanner;