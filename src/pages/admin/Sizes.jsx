



import { useEffect, useMemo, useState } from "react";
import {
  Edit3,
  Plus,
  Search,
  X,
  LoaderCircle,
} from "lucide-react";

const API_BASE =
  "https://coreops.pk/cakes/api/Sizes";

const Sizes = () => {
  const [sizes, setSizes] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const [editingSize, setEditingSize] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    status: "Active",
  });

  // ==========================================
  // GET ALL SIZES FROM DATABASE
  // ==========================================

  const fetchSizes = async () => {
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
            "Unable to fetch sizes."
        );
      }

      // Supports:
      // { status, data: [...] }
      // OR
      // { status, sizes: [...] }

      const apiSizes = Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.sizes)
        ? result.sizes
        : [];

      const formattedSizes = apiSizes.map(
        (size) => ({
          id: Number(size.id),

          name: size.name || "",

          status:
            size.status || "Active",

          sort_order: Number(
            size.sort_order || 0
          ),

          created_at:
            size.created_at || null,

          updated_at:
            size.updated_at || null,
        })
      );

      setSizes(formattedSizes);
    } catch (err) {
      console.error(
        "Fetch sizes error:",
        err
      );

      setSizes([]);

      setError(
        err.message ||
          "Unable to load sizes."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD SIZES
  // ==========================================

  useEffect(() => {
    fetchSizes();
  }, []);

  // ==========================================
  // FILTER SIZES
  // ==========================================

  const filteredSizes = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    if (!search) {
      return sizes;
    }

    return sizes.filter((size) =>
      size.name
        .toLowerCase()
        .includes(search)
    );
  }, [sizes, searchTerm]);

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setFormData({
      name: "",
      status: "Active",
    });

    setEditingSize(null);
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

  const openEditModal = (size) => {
    setEditingSize(size);

    setFormData({
      name: size.name || "",
      status: size.status || "Active",
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

    setError("");
  };

  // ==========================================
  // ADD / UPDATE SIZE
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanName =
      formData.name.trim();

    // ========================================
    // VALIDATION
    // ========================================

    if (!cleanName) {
      setError("Size name is required.");
      return;
    }

    // Frontend duplicate check
    const duplicate = sizes.some(
      (size) =>
        size.name
          .trim()
          .toLowerCase() ===
          cleanName.toLowerCase() &&
        Number(size.id) !==
          Number(editingSize?.id || 0)
    );

    if (duplicate) {
      setError(
        "This size already exists."
      );
      return;
    }

    try {
      setSaving(true);

      const isEditing =
        Boolean(editingSize);

      const endpoint = isEditing
        ? `${API_BASE}/update.php`
        : `${API_BASE}/add.php`;

      // ========================================
      // REQUEST BODY
      // ========================================

      const requestBody = {
        name: cleanName,

        status: formData.status,

        sort_order: isEditing
          ? Number(
              editingSize.sort_order || 0
            )
          : 0,
      };

      if (isEditing) {
        requestBody.id =
          Number(editingSize.id);
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
              ? "Unable to update size."
              : "Unable to add size.")
        );
      }

      // ========================================
      // SUCCESS
      // ========================================

      setModalOpen(false);

      resetForm();

      setSuccess(
        isEditing
          ? "Size updated successfully."
          : "Size added successfully."
      );

      // Get fresh data from database
      await fetchSizes();

      // Notify other frontend pages
      window.dispatchEvent(
        new Event("sizesChanged")
      );
    } catch (err) {
      console.error(
        "Save size error:",
        err
      );

      setError(
        err.message ||
          "Unable to save size."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // ACTIVE / INACTIVE
  // Uses update.php
  // ==========================================

  const toggleStatus = async (size) => {
    const newStatus =
      size.status === "Active"
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
            id: Number(size.id),

            name: size.name,

            status: newStatus,

            sort_order: Number(
              size.sort_order || 0
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
            "Unable to update size status."
        );
      }

      setSuccess(
        `Size set to ${newStatus}.`
      );

      // Refresh database data
      await fetchSizes();

      window.dispatchEvent(
        new Event("sizesChanged")
      );
    } catch (err) {
      console.error(
        "Size status error:",
        err
      );

      setError(
        err.message ||
          "Unable to update size status."
      );
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div>
      {/* ======================================
          PAGE HEADING
      ====================================== */}

      <div className="admin-page-heading admin-master-heading">
        <div>
          <span>PRODUCT SETTINGS</span>

          <h1>Sizes</h1>

          <p>
            Manage the cake sizes available for
            products and pricing.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={openAddModal}
          disabled={loading}
        >
          <Plus size={17} />
          Add Size
        </button>
      </div>

      {/* ======================================
          SUCCESS MESSAGE
      ====================================== */}

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
          ERROR MESSAGE
      ====================================== */}

      {error && !modalOpen && (
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
          {error}
        </div>
      )}

      {/* ======================================
          TOOLBAR
      ====================================== */}

      <div className="admin-master-toolbar">
        <div className="admin-master-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search sizes..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />
        </div>

        <span>
          {filteredSizes.length} sizes
        </span>
      </div>

      {/* ======================================
          TABLE
      ====================================== */}

      <div className="admin-master-table-wrapper">
        {loading ? (
          <div
            style={{
              minHeight: "220px",
              display: "grid",
              placeItems: "center",
              textAlign: "center",
            }}
          >
            <div>
              <LoaderCircle size={28} />

              <p>
                Loading sizes from database...
              </p>
            </div>
          </div>
        ) : (
          <table className="admin-master-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredSizes.length ===
              0 ? (
                <tr>
                  <td
                    colSpan="3"
                    style={{
                      textAlign: "center",
                      padding: "35px",
                    }}
                  >
                    No sizes found.
                  </td>
                </tr>
              ) : (
                filteredSizes.map(
                  (size) => (
                    <tr key={size.id}>
                      <td>
                        <strong>
                          {size.name}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={
                            size.status ===
                            "Active"
                              ? "admin-master-status active"
                              : "admin-master-status inactive"
                          }
                        >
                          {size.status}
                        </span>
                      </td>

                      <td>
                        <div className="admin-master-actions">
                          {/* STATUS */}

                          <button
                            type="button"
                            className="admin-category-status-button"
                            onClick={() =>
                              toggleStatus(
                                size
                              )
                            }
                          >
                            {size.status ===
                            "Active"
                              ? "Set Inactive"
                              : "Set Active"}
                          </button>

                          {/* EDIT */}

                          <button
                            type="button"
                            className="admin-category-icon-button"
                            onClick={() =>
                              openEditModal(
                                size
                              )
                            }
                            aria-label="Edit size"
                          >
                            <Edit3
                              size={16}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        )}
      </div>

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
                  {editingSize
                    ? "EDIT SIZE"
                    : "NEW SIZE"}
                </span>

                <h2>
                  {editingSize
                    ? "Update Size"
                    : "Add Size"}
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
              {/* MODAL ERROR */}

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

              {/* SIZE NAME */}

              <div className="admin-category-form-group">
                <label>Size Name</label>

                <input
                  type="text"
                  placeholder="e.g. 4 lb"
                  value={formData.name}
                  disabled={saving}
                  onChange={(event) =>
                    setFormData(
                      (previous) => ({
                        ...previous,

                        name:
                          event.target
                            .value,
                      })
                    )
                  }
                />
              </div>

              {/* STATUS */}

              <div className="admin-category-form-group">
                <label>Status</label>

                <select
                  value={formData.status}
                  disabled={saving}
                  onChange={(event) =>
                    setFormData(
                      (previous) => ({
                        ...previous,

                        status:
                          event.target
                            .value,
                      })
                    )
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
                  ) : editingSize ? (
                    "Save Changes"
                  ) : (
                    "Add Size"
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

export default Sizes;