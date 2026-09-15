import { useMemo, useState } from "react";
import {
  Edit3,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

const Sizes = () => {
  const [sizes, setSizes] = useState(() => {
    try {
      const saved = localStorage.getItem("cakeSizes");

      if (saved) {
        return JSON.parse(saved);
      }

      const initial = [
        {
          id: 1,
          name: "1 lb",
          status: "Active",
        },
        {
          id: 2,
          name: "2 lb",
          status: "Active",
        },
        {
          id: 3,
          name: "3 lb",
          status: "Active",
        },
      ];

      localStorage.setItem(
        "cakeSizes",
        JSON.stringify(initial)
      );

      return initial;
    } catch {
      return [];
    }
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSize, setEditingSize] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    status: "Active",
  });

  const saveSizes = (updated) => {
    setSizes(updated);

    localStorage.setItem(
      "cakeSizes",
      JSON.stringify(updated)
    );
  };

  const filteredSizes = useMemo(() => {
    return sizes.filter((size) =>
      size.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [sizes, searchTerm]);

  const resetForm = () => {
    setFormData({
      name: "",
      status: "Active",
    });

    setEditingSize(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (size) => {
    setEditingSize(size);

    setFormData({
      name: size.name,
      status: size.status,
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
      alert("Size name is required.");
      return;
    }

    const duplicate = sizes.some(
      (size) =>
        size.name.toLowerCase() ===
          formData.name.trim().toLowerCase() &&
        size.id !== editingSize?.id
    );

    if (duplicate) {
      alert("This size already exists.");
      return;
    }

    if (editingSize) {
      const updated = sizes.map((size) =>
        size.id === editingSize.id
          ? {
              ...size,
              name: formData.name.trim(),
              status: formData.status,
            }
          : size
      );

      saveSizes(updated);
    } else {
      const newSize = {
        id: Date.now(),
        name: formData.name.trim(),
        status: formData.status,
      };

      saveSizes([
        newSize,
        ...sizes,
      ]);
    }

    closeModal();
  };

  const toggleStatus = (id) => {
    const updated = sizes.map((size) =>
      size.id === id
        ? {
            ...size,
            status:
              size.status === "Active"
                ? "Inactive"
                : "Active",
          }
        : size
    );

    saveSizes(updated);
  };

  const deleteSize = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this size?"
    );

    if (!confirmed) return;

    saveSizes(
      sizes.filter(
        (size) => size.id !== id
      )
    );
  };

  return (
    <div>
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
        >
          <Plus size={17} />
          Add Size
        </button>
      </div>

      <div className="admin-master-toolbar">
        <div className="admin-master-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search sizes..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <span>
          {filteredSizes.length} sizes
        </span>
      </div>

      <div className="admin-master-table-wrapper">
        <table className="admin-master-table">
          <thead>
            <tr>
              <th>Size</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredSizes.map((size) => (
              <tr key={size.id}>
                <td>
                  <strong>{size.name}</strong>
                </td>

                <td>
                  <span
                    className={
                      size.status === "Active"
                        ? "admin-master-status active"
                        : "admin-master-status inactive"
                    }
                  >
                    {size.status}
                  </span>
                </td>

                <td>
                  <div className="admin-master-actions">
                    <button
                      type="button"
                      className="admin-category-status-button"
                      onClick={() =>
                        toggleStatus(size.id)
                      }
                    >
                      {size.status === "Active"
                        ? "Set Inactive"
                        : "Set Active"}
                    </button>

                    <button
                      type="button"
                      className="admin-category-icon-button"
                      onClick={() =>
                        openEditModal(size)
                      }
                    >
                      <Edit3 size={16} />
                    </button>

                    <button
                      type="button"
                      className="admin-category-icon-button delete"
                      onClick={() =>
                        deleteSize(size.id)
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
              >
                <X size={18} />
              </button>
            </div>

            <form
              className="admin-category-form"
              onSubmit={handleSubmit}
            >
              <div className="admin-category-form-group">
                <label>Size Name</label>

                <input
                  type="text"
                  placeholder="e.g. 4 lb"
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
                  {editingSize
                    ? "Save Changes"
                    : "Add Size"}
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