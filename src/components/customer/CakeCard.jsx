import { Heart, ShoppingBag } from "lucide-react";

import { Link } from "react-router-dom";

const CakeCard = ({ cake }) => {
  // ==========================================
  // SAFE DATA
  // ==========================================

  const cakeId = Number(cake?.id || 0);

  const sizes = Array.isArray(cake?.sizes) ? cake.sizes : [];

  const prices = sizes
    .map((size) => Number(size.price || 0))
    .filter((price) => price > 0);

  const startingPrice = prices.length > 0 ? Math.min(...prices) : 0;

  const cakeImage = cake?.image || cake?.mainImage || cake?.main_image || "";

  const categoryName =
    typeof cake?.category === "object"
      ? cake.category?.name || ""
      : cake?.category || "";

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="cake-card">
      <Link to={`/cake/${cakeId}`} className="cake-image-wrapper">
        {cakeImage ? (
          <img src={cakeImage} alt={cake?.name || "Cake"} />
        ) : (
          <div className="cake-card-no-image">
            <ShoppingBag size={28} strokeWidth={1.4} />

            <span>No Image</span>
          </div>
        )}

        <button
          type="button"
          className="wishlist-button"
          aria-label="Add to wishlist"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        >
          <Heart size={18} />
        </button>

        <div className="cake-image-overlay">
          <span>
            View Cake
            <ShoppingBag size={16} />
          </span>
        </div>
      </Link>

      <div className="cake-info">
        {categoryName && <span className="cake-category">{categoryName}</span>}

        <Link to={`/cake/${cakeId}`}>
          <h3>{cake?.name || "Cake"}</h3>
        </Link>

        <div className="cake-price">
          {startingPrice > 0 ? (
            <>
              From <strong>Rs. {startingPrice.toLocaleString()}</strong>
            </>
          ) : (
            <strong>Price unavailable</strong>
          )}
        </div>
      </div>
    </div>
  );
};

export default CakeCard;
