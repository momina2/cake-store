import { useEffect, useMemo, useState } from "react";

import { useSearchParams } from "react-router-dom";

import { Search, SlidersHorizontal } from "lucide-react";

import CakeCard from "../../components/customer/CakeCard";

const API_ROOT = "https://coreops.pk/cakes/api";

const Cakes = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [cakes, setCakes] = useState([]);

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedCategoryId, setSelectedCategoryId] = useState("All");

  const [searchTerm, setSearchTerm] = useState("");

  const [sortBy, setSortBy] = useState("default");

  // ==========================================
  // NORMALIZE CAKE
  // ==========================================

  const normalizeCake = (cake) => {
    const category = typeof cake.category === "object" ? cake.category : null;

    const images = Array.isArray(cake.images)
      ? cake.images
          .map((image) =>
            typeof image === "string"
              ? image
              : image.image_url || image.url || "",
          )
          .filter(Boolean)
      : [];

    const sizes = Array.isArray(cake.sizes)
      ? cake.sizes
          .filter((size) => !size.status || size.status === "Active")
          .map((size) => ({
            id: Number(size.size_id || size.id || 0),

            size: size.size_name || size.name || size.size || "",

            name: size.size_name || size.name || size.size || "",

            price: Number(size.price || 0),
          }))
      : [];

    const colors = Array.isArray(cake.colors)
      ? cake.colors
          .filter((color) => !color.status || color.status === "Active")
          .map((color) => ({
            id: Number(color.color_id || color.id || 0),

            name: color.color_name || color.name || "",

            hex: color.hex_code || color.hex || "#ffffff",
          }))
      : [];

    return {
      id: Number(cake.id),

      name: cake.name || "",

      category: category?.name || cake.category_name || cake.category || "",

      categoryId: Number(category?.id || cake.category_id || 0),

      description: cake.description || cake.short_description || "",

      shortDescription: cake.short_description || "",

      image: cake.main_image || cake.image || images[0] || "",

      mainImage: cake.main_image || cake.image || images[0] || "",

      images,

      sizes,

      colors,

      featured: Number(cake.featured) === 1 || cake.featured === true,

      status: cake.status || "Active",
    };
  };

  // ==========================================
  // LOAD DATABASE DATA
  // ==========================================

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        setLoading(true);

        const [categoryResponse, cakeResponse] = await Promise.all([
          fetch(`${API_ROOT}/Categories/getAll.php`),

          fetch(`${API_ROOT}/Cakes/getAll.php`),
        ]);

        const categoryResult = await categoryResponse.json();

        const cakeResult = await cakeResponse.json();

        if (categoryResult.status !== "success") {
          throw new Error(
            categoryResult.message || "Unable to load categories.",
          );
        }

        if (cakeResult.status !== "success") {
          throw new Error(cakeResult.message || "Unable to load cakes.");
        }

        // ==================================
        // CATEGORIES
        // ==================================

        const categoryRows = Array.isArray(categoryResult.data)
          ? categoryResult.data
          : [];

        setCategories(
          categoryRows
            .filter((category) => category.status === "Active")
            .map((category) => ({
              id: Number(category.id),

              name: category.name || "",

              slug: category.slug || "",

              description: category.description || "",

              image: category.image_url || "",
            })),
        );

        // ==================================
        // CAKES
        // ==================================

        const cakeRows = Array.isArray(cakeResult.data) ? cakeResult.data : [];

        const normalized = cakeRows
          .map(normalizeCake)
          .filter((cake) => cake.status === "Active" && cake.sizes.length > 0);

        setCakes(normalized);
      } catch (error) {
        console.error("Customer catalog error:", error);

        setCategories([]);
        setCakes([]);
      } finally {
        setLoading(false);
      }
    };

    loadCatalog();
  }, []);

  // ==========================================
  // READ CATEGORY FROM URL
  // ==========================================

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");

    if (categoryFromUrl) {
      const categoryId = Number(categoryFromUrl);

      if (Number.isFinite(categoryId) && categoryId > 0) {
        setSelectedCategoryId(String(categoryId));

        return;
      }
    }

    setSelectedCategoryId("All");
  }, [searchParams]);

  // ==========================================
  // CHANGE CATEGORY
  // ==========================================

  const handleCategoryChange = (categoryId) => {
    if (categoryId === "All") {
      setSelectedCategoryId("All");

      const newParams = new URLSearchParams(searchParams);

      newParams.delete("category");

      setSearchParams(newParams);

      return;
    }

    const id = String(categoryId);

    setSelectedCategoryId(id);

    const newParams = new URLSearchParams(searchParams);

    newParams.set("category", id);

    setSearchParams(newParams);
  };

  // ==========================================
  // FILTER + SORT
  // ==========================================

  const filteredCakes = useMemo(() => {
    let result = [...cakes];

    // CATEGORY

    if (selectedCategoryId !== "All") {
      const categoryId = Number(selectedCategoryId);

      result = result.filter((cake) => Number(cake.categoryId) === categoryId);
    }

    // SEARCH

    if (searchTerm.trim() !== "") {
      const search = searchTerm.trim().toLowerCase();

      result = result.filter((cake) =>
        cake.name.toLowerCase().includes(search),
      );
    }

    // STARTING PRICE

    const getStartingPrice = (cake) => {
      if (!Array.isArray(cake.sizes) || cake.sizes.length === 0) {
        return 0;
      }

      const validPrices = cake.sizes
        .map((size) => Number(size.price || 0))
        .filter((price) => price > 0);

      if (validPrices.length === 0) {
        return 0;
      }

      return Math.min(...validPrices);
    };

    // SORT

    if (sortBy === "low-high") {
      result.sort((a, b) => getStartingPrice(a) - getStartingPrice(b));
    }

    if (sortBy === "high-low") {
      result.sort((a, b) => getStartingPrice(b) - getStartingPrice(a));
    }

    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [cakes, selectedCategoryId, searchTerm, sortBy]);

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="shop-page">
      {/* HERO */}

      <section className="shop-hero">
        <div className="container shop-hero-content">
          <span className="section-kicker">OUR COLLECTION</span>

          <h1>Find your perfect cake.</h1>

          <p>
            Handcrafted cakes designed for birthdays, celebrations and
            everything worth making a little sweeter.
          </p>
        </div>
      </section>

      {/* SHOP */}

      <section className="shop-section">
        <div className="container">
          {/* TOOLBAR */}

          <div className="shop-toolbar">
            <div className="shop-search">
              <Search size={18} />

              <input
                type="text"
                placeholder="Search cakes..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <div className="shop-sort">
              <SlidersHorizontal size={17} />

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="default">Sort by</option>

                <option value="low-high">Price: Low to High</option>

                <option value="high-low">Price: High to Low</option>

                <option value="name">Name: A-Z</option>
              </select>
            </div>
          </div>

          {/* CATEGORY FILTER */}

          <div className="category-filter-list">
            <button
              type="button"
              className={
                selectedCategoryId === "All"
                  ? "category-filter active"
                  : "category-filter"
              }
              onClick={() => handleCategoryChange("All")}
            >
              All Cakes
            </button>

            {categories.map((category) => (
              <button
                type="button"
                key={category.id}
                className={
                  selectedCategoryId === String(category.id)
                    ? "category-filter active"
                    : "category-filter"
                }
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* RESULT COUNT */}

          <div className="shop-results-header">
            <p>
              Showing <strong>{filteredCakes.length}</strong>{" "}
              {filteredCakes.length === 1 ? "cake" : "cakes"}
            </p>
          </div>

          {/* RESULTS */}

          {loading ? (
            <div className="no-cakes-found">
              <h3>Loading cakes...</h3>

              <p>Fetching our latest collection.</p>
            </div>
          ) : filteredCakes.length > 0 ? (
            <div className="shop-cake-grid">
              {filteredCakes.map((cake) => (
                <CakeCard key={cake.id} cake={cake} />
              ))}
            </div>
          ) : (
            <div className="no-cakes-found">
              <h3>No cakes found.</h3>

              <p>Try another search term or category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Cakes;
