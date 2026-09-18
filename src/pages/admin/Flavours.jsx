import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Edit3,
  Plus,
  Search,
  X,
  LoaderCircle,
  CakeSlice,
} from "lucide-react";

const API_BASE =
  "https://coreops.pk/cakes/api/Flavours";

const Flavours = () => {
  const [flavours, setFlavours] =
    useState([]);

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const [
    editingFlavour,
    setEditingFlavour,
  ] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [
    formData,
    setFormData,
  ] = useState({
    name: "",
    status: "Active",
  });

  // ==========================================
  // FETCH FLAVOURS
  // ==========================================

  const fetchFlavours =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `${API_BASE}/getAll.php`,
            {
              method: "GET",
            }
          );

        let result;

        try {
          result =
            await response.json();
        } catch {
          throw new Error(
            "Server returned an invalid response."
          );
        }

        if (
          !response.ok ||
          result.status !==
            "success"
        ) {
          throw new Error(
            result.message ||
              "Unable to fetch flavours."
          );
        }

        const apiFlavours =
          Array.isArray(
            result.data
          )
            ? result.data
            : [];

        const formattedFlavours =
          apiFlavours.map(
            (flavour) => ({
              id: Number(
                flavour.id
              ),

              name:
                flavour.name ||
                "",

              status:
                flavour.status ||
                "Active",

              created_at:
                flavour.created_at ||
                null,

              updated_at:
                flavour.updated_at ||
                null,
            })
          );

        setFlavours(
          formattedFlavours
        );
      } catch (err) {
        console.error(
          "Fetch flavours error:",
          err
        );

        setFlavours([]);

        setError(
          err.message ||
            "Unable to load flavours."
        );
      } finally {
        setLoading(false);
      }
    };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchFlavours();
  }, []);

  // ==========================================
  // FILTER
  // ==========================================

  const filteredFlavours =
    useMemo(() => {
      const search =
        searchTerm
          .trim()
          .toLowerCase();

      if (!search) {
        return flavours;
      }

      return flavours.filter(
        (flavour) =>
          flavour.name
            .toLowerCase()
            .includes(search)
      );
    }, [
      flavours,
      searchTerm,
    ]);

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setFormData({
      name: "",
      status: "Active",
    });

    setEditingFlavour(null);
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

  const openEditModal = (
    flavour
  ) => {
    setEditingFlavour(
      flavour
    );

    setFormData({
      name:
        flavour.name || "",

      status:
        flavour.status ||
        "Active",
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

  const handleChange = (
    event
  ) => {
    const { name, value } =
      event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  // ==========================================
  // ADD / UPDATE FLAVOUR
  // ==========================================

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");
      setSuccess("");

      const cleanName =
        formData.name.trim();

      if (!cleanName) {
        setError(
          "Flavour name is required."
        );

        return;
      }

      try {
        setSaving(true);

        const isEditing =
          Boolean(
            editingFlavour
          );

        const endpoint =
          isEditing
            ? `${API_BASE}/update.php`
            : `${API_BASE}/add.php`;

        // ======================================
        // REQUEST BODY
        // ======================================

        const requestBody = {
          name: cleanName,
          status:
            formData.status,
        };

        if (isEditing) {
          requestBody.id =
            Number(
              editingFlavour.id
            );
        }

        // ======================================
        // API CALL
        // ======================================

        const response =
          await fetch(
            endpoint,
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  requestBody
                ),
            }
          );

        let result;

        try {
          result =
            await response.json();
        } catch {
          throw new Error(
            "Server returned an invalid response."
          );
        }

        if (
          !response.ok ||
          result.status !==
            "success"
        ) {
          throw new Error(
            result.message ||
              (isEditing
                ? "Unable to update flavour."
                : "Unable to add flavour.")
          );
        }

        // ======================================
        // SUCCESS
        // ======================================

        setModalOpen(false);

        resetForm();

        setSuccess(
          isEditing
            ? "Flavour updated successfully."
            : "Flavour added successfully."
        );

        await fetchFlavours();

        window.dispatchEvent(
          new Event(
            "flavoursChanged"
          )
        );
      } catch (err) {
        console.error(
          "Save flavour error:",
          err
        );

        setError(
          err.message ||
            "Unable to save flavour."
        );
      } finally {
        setSaving(false);
      }
    };

  // ==========================================
  // ACTIVE / INACTIVE
  // ==========================================

  const toggleStatus =
    async (flavour) => {
      const newStatus =
        flavour.status ===
        "Active"
          ? "Inactive"
          : "Active";

      try {
        setError("");
        setSuccess("");

        const response =
          await fetch(
            `${API_BASE}/update.php`,
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  id: Number(
                    flavour.id
                  ),

                  name:
                    flavour.name,

                  status:
                    newStatus,
                }),
            }
          );

        let result;

        try {
          result =
            await response.json();
        } catch {
          throw new Error(
            "Server returned an invalid response."
          );
        }

        if (
          !response.ok ||
          result.status !==
            "success"
        ) {
          throw new Error(
            result.message ||
              "Unable to update flavour status."
          );
        }

        setSuccess(
          `Flavour set to ${newStatus}.`
        );

        await fetchFlavours();

        window.dispatchEvent(
          new Event(
            "flavoursChanged"
          )
        );
      } catch (err) {
        console.error(
          "Flavour status error:",
          err
        );

        setError(
          err.message ||
            "Unable to update flavour status."
        );
      }
    };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="admin-categories-page">

      {/* PAGE HEADING */}

      <div className="admin-page-heading admin-category-heading">
        <div>
          <span>
            PRODUCT MANAGEMENT
          </span>

          <h1>
            Flavours
          </h1>

          <p>
            Manage cake flavours
            available for customer
            orders.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={
            openAddModal
          }
          disabled={loading}
        >
          <Plus size={17} />
          Add Flavour
        </button>
      </div>

      {/* MESSAGES */}

      {error &&
        !modalOpen && (
          <div className="admin-category-empty">
            <p>
              {error}
            </p>
          </div>
        )}

      {success &&
        !modalOpen && (
          <div
            style={{
              marginBottom:
                "18px",

              padding:
                "12px 16px",

              border:
                "1px solid var(--border)",

              background:
                "var(--background-soft)",
            }}
          >
            {success}
          </div>
        )}

      {/* TOOLBAR */}

      <div className="admin-category-toolbar">
        <div className="admin-category-search">
          <Search
            size={17}
          />

          <input
            type="text"
            placeholder="Search flavours..."
            value={
              searchTerm
            }
            onChange={(
              event
            ) =>
              setSearchTerm(
                event.target
                  .value
              )
            }
          />
        </div>

        <span>
          {
            filteredFlavours.length
          }{" "}
          {filteredFlavours.length ===
          1
            ? "flavour"
            : "flavours"}
        </span>
      </div>

      {/* CONTENT */}

      {loading ? (
        <div className="admin-category-empty">
          <LoaderCircle
            size={28}
          />

          <h3>
            Loading flavours...
          </h3>

          <p>
            Fetching flavours
            from the database.
          </p>
        </div>
      ) : filteredFlavours.length ===
        0 ? (
        <div className="admin-category-empty">
          <h3>
            No flavours found.
          </h3>

          <p>
            Add your first cake
            flavour or change
            your search.
          </p>
        </div>
      ) : (
        <div className="admin-category-grid">
          {filteredFlavours.map(
            (flavour) => (
              <div
                className="admin-category-card"
                key={
                  flavour.id
                }
              >
                {/* VISUAL */}

                <div
                  className="admin-category-image"
                  style={{
                    display:
                      "grid",

                    placeItems:
                      "center",

                    background:
                      "var(--background-soft)",
                  }}
                >
                  <div
                    style={{
                      textAlign:
                        "center",
                    }}
                  >
                    <CakeSlice
                      size={40}
                      style={{
                        marginBottom:
                          "9px",

                        opacity:
                          0.65,
                      }}
                    />

                    <div
                      style={{
                        fontFamily:
                          "var(--serif)",

                        fontSize:
                          "22px",

                        fontWeight:
                          "600",
                      }}
                    >
                      {flavour.name}
                    </div>

                    <div
                      style={{
                        marginTop:
                          "5px",

                        fontSize:
                          "8px",

                        letterSpacing:
                          "1.2px",

                        color:
                          "var(--text-soft)",
                      }}
                    >
                      CAKE FLAVOUR
                    </div>
                  </div>

                  <span
                    className={
                      flavour.status ===
                      "Active"
                        ? "admin-category-status active"
                        : "admin-category-status inactive"
                    }
                  >
                    {
                      flavour.status
                    }
                  </span>
                </div>

                {/* CARD BODY */}

                <div className="admin-category-card-body">
                  <div>
                    <span>
                      CAKE FLAVOUR
                    </span>

                    <h3>
                      {
                        flavour.name
                      }
                    </h3>
                  </div>

                  <div className="admin-category-actions">
                    <button
                      type="button"
                      className="admin-category-status-button"
                      onClick={() =>
                        toggleStatus(
                          flavour
                        )
                      }
                    >
                      {flavour.status ===
                      "Active"
                        ? "Set Inactive"
                        : "Set Active"}
                    </button>

                    <button
                      type="button"
                      className="admin-category-icon-button"
                      onClick={() =>
                        openEditModal(
                          flavour
                        )
                      }
                      aria-label="Edit flavour"
                    >
                      <Edit3
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
          ADD / EDIT MODAL
      ====================================== */}

      {modalOpen && (
        <div
          className="admin-category-modal-overlay"
          onClick={
            closeModal
          }
        >
          <div
            className="admin-category-modal"
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
          >
            {/* HEADER */}

            <div className="admin-category-modal-header">
              <div>
                <span>
                  {editingFlavour
                    ? "EDIT FLAVOUR"
                    : "NEW FLAVOUR"}
                </span>

                <h2>
                  {editingFlavour
                    ? "Update Flavour"
                    : "Add Flavour"}
                </h2>
              </div>

              <button
                type="button"
                onClick={
                  closeModal
                }
                disabled={
                  saving
                }
              >
                <X
                  size={18}
                />
              </button>
            </div>

            {/* FORM */}

            <form
              className="admin-category-form"
              onSubmit={
                handleSubmit
              }
            >
              {/* ERROR */}

              {error && (
                <div
                  style={{
                    marginBottom:
                      "15px",

                    padding:
                      "11px 13px",

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
                  Flavour Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Chocolate"
                  value={
                    formData.name
                  }
                  disabled={
                    saving
                  }
                  onChange={
                    handleChange
                  }
                />

                <small
                  style={{
                    display:
                      "block",

                    marginTop:
                      "7px",

                    color:
                      "var(--text-soft)",

                    fontSize:
                      "9px",

                    lineHeight:
                      "1.6",
                  }}
                >
                  This flavour will
                  be available for
                  customers to select
                  while ordering a
                  cake.
                </small>
              </div>

              {/* STATUS */}

              <div className="admin-category-form-group">
                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={
                    formData.status
                  }
                  disabled={
                    saving
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

              {/* ACTIONS */}

              <div className="admin-category-modal-actions">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={
                    closeModal
                  }
                  disabled={
                    saving
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={
                    saving
                  }
                >
                  {saving ? (
                    <>
                      <LoaderCircle
                        size={16}
                      />
                      Saving...
                    </>
                  ) : editingFlavour ? (
                    "Save Changes"
                  ) : (
                    "Add Flavour"
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

export default Flavours;