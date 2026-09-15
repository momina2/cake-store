import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => {
  return (
    <Link to="/cakes" className="category-card">
      <img src={category.image} alt={category.name} />

      <div className="category-overlay"></div>

      <div className="category-content">
        <div>
          <span>Discover</span>
          <h3>{category.name}</h3>
        </div>

        <div className="category-arrow">
          <ArrowUpRight size={20} />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;