import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const CakeCard = ({ cake }) => {
  const startingPrice = cake.sizes[0]?.price || 0;

  return (
    <div className="cake-card">
      <Link to={`/cake/${cake.id}`} className="cake-image-wrapper">
        <img src={cake.image} alt={cake.name} />

        <button
          className="wishlist-button"
          onClick={(event) => event.preventDefault()}
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
        <span className="cake-category">{cake.category}</span>

        <Link to={`/cake/${cake.id}`}>
          <h3>{cake.name}</h3>
        </Link>

        <div className="cake-price">
          From <strong>Rs. {startingPrice.toLocaleString()}</strong>
        </div>
      </div>
    </div>
  );
};

export default CakeCard;