import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const CakeCard = ({ cake }) => {
  // ==========================================
  // SAFE DATA
  // ==========================================

  const cakeId = Number(cake?.id || 0);

  const sizes = Array.isArray(cake?.sizes)
    ? cake.sizes
    : [];

  const flavours = Array.isArray(cake?.flavours)
    ? cake.flavours
    : [];

  // ==========================================
  // GET SIZE WEIGHT IN LB
  // ==========================================

  const getSizeInLb = (size) => {
    const sizeText = String(
      size?.size ||
        size?.name ||
        size?.size_name ||
        ""
    ).trim();

    const match = sizeText.match(/(\d+(?:\.\d+)?)/);

    if (!match) {
      return 0;
    }

    const weight = Number(match[1]);

    return Number.isFinite(weight)
      ? weight
      : 0;
  };

  // ==========================================
  // MINIMUM AVAILABLE SIZE
  // ==========================================

  const availableSizeWeights = sizes
    .filter(
      (size) =>
        !size?.status ||
        size.status === "Active"
    )
    .map(getSizeInLb)
    .filter((weight) => weight > 0);

  const minimumSizeLb =
    availableSizeWeights.length > 0
      ? Math.min(...availableSizeWeights)
      : 0;

  // ==========================================
  // MINIMUM ACTIVE FLAVOUR PRICE PER LB
  // ==========================================

  const flavourPrices = flavours
    .filter(
      (flavour) =>
        (!flavour?.status ||
          flavour.status === "Active") &&
        (!flavour?.master_status ||
          flavour.master_status === "Active")
    )
    .map((flavour) =>
      Number(flavour?.charge || 0)
    )
    .filter((price) => price > 0);

  const minimumFlavourPrice =
    flavourPrices.length > 0
      ? Math.min(...flavourPrices)
      : 0;

  // ==========================================
  // STARTING PRICE
  //
  // Minimum available size
  // ×
  // Minimum flavour price per LB
  // ==========================================

  const startingPrice =
    minimumSizeLb > 0 &&
    minimumFlavourPrice > 0
      ? minimumSizeLb *
        minimumFlavourPrice
      : 0;

  // ==========================================
  // IMAGE
  // ==========================================

  const cakeImage =
    cake?.image ||
    cake?.mainImage ||
    cake?.main_image ||
    "";

  // ==========================================
  // CATEGORY
  // ==========================================

  const categoryName =
    typeof cake?.category === "object"
      ? cake.category?.name || ""
      : cake?.category || "";

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="cake-card">
      <Link
        to={`/cake/${cakeId}`}
        className="cake-image-wrapper"
      >
        {cakeImage ? (
          <img
            src={cakeImage}
            alt={cake?.name || "Cake"}
          />
        ) : (
          <div className="cake-card-no-image">
            <ShoppingBag
              size={28}
              strokeWidth={1.4}
            />

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
        {categoryName && (
          <span className="cake-category">
            {categoryName}
          </span>
        )}

        <Link to={`/cake/${cakeId}`}>
          <h3>
            {cake?.name || "Cake"}
          </h3>
        </Link>

        <div className="cake-price">
          {startingPrice > 0 ? (
            <>
              From{" "}
              <strong>
                Rs.{" "}
                {startingPrice.toLocaleString(
                  "en-PK"
                )}
              </strong>
            </>
          ) : (
            <strong>
              Price unavailable
            </strong>
          )}
        </div>
      </div>
    </div>
  );
};

export default CakeCard;