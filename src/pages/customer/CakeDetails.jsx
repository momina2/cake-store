// import { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
// import toast, { Toaster } from "react-hot-toast";

// import { getCakeById } from "../../utils/catalog";
// import { useCart } from "../../context/CartContext";

// const CakeDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const { addToCart } = useCart();

//   const cake = getCakeById(id);

//   const [selectedSize, setSelectedSize] = useState(
//     cake?.sizes?.[0]?.size || "",
//   );

//   const [selectedColor, setSelectedColor] = useState(cake?.colors?.[0] || "");

//   const [quantity, setQuantity] = useState(1);

//   const [cakeMessage, setCakeMessage] = useState("");

//   if (!cake) {
//     return (
//       <div className="cake-not-found">
//         <h2>Cake not found.</h2>

//         <button onClick={() => navigate("/cakes")}>Back to Cakes</button>
//       </div>
//     );
//   }

//   const selectedSizeData = cake.sizes.find(
//     (item) => item.size === selectedSize,
//   );

//   const selectedPrice = selectedSizeData?.price || 0;

//   const handleAddToCart = () => {
//     if (!selectedSize) {
//       toast.error("Please select a cake size.");
//       return;
//     }

//     if (!selectedColor) {
//       toast.error("Please select a cake color.");
//       return;
//     }

//     addToCart({
//       id: cake.id,
//       name: cake.name,
//       image: cake.image,
//       selectedSize,
//       selectedColor,
//       price: selectedPrice,
//       quantity,
//       cakeMessage,
//     });

//     toast.success("Cake added to cart!");
//   };

//   return (
//     <>
//       <Toaster position="top-right" />

//       <section className="cake-details-page">
//         <div className="container">
//           <button
//             className="cake-back-button"
//             onClick={() => navigate("/cakes")}
//           >
//             <ArrowLeft size={17} />
//             Back to cakes
//           </button>

//           <div className="cake-details-grid">
//             {/* IMAGE */}

//             <div className="cake-details-image-area">
//               <div className="cake-main-image">
//                 <img src={cake.image} alt={cake.name} />
//               </div>

//               <div className="cake-detail-label">Handcrafted Fresh</div>
//             </div>

//             {/* INFORMATION */}

//             <div className="cake-details-content">
//               <span className="cake-details-category">{cake.category}</span>

//               <h1>{cake.name}</h1>

//               <div className="cake-details-price">
//                 Rs. {selectedPrice.toLocaleString()}
//               </div>

//               <p className="cake-details-description">{cake.description}</p>

//               {/* SIZE */}

//               <div className="cake-option-section">
//                 <div className="cake-option-heading">
//                   <h4>Select Size</h4>
//                   <span>{selectedSize}</span>
//                 </div>

//                 <div className="cake-size-options">
//                   {cake.sizes.map((item) => (
//                     <button
//                       key={item.size}
//                       className={
//                         selectedSize === item.size
//                           ? "cake-size-button active"
//                           : "cake-size-button"
//                       }
//                       onClick={() => setSelectedSize(item.size)}
//                     >
//                       <strong>{item.size}</strong>

//                       <span>Rs. {item.price.toLocaleString()}</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* COLOR */}

//               <div className="cake-option-section">
//                 <div className="cake-option-heading">
//                   <h4>Select Color</h4>
//                   <span>{selectedColor}</span>
//                 </div>

//                 <div className="cake-color-options">
//                   {cake.colors.map((color) => (
//                     <button
//                       key={color}
//                       className={
//                         selectedColor === color
//                           ? "cake-color-button active"
//                           : "cake-color-button"
//                       }
//                       onClick={() => setSelectedColor(color)}
//                     >
//                       <span
//                         className={`color-circle ${color
//                           .toLowerCase()
//                           .replaceAll(" ", "-")}`}
//                       ></span>

//                       {color}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* MESSAGE */}

//               <div className="cake-option-section">
//                 <div className="cake-option-heading">
//                   <h4>Message on Cake</h4>

//                   <span>Optional</span>
//                 </div>

//                 <input
//                   type="text"
//                   className="cake-message-input"
//                   placeholder='e.g. "Happy Birthday Sarah!"'
//                   maxLength={50}
//                   value={cakeMessage}
//                   onChange={(event) => setCakeMessage(event.target.value)}
//                 />

//                 <small className="cake-message-count">
//                   {cakeMessage.length}/50
//                 </small>
//               </div>

//               {/* QUANTITY + CART */}

//               <div className="cake-cart-actions">
//                 <div className="quantity-selector">
//                   <button
//                     onClick={() =>
//                       setQuantity((previous) => Math.max(1, previous - 1))
//                     }
//                   >
//                     <Minus size={16} />
//                   </button>

//                   <span>{quantity}</span>

//                   <button
//                     onClick={() => setQuantity((previous) => previous + 1)}
//                   >
//                     <Plus size={16} />
//                   </button>
//                 </div>

//                 <button
//                   className="add-to-cart-button"
//                   onClick={handleAddToCart}
//                 >
//                   <ShoppingBag size={18} />
//                   Add to Cart
//                   <span>Rs. {(selectedPrice * quantity).toLocaleString()}</span>
//                 </button>
//               </div>

//               <div className="cake-detail-note">
//                 <div>
//                   <strong>Freshly prepared</strong>
//                   <span>Every cake is prepared fresh for your order.</span>
//                 </div>

//                 <div>
//                   <strong>Custom details</strong>
//                   <span>
//                     Colours and finishing may vary slightly as each cake is
//                     handmade.
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default CakeDetails;



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
import { getCakeById } from "../../utils/catalog";

import "./CakeDetails.css";

const CakeDetails = () => {
  const { id } = useParams();

  const { addToCart } = useCart();

  // ==========================================
  // CAKE
  // ==========================================

  const cake = useMemo(() => {
    return getCakeById(id);
  }, [id]);

  // ==========================================
  // IMAGES
  // ==========================================

  const cakeImages = useMemo(() => {
    if (!cake) {
      return [];
    }

    if (
      Array.isArray(cake.images) &&
      cake.images.length > 0
    ) {
      return [
        ...new Set(
          cake.images.filter(Boolean)
        ),
      ];
    }

    if (cake.image) {
      return [cake.image];
    }

    return [];
  }, [cake]);

  // ==========================================
  // STATE
  // ==========================================

  const [activeImage, setActiveImage] =
    useState("");

  const [selectedSize, setSelectedSize] =
    useState("");

  const [selectedColor, setSelectedColor] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  const [addedMessage, setAddedMessage] =
    useState(false);

  // ==========================================
  // SET DEFAULTS
  // ==========================================

  useEffect(() => {
    if (!cake) {
      return;
    }

    setActiveImage(
      cakeImages[0] || cake.image || ""
    );

    if (
      Array.isArray(cake.sizes) &&
      cake.sizes.length > 0
    ) {
      setSelectedSize(
        cake.sizes[0].size
      );
    }

    if (
      Array.isArray(cake.colors) &&
      cake.colors.length > 0
    ) {
      setSelectedColor(
        cake.colors[0]
      );
    }

    setQuantity(1);
  }, [cake, cakeImages]);

  // ==========================================
  // SELECTED SIZE OBJECT
  // ==========================================

  const selectedSizeData =
    cake?.sizes?.find(
      (item) =>
        item.size === selectedSize
    );

  const selectedPrice =
    Number(
      selectedSizeData?.price || 0
    );

  const totalPrice =
    selectedPrice * quantity;

  // ==========================================
  // GALLERY NAVIGATION
  // ==========================================

  const currentImageIndex =
    cakeImages.findIndex(
      (image) =>
        image === activeImage
    );

  const showPreviousImage = () => {
    if (cakeImages.length <= 1) {
      return;
    }

    const newIndex =
      currentImageIndex <= 0
        ? cakeImages.length - 1
        : currentImageIndex - 1;

    setActiveImage(
      cakeImages[newIndex]
    );
  };

  const showNextImage = () => {
    if (cakeImages.length <= 1) {
      return;
    }

    const newIndex =
      currentImageIndex >=
      cakeImages.length - 1
        ? 0
        : currentImageIndex + 1;

    setActiveImage(
      cakeImages[newIndex]
    );
  };

  // ==========================================
  // QUANTITY
  // ==========================================

  const increaseQuantity = () => {
    setQuantity(
      (previous) =>
        previous + 1
    );
  };

  const decreaseQuantity = () => {
    setQuantity((previous) =>
      Math.max(
        1,
        previous - 1
      )
    );
  };

  // ==========================================
  // ADD TO CART
  // ==========================================

  const handleAddToCart = () => {
    if (!cake) {
      return;
    }

    if (!selectedSize) {
      alert(
        "Please select a cake size."
      );

      return;
    }

    if (
      Array.isArray(cake.colors) &&
      cake.colors.length > 0 &&
      !selectedColor
    ) {
      alert(
        "Please select a cake color."
      );

      return;
    }

    addToCart({
      id: cake.id,

      name: cake.name,

      category:
        cake.category,

      image:
        activeImage ||
        cake.image,

      selectedSize,

      selectedColor,

      price:
        selectedPrice,

      quantity,
    });

    setAddedMessage(true);

    setTimeout(() => {
      setAddedMessage(false);
    }, 2200);
  };

  // ==========================================
  // NOT FOUND
  // ==========================================

  if (!cake) {
    return (
      <section className="cake-details-not-found">
        <div className="container">
          <span>
            CAKE NOT FOUND
          </span>

          <h1>
            This cake is unavailable.
          </h1>

          <p>
            The cake may have been
            removed or is currently
            inactive.
          </p>

          <Link
            to="/cakes"
            className="primary-button"
          >
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
        {/* ==================================
            BREADCRUMB
        ================================== */}

        <div className="cake-details-breadcrumb">
          <Link to="/">
            Home
          </Link>

          <span>/</span>

          <Link to="/cakes">
            Cakes
          </Link>

          <span>/</span>

          <strong>
            {cake.name}
          </strong>
        </div>

        {/* ==================================
            MAIN SECTION
        ================================== */}

        <section className="cake-details-main">
          {/* ==================================
              LEFT - GALLERY
          ================================== */}

          <div className="cake-details-gallery">
            <div className="cake-details-main-image">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={cake.name}
                />
              ) : (
                <div className="cake-details-no-image">
                  No Image
                </div>
              )}

              {cake.featured && (
                <span className="cake-details-featured">
                  Featured
                </span>
              )}

              {cakeImages.length > 1 && (
                <>
                  <button
                    type="button"
                    className="cake-gallery-arrow cake-gallery-arrow-left"
                    onClick={
                      showPreviousImage
                    }
                    aria-label="Previous image"
                  >
                    <ChevronLeft
                      size={20}
                    />
                  </button>

                  <button
                    type="button"
                    className="cake-gallery-arrow cake-gallery-arrow-right"
                    onClick={
                      showNextImage
                    }
                    aria-label="Next image"
                  >
                    <ChevronRight
                      size={20}
                    />
                  </button>

                  <div className="cake-image-counter">
                    {currentImageIndex +
                      1}{" "}
                    /{" "}
                    {
                      cakeImages.length
                    }
                  </div>
                </>
              )}
            </div>

            {/* THUMBNAILS */}

            {cakeImages.length > 1 && (
              <div className="cake-details-thumbnails">
                {cakeImages.map(
                  (
                    image,
                    index
                  ) => (
                    <button
                      type="button"
                      key={`${image}-${index}`}
                      className={`cake-thumbnail ${
                        activeImage ===
                        image
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setActiveImage(
                          image
                        )
                      }
                    >
                      <img
                        src={image}
                        alt={`${cake.name} ${
                          index + 1
                        }`}
                      />
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* ==================================
              RIGHT - INFORMATION
          ================================== */}

          <div className="cake-details-info">
            <span className="cake-details-category">
              {cake.category}
            </span>

            <h1>
              {cake.name}
            </h1>

            <div className="cake-details-price">
              Rs.{" "}
              {selectedPrice.toLocaleString()}
            </div>

            <p className="cake-details-description">
              {cake.description}
            </p>

            <div className="cake-details-divider" />

            {/* ==================================
                SIZE
            ================================== */}

            <div className="cake-option-section">
              <div className="cake-option-heading">
                <div>
                  <span>
                    SELECT SIZE
                  </span>

                  <strong>
                    {selectedSize ||
                      "Choose a size"}
                  </strong>
                </div>
              </div>

              <div className="cake-size-options">
                {cake.sizes?.map(
                  (
                    item,
                    index
                  ) => {
                    const active =
                      selectedSize ===
                      item.size;

                    return (
                      <button
                        type="button"
                        key={`${item.size}-${index}`}
                        className={`cake-size-option ${
                          active
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedSize(
                            item.size
                          )
                        }
                      >
                        <span>
                          {item.size}
                        </span>

                        <small>
                          Rs.{" "}
                          {Number(
                            item.price
                          ).toLocaleString()}
                        </small>

                        {active && (
                          <Check
                            size={14}
                          />
                        )}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* ==================================
                COLORS
            ================================== */}

            {Array.isArray(
              cake.colors
            ) &&
              cake.colors.length >
                0 && (
                <div className="cake-option-section">
                  <div className="cake-option-heading">
                    <div>
                      <span>
                        SELECT COLOR
                      </span>

                      <strong>
                        {selectedColor}
                      </strong>
                    </div>
                  </div>

                  <div className="cake-color-options">
                    {cake.colors.map(
                      (
                        color,
                        index
                      ) => {
                        const active =
                          selectedColor ===
                          color;

                        return (
                          <button
                            type="button"
                            key={`${color}-${index}`}
                            className={`cake-color-option ${
                              active
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>
                              setSelectedColor(
                                color
                              )
                            }
                          >
                            {active && (
                              <Check
                                size={13}
                              />
                            )}

                            {
                              color
                            }
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

            {/* ==================================
                QUANTITY
            ================================== */}

            <div className="cake-option-section">
              <div className="cake-option-heading">
                <div>
                  <span>
                    QUANTITY
                  </span>

                  <strong>
                    {quantity}
                  </strong>
                </div>
              </div>

              <div className="cake-quantity-control">
                <button
                  type="button"
                  onClick={
                    decreaseQuantity
                  }
                  disabled={
                    quantity === 1
                  }
                >
                  <Minus size={16} />
                </button>

                <span>
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={
                    increaseQuantity
                  }
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* ==================================
                TOTAL
            ================================== */}

            <div className="cake-details-total">
              <span>
                Total
              </span>

              <strong>
                Rs.{" "}
                {totalPrice.toLocaleString()}
              </strong>
            </div>

            {/* ==================================
                ADD TO CART
            ================================== */}

            <button
              type="button"
              className="cake-add-cart-button"
              onClick={
                handleAddToCart
              }
            >
              <ShoppingBag
                size={18}
              />

              Add to Cart

              <span>
                Rs.{" "}
                {totalPrice.toLocaleString()}
              </span>
            </button>

            {/* SUCCESS MESSAGE */}

            {addedMessage && (
              <div className="cake-added-message">
                <Check size={15} />

                Added to your cart
                successfully.
              </div>
            )}

            {/* ==================================
                INFO
            ================================== */}

            <div className="cake-details-extra-info">
              <div>
                <span>
                  FRESHLY MADE
                </span>

                <p>
                  Every cake is
                  prepared fresh for
                  your order.
                </p>
              </div>

              <div>
                <span>
                  CUSTOM DETAILS
                </span>

                <p>
                  Add special
                  instructions during
                  checkout.
                </p>
              </div>

              <div>
                <span>
                  HANDCRAFTED
                </span>

                <p>
                  Carefully finished
                  by hand for your
                  celebration.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================
            BACK
        ================================== */}

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