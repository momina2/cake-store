import { useMemo, useState } from "react";
import {
  Edit3,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

const Colors = () => {
  const [colors, setColors] = useState(() => {
    try {
      const saved = localStorage.getItem("cakeColors");

      if (saved) {
        return JSON.parse(saved);
      }

      const initial = [
        {
          id: 1,
          name: "White",
          hex: "#ffffff",
          status: "Active",
        },
        {
          id: 2,
          name: "Pink",
          hex: "#e9b7c3",
          status: "Active",
        },
        {
          id: 3,
          name: "Chocolate",
          hex: "#6b4436",
          status: "Active",
        },
      ];

      localStorage.setItem(
        "cakeColors",
        JSON.stringify(initial)
      );

      return initial;
    } catch {
      return [];
    }
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingColor, setEditingColor] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    hex: "#ffffff",
    status: "Active",
  });

  const filteredColors = useMemo(() => {
    return colors.filter((color) =>
      color.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [colors, searchTerm]);

  const saveColors = (updated) => {
    setColors(updated);

    localStorage.setItem(
      "cakeColors",
      JSON.stringify(updated)
    );
  };

  const resetForm = () => {
    setEditingColor(null);

    setFormData({
      name: "",
      hex: "#ffffff",
      status: "Active",
    });
  };

  const openAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (color) => {
    setEditingColor(color);

    setFormData({
      name: color.name,
      hex: color.hex || "#ffffff",
      status: color.status,
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      alert("Color name is required.");
      return;
    }

    const duplicate = colors.some(
      (color) =>
        color.name.toLowerCase() ===
          formData.name.trim().toLowerCase() &&
        color.id !== editingColor?.id
    );

    if (duplicate) {
      alert("This color already exists.");
      return;
    }

    if (editingColor) {
      saveColors(
        colors.map((color) =>
          color.id === editingColor.id
            ? {
                ...color,
                ...formData,
                name: formData.name.trim(),
              }
            : color
        )
      );
    } else {
      saveColors([
        {
          id: Date.now(),
          ...formData,
          name: formData.name.trim(),
        },
        ...colors,
      ]);
    }

    closeModal();
  };

  const toggleStatus = (id) => {
    saveColors(
      colors.map((color) =>
        color.id === id
          ? {
              ...color,
              status:
                color.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : color
      )
    );
  };

  const deleteColor = (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this color?"
      )
    ) {
      return;
    }

    saveColors(
      colors.filter(
        (color) => color.id !== id
      )
    );
  };

  return (
    <div>
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
        >
          <Plus size={17} />
          Add Color
        </button>
      </div>

      <div className="admin-master-toolbar">
        <div className="admin-master-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search colors..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <span>
          {filteredColors.length} colors
        </span>
      </div>

      <div className="admin-master-table-wrapper">
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
            {filteredColors.map((color) => (
              <tr key={color.id}>
                <td>
                  <strong>{color.name}</strong>
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
                      color.status === "Active"
                        ? "admin-master-status active"
                        : "admin-master-status inactive"
                    }
                  >
                    {color.status}
                  </span>
                </td>

                <td>
                  <div className="admin-master-actions">
                    <button
                      type="button"
                      className="admin-category-status-button"
                      onClick={() =>
                        toggleStatus(color.id)
                      }
                    >
                      {color.status === "Active"
                        ? "Set Inactive"
                        : "Set Active"}
                    </button>

                    <button
                      type="button"
                      className="admin-category-icon-button"
                      onClick={() =>
                        openEditModal(color)
                      }
                    >
                      <Edit3 size={16} />
                    </button>

                    <button
                      type="button"
                      className="admin-category-icon-button delete"
                      onClick={() =>
                        deleteColor(color.id)
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
              >
                <X size={18} />
              </button>
            </div>

            <form
              className="admin-category-form"
              onSubmit={handleSubmit}
            >
              <div className="admin-category-form-group">
                <label>Color Name</label>

                <input
                  type="text"
                  placeholder="e.g. Sage Green"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="admin-category-form-group">
                <label>Color</label>

                <div className="admin-color-picker-field">
                  <input
                    type="color"
                    value={formData.hex}
                    onChange={(event) =>
                      setFormData((previous) => ({
                        ...previous,
                        hex: event.target.value,
                      }))
                    }
                  />

                  <input
                    type="text"
                    value={formData.hex}
                    onChange={(event) =>
                      setFormData((previous) => ({
                        ...previous,
                        hex: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="admin-category-form-group">
                <label>Status</label>

                <select
                  value={formData.status}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      status: event.target.value,
                    }))
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

              <div className="admin-category-modal-actions">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                >
                  {editingColor
                    ? "Save Changes"
                    : "Add Color"}
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