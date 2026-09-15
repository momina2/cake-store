


import { useEffect, useMemo, useState } from "react";
import {
  Edit3,
  Plus,
  Search,
  X,
  LoaderCircle,
} from "lucide-react";

const API_BASE =
  "https://coreops.pk/cakes/api/Categories";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const [editingCategory, setEditingCategory] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    status: "Active",
  });

  // ==========================================
  // GET ALL CATEGORIES FROM DATABASE
  // ==========================================

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE}/getAll.php`,
        {
          method: "GET",
        }
      );

      let result;

      try {
        result = await response.json();
      } catch {
        throw new Error(
          "Server returned an invalid response."
        );
      }

      if (
        !response.ok ||
        result.status !== "success"
      ) {
        throw new Error(
          result.message ||
            "Unable to fetch categories."
        );
      }

      // Supports common response structures:
      // { status, data: [...] }
      // { status, categories: [...] }

      const apiCategories = Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.categories)
        ? result.categories
        : [];

      const formattedCategories =
        apiCategories.map((category) => ({
          id: Number(category.id),

          name: category.name || "",

          slug: category.slug || "",

          description:
            category.description || "",

          // Database uses image_url.
          // Existing UI uses image.
          image:
            category.image_url ||
            category.image ||
            "",

          status:
            category.status || "Active",

          sort_order: Number(
            category.sort_order || 0
          ),

          created_at:
            category.created_at || null,

          updated_at:
            category.updated_at || null,
        }));

      setCategories(formattedCategories);
    } catch (err) {
      console.error(
        "Fetch categories error:",
        err
      );

      setCategories([]);

      setError(
        err.message ||
          "Unable to load categories."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD CATEGORIES
  // ==========================================

  useEffect(() => {
    fetchCategories();
  }, []);

  // ==========================================
  // FILTER
  // ==========================================

  const filteredCategories = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    if (!search) {
      return categories;
    }

    return categories.filter((category) =>
      category.name
        .toLowerCase()
        .includes(search)
    );
  }, [categories, searchTerm]);

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setFormData({
      name: "",
      image: "",
      status: "Active",
    });

    setEditingCategory(null);
  };

  // ==========================================
  // OPEN ADD MODAL
  // ==========================================

  const openAddModal = () => {
    resetForm();

    setError("");
    setSuccess("");

    setModalOpen(true);
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const openEditModal = (category) => {
    setEditingCategory(category);

    setFormData({
      name: category.name || "",
      image: category.image || "",
      status:
        category.status || "Active",
    });

    setError("");
    setSuccess("");

    setModalOpen(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    if (saving) {
      return;
    }

    setModalOpen(false);

    resetForm();
  };

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // ADD / UPDATE CATEGORY
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanName =
      formData.name.trim();

    const cleanImage =
      formData.image.trim();

    if (!cleanName) {
      setError(
        "Category name is required."
      );
      return;
    }

    if (!cleanImage) {
      setError(
        "Category image URL is required."
      );
      return;
    }

    try {
      setSaving(true);

      const isEditing =
        Boolean(editingCategory);

      const endpoint = isEditing
        ? `${API_BASE}/update.php`
        : `${API_BASE}/add.php`;

      // ========================================
      // REQUEST BODY
      // ========================================

      const requestBody = {
        name: cleanName,

        image_url: cleanImage,

        status: formData.status,
      };

      // ========================================
      // KEEP EXISTING DB VALUES WHILE EDITING
      // ========================================

      if (isEditing) {
        requestBody.id =
          Number(editingCategory.id);

        requestBody.slug =
          editingCategory.slug || "";

        requestBody.description =
          editingCategory.description || "";

        requestBody.sort_order =
          Number(
            editingCategory.sort_order || 0
          );
      } else {
        requestBody.description = "";
        requestBody.sort_order = 0;
      }

      // ========================================
      // API CALL
      // ========================================

      const response = await fetch(
        endpoint,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            requestBody
          ),
        }
      );

      let result;

      try {
        result = await response.json();
      } catch {
        throw new Error(
          "Server returned an invalid response."
        );
      }

      if (
        !response.ok ||
        result.status !== "success"
      ) {
        throw new Error(
          result.message ||
            (isEditing
              ? "Unable to update category."
              : "Unable to add category.")
        );
      }

      // ========================================
      // SUCCESS
      // ========================================

      setModalOpen(false);

      resetForm();

      setSuccess(
        isEditing
          ? "Category updated successfully."
          : "Category added successfully."
      );

      // Reload fresh database data
      await fetchCategories();

      // Let other same-tab pages know catalog changed
      window.dispatchEvent(
        new Event("categoriesChanged")
      );
    } catch (err) {
      console.error(
        "Save category error:",
        err
      );

      setError(
        err.message ||
          "Unable to save category."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // TOGGLE ACTIVE / INACTIVE
  // Uses update.php — no separate status API
  // ==========================================

  const toggleStatus = async (category) => {
    const newStatus =
      category.status === "Active"
        ? "Inactive"
        : "Active";

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_BASE}/update.php`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            id: Number(category.id),

            name: category.name,

            slug: category.slug || "",

            description:
              category.description || "",

            image_url:
              category.image || "",

            status: newStatus,

            sort_order: Number(
              category.sort_order || 0
            ),
          }),
        }
      );

      let result;

      try {
        result = await response.json();
      } catch {
        throw new Error(
          "Server returned an invalid response."
        );
      }

      if (
        !response.ok ||
        result.status !== "success"
      ) {
        throw new Error(
          result.message ||
            "Unable to update category status."
        );
      }

      setSuccess(
        `Category set to ${newStatus}.`
      );

      await fetchCategories();

      window.dispatchEvent(
        new Event("categoriesChanged")
      );
    } catch (err) {
      console.error(
        "Category status error:",
        err
      );

      setError(
        err.message ||
          "Unable to update category status."
      );
    }
  };

  // ==========================================
  // IMAGE ERROR
  // ==========================================

  const handleImageError = (event) => {
    event.currentTarget.style.display =
      "none";
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="admin-categories-page">
      <div className="admin-page-heading admin-category-heading">
        <div>
          <span>PRODUCT MANAGEMENT</span>

          <h1>Categories</h1>

          <p>
            Organize cakes into beautiful
            customer-facing collections.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={openAddModal}
          disabled={loading}
        >
          <Plus size={17} />
          Add Category
        </button>
      </div>

      {/* ======================================
          MESSAGES
      ====================================== */}

      {error && !modalOpen && (
        <div className="admin-category-empty">
          <p>{error}</p>
        </div>
      )}

      {success && !modalOpen && (
        <div
          style={{
            marginBottom: "18px",
            padding: "12px 16px",
            border:
              "1px solid var(--border)",
            background:
              "var(--background-soft)",
          }}
        >
          {success}
        </div>
      )}

      {/* ======================================
          TOOLBAR
      ====================================== */}

      <div className="admin-category-toolbar">
        <div className="admin-category-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />
        </div>

        <span>
          {filteredCategories.length}{" "}
          categories
        </span>
      </div>

      {/* ======================================
          LOADING
      ====================================== */}

      {loading ? (
        <div className="admin-category-empty">
          <LoaderCircle size={28} />

          <h3>Loading categories...</h3>

          <p>
            Fetching categories from the
            database.
          </p>
        </div>
      ) : filteredCategories.length ===
        0 ? (
        <div className="admin-category-empty">
          <h3>No categories found.</h3>

          <p>
            Add a new category or change your
            search.
          </p>
        </div>
      ) : (
        /* ====================================
           CATEGORY GRID
        ==================================== */

        <div className="admin-category-grid">
          {filteredCategories.map(
            (category) => (
              <div
                className="admin-category-card"
                key={category.id}
              >
                <div className="admin-category-image">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      onError={
                        handleImageError
                      }
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "grid",
                        placeItems: "center",
                        background:
                          "var(--background-soft)",
                      }}
                    >
                      No Image
                    </div>
                  )}

                  <span
                    className={
                      category.status ===
                      "Active"
                        ? "admin-category-status active"
                        : "admin-category-status inactive"
                    }
                  >
                    {category.status}
                  </span>
                </div>

                <div className="admin-category-card-body">
                  <div>
                    <span>COLLECTION</span>

                    <h3>
                      {category.name}
                    </h3>
                  </div>

                  <div className="admin-category-actions">
                    <button
                      type="button"
                      className="admin-category-status-button"
                      onClick={() =>
                        toggleStatus(
                          category
                        )
                      }
                    >
                      {category.status ===
                      "Active"
                        ? "Set Inactive"
                        : "Set Active"}
                    </button>

                    <button
                      type="button"
                      className="admin-category-icon-button"
                      onClick={() =>
                        openEditModal(
                          category
                        )
                      }
                      aria-label="Edit category"
                    >
                      <Edit3 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* ======================================
          ADD / EDIT MODAL
      ====================================== */}

      {modalOpen && (
        <div
          className="admin-category-modal-overlay"
          onClick={closeModal}
        >
          <div
            className="admin-category-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="admin-category-modal-header">
              <div>
                <span>
                  {editingCategory
                    ? "EDIT CATEGORY"
                    : "NEW CATEGORY"}
                </span>

                <h2>
                  {editingCategory
                    ? "Update Category"
                    : "Add Category"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
              >
                <X size={18} />
              </button>
            </div>

            <form
              className="admin-category-form"
              onSubmit={handleSubmit}
            >
              {/* ERROR INSIDE MODAL */}

              {error && (
                <div
                  style={{
                    marginBottom: "15px",
                    padding: "11px 13px",
                    border:
                      "1px solid var(--border)",
                  }}
                >
                  {error}
                </div>
              )}

              {/* NAME */}

              <div className="admin-category-form-group">
                <label>
                  Category Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Anniversary Cakes"
                  value={formData.name}
                  disabled={saving}
                  onChange={handleChange}
                />
              </div>

              {/* IMAGE */}

              <div className="admin-category-form-group">
                <label>Image URL</label>

                <input
                  type="text"
                  name="image"
                  placeholder="https://..."
                  value={formData.image}
                  disabled={saving}
                  onChange={handleChange}
                />
              </div>

              {/* IMAGE PREVIEW */}

              {formData.image && (
                <div className="admin-category-image-preview">
                  <img
                    src={formData.image}
                    alt="Preview"
                  />
                </div>
              )}

              {/* STATUS */}

              <div className="admin-category-form-group">
                <label>Status</label>

                <select
                  name="status"
                  value={formData.status}
                  disabled={saving}
                  onChange={handleChange}
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>

              {/* ACTIONS */}

              <div className="admin-category-modal-actions">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <LoaderCircle
                        size={16}
                      />
                      Saving...
                    </>
                  ) : editingCategory ? (
                    "Save Changes"
                  ) : (
                    "Add Category"
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

export default Categories;