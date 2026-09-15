import { useMemo, useState } from "react";
import {
  Edit3,
  ImagePlus,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { cakes as defaultCakes } from "../../data/cakes";
import { categories as defaultCategories } from "../../data/categories";

import "./CakesAdmin.css";

const CakesAdmin = () => {
  // ==========================================
  // CAKES
  // ==========================================

  const [cakes, setCakes] = useState(() => {
    try {
      const saved = localStorage.getItem("adminCakes");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      }

      const initial = defaultCakes.map((cake) => ({
        ...cake,
        status: cake.status || "Active",

        images:
          Array.isArray(cake.images) &&
          cake.images.length > 0
            ? cake.images
            : cake.image
            ? [cake.image]
            : [],
      }));

      localStorage.setItem(
        "adminCakes",
        JSON.stringify(initial)
      );

      return initial;
    } catch (error) {
      console.error("Cake loading error:", error);

      return [];
    }
  });

  // ==========================================
  // CATEGORIES
  // ==========================================

  const [categories] = useState(() => {
    try {
      const saved = localStorage.getItem(
        "cakeCategories"
      );

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      }

      return defaultCategories;
    } catch (error) {
      console.error(
        "Category loading error:",
        error
      );

      return defaultCategories;
    }
  });

  // ==========================================
  // SIZES
  // ==========================================

  const [availableSizes] = useState(() => {
    try {
      const saved =
        localStorage.getItem("cakeSizes");

      if (!saved) {
        return [];
      }

      const parsed = JSON.parse(saved);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter(
        (size) =>
          !size.status ||
          size.status === "Active"
      );
    } catch (error) {
      console.error(
        "Sizes loading error:",
        error
      );

      return [];
    }
  });

  // ==========================================
  // COLORS
  // ==========================================

  const [availableColors] = useState(() => {
    try {
      const saved =
        localStorage.getItem("cakeColors");

      if (!saved) {
        return [];
      }

      const parsed = JSON.parse(saved);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter(
        (color) =>
          !color.status ||
          color.status === "Active"
      );
    } catch (error) {
      console.error(
        "Colors loading error:",
        error
      );

      return [];
    }
  });

  // ==========================================
  // SEARCH
  // ==========================================

  const [searchTerm, setSearchTerm] =
    useState("");

  // ==========================================
  // MODAL
  // ==========================================

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingCake, setEditingCake] =
    useState(null);

  // ==========================================
  // FORM
  // ==========================================

  const [formData, setFormData] = useState({
    name: "",

    category: "",

    description: "",

    image: "",

    galleryImages: [""],

    featured: false,

    status: "Active",

    sizes: [
      {
        size: "",
        price: "",
      },
    ],

    colors: [],
  });

  // ==========================================
  // FILTER
  // ==========================================

  const filteredCakes = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    if (!search) {
      return cakes;
    }

    return cakes.filter((cake) => {
      const cakeName =
        cake.name?.toLowerCase() || "";

      const categoryName =
        cake.category?.toLowerCase() || "";

      return (
        cakeName.includes(search) ||
        categoryName.includes(search)
      );
    });
  }, [cakes, searchTerm]);

  // ==========================================
  // ACTIVE CATEGORIES
  // ==========================================

  const activeCategories =
    categories.filter(
      (category) =>
        !category.status ||
        category.status === "Active"
    );

  // ==========================================
  // SAVE CAKES
  // ==========================================

  const saveCakes = (updatedCakes) => {
    setCakes(updatedCakes);

    localStorage.setItem(
      "adminCakes",
      JSON.stringify(updatedCakes)
    );

    window.dispatchEvent(
      new Event("cakesChanged")
    );
  };

  // ==========================================
  // RESET
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

      sizes: [
        {
          size: "",
          price: "",
        },
      ],

      colors: [],
    });

    setEditingCake(null);
  };

  // ==========================================
  // ADD MODAL
  // ==========================================

  const openAddModal = () => {
    resetForm();

    setModalOpen(true);
  };

  // ==========================================
  // EDIT MODAL
  // ==========================================

  const openEditModal = (cake) => {
    setEditingCake(cake);

    let gallery = [];

    if (
      Array.isArray(cake.images) &&
      cake.images.length > 0
    ) {
      gallery = cake.images.filter(
        (image) => image !== cake.image
      );
    }

    setFormData({
      name: cake.name || "",

      category: cake.category || "",

      description:
        cake.description || "",

      image: cake.image || "",

      galleryImages:
        gallery.length > 0
          ? gallery
          : [""],

      featured:
        Boolean(cake.featured),

      status:
        cake.status || "Active",

      sizes:
        Array.isArray(cake.sizes) &&
        cake.sizes.length > 0
          ? cake.sizes.map((item) => ({
              size: item.size || "",

              price:
                item.price !== undefined
                  ? item.price
                  : "",
            }))
          : [
              {
                size: "",
                price: "",
              },
            ],

      colors:
        Array.isArray(cake.colors)
          ? [...cake.colors]
          : [],
    });

    setModalOpen(true);
  };

  // ==========================================
  // CLOSE
  // ==========================================

  const closeModal = () => {
    setModalOpen(false);

    resetForm();
  };

  // ==========================================
  // NORMAL CHANGE
  // ==========================================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ==========================================
  // GALLERY IMAGE CHANGE
  // ==========================================

  const handleGalleryImageChange = (
    index,
    value
  ) => {
    setFormData((previous) => {
      const updatedImages = [
        ...previous.galleryImages,
      ];

      updatedImages[index] = value;

      return {
        ...previous,

        galleryImages:
          updatedImages,
      };
    });
  };

  // ==========================================
  // ADD GALLERY IMAGE
  // ==========================================

  const addGalleryImage = () => {
    setFormData((previous) => ({
      ...previous,

      galleryImages: [
        ...previous.galleryImages,
        "",
      ],
    }));
  };

  // ==========================================
  // REMOVE GALLERY IMAGE
  // ==========================================

  const removeGalleryImage = (
    index
  ) => {
    setFormData((previous) => {
      if (
        previous.galleryImages.length ===
        1
      ) {
        return {
          ...previous,

          galleryImages: [""],
        };
      }

      return {
        ...previous,

        galleryImages:
          previous.galleryImages.filter(
            (_, itemIndex) =>
              itemIndex !== index
          ),
      };
    });
  };

  // ==========================================
  // SIZE CHANGE
  // ==========================================

  const handleSizeChange = (
    index,
    field,
    value
  ) => {
    setFormData((previous) => {
      const updatedSizes = [
        ...previous.sizes,
      ];

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

  // ==========================================
  // ADD SIZE
  // ==========================================

  const addSizeRow = () => {
    const selectedSizeNames =
      formData.sizes
        .map((item) => item.size)
        .filter(Boolean);

    const firstAvailableSize =
      availableSizes.find(
        (size) =>
          !selectedSizeNames.includes(
            size.name
          )
      );

    if (!firstAvailableSize) {
      alert(
        "All active sizes are already selected."
      );

      return;
    }

    setFormData((previous) => ({
      ...previous,

      sizes: [
        ...previous.sizes,

        {
          size: firstAvailableSize.name,

          price: "",
        },
      ],
    }));
  };

  // ==========================================
  // REMOVE SIZE
  // ==========================================

  const removeSizeRow = (index) => {
    if (formData.sizes.length === 1) {
      return;
    }

    setFormData((previous) => ({
      ...previous,

      sizes: previous.sizes.filter(
        (_, itemIndex) =>
          itemIndex !== index
      ),
    }));
  };

  // ==========================================
  // COLOR
  // ==========================================

  const toggleColor = (colorName) => {
    setFormData((previous) => {
      const alreadySelected =
        previous.colors.includes(
          colorName
        );

      return {
        ...previous,

        colors: alreadySelected
          ? previous.colors.filter(
              (color) =>
                color !== colorName
            )
          : [
              ...previous.colors,

              colorName,
            ],
      };
    });
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      alert("Cake name is required.");

      return;
    }

    if (!formData.category) {
      alert(
        "Please select a category."
      );

      return;
    }

    if (!formData.image.trim()) {
      alert(
        "Main cake image is required."
      );

      return;
    }

    const cleanSizes =
      formData.sizes
        .filter(
          (item) =>
            item.size &&
            item.size.trim() &&
            item.price !== ""
        )
        .map((item) => ({
          size:
            item.size.trim(),

          price:
            Number(item.price),
        }));

    if (cleanSizes.length === 0) {
      alert(
        "Please select at least one size and enter its price."
      );

      return;
    }

    const hasInvalidPrice =
      cleanSizes.some(
        (item) =>
          Number.isNaN(item.price) ||
          item.price <= 0
      );

    if (hasInvalidPrice) {
      alert(
        "Please enter valid prices."
      );

      return;
    }

    const sizeNames =
      cleanSizes.map(
        (item) => item.size
      );

    if (
      new Set(sizeNames).size !==
      sizeNames.length
    ) {
      alert(
        "Same size cannot be selected more than once."
      );

      return;
    }

    if (
      !formData.colors ||
      formData.colors.length === 0
    ) {
      alert(
        "Please select at least one color."
      );

      return;
    }

    // ------------------------------------------
    // CLEAN GALLERY
    // ------------------------------------------

    const cleanGallery =
      formData.galleryImages
        .map((image) =>
          image.trim()
        )
        .filter(
          (image) =>
            image &&
            image !==
              formData.image.trim()
        );

    // ------------------------------------------
    // COMPLETE IMAGE LIST
    // ------------------------------------------

    const allImages = [
      formData.image.trim(),

      ...cleanGallery,
    ];

    const uniqueImages = [
      ...new Set(allImages),
    ];

    // ------------------------------------------
    // CAKE DATA
    // ------------------------------------------

    const cakeData = {
      name:
        formData.name.trim(),

      category:
        formData.category,

      description:
        formData.description.trim(),

      image:
        formData.image.trim(),

      images:
        uniqueImages,

      featured:
        Boolean(
          formData.featured
        ),

      status:
        formData.status,

      sizes:
        cleanSizes,

      colors:
        [...formData.colors],
    };

    // ------------------------------------------
    // UPDATE
    // ------------------------------------------

    if (editingCake) {
      const updated =
        cakes.map((cake) =>
          cake.id === editingCake.id
            ? {
                ...cake,

                ...cakeData,
              }
            : cake
        );

      saveCakes(updated);
    }

    // ------------------------------------------
    // ADD
    // ------------------------------------------

    else {
      const newCake = {
        id: Date.now(),

        ...cakeData,

        createdAt:
          new Date().toISOString(),
      };

      saveCakes([
        newCake,

        ...cakes,
      ]);
    }

    closeModal();
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = (cakeId) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this cake?"
      );

    if (!confirmed) {
      return;
    }

    saveCakes(
      cakes.filter(
        (cake) =>
          cake.id !== cakeId
      )
    );
  };

  // ==========================================
  // STATUS
  // ==========================================

  const toggleStatus = (cakeId) => {
    saveCakes(
      cakes.map((cake) =>
        cake.id === cakeId
          ? {
              ...cake,

              status:
                cake.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : cake
      )
    );
  };

  // ==========================================
  // STARTING PRICE
  // ==========================================

  const getStartingPrice = (cake) => {
    if (
      !Array.isArray(cake.sizes) ||
      cake.sizes.length === 0
    ) {
      return 0;
    }

    const prices =
      cake.sizes
        .map((item) =>
          Number(item.price)
        )
        .filter(
          (price) =>
            !Number.isNaN(price)
        );

    if (prices.length === 0) {
      return 0;
    }

    return Math.min(...prices);
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="cakes-admin-page">
      {/* HEADING */}

      <div className="cakes-admin-heading">
        <div>
          <span className="cakes-admin-kicker">
            PRODUCT MANAGEMENT
          </span>

          <h1>Cakes</h1>

          <p>
            Manage cakes, multiple
            images, categories,
            size-wise prices, colors
            and availability.
          </p>
        </div>

        <button
          type="button"
          className="cakes-admin-primary-btn"
          onClick={openAddModal}
        >
          <Plus size={17} />

          Add Cake
        </button>
      </div>

      {/* TOOLBAR */}

      <div className="cakes-admin-toolbar">
        <div className="cakes-admin-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search cakes or categories..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />
        </div>

        <span>
          {filteredCakes.length} Cakes
        </span>
      </div>

      {/* EMPTY */}

      {filteredCakes.length === 0 ? (
        <div className="cakes-admin-empty">
          <h2>
            No Cakes Found
          </h2>

          <p>
            Add a cake or change your
            search.
          </p>
        </div>
      ) : (
        <div className="cakes-admin-grid">
          {filteredCakes.map(
            (cake) => (
              <div
                className="cakes-admin-card"
                key={cake.id}
              >
                {/* IMAGE */}

                <div className="cakes-admin-card-image">
                  <img
                    src={cake.image}
                    alt={cake.name}
                  />

                  <div className="cakes-admin-badges">
                    {cake.featured && (
                      <span className="cakes-admin-featured-badge">
                        Featured
                      </span>
                    )}

                    <span
                      className={`cakes-admin-status-badge ${
                        cake.status ===
                        "Active"
                          ? "active"
                          : "inactive"
                      }`}
                    >
                      {cake.status ||
                        "Active"}
                    </span>
                  </div>

                  <div className="cakes-admin-image-count">
                    <ImagePlus size={13} />

                    {cake.images?.length ||
                      1}{" "}
                    Images
                  </div>
                </div>

                {/* BODY */}

                <div className="cakes-admin-card-body">
                  <span className="cakes-admin-category-name">
                    {cake.category}
                  </span>

                  <h3>
                    {cake.name}
                  </h3>

                  <p className="cakes-admin-description">
                    {cake.description ||
                      "No description available."}
                  </p>

                  {/* META */}

                  <div className="cakes-admin-meta">
                    <div>
                      <span>
                        Sizes
                      </span>

                      <strong>
                        {cake.sizes
                          ?.length || 0}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Colors
                      </span>

                      <strong>
                        {cake.colors
                          ?.length || 0}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Starting
                      </span>

                      <strong>
                        Rs.{" "}
                        {getStartingPrice(
                          cake
                        ).toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  {/* SIZE SUMMARY */}

                  <div className="cakes-admin-size-summary">
                    {cake.sizes?.map(
                      (item, index) => (
                        <span
                          key={`${item.size}-${index}`}
                        >
                          {item.size}
                          {" — "}
                          Rs.{" "}
                          {Number(
                            item.price
                          ).toLocaleString()}
                        </span>
                      )
                    )}
                  </div>

                  {/* COLORS */}

                  <div className="cakes-admin-color-summary">
                    {cake.colors?.map(
                      (
                        color,
                        index
                      ) => (
                        <span
                          key={`${color}-${index}`}
                        >
                          {color}
                        </span>
                      )
                    )}
                  </div>

                  {/* ACTIONS */}

                  <div className="cakes-admin-actions">
                    <button
                      type="button"
                      className="cakes-admin-status-btn"
                      onClick={() =>
                        toggleStatus(
                          cake.id
                        )
                      }
                    >
                      {cake.status ===
                      "Active"
                        ? "Set Inactive"
                        : "Set Active"}
                    </button>

                    <button
                      type="button"
                      className="cakes-admin-icon-btn"
                      onClick={() =>
                        openEditModal(
                          cake
                        )
                      }
                      title="Edit Cake"
                    >
                      <Edit3
                        size={16}
                      />
                    </button>

                    <button
                      type="button"
                      className="cakes-admin-icon-btn delete"
                      onClick={() =>
                        handleDelete(
                          cake.id
                        )
                      }
                      title="Delete Cake"
                    >
                      <Trash2
                        size={16}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* ======================================
          MODAL
      ====================================== */}

      {modalOpen && (
        <div
          className="cakes-admin-modal-overlay"
          onClick={closeModal}
        >
          <div
            className="cakes-admin-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* HEADER */}

            <div className="cakes-admin-modal-header">
              <div>
                <span>
                  {editingCake
                    ? "EDIT CAKE"
                    : "NEW CAKE"}
                </span>

                <h2>
                  {editingCake
                    ? "Update Cake"
                    : "Add New Cake"}
                </h2>
              </div>

              <button
                type="button"
                className="cakes-admin-close-btn"
                onClick={closeModal}
              >
                <X size={19} />
              </button>
            </div>

            {/* FORM */}

            <form
              className="cakes-admin-form"
              onSubmit={handleSubmit}
            >
              {/* NAME + CATEGORY */}

              <div className="cakes-admin-form-grid">
                <div className="cakes-admin-field">
                  <label>
                    Cake Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Lotus Celebration Cake"
                    value={
                      formData.name
                    }
                    onChange={
                      handleChange
                    }
                  />
                </div>

                <div className="cakes-admin-field">
                  <label>
                    Category
                  </label>

                  <select
                    name="category"
                    value={
                      formData.category
                    }
                    onChange={
                      handleChange
                    }
                  >
                    <option value="">
                      Select Category
                    </option>

                    {activeCategories.map(
                      (
                        category
                      ) => (
                        <option
                          key={
                            category.id
                          }
                          value={
                            category.name
                          }
                        >
                          {
                            category.name
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              {/* DESCRIPTION */}

              <div className="cakes-admin-field">
                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  rows="4"
                  placeholder="Write a short cake description..."
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>

              {/* ======================================
                  IMAGES
              ====================================== */}

              <div className="cakes-admin-section">
                <div className="cakes-admin-section-heading">
                  <div>
                    <span>
                      PRODUCT IMAGES
                    </span>

                    <h3>
                      Cake Gallery
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={
                      addGalleryImage
                    }
                  >
                    <Plus size={14} />

                    Add Image
                  </button>
                </div>

                {/* MAIN IMAGE */}

                <div className="cakes-admin-field">
                  <label>
                    Main Image URL
                  </label>

                  <input
                    type="text"
                    name="image"
                    placeholder="https://..."
                    value={
                      formData.image
                    }
                    onChange={
                      handleChange
                    }
                  />
                </div>

                {formData.image && (
                  <div className="cakes-admin-main-image-preview">
                    <div className="cakes-admin-preview-label">
                      Main Image
                    </div>

                    <img
                      src={
                        formData.image
                      }
                      alt="Main cake preview"
                    />
                  </div>
                )}

                {/* OTHER IMAGES */}

                <div className="cakes-admin-gallery-heading">
                  Additional Images
                </div>

                <div className="cakes-admin-gallery-rows">
                  {formData.galleryImages.map(
                    (
                      image,
                      index
                    ) => (
                      <div
                        className="cakes-admin-gallery-row"
                        key={index}
                      >
                        <div className="cakes-admin-gallery-input">
                          <input
                            type="text"
                            placeholder={`Gallery Image ${
                              index +
                              1
                            } URL`}
                            value={
                              image
                            }
                            onChange={(
                              event
                            ) =>
                              handleGalleryImageChange(
                                index,

                                event
                                  .target
                                  .value
                              )
                            }
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeGalleryImage(
                                index
                              )
                            }
                          >
                            <Trash2
                              size={15}
                            />
                          </button>
                        </div>

                        {image && (
                          <div className="cakes-admin-gallery-preview">
                            <img
                              src={
                                image
                              }
                              alt={`Gallery ${
                                index +
                                1
                              }`}
                            />
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* ======================================
                  SIZES
              ====================================== */}

              <div className="cakes-admin-section">
                <div className="cakes-admin-section-heading">
                  <div>
                    <span>
                      PRICING
                    </span>

                    <h3>
                      Sizes & Prices
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={
                      addSizeRow
                    }
                    disabled={
                      availableSizes.length ===
                      0
                    }
                  >
                    <Plus size={14} />

                    Add Size
                  </button>
                </div>

                {availableSizes.length ===
                0 ? (
                  <div className="cakes-admin-no-options">
                    No active sizes
                    available. First add
                    sizes from Admin →
                    Sizes.
                  </div>
                ) : (
                  <div className="cakes-admin-size-rows">
                    {formData.sizes.map(
                      (
                        item,
                        index
                      ) => (
                        <div
                          className="cakes-admin-size-row"
                          key={
                            index
                          }
                        >
                          <select
                            value={
                              item.size
                            }
                            onChange={(
                              event
                            ) =>
                              handleSizeChange(
                                index,

                                "size",

                                event
                                  .target
                                  .value
                              )
                            }
                          >
                            <option value="">
                              Select
                              Size
                            </option>

                            {availableSizes.map(
                              (
                                size
                              ) => {
                                const usedByAnotherRow =
                                  formData.sizes.some(
                                    (
                                      selectedItem,

                                      selectedIndex
                                    ) =>
                                      selectedIndex !==
                                        index &&
                                      selectedItem.size ===
                                        size.name
                                  );

                                return (
                                  <option
                                    key={
                                      size.id
                                    }
                                    value={
                                      size.name
                                    }
                                    disabled={
                                      usedByAnotherRow
                                    }
                                  >
                                    {
                                      size.name
                                    }
                                  </option>
                                );
                              }
                            )}
                          </select>

                          <input
                            type="number"
                            min="1"
                            placeholder="Price"
                            value={
                              item.price
                            }
                            onChange={(
                              event
                            ) =>
                              handleSizeChange(
                                index,

                                "price",

                                event
                                  .target
                                  .value
                              )
                            }
                          />

                          <button
                            type="button"
                            className="cakes-admin-row-delete"
                            disabled={
                              formData
                                .sizes
                                .length ===
                              1
                            }
                            onClick={() =>
                              removeSizeRow(
                                index
                              )
                            }
                          >
                            <Trash2
                              size={15}
                            />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* ======================================
                  COLORS
              ====================================== */}

              <div className="cakes-admin-section">
                <div className="cakes-admin-section-heading">
                  <div>
                    <span>
                      DESIGN OPTIONS
                    </span>

                    <h3>
                      Available Colors
                    </h3>
                  </div>

                  <small>
                    {
                      formData
                        .colors
                        .length
                    }{" "}
                    selected
                  </small>
                </div>

                {availableColors.length ===
                0 ? (
                  <div className="cakes-admin-no-options">
                    No active colors
                    available. First add
                    colors from Admin →
                    Colors.
                  </div>
                ) : (
                  <div className="cakes-admin-color-grid">
                    {availableColors.map(
                      (
                        color
                      ) => {
                        const selected =
                          formData.colors.includes(
                            color.name
                          );

                        return (
                          <button
                            key={
                              color.id
                            }
                            type="button"
                            className={`cakes-admin-color-option ${
                              selected
                                ? "selected"
                                : ""
                            }`}
                            onClick={() =>
                              toggleColor(
                                color.name
                              )
                            }
                          >
                            <span
                              className="cakes-admin-color-dot"
                              style={{
                                backgroundColor:
                                  color.hex ||
                                  "#ffffff",
                              }}
                            />

                            <span className="cakes-admin-color-label">
                              {
                                color.name
                              }
                            </span>

                            {selected && (
                              <strong>
                                ✓
                              </strong>
                            )}
                          </button>
                        );
                      }
                    )}
                  </div>
                )}
              </div>

              {/* STATUS */}

              <div className="cakes-admin-form-grid">
                <div className="cakes-admin-field">
                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={
                      formData.status
                    }
                    onChange={
                      handleChange
                    }
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
                  <span>
                    DISPLAY
                  </span>

                  <label className="cakes-admin-featured-toggle">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={
                        formData.featured
                      }
                      onChange={
                        handleChange
                      }
                    />

                    <span>
                      Show as Featured
                      Cake
                    </span>
                  </label>
                </div>
              </div>

              {/* ACTIONS */}

              <div className="cakes-admin-modal-actions">
                <button
                  type="button"
                  className="cakes-admin-secondary-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="cakes-admin-primary-btn"
                >
                  {editingCake
                    ? "Save Changes"
                    : "Add Cake"}
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