import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  Upload,
  Trash2,
  LoaderCircle,
} from "lucide-react";

import { useCart } from "../../context/CartContext";

import "./CakeDetails.css";

const API_ROOT =
  "https://coreops.pk/cakes/api";

const CakeDetails = () => {
  const { id } = useParams();

  const { addToCart } = useCart();

  // ==========================================
  // STATE
  // ==========================================

  const [cake, setCake] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    activeImage,
    setActiveImage,
  ] = useState("");

  const [
    selectedSizeId,
    setSelectedSizeId,
  ] = useState(null);

  const [
    selectedColorId,
    setSelectedColorId,
  ] = useState(null);

  // ==========================================
  // FILLINGS
  // ==========================================

  const [fillings, setFillings] =
    useState([]);

  const [
    selectedFillingId,
    setSelectedFillingId,
  ] = useState(null);

  const [
    fillingsLoading,
    setFillingsLoading,
  ] = useState(true);

  const [
    fillingError,
    setFillingError,
  ] = useState("");

  // ==========================================
  // FLAVOURS
  // ==========================================

  const [flavours, setFlavours] =
    useState([]);

  const [
    selectedFlavourId,
    setSelectedFlavourId,
  ] = useState(null);

  const [
    flavoursLoading,
    setFlavoursLoading,
  ] = useState(true);

  const [
    flavourError,
    setFlavourError,
  ] = useState("");

  // ==========================================
  // REFERENCE IMAGE
  // ==========================================

  const [
    referenceImage,
    setReferenceImage,
  ] = useState("");

  const [
    referencePreview,
    setReferencePreview,
  ] = useState("");

  const [
    referenceUploading,
    setReferenceUploading,
  ] = useState(false);

  const [
    referenceError,
    setReferenceError,
  ] = useState("");

  const [quantity, setQuantity] =
    useState(1);

  const [
    addedMessage,
    setAddedMessage,
  ] = useState(false);

  // ==========================================
  // NORMALIZE CAKE
  // ==========================================

  const normalizeCake = (
    rawCake
  ) => {
    const category =
      rawCake.category &&
      typeof rawCake.category ===
        "object"
        ? rawCake.category
        : null;

    // ========================================
    // IMAGES
    // ========================================

    const galleryImages =
      Array.isArray(rawCake.images)
        ? rawCake.images
            .map((image) => {
              if (
                typeof image ===
                "string"
              ) {
                return image;
              }

              return (
                image.image_url ||
                image.url ||
                ""
              );
            })
            .filter(Boolean)
        : [];

    const mainImage =
      rawCake.main_image ||
      rawCake.image ||
      galleryImages[0] ||
      "";

    const images = [
      ...new Set(
        [
          mainImage,
          ...galleryImages,
        ].filter(Boolean)
      ),
    ];

    // ========================================
    // SIZES
    // ========================================

    const sizes =
      Array.isArray(rawCake.sizes)
        ? rawCake.sizes
            .filter(
              (size) =>
                !size.status ||
                size.status ===
                  "Active"
            )
            .map((size) => ({
              id: Number(
                size.size_id ||
                  size.id ||
                  0
              ),

              size:
                size.size_name ||
                size.name ||
                size.size ||
                "",

              name:
                size.size_name ||
                size.name ||
                size.size ||
                "",

              price: Number(
                size.price || 0
              ),

              status:
                size.status ||
                "Active",
            }))
            .filter((size) => size.id > 0)
        : [];

    // ========================================
    // COLORS
    // ========================================

    const colors =
      Array.isArray(rawCake.colors)
        ? rawCake.colors
            .filter(
              (color) =>
                !color.status ||
                color.status ===
                  "Active"
            )
            .map((color) => ({
              id: Number(
                color.color_id ||
                  color.id ||
                  0
              ),

              name:
                color.color_name ||
                color.name ||
                "",

              hex:
                color.hex_code ||
                color.hex ||
                "#ffffff",

              status:
                color.status ||
                "Active",
            }))
            .filter(
              (color) =>
                color.id > 0
            )
        : [];

    return {
      id: Number(rawCake.id),

      name:
        rawCake.name || "",

      categoryId: Number(
        category?.id ||
          rawCake.category_id ||
          0
      ),

      category:
        category?.name ||
        rawCake.category_name ||
        rawCake.category ||
        "",

      shortDescription:
        rawCake.short_description ||
        "",

      description:
        rawCake.description ||
        rawCake.short_description ||
        "",

      image: mainImage,

      mainImage,

      images,

      sizes,

      colors,

      featured:
        Number(
          rawCake.featured
        ) === 1 ||
        rawCake.featured === true,

      status:
        rawCake.status ||
        "Active",
    };
  };

  // ==========================================
  // FETCH CAKE
  // ==========================================

  useEffect(() => {
    let active = true;

    const loadCake =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await fetch(
              `${API_ROOT}/Cakes/getAll.php`
            );

          let result;

          try {
            result =
              await response.json();
          } catch {
            throw new Error(
              "Server returned an invalid response."
            );
          }

          if (
            !response.ok ||
            result.status !==
              "success"
          ) {
            throw new Error(
              result.message ||
                "Unable to load cake."
            );
          }

          const rows =
            Array.isArray(
              result.data
            )
              ? result.data
              : [];

          const foundCake =
            rows.find(
              (item) =>
                Number(item.id) ===
                Number(id)
            );

          if (!active) {
            return;
          }

          if (
            !foundCake ||
            foundCake.status !==
              "Active"
          ) {
            setCake(null);

            setError(
              "This cake is unavailable."
            );

            return;
          }

          const normalized =
            normalizeCake(
              foundCake
            );

          if (
            normalized.sizes
              .length === 0
          ) {
            setCake(null);

            setError(
              "This cake does not currently have an available size."
            );

            return;
          }

          setCake(normalized);

          setActiveImage(
            normalized.images[0] ||
              normalized.image ||
              ""
          );

          setSelectedSizeId(
            normalized.sizes[0]
              ?.id || null
          );

          setSelectedColorId(
            normalized.colors[0]
              ?.id || null
          );

          setSelectedFillingId(
            null
          );

          setSelectedFlavourId(
            null
          );

          setReferenceImage("");
          setReferencePreview("");
          setReferenceError("");

          setQuantity(1);
        } catch (err) {
          console.error(
            "Cake details loading error:",
            err
          );

          if (active) {
            setCake(null);

            setError(
              err.message ||
                "Unable to load cake."
            );
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
  // FETCH ACTIVE FILLINGS
  // ==========================================

  useEffect(() => {
    let active = true;

    const loadFillings =
      async () => {
        try {
          setFillingsLoading(
            true
          );

          setFillingError("");

          const response =
            await fetch(
              `${API_ROOT}/Fillings/getAll.php`
            );

          let result;

          try {
            result =
              await response.json();
          } catch {
            throw new Error(
              "Server returned an invalid fillings response."
            );
          }

          if (
            !response.ok ||
            result.status !==
              "success"
          ) {
            throw new Error(
              result.message ||
                "Unable to load fillings."
            );
          }

          const rows =
            Array.isArray(
              result.data
            )
              ? result.data
              : [];

          const activeFillings =
            rows
              .filter(
                (item) =>
                  item.status ===
                  "Active"
              )
              .map(
                (item) => ({
                  id: Number(
                    item.id || 0
                  ),

                  name:
                    item.name ||
                    "",

                  charge: Number(
                    item.charge ||
                      0
                  ),

                  status:
                    item.status ||
                    "Active",
                })
              )
              .filter(
                (item) =>
                  item.id > 0
              );

          if (active) {
            setFillings(
              activeFillings
            );
          }
        } catch (err) {
          console.error(
            "Fillings loading error:",
            err
          );

          if (active) {
            setFillings([]);

            setFillingError(
              err.message ||
                "Unable to load fillings."
            );
          }
        } finally {
          if (active) {
            setFillingsLoading(
              false
            );
          }
        }
      };

    loadFillings();

    const handleFillingsChanged =
      () => {
        loadFillings();
      };

    window.addEventListener(
      "fillingsChanged",
      handleFillingsChanged
    );

    return () => {
      active = false;

      window.removeEventListener(
        "fillingsChanged",
        handleFillingsChanged
      );
    };
  }, []);

  // ==========================================
  // FETCH ACTIVE FLAVOURS
  // ==========================================

  useEffect(() => {
    let active = true;

    const loadFlavours =
      async () => {
        try {
          setFlavoursLoading(
            true
          );

          setFlavourError("");

          const response =
            await fetch(
              `${API_ROOT}/Flavours/getAll.php`
            );

          let result;

          try {
            result =
              await response.json();
          } catch {
            throw new Error(
              "Server returned an invalid flavours response."
            );
          }

          if (
            !response.ok ||
            result.status !==
              "success"
          ) {
            throw new Error(
              result.message ||
                "Unable to load flavours."
            );
          }

          const rows =
            Array.isArray(
              result.data
            )
              ? result.data
              : [];

          const activeFlavours =
            rows
              .filter(
                (item) =>
                  item.status ===
                  "Active"
              )
              .map(
                (item) => ({
                  id: Number(
                    item.id || 0
                  ),

                  name:
                    item.name ||
                    "",

                  charge: Number(
                    item.charge ||
                      0
                  ),

                  status:
                    item.status ||
                    "Active",
                })
              )
              .filter(
                (item) =>
                  item.id > 0
              );

          if (active) {
            setFlavours(
              activeFlavours
            );
          }
        } catch (err) {
          console.error(
            "Flavours loading error:",
            err
          );

          if (active) {
            setFlavours([]);

            setFlavourError(
              err.message ||
                "Unable to load flavours."
            );
          }
        } finally {
          if (active) {
            setFlavoursLoading(
              false
            );
          }
        }
      };

    loadFlavours();

    const handleFlavoursChanged =
      () => {
        loadFlavours();
      };

    window.addEventListener(
      "flavoursChanged",
      handleFlavoursChanged
    );

    return () => {
      active = false;

      window.removeEventListener(
        "flavoursChanged",
        handleFlavoursChanged
      );
    };
  }, []);

  // ==========================================
  // CAKE IMAGES
  // ==========================================

  const cakeImages =
    useMemo(() => {
      if (!cake) {
        return [];
      }

      if (
        Array.isArray(
          cake.images
        ) &&
        cake.images.length > 0
      ) {
        return [
          ...new Set(
            cake.images.filter(
              Boolean
            )
          ),
        ];
      }

      if (cake.image) {
        return [
          cake.image,
        ];
      }

      return [];
    }, [cake]);

  // ==========================================
  // SELECTED SIZE
  // ==========================================

  const selectedSizeData =
    useMemo(() => {
      if (!cake) {
        return null;
      }

      return (
        cake.sizes.find(
          (size) =>
            Number(size.id) ===
            Number(
              selectedSizeId
            )
        ) || null
      );
    }, [
      cake,
      selectedSizeId,
    ]);

  // ==========================================
  // SELECTED COLOR
  // ==========================================

  const selectedColorData =
    useMemo(() => {
      if (!cake) {
        return null;
      }

      return (
        cake.colors.find(
          (color) =>
            Number(color.id) ===
            Number(
              selectedColorId
            )
        ) || null
      );
    }, [
      cake,
      selectedColorId,
    ]);

  // ==========================================
  // SELECTED FILLING
  // ==========================================

  const selectedFillingData =
    useMemo(() => {
      if (
        !selectedFillingId
      ) {
        return null;
      }

      return (
        fillings.find(
          (filling) =>
            Number(
              filling.id
            ) ===
            Number(
              selectedFillingId
            )
        ) || null
      );
    }, [
      fillings,
      selectedFillingId,
    ]);

  // ==========================================
  // SELECTED FLAVOUR
  // ==========================================

  const selectedFlavourData =
    useMemo(() => {
      if (
        !selectedFlavourId
      ) {
        return null;
      }

      return (
        flavours.find(
          (flavour) =>
            Number(
              flavour.id
            ) ===
            Number(
              selectedFlavourId
            )
        ) || null
      );
    }, [
      flavours,
      selectedFlavourId,
    ]);

  // ==========================================
  // PRICE
  // ==========================================

  const getSizeInLb = (sizeName = "") => {
    const match = String(sizeName).replace(",", ".").match(/\d+(?:\.\d+)?/);
    return match ? Number(match[0]) : 0;
  };

  const sizeInLb = getSizeInLb(
    selectedSizeData?.name || selectedSizeData?.size || ""
  );

  // flavours.charge is now the 1 lb price.
  const flavourPricePerLb = Number(selectedFlavourData?.charge || 0);
  const fillingCharge = Number(selectedFillingData?.charge || 0);

  const cakeBasePrice =
    sizeInLb > 0 && flavourPricePerLb > 0
      ? sizeInLb * flavourPricePerLb
      : 0;

  const selectedPrice = cakeBasePrice + fillingCharge;
  const totalPrice = selectedPrice * quantity;

  // Keep these names for the existing cart payload.
  const basePrice = cakeBasePrice;
  const flavourCharge = flavourPricePerLb;

  // ==========================================
  // GALLERY
  // ==========================================

  const currentImageIndex =
    cakeImages.findIndex(
      (image) =>
        image === activeImage
    );

  const showPreviousImage =
    () => {
      if (
        cakeImages.length <= 1
      ) {
        return;
      }

      const newIndex =
        currentImageIndex <= 0
          ? cakeImages.length -
            1
          : currentImageIndex -
            1;

      setActiveImage(
        cakeImages[newIndex]
      );
    };

  const showNextImage =
    () => {
      if (
        cakeImages.length <= 1
      ) {
        return;
      }

      const newIndex =
        currentImageIndex >=
        cakeImages.length - 1
          ? 0
          : currentImageIndex +
            1;

      setActiveImage(
        cakeImages[newIndex]
      );
    };

  // ==========================================
  // QUANTITY
  // ==========================================

  const increaseQuantity =
    () => {
      setQuantity(
        (previous) =>
          previous + 1
      );
    };

  const decreaseQuantity =
    () => {
      setQuantity(
        (previous) =>
          Math.max(
            1,
            previous - 1
          )
      );
    };

  // ==========================================
  // REFERENCE IMAGE UPLOAD
  // ==========================================

  const handleReferenceImage =
    async (event) => {
      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      setReferenceError("");

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (
        !allowedTypes.includes(
          file.type
        )
      ) {
        setReferenceError(
          "Only JPG, PNG and WEBP images are allowed."
        );

        event.target.value =
          "";

        return;
      }

      if (
        file.size >
        5 * 1024 * 1024
      ) {
        setReferenceError(
          "Image must be 5 MB or smaller."
        );

        event.target.value =
          "";

        return;
      }

      if (referencePreview) {
        URL.revokeObjectURL(
          referencePreview
        );
      }

      const localPreview =
        URL.createObjectURL(
          file
        );

      setReferencePreview(
        localPreview
      );

      setReferenceImage("");

      try {
        setReferenceUploading(
          true
        );

        const uploadData =
          new FormData();

        uploadData.append(
          "reference_image",
          file
        );

        const response =
          await fetch(
            `${API_ROOT}/ReferenceImages/upload.php`,
            {
              method:
                "POST",

              body:
                uploadData,
            }
          );

        let result;

        try {
          result =
            await response.json();
        } catch {
          throw new Error(
            "Server returned an invalid upload response."
          );
        }

        if (
          !response.ok ||
          result.status !==
            "success"
        ) {
          throw new Error(
            result.message ||
              "Unable to upload reference image."
          );
        }

        const imageUrl =
          result.data
            ?.reference_image ||
          result.data?.url ||
          "";

        if (!imageUrl) {
          throw new Error(
            "Image URL was not returned."
          );
        }

        setReferenceImage(
          imageUrl
        );
      } catch (err) {
        console.error(
          "Reference image upload error:",
          err
        );

        setReferenceImage(
          ""
        );

        setReferenceError(
          err.message ||
            "Unable to upload reference image."
        );
      } finally {
        setReferenceUploading(
          false
        );
      }
    };

  // ==========================================
  // REMOVE REFERENCE IMAGE
  // ==========================================

  const removeReferenceImage =
    () => {
      if (referencePreview) {
        URL.revokeObjectURL(
          referencePreview
        );
      }

      setReferenceImage("");
      setReferencePreview("");
      setReferenceError("");
    };

  // ==========================================
  // CLEAN PREVIEW
  // ==========================================

  useEffect(() => {
    return () => {
      if (referencePreview) {
        URL.revokeObjectURL(
          referencePreview
        );
      }
    };
  }, [referencePreview]);

  // ==========================================
  // ADD TO CART
  // ==========================================

  const handleAddToCart =
    () => {
      if (!cake) {
        return;
      }

      if (
        !selectedSizeData
      ) {
        alert(
          "Please select a cake size."
        );

        return;
      }

      if (
        cake.colors.length >
          0 &&
        !selectedColorData
      ) {
        alert(
          "Please select a cake color."
        );

        return;
      }

      // Flavour is required.

      if (
        !selectedFlavourData
      ) {
        alert(
          "Please select a cake flavour."
        );

        return;
      }

      // Prevent adding while
      // reference image is uploading.

      if (
        referenceUploading
      ) {
        alert(
          "Please wait for the reference image to finish uploading."
        );

        return;
      }

      // If preview exists but upload
      // failed, don't silently add it.

      if (
        referencePreview &&
        !referenceImage
      ) {
        alert(
          "Reference image could not be uploaded. Please remove it or upload it again."
        );

        return;
      }

      addToCart({
        // ======================================
        // CAKE
        // ======================================

        id:
          cake.id,

        cake_id:
          cake.id,

        name:
          cake.name,

        category:
          cake.category,

        image:
          activeImage ||
          cake.image,

        // ======================================
        // SIZE
        // ======================================

        size_id:
          selectedSizeData.id,

        selectedSizeId:
          selectedSizeData.id,

        selectedSize:
          selectedSizeData.name,

        // ======================================
        // COLOR
        // ======================================

        color_id:
          selectedColorData
            ?.id || null,

        selectedColorId:
          selectedColorData
            ?.id || null,

        selectedColor:
          selectedColorData
            ?.name || "",

        // ======================================
        // FLAVOUR
        // ======================================

        flavour_id:
          selectedFlavourData.id,

        selectedFlavourId:
          selectedFlavourData.id,

        selectedFlavour:
          selectedFlavourData.name,

        selected_flavour:
          selectedFlavourData.name,

        flavour_charge:
          flavourCharge,

        selectedFlavourCharge:
          flavourCharge,

        selected_flavour_charge:
          flavourCharge,

        // ======================================
        // FILLING
        // ======================================

        filling_id:
          selectedFillingData
            ?.id || null,

        selectedFillingId:
          selectedFillingData
            ?.id || null,

        selectedFilling:
          selectedFillingData
            ?.name || "",

        selected_filling:
          selectedFillingData
            ?.name || "",

        filling_charge:
          fillingCharge,

        selectedFillingCharge:
          fillingCharge,

        selected_filling_charge:
          fillingCharge,

        // ======================================
        // REFERENCE IMAGE
        // ======================================

        reference_image:
          referenceImage ||
          "",

        referenceImage:
          referenceImage ||
          "",

        // ======================================
        // PRICES
        // ======================================

        base_price:
          basePrice,

        price:
          selectedPrice,

        quantity,
      });

      setAddedMessage(
        true
      );

      setTimeout(() => {
        setAddedMessage(
          false
        );
      }, 2200);
    };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <section className="cake-details-not-found">
        <div className="container">
          <span>
            LOADING
          </span>

          <h1>
            Preparing something
            sweet...
          </h1>

          <p>
            Loading cake details.
          </p>
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
          <span>
            CAKE NOT FOUND
          </span>

          <h1>
            This cake is
            unavailable.
          </h1>

          <p>
            {error ||
              "The cake may have been removed or is currently inactive."}
          </p>

          <Link
            to="/cakes"
            className="primary-button"
          >
            <ArrowLeft
              size={16}
            />

            Back to Cakes
          </Link>
        </div>
      </section>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="cake-details-page">
      <div className="container">

        {/* ====================================
            BREADCRUMB
        ==================================== */}

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

        {/* ====================================
            MAIN
        ==================================== */}

        <section className="cake-details-main">

          {/* ==================================
              GALLERY
          ================================== */}

          <div className="cake-details-gallery">

            <div className="cake-details-main-image">

              {activeImage ? (
                <img
                  src={
                    activeImage
                  }
                  alt={
                    cake.name
                  }
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

              {cakeImages.length >
                1 && (
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

            {cakeImages.length >
              1 && (
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
                          index +
                          1
                        }`}
                      />
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* ==================================
              INFORMATION
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

            {selectedFlavourData && sizeInLb > 0 && (
              <p
                style={{
                  marginTop: "6px",
                  fontSize: "11px",
                  color: "var(--text-soft)",
                }}
              >
                Rs. {flavourPricePerLb.toLocaleString()} / lb × {sizeInLb} lb
                {" = Rs. "}{cakeBasePrice.toLocaleString()}
                {fillingCharge > 0 && (
                  <>{" + Rs. "}{fillingCharge.toLocaleString()}{" filling"}</>
                )}
              </p>
            )}

            <p className="cake-details-description">
              {
                cake.description
              }
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
                    {selectedSizeData
                      ?.name ||
                      "Choose a size"}
                  </strong>
                </div>
              </div>

              <div className="cake-size-options">
                {cake.sizes.map(
                  (item) => {
                    const active =
                      Number(
                        selectedSizeId
                      ) ===
                      Number(
                        item.id
                      );

                    return (
                      <button
                        type="button"
                        key={
                          item.id
                        }
                        className={`cake-size-option ${
                          active
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedSizeId(
                            item.id
                          )
                        }
                      >
                        <span>
                          {
                            item.name
                          }
                        </span>

                        <small>
                          {selectedFlavourData
                            ? `Rs. ${(getSizeInLb(item.name) * flavourPricePerLb).toLocaleString()}`
                            : "Select flavour for price"}
                        </small>

                        {active && (
                          <Check
                            size={
                              14
                            }
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

            {cake.colors.length >
              0 && (
              <div className="cake-option-section">

                <div className="cake-option-heading">
                  <div>
                    <span>
                      SELECT COLOR
                    </span>

                    <strong>
                      {selectedColorData
                        ?.name ||
                        "Choose a color"}
                    </strong>
                  </div>
                </div>

                <div className="cake-color-options">
                  {cake.colors.map(
                    (color) => {
                      const active =
                        Number(
                          selectedColorId
                        ) ===
                        Number(
                          color.id
                        );

                      return (
                        <button
                          type="button"
                          key={
                            color.id
                          }
                          className={`cake-color-option ${
                            active
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            setSelectedColorId(
                              color.id
                            )
                          }
                        >
                          {active && (
                            <Check
                              size={
                                13
                              }
                            />
                          )}

                          {
                            color.name
                          }
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {/* ==================================
                FLAVOURS
            ================================== */}

            <div className="cake-option-section">

              <div className="cake-option-heading">
                <div>
                  <span>
                    SELECT FLAVOUR
                  </span>

                  <strong>
                    {selectedFlavourData
                      ? selectedFlavourData.name
                      : "Choose a flavour"}
                  </strong>
                </div>
              </div>

              {flavoursLoading ? (
                <p
                  style={{
                    fontSize:
                      "11px",

                    color:
                      "var(--text-soft)",
                  }}
                >
                  Loading flavours...
                </p>
              ) : flavourError ? (
                <p
                  style={{
                    fontSize:
                      "11px",

                    color:
                      "var(--text-soft)",
                  }}
                >
                  Flavours are
                  currently unavailable.
                </p>
              ) : flavours.length ===
                0 ? (
                <p
                  style={{
                    fontSize:
                      "11px",

                    color:
                      "var(--text-soft)",
                  }}
                >
                  No flavours are
                  currently available.
                </p>
              ) : (
                <div className="cake-size-options">
                  {flavours.map(
                    (flavour) => {
                      const active =
                        Number(
                          selectedFlavourId
                        ) ===
                        Number(
                          flavour.id
                        );

                      return (
                        <button
                          type="button"
                          key={
                            flavour.id
                          }
                          className={`cake-size-option ${
                            active
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            setSelectedFlavourId(
                              flavour.id
                            )
                          }
                        >
                          <span>
                            {
                              flavour.name
                            }
                          </span>

                          <small>
                            + Rs.{" "}
                            {Number(
                              flavour.charge || 0
                            ).toLocaleString()}
                          </small>

                          {active && (
                            <Check
                              size={
                                14
                              }
                            />
                          )}
                        </button>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            {/* ==================================
                FILLINGS
            ================================== */}

            <div className="cake-option-section">

              <div className="cake-option-heading">
                <div>
                  <span>
                    SELECT FILLING
                  </span>

                  <strong>
                    {selectedFillingData
                      ? selectedFillingData.name
                      : "No Filling"}
                  </strong>
                </div>
              </div>

              {fillingsLoading ? (
                <p
                  style={{
                    fontSize:
                      "11px",

                    color:
                      "var(--text-soft)",
                  }}
                >
                  Loading fillings...
                </p>
              ) : fillingError ? (
                <p
                  style={{
                    fontSize:
                      "11px",

                    color:
                      "var(--text-soft)",
                  }}
                >
                  Fillings are
                  currently unavailable.
                </p>
              ) : (
                <div className="cake-size-options">

                  {/* NO FILLING */}

                  <button
                    type="button"
                    className={`cake-size-option ${
                      selectedFillingId ===
                      null
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedFillingId(
                        null
                      )
                    }
                  >
                    <span>
                      No Filling
                    </span>

                    <small>
                      Rs. 0
                    </small>

                    {selectedFillingId ===
                      null && (
                      <Check
                        size={
                          14
                        }
                      />
                    )}
                  </button>

                  {/* FILLINGS */}

                  {fillings.map(
                    (filling) => {
                      const active =
                        Number(
                          selectedFillingId
                        ) ===
                        Number(
                          filling.id
                        );

                      return (
                        <button
                          type="button"
                          key={
                            filling.id
                          }
                          className={`cake-size-option ${
                            active
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            setSelectedFillingId(
                              filling.id
                            )
                          }
                        >
                          <span>
                            {
                              filling.name
                            }
                          </span>

                          <small>
                            + Rs.{" "}
                            {Number(
                              filling.charge
                            ).toLocaleString()}
                          </small>

                          {active && (
                            <Check
                              size={
                                14
                              }
                            />
                          )}
                        </button>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            {/* ==================================
                REFERENCE CAKE IMAGE
            ================================== */}

            <div className="cake-option-section">

              <div className="cake-option-heading">
                <div>
                  <span>
                    REFERENCE CAKE IMAGE
                  </span>

                  <strong>
                    {referenceImage
                      ? "Image Uploaded"
                      : "Optional"}
                  </strong>
                </div>
              </div>

              <p
                style={{
                  marginBottom:
                    "12px",

                  fontSize:
                    "11px",

                  lineHeight:
                    "1.7",

                  color:
                    "var(--text-soft)",
                }}
              >
                Have a cake design
                in mind? Upload a
                reference picture
                for our baker.
              </p>

              {!referencePreview ? (
                <label
                  style={{
                    minHeight:
                      "120px",

                    border:
                      "1px dashed var(--border)",

                    borderRadius:
                      "10px",

                    display:
                      "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    flexDirection:
                      "column",

                    gap:
                      "8px",

                    cursor:
                      referenceUploading
                        ? "not-allowed"
                        : "pointer",

                    background:
                      "var(--background-soft)",

                    padding:
                      "20px",
                  }}
                >
                  {referenceUploading ? (
                    <LoaderCircle
                      size={23}
                    />
                  ) : (
                    <Upload
                      size={23}
                    />
                  )}

                  <strong
                    style={{
                      fontSize:
                        "12px",
                    }}
                  >
                    Upload Reference
                    Image
                  </strong>

                  <span
                    style={{
                      fontSize:
                        "9px",

                      color:
                        "var(--text-soft)",
                    }}
                  >
                    JPG, PNG or WEBP
                    · Max 5 MB
                  </span>

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={
                      handleReferenceImage
                    }
                    disabled={
                      referenceUploading
                    }
                    style={{
                      display:
                        "none",
                    }}
                  />
                </label>
              ) : (
                <div
                  style={{
                    position:
                      "relative",

                    width:
                      "100%",

                    maxWidth:
                      "280px",
                  }}
                >
                  <img
                    src={
                      referencePreview
                    }
                    alt="Customer cake reference"
                    style={{
                      width:
                        "100%",

                      height:
                        "190px",

                      objectFit:
                        "cover",

                      display:
                        "block",

                      borderRadius:
                        "10px",

                      border:
                        "1px solid var(--border)",
                    }}
                  />

                  <button
                    type="button"
                    onClick={
                      removeReferenceImage
                    }
                    disabled={
                      referenceUploading
                    }
                    aria-label="Remove reference image"
                    style={{
                      position:
                        "absolute",

                      top:
                        "9px",

                      right:
                        "9px",

                      width:
                        "35px",

                      height:
                        "35px",

                      display:
                        "grid",

                      placeItems:
                        "center",

                      border:
                        "1px solid var(--border)",

                      borderRadius:
                        "50%",

                      background:
                        "#ffffff",

                      cursor:
                        referenceUploading
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    <Trash2
                      size={15}
                    />
                  </button>

                  {referenceUploading && (
                    <div
                      style={{
                        position:
                          "absolute",

                        inset:
                          "0",

                        display:
                          "grid",

                        placeItems:
                          "center",

                        borderRadius:
                          "10px",

                        background:
                          "rgba(255,255,255,0.75)",
                      }}
                    >
                      <div
                        style={{
                          display:
                            "flex",

                          alignItems:
                            "center",

                          gap:
                            "8px",

                          fontSize:
                            "11px",
                        }}
                      >
                        <LoaderCircle
                          size={17}
                        />

                        Uploading...
                      </div>
                    </div>
                  )}
                </div>
              )}

              {referenceError && (
                <p
                  style={{
                    marginTop:
                      "9px",

                    fontSize:
                      "10px",

                    color:
                      "#a33",
                  }}
                >
                  {referenceError}
                </p>
              )}

              {referenceImage &&
                !referenceUploading && (
                <p
                  style={{
                    marginTop:
                      "9px",

                    fontSize:
                      "10px",

                    color:
                      "var(--text-soft)",
                  }}
                >
                  ✓ Reference image
                  uploaded successfully.
                </p>
              )}
            </div>

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
                  <Minus
                    size={16}
                  />
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
                  <Plus
                    size={16}
                  />
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
              disabled={
                referenceUploading
              }
            >
              {referenceUploading ? (
                <LoaderCircle
                  size={18}
                />
              ) : (
                <ShoppingBag
                  size={18}
                />
              )}

              {referenceUploading
                ? "Uploading Image..."
                : "Add to Cart"}

              <span>
                Rs.{" "}
                {totalPrice.toLocaleString()}
              </span>
            </button>

            {addedMessage && (
              <div className="cake-added-message">
                <Check
                  size={15}
                />

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
                  prepared fresh
                  for your order.
                </p>
              </div>

              <div>
                <span>
                  CUSTOM DETAILS
                </span>

                <p>
                  Choose your
                  flavour, filling
                  and upload your
                  own reference
                  cake design.
                </p>
              </div>

              <div>
                <span>
                  HANDCRAFTED
                </span>

                <p>
                  Carefully
                  finished by hand
                  for your
                  celebration.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="cake-details-back">
          <Link to="/cakes">
            <ArrowLeft
              size={15}
            />

            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CakeDetails;