

import { useEffect, useMemo, useState } from "react";
import {
  Edit3,
  Plus,
  Search,
  X,
  LoaderCircle,
} from "lucide-react";

const API_BASE =
  "https://coreops.pk/cakes/api/Colors";

const Colors = () => {
  const [colors, setColors] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const [editingColor, setEditingColor] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    hex: "#ffffff",
    status: "Active",
  });

  // ==========================================
  // GET ALL COLORS FROM DATABASE
  // ==========================================

  const fetchColors = async () => {
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
            "Unable to fetch colors."
        );
      }

      // Supports:
      // { status, data: [...] }
      // OR
      // { status, colors: [...] }

      const apiColors = Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.colors)
        ? result.colors
        : [];

      const formattedColors = apiColors.map(
        (color) => ({
          id: Number(color.id),

          name: color.name || "",

          // Database = hex_code
          // Frontend = hex
          hex:
            color.hex_code ||
            color.hex ||
            "#ffffff",

          status:
            color.status || "Active",

          sort_order: Number(
            color.sort_order || 0
          ),

          created_at:
            color.created_at || null,

          updated_at:
            color.updated_at || null,
        })
      );

      setColors(formattedColors);
    } catch (err) {
      console.error(
        "Fetch colors error:",
        err
      );

      setColors([]);

      setError(
        err.message ||
          "Unable to load colors."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD COLORS
  // ==========================================

  useEffect(() => {
    fetchColors();
  }, []);

  // ==========================================
  // FILTER COLORS
  // ==========================================

  const filteredColors = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    if (!search) {
      return colors;
    }

    return colors.filter((color) =>
      color.name
        .toLowerCase()
        .includes(search)
    );
  }, [colors, searchTerm]);

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setEditingColor(null);

    setFormData({
      name: "",
      hex: "#ffffff",
      status: "Active",
    });
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

  const openEditModal = (color) => {
    setEditingColor(color);

    setFormData({
      name: color.name || "",
      hex: color.hex || "#ffffff",
      status:
        color.status || "Active",
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
  // VALID HEX COLOR
  // ==========================================

  const isValidHex = (value) => {
    return /^#[0-9A-Fa-f]{6}$/.test(value);
  };

  // ==========================================
  // ADD / UPDATE COLOR
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanName =
      formData.name.trim();

    const cleanHex =
      formData.hex.trim().toUpperCase();

    // ========================================
    // VALIDATION
    // ========================================

    if (!cleanName) {
      setError(
        "Color name is required."
      );
      return;
    }

    if (!isValidHex(cleanHex)) {
      setError(
        "Please enter a valid hex color, for example #FFFFFF."
      );
      return;
    }

    const duplicate = colors.some(
      (color) =>
        color.name
          .trim()
          .toLowerCase() ===
          cleanName.toLowerCase() &&
        Number(color.id) !==
          Number(editingColor?.id || 0)
    );

    if (duplicate) {
      setError(
        "This color already exists."
      );
      return;
    }

    try {
      setSaving(true);

      const isEditing =
        Boolean(editingColor);

      const endpoint = isEditing
        ? `${API_BASE}/update.php`
        : `${API_BASE}/add.php`;

      // ========================================
      // API REQUEST BODY
      // ========================================

      const requestBody = {
        name: cleanName,

        hex_code: cleanHex,

        status: formData.status,

        sort_order: isEditing
          ? Number(
              editingColor.sort_order || 0
            )
          : 0,
      };

      if (isEditing) {
        requestBody.id =
          Number(editingColor.id);
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
              ? "Unable to update color."
              : "Unable to add color.")
        );
      }

      // ========================================
      // SUCCESS
      // ========================================

      setModalOpen(false);

      resetForm();

      setSuccess(
        isEditing
          ? "Color updated successfully."
          : "Color added successfully."
      );

      // Fresh DB data
      await fetchColors();

      // Notify other pages
      window.dispatchEvent(
        new Event("colorsChanged")
      );
    } catch (err) {
      console.error(
        "Save color error:",
        err
      );

      setError(
        err.message ||
          "Unable to save color."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // SET ACTIVE / INACTIVE
  // Uses update.php
  // ==========================================

  const toggleStatus = async (color) => {
    const newStatus =
      color.status === "Active"
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
            id: Number(color.id),

            name: color.name,

            hex_code:
              color.hex || "#FFFFFF",

            status: newStatus,

            sort_order: Number(
              color.sort_order || 0
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
            "Unable to update color status."
        );
      }

      setSuccess(
        `Color set to ${newStatus}.`
      );

      await fetchColors();

      window.dispatchEvent(
        new Event("colorsChanged")
      );
    } catch (err) {
      console.error(
        "Color status error:",
        err
      );

      setError(
        err.message ||
          "Unable to update color status."
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

          <h1>Colors</h1>

          <p>
            Manage available cake design colors.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={openAddModal}
          disabled={loading}
        >
          <Plus size={17} />
          Add Color
        </button>
      </div>

      {/* ======================================
          SUCCESS
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
          ERROR
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
            placeholder="Search colors..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />
        </div>

        <span>
          {filteredColors.length} colors
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
                Loading colors from database...
              </p>
            </div>
          </div>
        ) : (
          <table className="admin-master-table">
            <thead>
              <tr>
                <th>Color</th>
                <th>Preview</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredColors.length ===
              0 ? (
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      textAlign: "center",
                      padding: "35px",
                    }}
                  >
                    No colors found.
                  </td>
                </tr>
              ) : (
                filteredColors.map(
                  (color) => (
                    <tr key={color.id}>
                      <td>
                        <strong>
                          {color.name}
                        </strong>
                      </td>

                      <td>
                        <div className="admin-color-preview-row">
                          <span
                            className="admin-color-dot"
                            style={{
                              backgroundColor:
                                color.hex,
                            }}
                          />

                          <span>
                            {color.hex}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span
                          className={
                            color.status ===
                            "Active"
                              ? "admin-master-status active"
                              : "admin-master-status inactive"
                          }
                        >
                          {color.status}
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
                                color
                              )
                            }
                          >
                            {color.status ===
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
                                color
                              )
                            }
                            aria-label="Edit color"
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
                  {editingColor
                    ? "EDIT COLOR"
                    : "NEW COLOR"}
                </span>

                <h2>
                  {editingColor
                    ? "Update Color"
                    : "Add Color"}
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

              {/* COLOR NAME */}

              <div className="admin-category-form-group">
                <label>
                  Color Name
                </label>

                <input
                  type="text"
                  placeholder="e.g. Sage Green"
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

              {/* COLOR PICKER */}

              <div className="admin-category-form-group">
                <label>Color</label>

                <div className="admin-color-picker-field">
                  <input
                    type="color"
                    value={
                      isValidHex(
                        formData.hex
                      )
                        ? formData.hex
                        : "#ffffff"
                    }
                    disabled={saving}
                    onChange={(event) =>
                      setFormData(
                        (previous) => ({
                          ...previous,

                          hex:
                            event.target
                              .value,
                        })
                      )
                    }
                  />

                  <input
                    type="text"
                    value={formData.hex}
                    placeholder="#FFFFFF"
                    maxLength={7}
                    disabled={saving}
                    onChange={(event) =>
                      setFormData(
                        (previous) => ({
                          ...previous,

                          hex:
                            event.target
                              .value,
                        })
                      )
                    }
                  />
                </div>
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
                  ) : editingColor ? (
                    "Save Changes"
                  ) : (
                    "Add Color"
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

export default Colors;