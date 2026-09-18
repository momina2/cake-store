import { useEffect, useMemo, useState } from "react";
import {
  Edit3,
  Plus,
  Search,
  X,
  LoaderCircle,
  CakeSlice,
} from "lucide-react";

const API_BASE =
  "https://coreops.pk/cakes/api/Fillings";

const Fillings = () => {
  const [fillings, setFillings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingFilling, setEditingFilling] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    charge: "",
    status: "Active",
  });

  // ==========================================
  // FETCH FILLINGS
  // ==========================================

  const fetchFillings = async () => {
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
            "Unable to fetch fillings."
        );
      }

      const apiFillings = Array.isArray(result.data)
        ? result.data
        : [];

      const formattedFillings = apiFillings.map(
        (filling) => ({
          id: Number(filling.id),

          name: filling.name || "",

          charge: Number(
            filling.charge || 0
          ),

          status:
            filling.status || "Active",

          created_at:
            filling.created_at || null,

          updated_at:
            filling.updated_at || null,
        })
      );

      setFillings(formattedFillings);
    } catch (err) {
      console.error(
        "Fetch fillings error:",
        err
      );

      setFillings([]);

      setError(
        err.message ||
          "Unable to load fillings."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchFillings();
  }, []);

  // ==========================================
  // FILTER
  // ==========================================

  const filteredFillings = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    if (!search) {
      return fillings;
    }

    return fillings.filter((filling) =>
      filling.name
        .toLowerCase()
        .includes(search)
    );
  }, [fillings, searchTerm]);

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setFormData({
      name: "",
      charge: "",
      status: "Active",
    });

    setEditingFilling(null);
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

  const openEditModal = (filling) => {
    setEditingFilling(filling);

    setFormData({
      name: filling.name || "",

      charge:
        filling.charge !== undefined
          ? String(filling.charge)
          : "",

      status:
        filling.status || "Active",
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
  // ADD / UPDATE FILLING
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanName =
      formData.name.trim();

    const chargeValue =
      Number(formData.charge);

    // ========================================
    // VALIDATION
    // ========================================

    if (!cleanName) {
      setError(
        "Filling name is required."
      );

      return;
    }

    if (
      formData.charge === "" ||
      Number.isNaN(chargeValue)
    ) {
      setError(
        "Valid filling charge is required."
      );

      return;
    }

    if (chargeValue < 0) {
      setError(
        "Filling charge cannot be negative."
      );

      return;
    }

    try {
      setSaving(true);

      const isEditing =
        Boolean(editingFilling);

      const endpoint = isEditing
        ? `${API_BASE}/update.php`
        : `${API_BASE}/add.php`;

      // ======================================
      // REQUEST BODY
      // ======================================

      const requestBody = {
        name: cleanName,
        charge: chargeValue,
        status: formData.status,
      };

      if (isEditing) {
        requestBody.id =
          Number(editingFilling.id);
      }

      // ======================================
      // API CALL
      // ======================================

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
              ? "Unable to update filling."
              : "Unable to add filling.")
        );
      }

      // ======================================
      // SUCCESS
      // ======================================

      setModalOpen(false);

      resetForm();

      setSuccess(
        isEditing
          ? "Filling updated successfully."
          : "Filling added successfully."
      );

      await fetchFillings();

      window.dispatchEvent(
        new Event("fillingsChanged")
      );
    } catch (err) {
      console.error(
        "Save filling error:",
        err
      );

      setError(
        err.message ||
          "Unable to save filling."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // ACTIVE / INACTIVE
  // ==========================================

  const toggleStatus = async (filling) => {
    const newStatus =
      filling.status === "Active"
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
            id: Number(filling.id),

            name: filling.name,

            charge: Number(
              filling.charge || 0
            ),

            status: newStatus,
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
            "Unable to update filling status."
        );
      }

      setSuccess(
        `Filling set to ${newStatus}.`
      );

      await fetchFillings();

      window.dispatchEvent(
        new Event("fillingsChanged")
      );
    } catch (err) {
      console.error(
        "Filling status error:",
        err
      );

      setError(
        err.message ||
          "Unable to update filling status."
      );
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="admin-categories-page">
      {/* ======================================
          PAGE HEADING
      ====================================== */}

      <div className="admin-page-heading admin-category-heading">
        <div>
          <span>
            PRODUCT MANAGEMENT
          </span>

          <h1>Fillings</h1>

          <p>
            Manage cake fillings and their
            additional customer charges.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={openAddModal}
          disabled={loading}
        >
          <Plus size={17} />
          Add Filling
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
            placeholder="Search fillings..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />
        </div>

        <span>
          {filteredFillings.length}{" "}
          {filteredFillings.length === 1
            ? "filling"
            : "fillings"}
        </span>
      </div>

      {/* ======================================
          LOADING
      ====================================== */}

      {loading ? (
        <div className="admin-category-empty">
          <LoaderCircle size={28} />

          <h3>
            Loading fillings...
          </h3>

          <p>
            Fetching fillings from the
            database.
          </p>
        </div>
      ) : filteredFillings.length === 0 ? (
        <div className="admin-category-empty">
          <h3>
            No fillings found.
          </h3>

          <p>
            Add your first cake filling
            or change your search.
          </p>
        </div>
      ) : (
        /* ====================================
           FILLING GRID
        ==================================== */

        <div className="admin-category-grid">
          {filteredFillings.map(
            (filling) => (
              <div
                className="admin-category-card"
                key={filling.id}
              >
                {/* ============================
                    FILLING VISUAL
                ============================ */}

                <div
                  className="admin-category-image"
                  style={{
                    display: "grid",
                    placeItems: "center",
                    background:
                      "var(--background-soft)",
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <CakeSlice
                      size={35}
                      style={{
                        marginBottom: "8px",
                        opacity: 0.65,
                      }}
                    />

                    <div
                      style={{
                        fontFamily:
                          "var(--serif)",
                        fontSize: "23px",
                        fontWeight: "600",
                      }}
                    >
                      Rs.{" "}
                      {Number(
                        filling.charge
                      ).toLocaleString()}
                    </div>

                    <div
                      style={{
                        marginTop: "4px",
                        fontSize: "8px",
                        letterSpacing:
                          "1.2px",
                        color:
                          "var(--text-soft)",
                      }}
                    >
                      ADDITIONAL CHARGE
                    </div>
                  </div>

                  <span
                    className={
                      filling.status ===
                      "Active"
                        ? "admin-category-status active"
                        : "admin-category-status inactive"
                    }
                  >
                    {filling.status}
                  </span>
                </div>

                {/* ============================
                    CARD BODY
                ============================ */}

                <div className="admin-category-card-body">
                  <div>
                    <span>
                      CAKE FILLING
                    </span>

                    <h3>
                      {filling.name}
                    </h3>
                  </div>

                  <div className="admin-category-actions">
                    <button
                      type="button"
                      className="admin-category-status-button"
                      onClick={() =>
                        toggleStatus(
                          filling
                        )
                      }
                    >
                      {filling.status ===
                      "Active"
                        ? "Set Inactive"
                        : "Set Active"}
                    </button>

                    <button
                      type="button"
                      className="admin-category-icon-button"
                      onClick={() =>
                        openEditModal(
                          filling
                        )
                      }
                      aria-label="Edit filling"
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
            {/* HEADER */}

            <div className="admin-category-modal-header">
              <div>
                <span>
                  {editingFilling
                    ? "EDIT FILLING"
                    : "NEW FILLING"}
                </span>

                <h2>
                  {editingFilling
                    ? "Update Filling"
                    : "Add Filling"}
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

            {/* FORM */}

            <form
              className="admin-category-form"
              onSubmit={handleSubmit}
            >
              {/* ERROR */}

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
                  Filling Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Nutella"
                  value={formData.name}
                  disabled={saving}
                  onChange={handleChange}
                />
              </div>

              {/* CHARGE */}

              <div className="admin-category-form-group">
                <label>
                  Additional Charge (Rs.)
                </label>

                <input
                  type="number"
                  name="charge"
                  min="0"
                  step="1"
                  placeholder="e.g. 500"
                  value={formData.charge}
                  disabled={saving}
                  onChange={handleChange}
                />

                <small
                  style={{
                    display: "block",
                    marginTop: "7px",
                    color:
                      "var(--text-soft)",
                    fontSize: "9px",
                    lineHeight: "1.6",
                  }}
                >
                  This amount will be added
                  to the cake price when the
                  customer selects this filling.
                </small>
              </div>

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
                  ) : editingFilling ? (
                    "Save Changes"
                  ) : (
                    "Add Filling"
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

export default Fillings;