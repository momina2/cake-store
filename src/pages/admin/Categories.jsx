import { useMemo, useState } from "react";
import {
  Edit3,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { categories as defaultCategories } from "../../data/categories";

const Categories = () => {
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem("cakeCategories");

      if (saved) {
        return JSON.parse(saved);
      }

      const initial = defaultCategories.map((item) => ({
        ...item,
        status: "Active",
      }));

      localStorage.setItem(
        "cakeCategories",
        JSON.stringify(initial)
      );

      return initial;
    } catch {
      return [];
    }
  });

  const [searchTerm, setSearchTerm] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    status: "Active",
  });

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const saveCategories = (updated) => {
    setCategories(updated);

    localStorage.setItem(
      "cakeCategories",
      JSON.stringify(updated)
    );
  };

  const resetForm = () => {
    setFormData({
      name: "",
      image: "",
      status: "Active",
    });

    setEditingCategory(null);
  };

  const openAddModal = () => {
    resetForm();

    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);

    setFormData({
      name: category.name,
      image: category.image,
      status: category.status || "Active",
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);

    resetForm();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      alert("Category name is required.");
      return;
    }

    if (!formData.image.trim()) {
      alert("Category image URL is required.");
      return;
    }

    if (editingCategory) {
      const updated = categories.map((category) =>
        category.id === editingCategory.id
          ? {
              ...category,
              name: formData.name,
              image: formData.image,
              status: formData.status,
            }
          : category
      );

      saveCategories(updated);
    } else {
      const newCategory = {
        id: Date.now(),
        name: formData.name,
        image: formData.image,
        status: formData.status,
      };

      saveCategories([
        newCategory,
        ...categories,
      ]);
    }

    closeModal();
  };

  const handleDelete = (categoryId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    const updated = categories.filter(
      (category) => category.id !== categoryId
    );

    saveCategories(updated);
  };

  const toggleStatus = (categoryId) => {
    const updated = categories.map((category) =>
      category.id === categoryId
        ? {
            ...category,
            status:
              category.status === "Active"
                ? "Inactive"
                : "Active",
          }
        : category
    );

    saveCategories(updated);
  };

  return (
    <div className="admin-categories-page">
      <div className="admin-page-heading admin-category-heading">
        <div>
          <span>PRODUCT MANAGEMENT</span>

          <h1>Categories</h1>

          <p>
            Organize cakes into beautiful customer-facing collections.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={openAddModal}
        >
          <Plus size={17} />
          Add Category
        </button>
      </div>

      <div className="admin-category-toolbar">
        <div className="admin-category-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <span>
          {filteredCategories.length} categories
        </span>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="admin-category-empty">
          <h3>No categories found.</h3>

          <p>
            Add a new category or change your search.
          </p>
        </div>
      ) : (
        <div className="admin-category-grid">
          {filteredCategories.map((category) => (
            <div
              className="admin-category-card"
              key={category.id}
            >
              <div className="admin-category-image">
                <img
                  src={category.image}
                  alt={category.name}
                />

                <span
                  className={
                    category.status === "Active"
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

                  <h3>{category.name}</h3>
                </div>

                <div className="admin-category-actions">
                  <button
                    type="button"
                    className="admin-category-status-button"
                    onClick={() =>
                      toggleStatus(category.id)
                    }
                  >
                    {category.status === "Active"
                      ? "Set Inactive"
                      : "Set Active"}
                  </button>

                  <button
                    type="button"
                    className="admin-category-icon-button"
                    onClick={() =>
                      openEditModal(category)
                    }
                    aria-label="Edit category"
                  >
                    <Edit3 size={16} />
                  </button>

                  <button
                    type="button"
                    className="admin-category-icon-button delete"
                    onClick={() =>
                      handleDelete(category.id)
                    }
                    aria-label="Delete category"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
              >
                <X size={18} />
              </button>
            </div>

            <form
              className="admin-category-form"
              onSubmit={handleSubmit}
            >
              <div className="admin-category-form-group">
                <label>Category Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Anniversary Cakes"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-category-form-group">
                <label>Image URL</label>

                <input
                  type="text"
                  name="image"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={handleChange}
                />
              </div>

              {formData.image && (
                <div className="admin-category-image-preview">
                  <img
                    src={formData.image}
                    alt="Preview"
                  />
                </div>
              )}

              <div className="admin-category-form-group">
                <label>Status</label>

                <select
                  name="status"
                  value={formData.status}
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
                  {editingCategory
                    ? "Save Changes"
                    : "Add Category"}
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