import { ArrowUpRight, Image as ImageIcon } from "lucide-react";

import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => {
  const categoryId = Number(category?.id || 0);

  const categoryName = category?.name || "Category";

  const categoryImage = category?.image || category?.image_url || "";

  return (
    <Link to={`/cakes?category=${categoryId}`} className="category-card">
      {categoryImage ? (
        <img src={categoryImage} alt={categoryName} />
      ) : (
        <div className="category-card-no-image">
          <ImageIcon size={30} strokeWidth={1.4} />
        </div>
      )}

      <div className="category-overlay" />

      <div className="category-content">
        <div>
          <span>Discover</span>

          <h3>{categoryName}</h3>
        </div>

        <div className="category-arrow">
          <ArrowUpRight size={20} />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
