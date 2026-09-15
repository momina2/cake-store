import { useEffect, useMemo, useState } from "react";
import {
  Edit3,
  ImagePlus,
  Plus,
  Search,
  Trash2,
  X,
  LoaderCircle,
} from "lucide-react";

import "./CakesAdmin.css";

const API_ROOT = "https://coreops.pk/cakes/api";

const CakesAdmin = () => {
  const [cakes, setCakes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCake, setEditingCake] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    image: "",
    galleryImages: [""],
    featured: false,
    status: "Active",
    sizes: [{ size_id: "", size: "", price: "" }],
    colors: [],
  });

  // ==========================================
  // RESPONSE HELPERS
  // ==========================================

  const readJson = async (response) => {
    try {
      return await response.json();
    } catch {
      throw new Error("Server returned an invalid response.");
    }
  };

  const getArray = (result, key) => {
    if (Array.isArray(result?.data)) return result.data;
    if (Array.isArray(result?.[key])) return result[key];
    if (Array.isArray(result?.data?.[key])) return result.data[key];
    return [];
  };

  // ==========================================
  // NORMALIZE API CAKE
  // ==========================================

  const normalizeCake = (cake) => {
    const categoryObject =
      cake.category && typeof cake.category === "object"
        ? cake.category
        : null;

    const rawImages = Array.isArray(cake.images)
      ? cake.images
      : Array.isArray(cake.gallery)
      ? cake.gallery
      : [];

    const galleryUrls = rawImages
      .map((item) =>
        typeof item === "string"
          ? item
          : item?.image_url || item?.url || ""
      )
      .filter(Boolean);

    const mainImage =
      cake.main_image ||
      cake.image ||
      rawImages.find((item) => item?.is_cover == 1)?.image_url ||
      galleryUrls[0] ||
      "";

    const allImages = [...new Set([mainImage, ...galleryUrls].filter(Boolean))];

    const rawSizes = Array.isArray(cake.sizes)
      ? cake.sizes
      : Array.isArray(cake.cake_sizes)
      ? cake.cake_sizes
      : [];

    const normalizedSizes = rawSizes.map((item) => ({
      size_id: Number(item.size_id || item.id || 0),
      size:
        item.size_name ||
        item.name ||
        item.size ||
        "",
      price: Number(item.price || 0),
      status: item.status || "Active",
    }));

    const rawColors = Array.isArray(cake.colors)
      ? cake.colors
      : Array.isArray(cake.cake_colors)
      ? cake.cake_colors
      : [];

    const normalizedColors = rawColors.map((item) => ({
      color_id: Number(item.color_id || item.id || 0),
      name:
        typeof item === "string"
          ? item
          : item.color_name || item.name || item.color || "",
      hex:
        typeof item === "string"
          ? "#ffffff"
          : item.hex_code || item.hex || "#ffffff",
      status:
        typeof item === "string"
          ? "Active"
          : item.status || "Active",
    }));

    return {
      id: Number(cake.id),
      name: cake.name || "",
      slug: cake.slug || "",
      category_id: Number(
        cake.category_id ||
          categoryObject?.id ||
          0
      ),
      category:
        categoryObject?.name ||
        cake.category_name ||
        (typeof cake.category === "string" ? cake.category : "") ||
        "",
      short_description: cake.short_description || "",
      description: cake.description || "",
      image: mainImage,
      images: allImages,
      featured:
        cake.featured === true ||
        cake.featured === 1 ||
        cake.featured === "1",
      status: cake.status || "Active",
      sort_order: Number(cake.sort_order || 0),
      sizes: normalizedSizes,
      colors: normalizedColors,
    };
  };

  // ==========================================
  // FETCH MASTER DATA + CAKES
  // ==========================================

  const fetchCategories = async () => {
    const response = await fetch(`${API_ROOT}/Categories/getAll.php`);
    const result = await readJson(response);

    if (!response.ok || result.status !== "success") {
      throw new Error(result.message || "Unable to load categories.");
    }

    const rows = getArray(result, "categories");

    setCategories(
      rows.map((item) => ({
        id: Number(item.id),
        name: item.name || "",
        status: item.status || "Active",
      }))
    );
  };

  const fetchSizes = async () => {
    const response = await fetch(`${API_ROOT}/Sizes/getAll.php`);
    const result = await readJson(response);

    if (!response.ok || result.status !== "success") {
      throw new Error(result.message || "Unable to load sizes.");
    }

    const rows = getArray(result, "sizes");

    setAvailableSizes(
      rows.map((item) => ({
        id: Number(item.id),
        name: item.name || "",
        status: item.status || "Active",
      }))
    );
  };

  const fetchColors = async () => {
    const response = await fetch(`${API_ROOT}/Colors/getAll.php`);
    const result = await readJson(response);

    if (!response.ok || result.status !== "success") {
      throw new Error(result.message || "Unable to load colors.");
    }

    const rows = getArray(result, "colors");

    setAvailableColors(
      rows.map((item) => ({
        id: Number(item.id),
        name: item.name || "",
        hex: item.hex_code || item.hex || "#ffffff",
        status: item.status || "Active",
      }))
    );
  };

  const fetchCakes = async () => {
    const response = await fetch(`${API_ROOT}/Cakes/getAll.php`);
    const result = await readJson(response);

    if (!response.ok || result.status !== "success") {
      throw new Error(result.message || "Unable to load cakes.");
    }

    const rows = getArray(result, "cakes");
    setCakes(rows.map(normalizeCake));
  };

  const loadPage = async () => {
    try {
      setLoading(true);
      setError("");

      await Promise.all([
        fetchCategories(),
        fetchSizes(),
        fetchColors(),
        fetchCakes(),
      ]);
    } catch (err) {
      console.error("Cake admin loading error:", err);
      setError(err.message || "Unable to load cake management data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, []);

  // ==========================================
  // FILTER
  // ==========================================

  const filteredCakes = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return cakes;

    return cakes.filter((cake) => {
      const cakeName = cake.name?.toLowerCase() || "";
      const categoryName = cake.category?.toLowerCase() || "";

      return (
        cakeName.includes(search) ||
        categoryName.includes(search)
      );
    });
  }, [cakes, searchTerm]);

  const activeCategories = categories.filter(
    (category) => category.status === "Active"
  );

  // ==========================================
  // FORM
  // ==========================================

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      description: "",
      image: "",
      galleryImages: [""],
      featured: false,
      status: "Active",
      sizes: [{ size_id: "", size: "", price: "" }],
      colors: [],
    });

    setEditingCake(null);
  };

  const openAddModal = () => {
    resetForm();
    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const openEditModal = (cake) => {
    setEditingCake(cake);

    const gallery = Array.isArray(cake.images)
      ? cake.images.filter((image) => image && image !== cake.image)
      : [];

    setFormData({
      name: cake.name || "",
      category: cake.category || "",
      description: cake.description || "",
      image: cake.image || "",
      galleryImages: gallery.length > 0 ? gallery : [""],
      featured: Boolean(cake.featured),
      status: cake.status || "Active",
      sizes:
        Array.isArray(cake.sizes) && cake.sizes.length > 0
          ? cake.sizes.map((item) => ({
              size_id: Number(item.size_id || 0),
              size: item.size || "",
              price:
                item.price !== undefined && item.price !== null
                  ? item.price
                  : "",
            }))
          : [{ size_id: "", size: "", price: "" }],
      colors: Array.isArray(cake.colors)
        ? cake.colors
            .map((item) => Number(item?.color_id || item?.id || 0))
            .filter(Boolean)
        : [],
    });

    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    resetForm();
    setError("");
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==========================================
  // GALLERY
  // ==========================================

  const handleGalleryImageChange = (index, value) => {
    setFormData((previous) => {
      const updatedImages = [...previous.galleryImages];
      updatedImages[index] = value;

      return {
        ...previous,
        galleryImages: updatedImages,
      };
    });
  };

  const addGalleryImage = () => {
    setFormData((previous) => ({
      ...previous,
      galleryImages: [...previous.galleryImages, ""],
    }));
  };

  const removeGalleryImage = (index) => {
    setFormData((previous) => {
      if (previous.galleryImages.length === 1) {
        return {
          ...previous,
          galleryImages: [""],
        };
      }

      return {
        ...previous,
        galleryImages: previous.galleryImages.filter(
          (_, itemIndex) => itemIndex !== index
        ),
      };
    });
  };

  // ==========================================
  // SIZES
  // ==========================================

  const handleSizeChange = (index, field, value) => {
    setFormData((previous) => {
      const updatedSizes = [...previous.sizes];

      updatedSizes[index] = {
        ...updatedSizes[index],
        [field]: value,
      };

      return {
        ...previous,
        sizes: updatedSizes,
      };
    });
  };

  const addSizeRow = () => {
    const selectedSizeIds = formData.sizes
      .map((item) => Number(item.size_id))
      .filter(Boolean);

    const firstAvailableSize = availableSizes.find(
      (size) =>
        size.status === "Active" &&
        !selectedSizeIds.includes(Number(size.id))
    );

    if (!firstAvailableSize) {
      alert("All active sizes are already selected.");
      return;
    }

    setFormData((previous) => ({
      ...previous,
      sizes: [
        ...previous.sizes,
        {
          size_id: Number(firstAvailableSize.id),
          size: firstAvailableSize.name,
          price: "",
        },
      ],
    }));
  };

  const removeSizeRow = (index) => {
    if (formData.sizes.length === 1) return;

    setFormData((previous) => ({
      ...previous,
      sizes: previous.sizes.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  };

  // ==========================================
  // COLORS
  // ==========================================

  const toggleColor = (colorId) => {
    const id = Number(colorId);

    setFormData((previous) => {
      const alreadySelected = previous.colors.includes(id);

      return {
        ...previous,
        colors: alreadySelected
          ? previous.colors.filter((selectedId) => selectedId !== id)
          : [...previous.colors, id],
      };
    });
  };

  // ==========================================
  // BUILD API BODY
  // ==========================================

  const buildCakePayload = () => {
    const cleanName = formData.name.trim();

    if (!cleanName) {
      throw new Error("Cake name is required.");
    }

    const selectedCategory = categories.find(
      (category) => category.name === formData.category
    );

    if (!selectedCategory) {
      throw new Error("Please select a category.");
    }

    const mainImage = formData.image.trim();

    if (!mainImage) {
      throw new Error("Main cake image is required.");
    }

    const cleanSizes = formData.sizes
      .filter(
        (item) =>
          Number(item.size_id) > 0 &&
          item.price !== ""
      )
      .map((item) => ({
        size_id: Number(item.size_id),
        price: Number(item.price),
        status: "Active",
      }));

    if (cleanSizes.length === 0) {
      throw new Error(
        "Please select at least one size and enter its price."
      );
    }

    if (
      cleanSizes.some(
        (item) =>
          !item.size_id ||
          Number.isNaN(item.price) ||
          item.price <= 0
      )
    ) {
      throw new Error("Please enter valid sizes and prices.");
    }

    const sizeIds = cleanSizes.map((item) => item.size_id);

    if (new Set(sizeIds).size !== sizeIds.length) {
      throw new Error(
        "Same size cannot be selected more than once."
      );
    }

    if (!formData.colors || formData.colors.length === 0) {
      throw new Error("Please select at least one color.");
    }

    const selectedColors = formData.colors.map((colorId) => ({
      color_id: Number(colorId),
      status: "Active",
    }));

    if (
      selectedColors.some(
        (item) =>
          !item.color_id ||
          !availableColors.some(
            (color) => Number(color.id) === item.color_id
          )
      )
    ) {
      throw new Error("One or more selected colors are invalid.");
    }

    const cleanGallery = formData.galleryImages
      .map((image) => image.trim())
      .filter(
        (image) =>
          image &&
          image !== mainImage
      );

    const uniqueGallery = [...new Set(cleanGallery)];

    const images = uniqueGallery.map((imageUrl, index) => ({
      image_url: imageUrl,
      alt_text: `${cleanName} image ${index + 2}`,
      is_cover: 0,
      sort_order: index + 1,
    }));

    return {
      category_id: Number(selectedCategory.id),
      name: cleanName,
      slug: editingCake?.slug || "",
      short_description: editingCake?.short_description || "",
      description: formData.description.trim(),
      main_image: mainImage,
      featured: formData.featured ? 1 : 0,
      status: formData.status,
      sort_order: Number(editingCake?.sort_order || 0),
      images,
      sizes: cleanSizes,
      colors: selectedColors,
    };
  };

  // ==========================================
  // ADD / UPDATE CAKE
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = buildCakePayload();
      const isEditing = Boolean(editingCake);

      if (isEditing) {
        payload.id = Number(editingCake.id);
      }

      const response = await fetch(
        `${API_ROOT}/Cakes/${isEditing ? "update.php" : "add.php"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await readJson(response);

      if (!response.ok || result.status !== "success") {
        throw new Error(
          result.message ||
            (isEditing
              ? "Unable to update cake."
              : "Unable to add cake.")
        );
      }

      setModalOpen(false);
      resetForm();

      setSuccess(
        isEditing
          ? "Cake updated successfully."
          : "Cake added successfully."
      );

      await fetchCakes();

      window.dispatchEvent(new Event("cakesChanged"));
    } catch (err) {
      console.error("Save cake error:", err);
      setError(err.message || "Unable to save cake.");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // STATUS VIA update.php
  // ==========================================

  const toggleStatus = async (cake) => {
    try {
      setStatusUpdatingId(cake.id);
      setError("");
      setSuccess("");

      const newStatus =
        cake.status === "Active" ? "Inactive" : "Active";

      const payload = {
        id: Number(cake.id),
        category_id: Number(cake.category_id),
        name: cake.name,
        slug: cake.slug || "",
        short_description: cake.short_description || "",
        description: cake.description || "",
        main_image: cake.image || "",
        featured: cake.featured ? 1 : 0,
        status: newStatus,
        sort_order: Number(cake.sort_order || 0),

        images: (cake.images || [])
          .filter((image) => image && image !== cake.image)
          .map((image, index) => ({
            image_url: image,
            alt_text: `${cake.name} image ${index + 2}`,
            is_cover: 0,
            sort_order: index + 1,
          })),

        sizes: (cake.sizes || []).map((item) => ({
          size_id: Number(item.size_id),
          price: Number(item.price),
          status: item.status || "Active",
        })),

        colors: (cake.colors || []).map((item) => ({
          color_id: Number(item.color_id),
          status: item.status || "Active",
        })),
      };

      if (!payload.category_id) {
        throw new Error("Cake category information is missing.");
      }

      const response = await fetch(
        `${API_ROOT}/Cakes/update.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await readJson(response);

      if (!response.ok || result.status !== "success") {
        throw new Error(
          result.message || "Unable to update cake status."
        );
      }

      setSuccess(`Cake set to ${newStatus}.`);

      await fetchCakes();

      window.dispatchEvent(new Event("cakesChanged"));
    } catch (err) {
      console.error("Cake status error:", err);
      setError(
        err.message || "Unable to update cake status."
      );
    } finally {
      setStatusUpdatingId(null);
    }
  };

  // ==========================================
  // STARTING PRICE
  // ==========================================

  const getStartingPrice = (cake) => {
    if (!Array.isArray(cake.sizes) || cake.sizes.length === 0) {
      return 0;
    }

    const prices = cake.sizes
      .map((item) => Number(item.price))
      .filter((price) => !Number.isNaN(price));

    return prices.length > 0 ? Math.min(...prices) : 0;
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="cakes-admin-page">
      <div className="cakes-admin-heading">
        <div>
          <span className="cakes-admin-kicker">
            PRODUCT MANAGEMENT
          </span>

          <h1>Cakes</h1>

          <p>
            Manage cakes, multiple images, categories,
            size-wise prices, colors and availability.
          </p>
        </div>

        <button
          type="button"
          className="cakes-admin-primary-btn"
          onClick={openAddModal}
          disabled={loading}
        >
          <Plus size={17} />
          Add Cake
        </button>
      </div>

      {success && !modalOpen && (
        <div
          style={{
            marginBottom: "18px",
            padding: "12px 16px",
            border: "1px solid var(--border)",
            background: "var(--background-soft)",
          }}
        >
          {success}
        </div>
      )}

      {error && !modalOpen && (
        <div
          style={{
            marginBottom: "18px",
            padding: "12px 16px",
            border: "1px solid var(--border)",
            background: "var(--background-soft)",
          }}
        >
          {error}
        </div>
      )}

      <div className="cakes-admin-toolbar">
        <div className="cakes-admin-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search cakes or categories..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <span>{filteredCakes.length} Cakes</span>
      </div>

      {loading ? (
        <div className="cakes-admin-empty">
          <LoaderCircle size={30} />
          <h2>Loading Cakes...</h2>
          <p>Fetching cakes and product settings from database.</p>
        </div>
      ) : filteredCakes.length === 0 ? (
        <div className="cakes-admin-empty">
          <h2>No Cakes Found</h2>
          <p>Add a cake or change your search.</p>
        </div>
      ) : (
        <div className="cakes-admin-grid">
          {filteredCakes.map((cake) => (
            <div
              className="cakes-admin-card"
              key={cake.id}
            >
              <div className="cakes-admin-card-image">
                {cake.image ? (
                  <img
                    src={cake.image}
                    alt={cake.name}
                  />
                ) : (
                  <div className="cakes-admin-no-options">
                    No Image
                  </div>
                )}

                <div className="cakes-admin-badges">
                  {cake.featured && (
                    <span className="cakes-admin-featured-badge">
                      Featured
                    </span>
                  )}

                  <span
                    className={`cakes-admin-status-badge ${
                      cake.status === "Active"
                        ? "active"
                        : "inactive"
                    }`}
                  >
                    {cake.status || "Active"}
                  </span>
                </div>

                <div className="cakes-admin-image-count">
                  <ImagePlus size={13} />
                  {cake.images?.length || 1} Images
                </div>
              </div>

              <div className="cakes-admin-card-body">
                <span className="cakes-admin-category-name">
                  {cake.category}
                </span>

                <h3>{cake.name}</h3>

                <p className="cakes-admin-description">
                  {cake.description ||
                    "No description available."}
                </p>

                <div className="cakes-admin-meta">
                  <div>
                    <span>Sizes</span>
                    <strong>{cake.sizes?.length || 0}</strong>
                  </div>

                  <div>
                    <span>Colors</span>
                    <strong>{cake.colors?.length || 0}</strong>
                  </div>

                  <div>
                    <span>Starting</span>
                    <strong>
                      Rs.{" "}
                      {getStartingPrice(cake).toLocaleString()}
                    </strong>
                  </div>
                </div>

                <div className="cakes-admin-size-summary">
                  {cake.sizes?.map((item, index) => (
                    <span key={`${item.size}-${index}`}>
                      {item.size} — Rs.{" "}
                      {Number(item.price).toLocaleString()}
                    </span>
                  ))}
                </div>

                <div className="cakes-admin-color-summary">
                  {cake.colors?.map((color, index) => (
                    <span key={`${color.color_id}-${index}`}>
                      {color.name}
                    </span>
                  ))}
                </div>

                <div className="cakes-admin-actions">
                  <button
                    type="button"
                    className="cakes-admin-status-btn"
                    disabled={statusUpdatingId === cake.id}
                    onClick={() => toggleStatus(cake)}
                  >
                    {statusUpdatingId === cake.id
                      ? "Updating..."
                      : cake.status === "Active"
                      ? "Set Inactive"
                      : "Set Active"}
                  </button>

                  <button
                    type="button"
                    className="cakes-admin-icon-btn"
                    onClick={() => openEditModal(cake)}
                    title="Edit Cake"
                  >
                    <Edit3 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div
          className="cakes-admin-modal-overlay"
          onClick={closeModal}
        >
          <div
            className="cakes-admin-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cakes-admin-modal-header">
              <div>
                <span>
                  {editingCake ? "EDIT CAKE" : "NEW CAKE"}
                </span>

                <h2>
                  {editingCake ? "Update Cake" : "Add New Cake"}
                </h2>
              </div>

              <button
                type="button"
                className="cakes-admin-close-btn"
                onClick={closeModal}
                disabled={saving}
              >
                <X size={19} />
              </button>
            </div>

            <form
              className="cakes-admin-form"
              onSubmit={handleSubmit}
            >
              {error && (
                <div
                  style={{
                    marginBottom: "16px",
                    padding: "12px 14px",
                    border: "1px solid var(--border)",
                    background: "var(--background-soft)",
                  }}
                >
                  {error}
                </div>
              )}

              <div className="cakes-admin-form-grid">
                <div className="cakes-admin-field">
                  <label>Cake Name</label>

                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Lotus Celebration Cake"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>

                <div className="cakes-admin-field">
                  <label>Category</label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={saving}
                  >
                    <option value="">
                      Select Category
                    </option>

                    {activeCategories.map((category) => (
                      <option
                        key={category.id}
                        value={category.name}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="cakes-admin-field">
                <label>Description</label>

                <textarea
                  name="description"
                  rows="4"
                  placeholder="Write a short cake description..."
                  value={formData.description}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              <div className="cakes-admin-section">
                <div className="cakes-admin-section-heading">
                  <div>
                    <span>PRODUCT IMAGES</span>
                    <h3>Cake Gallery</h3>
                  </div>

                  <button
                    type="button"
                    onClick={addGalleryImage}
                    disabled={saving}
                  >
                    <Plus size={14} />
                    Add Image
                  </button>
                </div>

                <div className="cakes-admin-field">
                  <label>Main Image URL</label>

                  <input
                    type="text"
                    name="image"
                    placeholder="https://..."
                    value={formData.image}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>

                {formData.image && (
                  <div className="cakes-admin-main-image-preview">
                    <div className="cakes-admin-preview-label">
                      Main Image
                    </div>

                    <img
                      src={formData.image}
                      alt="Main cake preview"
                    />
                  </div>
                )}

                <div className="cakes-admin-gallery-heading">
                  Additional Images
                </div>

                <div className="cakes-admin-gallery-rows">
                  {formData.galleryImages.map((image, index) => (
                    <div
                      className="cakes-admin-gallery-row"
                      key={index}
                    >
                      <div className="cakes-admin-gallery-input">
                        <input
                          type="text"
                          placeholder={`Gallery Image ${
                            index + 1
                          } URL`}
                          value={image}
                          disabled={saving}
                          onChange={(event) =>
                            handleGalleryImageChange(
                              index,
                              event.target.value
                            )
                          }
                        />

                        <button
                          type="button"
                          disabled={saving}
                          onClick={() =>
                            removeGalleryImage(index)
                          }
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {image && (
                        <div className="cakes-admin-gallery-preview">
                          <img
                            src={image}
                            alt={`Gallery ${index + 1}`}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="cakes-admin-section">
                <div className="cakes-admin-section-heading">
                  <div>
                    <span>PRICING</span>
                    <h3>Sizes & Prices</h3>
                  </div>

                  <button
                    type="button"
                    onClick={addSizeRow}
                    disabled={
                      saving ||
                      availableSizes.filter((size) => size.status === "Active").length === 0
                    }
                  >
                    <Plus size={14} />
                    Add Size
                  </button>
                </div>

                {availableSizes.filter((size) => size.status === "Active").length === 0 ? (
                  <div className="cakes-admin-no-options">
                    No active sizes available. First add sizes
                    from Admin → Sizes.
                  </div>
                ) : (
                  <div className="cakes-admin-size-rows">
                    {formData.sizes.map((item, index) => (
                      <div
                        className="cakes-admin-size-row"
                        key={index}
                      >
                        <select
                          value={item.size_id || ""}
                          disabled={saving}
                          onChange={(event) => {
                            const id = Number(event.target.value);
                            const selected = availableSizes.find(
                              (size) => Number(size.id) === id
                            );

                            setFormData((previous) => {
                              const updatedSizes = [...previous.sizes];
                              updatedSizes[index] = {
                                ...updatedSizes[index],
                                size_id: id || "",
                                size: selected?.name || "",
                              };
                              return {
                                ...previous,
                                sizes: updatedSizes,
                              };
                            });
                          }}
                        >
                          <option value="">
                            Select Size
                          </option>

                          {availableSizes
                            .filter(
                              (size) =>
                                size.status === "Active" ||
                                Number(size.id) === Number(item.size_id)
                            )
                            .map((size) => {
                              const usedByAnotherRow =
                                formData.sizes.some(
                                  (selectedItem, selectedIndex) =>
                                    selectedIndex !== index &&
                                    Number(selectedItem.size_id) ===
                                      Number(size.id)
                                );

                              return (
                                <option
                                  key={size.id}
                                  value={size.id}
                                  disabled={usedByAnotherRow}
                                >
                                  {size.name}
                                  {size.status !== "Active"
                                    ? " (Inactive)"
                                    : ""}
                                </option>
                              );
                            })}
                        </select>

                        <input
                          type="number"
                          min="1"
                          placeholder="Price"
                          value={item.price}
                          disabled={saving}
                          onChange={(event) =>
                            handleSizeChange(
                              index,
                              "price",
                              event.target.value
                            )
                          }
                        />

                        <button
                          type="button"
                          className="cakes-admin-row-delete"
                          disabled={
                            saving ||
                            formData.sizes.length === 1
                          }
                          onClick={() =>
                            removeSizeRow(index)
                          }
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="cakes-admin-section">
                <div className="cakes-admin-section-heading">
                  <div>
                    <span>DESIGN OPTIONS</span>
                    <h3>Available Colors</h3>
                  </div>

                  <small>
                    {formData.colors.length} selected
                  </small>
                </div>

                {availableColors.filter((color) => color.status === "Active").length === 0 ? (
                  <div className="cakes-admin-no-options">
                    No active colors available. First add colors
                    from Admin → Colors.
                  </div>
                ) : (
                  <div className="cakes-admin-color-grid">
                    {availableColors
                      .filter(
                        (color) =>
                          color.status === "Active" ||
                          formData.colors.includes(Number(color.id))
                      )
                      .map((color) => {
                        const colorId = Number(color.id);
                        const selected =
                          formData.colors.includes(colorId);
                        const inactive =
                          color.status !== "Active";

                        return (
                          <button
                            key={color.id}
                            type="button"
                            disabled={saving || (inactive && !selected)}
                            className={`cakes-admin-color-option ${
                              selected ? "selected" : ""
                            }`}
                            onClick={() => toggleColor(colorId)}
                          >
                            <span
                              className="cakes-admin-color-dot"
                              style={{
                                backgroundColor:
                                  color.hex || "#ffffff",
                              }}
                            />

                            <span className="cakes-admin-color-label">
                              {color.name}
                              {inactive ? " (Inactive)" : ""}
                            </span>

                            {selected && <strong>✓</strong>}
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>

              <div className="cakes-admin-form-grid">
                <div className="cakes-admin-field">
                  <label>Status</label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={saving}
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>
                </div>

                <div className="cakes-admin-featured-wrapper">
                  <span>DISPLAY</span>

                  <label className="cakes-admin-featured-toggle">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      disabled={saving}
                    />

                    <span>
                      Show as Featured Cake
                    </span>
                  </label>
                </div>
              </div>

              <div className="cakes-admin-modal-actions">
                <button
                  type="button"
                  className="cakes-admin-secondary-btn"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="cakes-admin-primary-btn"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <LoaderCircle size={16} />
                      Saving...
                    </>
                  ) : editingCake ? (
                    "Save Changes"
                  ) : (
                    "Add Cake"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CakesAdmin;
