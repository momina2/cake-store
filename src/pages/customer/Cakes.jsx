import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { getCustomerCakes, getCustomerCategories } from "../../utils/catalog";

import CakeCard from "../../components/customer/CakeCard";

const Cakes = () => {
  const [cakes] = useState(() => getCustomerCakes());

  const [categories] = useState(() => getCustomerCategories());
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const filteredCakes = useMemo(() => {
    let result = [...cakes];

    if (selectedCategory !== "All") {
      result = result.filter((cake) => cake.category === selectedCategory);
    }

    if (searchTerm.trim() !== "") {
      result = result.filter((cake) =>
        cake.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (sortBy === "low-high") {
      result.sort((a, b) => a.sizes[0].price - b.sizes[0].price);
    }

    if (sortBy === "high-low") {
      result.sort((a, b) => b.sizes[0].price - a.sizes[0].price);
    }

    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [selectedCategory, searchTerm, sortBy]);

  return (
    <div className="shop-page">
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

      <section className="shop-section">
        <div className="container">
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

          <div className="category-filter-list">
            <button
              className={
                selectedCategory === "All"
                  ? "category-filter active"
                  : "category-filter"
              }
              onClick={() => setSelectedCategory("All")}
            >
              All Cakes
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                className={
                  selectedCategory === category.name
                    ? "category-filter active"
                    : "category-filter"
                }
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="shop-results-header">
            <p>
              Showing <strong>{filteredCakes.length}</strong> cakes
            </p>
          </div>

          {filteredCakes.length > 0 ? (
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
