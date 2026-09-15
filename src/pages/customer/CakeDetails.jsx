import { useEffect, useMemo, useState } from "react";

import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";

import { useCart } from "../../context/CartContext";

import "./CakeDetails.css";

const API_ROOT = "https://coreops.pk/cakes/api";

const CakeDetails = () => {
  const { id } = useParams();

  const { addToCart } = useCart();

  // ==========================================
  // STATE
  // ==========================================

  const [cake, setCake] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [activeImage, setActiveImage] = useState("");

  const [selectedSizeId, setSelectedSizeId] = useState(null);

  const [selectedColorId, setSelectedColorId] = useState(null);

  const [quantity, setQuantity] = useState(1);

  const [addedMessage, setAddedMessage] = useState(false);

  // ==========================================
  // NORMALIZE CAKE
  // ==========================================

  const normalizeCake = (rawCake) => {
    const category =
      rawCake.category && typeof rawCake.category === "object"
        ? rawCake.category
        : null;

    // ========================================
    // IMAGES
    // ========================================

    const galleryImages = Array.isArray(rawCake.images)
      ? rawCake.images
          .map((image) => {
            if (typeof image === "string") {
              return image;
            }

            return image.image_url || image.url || "";
          })
          .filter(Boolean)
      : [];

    const mainImage =
      rawCake.main_image || rawCake.image || galleryImages[0] || "";

    const images = [...new Set([mainImage, ...galleryImages].filter(Boolean))];

    // ========================================
    // SIZES
    // ========================================

    const sizes = Array.isArray(rawCake.sizes)
      ? rawCake.sizes
          .filter((size) => !size.status || size.status === "Active")
          .map((size) => ({
            id: Number(size.size_id || size.id || 0),

            size: size.size_name || size.name || size.size || "",

            name: size.size_name || size.name || size.size || "",

            price: Number(size.price || 0),

            status: size.status || "Active",
          }))
          .filter((size) => size.id > 0 && size.price > 0)
      : [];

    // ========================================
    // COLORS
    // ========================================

    const colors = Array.isArray(rawCake.colors)
      ? rawCake.colors
          .filter((color) => !color.status || color.status === "Active")
          .map((color) => ({
            id: Number(color.color_id || color.id || 0),

            name: color.color_name || color.name || "",

            hex: color.hex_code || color.hex || "#ffffff",

            status: color.status || "Active",
          }))
          .filter((color) => color.id > 0)
      : [];

    return {
      id: Number(rawCake.id),

      name: rawCake.name || "",

      categoryId: Number(category?.id || rawCake.category_id || 0),

      category:
        category?.name || rawCake.category_name || rawCake.category || "",

      shortDescription: rawCake.short_description || "",

      description: rawCake.description || rawCake.short_description || "",

      image: mainImage,

      mainImage,

      images,

      sizes,

      colors,

      featured: Number(rawCake.featured) === 1 || rawCake.featured === true,

      status: rawCake.status || "Active",
    };
  };

  // ==========================================
  // FETCH CAKE
  // ==========================================

  useEffect(() => {
    let active = true;

    const loadCake = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_ROOT}/Cakes/getAll.php`);

        let result;

        try {
          result = await response.json();
        } catch {
          throw new Error("Server returned an invalid response.");
        }

        if (!response.ok || result.status !== "success") {
          throw new Error(result.message || "Unable to load cake.");
        }

        const rows = Array.isArray(result.data) ? result.data : [];

        const foundCake = rows.find((item) => Number(item.id) === Number(id));

        if (!active) {
          return;
        }

        if (!foundCake || foundCake.status !== "Active") {
          setCake(null);
          setError("This cake is unavailable.");
          return;
        }

        const normalized = normalizeCake(foundCake);

        if (normalized.sizes.length === 0) {
          setCake(null);
          setError("This cake does not currently have an available size.");
          return;
        }

        setCake(normalized);

        setActiveImage(normalized.images[0] || normalized.image || "");

        setSelectedSizeId(normalized.sizes[0]?.id || null);

        setSelectedColorId(normalized.colors[0]?.id || null);

        setQuantity(1);
      } catch (err) {
        console.error("Cake details loading error:", err);

        if (active) {
          setCake(null);

          setError(err.message || "Unable to load cake.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadCake();

    return () => {
      active = false;
    };
  }, [id]);

  // ==========================================
  // CAKE IMAGES
  // ==========================================

  const cakeImages = useMemo(() => {
    if (!cake) {
      return [];
    }

    if (Array.isArray(cake.images) && cake.images.length > 0) {
      return [...new Set(cake.images.filter(Boolean))];
    }

    if (cake.image) {
      return [cake.image];
    }

    return [];
  }, [cake]);

  // ==========================================
  // SELECTED SIZE
  // ==========================================

  const selectedSizeData = useMemo(() => {
    if (!cake) {
      return null;
    }

    return (
      cake.sizes.find((size) => Number(size.id) === Number(selectedSizeId)) ||
      null
    );
  }, [cake, selectedSizeId]);

  // ==========================================
  // SELECTED COLOR
  // ==========================================

  const selectedColorData = useMemo(() => {
    if (!cake) {
      return null;
    }

    return (
      cake.colors.find(
        (color) => Number(color.id) === Number(selectedColorId),
      ) || null
    );
  }, [cake, selectedColorId]);

  const selectedPrice = Number(selectedSizeData?.price || 0);

  const totalPrice = selectedPrice * quantity;

  // ==========================================
  // GALLERY
  // ==========================================

  const currentImageIndex = cakeImages.findIndex(
    (image) => image === activeImage,
  );

  const showPreviousImage = () => {
    if (cakeImages.length <= 1) {
      return;
    }

    const newIndex =
      currentImageIndex <= 0 ? cakeImages.length - 1 : currentImageIndex - 1;

    setActiveImage(cakeImages[newIndex]);
  };

  const showNextImage = () => {
    if (cakeImages.length <= 1) {
      return;
    }

    const newIndex =
      currentImageIndex >= cakeImages.length - 1 ? 0 : currentImageIndex + 1;

    setActiveImage(cakeImages[newIndex]);
  };

  // ==========================================
  // QUANTITY
  // ==========================================

  const increaseQuantity = () => {
    setQuantity((previous) => previous + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((previous) => Math.max(1, previous - 1));
  };

  // ==========================================
  // ADD TO CART
  // ==========================================

  const handleAddToCart = () => {
    if (!cake) {
      return;
    }

    if (!selectedSizeData) {
      alert("Please select a cake size.");

      return;
    }

    if (cake.colors.length > 0 && !selectedColorData) {
      alert("Please select a cake color.");

      return;
    }

    addToCart({
      // Cake
      id: cake.id,
      cake_id: cake.id,

      name: cake.name,

      category: cake.category,

      image: activeImage || cake.image,

      // Size
      size_id: selectedSizeData.id,

      selectedSizeId: selectedSizeData.id,

      selectedSize: selectedSizeData.name,

      // Color
      color_id: selectedColorData?.id || null,

      selectedColorId: selectedColorData?.id || null,

      selectedColor: selectedColorData?.name || "",

      // Price
      price: selectedPrice,

      quantity,
    });

    setAddedMessage(true);

    setTimeout(() => {
      setAddedMessage(false);
    }, 2200);
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <section className="cake-details-not-found">
        <div className="container">
          <span>LOADING</span>

          <h1>Preparing something sweet...</h1>

          <p>Loading cake details.</p>
        </div>
      </section>
    );
  }

  // ==========================================
  // NOT FOUND
  // ==========================================

  if (!cake) {
    return (
      <section className="cake-details-not-found">
        <div className="container">
          <span>CAKE NOT FOUND</span>

          <h1>This cake is unavailable.</h1>

          <p>
            {error ||
              "The cake may have been removed or is currently inactive."}
          </p>

          <Link to="/cakes" className="primary-button">
            <ArrowLeft size={16} />
            Back to Cakes
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="cake-details-page">
      <div className="container">
        {/* BREADCRUMB */}

        <div className="cake-details-breadcrumb">
          <Link to="/">Home</Link>

          <span>/</span>

          <Link to="/cakes">Cakes</Link>

          <span>/</span>

          <strong>{cake.name}</strong>
        </div>

        {/* MAIN */}

        <section className="cake-details-main">
          {/* GALLERY */}

          <div className="cake-details-gallery">
            <div className="cake-details-main-image">
              {activeImage ? (
                <img src={activeImage} alt={cake.name} />
              ) : (
                <div className="cake-details-no-image">No Image</div>
              )}

              {cake.featured && (
                <span className="cake-details-featured">Featured</span>
              )}

              {cakeImages.length > 1 && (
                <>
                  <button
                    type="button"
                    className="cake-gallery-arrow cake-gallery-arrow-left"
                    onClick={showPreviousImage}
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    type="button"
                    className="cake-gallery-arrow cake-gallery-arrow-right"
                    onClick={showNextImage}
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>

                  <div className="cake-image-counter">
                    {currentImageIndex + 1} / {cakeImages.length}
                  </div>
                </>
              )}
            </div>

            {/* THUMBNAILS */}

            {cakeImages.length > 1 && (
              <div className="cake-details-thumbnails">
                {cakeImages.map((image, index) => (
                  <button
                    type="button"
                    key={`${image}-${index}`}
                    className={`cake-thumbnail ${
                      activeImage === image ? "active" : ""
                    }`}
                    onClick={() => setActiveImage(image)}
                  >
                    <img src={image} alt={`${cake.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFORMATION */}

          <div className="cake-details-info">
            <span className="cake-details-category">{cake.category}</span>

            <h1>{cake.name}</h1>

            <div className="cake-details-price">
              Rs. {selectedPrice.toLocaleString()}
            </div>

            <p className="cake-details-description">{cake.description}</p>

            <div className="cake-details-divider" />

            {/* SIZE */}

            <div className="cake-option-section">
              <div className="cake-option-heading">
                <div>
                  <span>SELECT SIZE</span>

                  <strong>{selectedSizeData?.name || "Choose a size"}</strong>
                </div>
              </div>

              <div className="cake-size-options">
                {cake.sizes.map((item) => {
                  const active = Number(selectedSizeId) === Number(item.id);

                  return (
                    <button
                      type="button"
                      key={item.id}
                      className={`cake-size-option ${active ? "active" : ""}`}
                      onClick={() => setSelectedSizeId(item.id)}
                    >
                      <span>{item.name}</span>

                      <small>Rs. {Number(item.price).toLocaleString()}</small>

                      {active && <Check size={14} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* COLORS */}

            {cake.colors.length > 0 && (
              <div className="cake-option-section">
                <div className="cake-option-heading">
                  <div>
                    <span>SELECT COLOR</span>

                    <strong>
                      {selectedColorData?.name || "Choose a color"}
                    </strong>
                  </div>
                </div>

                <div className="cake-color-options">
                  {cake.colors.map((color) => {
                    const active = Number(selectedColorId) === Number(color.id);

                    return (
                      <button
                        type="button"
                        key={color.id}
                        className={`cake-color-option ${
                          active ? "active" : ""
                        }`}
                        onClick={() => setSelectedColorId(color.id)}
                      >
                        {active && <Check size={13} />}

                        {color.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* QUANTITY */}

            <div className="cake-option-section">
              <div className="cake-option-heading">
                <div>
                  <span>QUANTITY</span>

                  <strong>{quantity}</strong>
                </div>
              </div>

              <div className="cake-quantity-control">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity === 1}
                >
                  <Minus size={16} />
                </button>

                <span>{quantity}</span>

                <button type="button" onClick={increaseQuantity}>
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* TOTAL */}

            <div className="cake-details-total">
              <span>Total</span>

              <strong>Rs. {totalPrice.toLocaleString()}</strong>
            </div>

            {/* ADD TO CART */}

            <button
              type="button"
              className="cake-add-cart-button"
              onClick={handleAddToCart}
            >
              <ShoppingBag size={18} />
              Add to Cart
              <span>Rs. {totalPrice.toLocaleString()}</span>
            </button>

            {addedMessage && (
              <div className="cake-added-message">
                <Check size={15} />
                Added to your cart successfully.
              </div>
            )}

            {/* INFO */}

            <div className="cake-details-extra-info">
              <div>
                <span>FRESHLY MADE</span>

                <p>Every cake is prepared fresh for your order.</p>
              </div>

              <div>
                <span>CUSTOM DETAILS</span>

                <p>Add special instructions during checkout.</p>
              </div>

              <div>
                <span>HANDCRAFTED</span>

                <p>Carefully finished by hand for your celebration.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="cake-details-back">
          <Link to="/cakes">
            <ArrowLeft size={15} />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CakeDetails;
