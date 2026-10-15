import { useEffect, useState } from "react";

import { ArrowRight, CakeSlice, Heart, Sparkles } from "lucide-react";

import { Link } from "react-router-dom";

import fallbackLogo from "../../assets/images/just-bake-it-logo.jpeg";

import CategoryCard from "../../components/customer/CategoryCard";

import CakeCard from "../../components/customer/CakeCard";

const API_ROOT = "https://coreops.pk/cakes/api";

const Home = () => {
  const [categories, setCategories] = useState([]);

  const [featuredCakes, setFeaturedCakes] = useState([]);

  const [homeBanner, setHomeBanner] = useState(null);

  const [loading, setLoading] = useState(true);

  // ==========================================

  // GET SIZE IN LB

  // ==========================================

  const getSizeInLb = (size) => {
    const sizeText = String(
      size?.size || size?.name || size?.size_name || "",
    ).trim();

    const match = sizeText.match(/(\d+(?:\.\d+)?)/);

    if (!match) {
      return 0;
    }

    const weight = Number(match[1]);

    return Number.isFinite(weight) ? weight : 0;
  };

  // ==========================================

  // GET STARTING PRICE

  //

  // Minimum Available Size

  // ×

  // Minimum Active Flavour Price Per LB

  // ==========================================

  const getStartingPrice = (cake) => {
    const sizes = Array.isArray(cake?.sizes) ? cake.sizes : [];

    const flavours = Array.isArray(cake?.flavours) ? cake.flavours : [];

    const sizeWeights = sizes

      .filter((size) => !size?.status || size.status === "Active")

      .map(getSizeInLb)

      .filter((weight) => weight > 0);

    const flavourPrices = flavours

      .filter(
        (flavour) =>
          (!flavour?.status || flavour.status === "Active") &&
          (!flavour?.master_status || flavour.master_status === "Active"),
      )

      .map((flavour) => Number(flavour?.charge || 0))

      .filter((price) => price > 0);

    if (sizeWeights.length === 0 || flavourPrices.length === 0) {
      return 0;
    }

    const minimumSize = Math.min(...sizeWeights);

    const minimumFlavourPrice = Math.min(...flavourPrices);

    return minimumSize * minimumFlavourPrice;
  };

  // ==========================================

  // NORMALIZE CAKE

  // ==========================================

  const normalizeCake = (cake) => {
    const category = typeof cake.category === "object" ? cake.category : null;

    // ==========================================

    // IMAGES

    // ==========================================

    const images = Array.isArray(cake.images)
      ? cake.images

          .map((image) =>
            typeof image === "string"
              ? image
              : image.image_url || image.url || "",
          )

          .filter(Boolean)
      : [];

    // ==========================================

    // SIZES

    // ==========================================

    const sizes = Array.isArray(cake.sizes)
      ? cake.sizes

          .filter((size) => !size.status || size.status === "Active")

          .map((size) => ({
            id: Number(size.size_id || size.id || 0),

            size_id: Number(size.size_id || size.id || 0),

            size: size.size_name || size.name || size.size || "",

            name: size.size_name || size.name || size.size || "",

            size_name: size.size_name || size.name || size.size || "",

            price: Number(size.price || 0),

            status: size.status || "Active",
          }))
      : [];

    // ==========================================

    // COLORS

    // ==========================================

    const colors = Array.isArray(cake.colors)
      ? cake.colors

          .filter((color) => !color.status || color.status === "Active")

          .map((color) => ({
            id: Number(color.color_id || color.id || 0),

            color_id: Number(color.color_id || color.id || 0),

            name: color.color_name || color.name || "",

            color_name: color.color_name || color.name || "",

            hex: color.hex_code || color.hex || "#ffffff",

            hex_code: color.hex_code || color.hex || "#ffffff",

            status: color.status || "Active",
          }))
      : [];

    // ==========================================

    // FILLINGS

    // ==========================================

    const fillings = Array.isArray(cake.fillings)
      ? cake.fillings

          .filter(
            (filling) =>
              (!filling.status || filling.status === "Active") &&
              (!filling.master_status || filling.master_status === "Active"),
          )

          .map((filling) => ({
            id: Number(filling.filling_id || filling.id || 0),

            filling_id: Number(filling.filling_id || filling.id || 0),

            name: filling.filling_name || filling.name || "",

            filling_name: filling.filling_name || filling.name || "",

            charge: Number(filling.charge || 0),

            status: filling.status || "Active",

            master_status: filling.master_status || "Active",
          }))
      : [];

    // ==========================================

    // FLAVOURS

    // charge = price per 1 LB

    // ==========================================

    const flavours = Array.isArray(cake.flavours)
      ? cake.flavours

          .filter(
            (flavour) =>
              (!flavour.status || flavour.status === "Active") &&
              (!flavour.master_status || flavour.master_status === "Active"),
          )

          .map((flavour) => ({
            id: Number(flavour.flavour_id || flavour.id || 0),

            flavour_id: Number(flavour.flavour_id || flavour.id || 0),

            name: flavour.flavour_name || flavour.name || "",

            flavour_name: flavour.flavour_name || flavour.name || "",

            charge: Number(flavour.charge || 0),

            status: flavour.status || "Active",

            master_status: flavour.master_status || "Active",
          }))
      : [];

    // ==========================================

    // FINAL NORMALIZED CAKE

    // ==========================================

    return {
      id: Number(cake.id),

      name: cake.name || "",

      slug: cake.slug || "",

      category: category?.name || cake.category_name || cake.category || "",

      categoryId: Number(category?.id || cake.category_id || 0),

      description: cake.description || cake.short_description || "",

      shortDescription: cake.short_description || "",

      image: cake.main_image || cake.image || images[0] || "",

      mainImage: cake.main_image || cake.image || images[0] || "",

      images,

      sizes,

      colors,

      fillings,

      flavours,

      featured: Number(cake.featured) === 1 || cake.featured === true,

      status: cake.status || "Active",
    };
  };

  // ==========================================

  // LOAD HOME DATA

  // ==========================================

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);

        const [categoryResponse, cakeResponse, bannerResponse] =
          await Promise.all([
            fetch(`${API_ROOT}/Categories/getAll.php`),

            fetch(`${API_ROOT}/Cakes/getAll.php`),

            fetch(`${API_ROOT}/HomeBanner/get.php`),
          ]);

        const categoryResult = await categoryResponse.json();

        const cakeResult = await cakeResponse.json();

        const bannerResult = await bannerResponse.json();

        // ======================================

        // HOME BANNER

        // ======================================

        if (
          bannerResponse.ok &&
          bannerResult.status === "success" &&
          bannerResult.data
        ) {
          setHomeBanner(bannerResult.data);
        }

        // ======================================

        // CATEGORIES

        // ======================================

        const categoryRows = Array.isArray(categoryResult.data)
          ? categoryResult.data
          : [];

        const activeCategories = categoryRows

          .filter((category) => category.status === "Active")

          .map((category) => ({
            id: Number(category.id),

            name: category.name || "",

            description: category.description || "",

            image: category.image_url || "",

            image_url: category.image_url || "",

            slug: category.slug || "",
          }));

        setCategories(activeCategories);

        // ======================================

        // CAKES

        // ======================================

        const cakeRows = Array.isArray(cakeResult.data) ? cakeResult.data : [];

        const activeCakes = cakeRows

          .map(normalizeCake)

          .filter((cake) => cake.status === "Active" && cake.sizes.length > 0);

        const featured = activeCakes.filter((cake) => cake.featured);

        setFeaturedCakes(
          featured.length > 0 ? featured.slice(0, 4) : activeCakes.slice(0, 4),
        );
      } catch (error) {
        console.error(
          "Home data loading error:",

          error,
        );

        setCategories([]);

        setFeaturedCakes([]);

        setHomeBanner(null);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  // ==========================================

  // HERO STARTING PRICE

  // ==========================================

  const heroStartingPrice =
    featuredCakes.length > 0 ? getStartingPrice(featuredCakes[0]) : 0;

  return (
    <div>
      {/* ================= ORDER NOTICE ================= */}

      <div className="order-notice-bar">
        <div className="order-notice-track">
          <span>
            ✦ Note: Place your order 3 days before, otherwise the order will not
            be accepted.
          </span>

          <span>
            ✦ Note: Place your order 3 days before, otherwise the order will not
            be accepted.
          </span>

          <span>
            ✦ Note: Place your order 3 days before, otherwise the order will not
            be accepted.
          </span>
        </div>
      </div>

      {/* ================= HERO ================= */}

      {Number(homeBanner?.is_active ?? 1) === 1 && (
        <section
          className="hero-section"
          style={{
            fontFamily: homeBanner?.hero_body_font || undefined,
          }}
        >
          <div className="hero-background-shape hero-shape-one" />

          <div className="hero-background-shape hero-shape-two" />

          <div className="container hero-grid">
            <div className="hero-content">
              <div className="home-brand-intro">
                {Number(homeBanner?.hero_show_logo ?? 1) === 1 && (
                  <img
                    src={
                      homeBanner?.hero_logo_url ||
                      homeBanner?.navbar_logo_url ||
                      fallbackLogo
                    }
                    alt="Just Bake It Official"
                    className="home-brand-logo"
                    style={{
                      width: `${Number(homeBanner?.hero_logo_size || 90)}px`,

                      height: "auto",
                    }}
                  />
                )}

                {Number(homeBanner?.hero_show_brand_text ?? 1) === 1 && (
                  <div>
                    <span
                      style={{
                        color: homeBanner?.hero_brand_small_color || undefined,

                        fontSize: `${Number(
                          homeBanner?.hero_brand_small_size || 11,
                        )}px`,
                      }}
                    >
                      {homeBanner?.brand_small_text || "JUST BAKE IT OFFICIAL"}
                    </span>

                    <strong
                      style={{
                        color: homeBanner?.hero_brand_title_color || undefined,

                        fontSize: `${Number(
                          homeBanner?.hero_brand_title_size || 22,
                        )}px`,
                      }}
                    >
                      {homeBanner?.brand_title || "Fresh & Delicious Cakes"}
                    </strong>
                  </div>
                )}
              </div>

              <div
                className="hero-eyebrow"
                style={{
                  color: homeBanner?.hero_eyebrow_color || undefined,
                }}
              >
                <span />

                {homeBanner?.eyebrow_text || "Handcrafted in Lahore"}
              </div>

              <h1
                style={{
                  color: homeBanner?.hero_heading_color || undefined,

                  fontFamily: homeBanner?.hero_heading_font || undefined,
                }}
              >
                {homeBanner?.heading || "Cakes made for"}

                <br />

                <em
                  style={{
                    color: homeBanner?.hero_highlight_color || undefined,
                  }}
                >
                  {homeBanner?.heading_highlight || "beautiful moments."}
                </em>
              </h1>

              <p
                style={{
                  color: homeBanner?.hero_subheading_color || undefined,
                }}
              >
                {homeBanner?.subheading ||
                  "Elegant, handcrafted cakes made fresh with thoughtful details, premium ingredients and a little bit of magic."}
              </p>

              <div className="hero-buttons">
                <Link
                  to={homeBanner?.button_link || "/cakes"}
                  className="primary-button"
                  style={{
                    color: homeBanner?.hero_primary_text_color || undefined,

                    background: homeBanner?.hero_primary_bg_color || undefined,
                  }}
                >
                  {homeBanner?.button_text || "Explore Cakes"}

                  <ArrowRight size={18} />
                </Link>

                <Link
                  to={homeBanner?.secondary_button_link || "/cakes"}
                  className="text-button"
                  style={{
                    color: homeBanner?.hero_secondary_text_color || undefined,

                    background:
                      homeBanner?.hero_secondary_bg_color || undefined,

                    padding: "12px 18px",
                  }}
                >
                  {homeBanner?.secondary_button_text || "Browse Collections"}
                </Link>
              </div>

              <div className="hero-features">
                <div>
                  <Sparkles size={18} />

                  <span>{homeBanner?.feature_one || "Freshly Baked"}</span>
                </div>

                <div>
                  <Heart size={18} />

                  <span>{homeBanner?.feature_two || "Made With Love"}</span>
                </div>

                <div>
                  <CakeSlice size={18} />

                  <span>{homeBanner?.feature_three || "Custom Designs"}</span>
                </div>
              </div>
            </div>

            <div className="hero-image-area">
              <div className="hero-image-main">
                <img
                  src={
                    homeBanner?.image_url ||
                    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=90"
                  }
                  alt={homeBanner?.product_title || "Elegant homemade cake"}
                />

                <div className="hero-floating-card">
                  <span>{homeBanner?.product_label || "Our favourite"}</span>

                  <strong>
                    {homeBanner?.product_title ||
                      featuredCakes[0]?.name ||
                      "Chocolate Bliss"}
                  </strong>

                  <div>
                    Starting from
                    <b>
                      {homeBanner?.product_price ||
                        (heroStartingPrice > 0
                          ? `Rs. ${heroStartingPrice.toLocaleString("en-PK")}`
                          : "Price unavailable")}
                    </b>
                  </div>
                </div>
              </div>

              {homeBanner?.secondary_image_url && (
                <div className="hero-small-image">
                  <img
                    src={homeBanner.secondary_image_url}
                    alt="Featured cake detail"
                  />
                </div>
              )}

              <div className="hero-script">
                {homeBanner?.vertical_text || "made with love"}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= INTRO ================= */}

      <section className="intro-section">
        <div className="container intro-content">
          <span className="section-kicker">A LITTLE SOMETHING SWEET</span>

          <h2>
            Every celebration deserves
            <br />
            something <em>extraordinary.</em>
          </h2>

          <p>
            From intimate birthdays to unforgettable celebrations, every cake is
            handcrafted to look beautiful and taste even better.
          </p>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}

      <section id="categories" className="category-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-kicker">SHOP BY OCCASION</span>

              <h2>Our Collections</h2>
            </div>

            <Link to="/cakes" className="section-link">
              View all cakes
              <ArrowRight size={17} />
            </Link>
          </div>

          {!loading && (
            <div className="category-grid">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= FEATURED ================= */}

      <section className="featured-section">
        <div className="container">
          <div className="center-section-heading">
            <span className="section-kicker">OUR FAVOURITES</span>

            <h2>Made to make you smile.</h2>

            <p>A few of our most-loved handcrafted creations.</p>
          </div>

          {!loading && (
            <div className="cake-grid">
              {featuredCakes.map((cake) => (
                <CakeCard key={cake.id} cake={cake} />
              ))}
            </div>
          )}

          <div className="featured-button">
            <Link to="/cakes" className="outline-button">
              Shop All Cakes
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= CUSTOM CAKE ================= */}

      {Number(homeBanner?.custom_is_active ?? 1) === 1 && (
        <section className="custom-cake-section">
          <div className="container custom-cake-wrapper">
            <div className="custom-cake-image">
              <img
                src={
                  homeBanner?.custom_image_url ||
                  "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1200&q=90"
                }
                alt="Custom cake"
              />
            </div>

            <div
              className="custom-cake-content"
              style={{
                fontFamily: homeBanner?.custom_body_font || undefined,
              }}
            >
              <span
                className="section-kicker"
                style={{
                  color: homeBanner?.custom_eyebrow_color || undefined,
                }}
              >
                {homeBanner?.custom_eyebrow || "MADE JUST FOR YOU"}
              </span>

              <h2
                style={{
                  color: homeBanner?.custom_heading_color || undefined,

                  fontFamily: homeBanner?.custom_heading_font || undefined,
                }}
              >
                {homeBanner?.custom_heading || "Have something"}
                <br />
                <em
                  style={{
                    color: homeBanner?.custom_highlight_color || undefined,
                  }}
                >
                  {homeBanner?.custom_heading_highlight || "special"}
                </em>{" "}
                {homeBanner?.custom_heading_after || "in mind?"}
              </h2>

              <p
                style={{
                  color: homeBanner?.custom_description_color || undefined,
                }}
              >
                {homeBanner?.custom_description ||
                  "Tell us about your celebration and we'll help create a cake that feels uniquely yours — from colours and flavours to every beautiful finishing detail."}
              </p>

              <Link
                to={homeBanner?.custom_button_link || "/cakes"}
                className="primary-button"
                style={{
                  color: homeBanner?.custom_button_text_color || undefined,

                  background: homeBanner?.custom_button_bg_color || undefined,
                }}
              >
                {homeBanner?.custom_button_text || "Create Your Cake"}

                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ================= VALUES ================= */}

      <section id="about" className="values-section">
        <div className="container values-grid">
          <div className="value-item">
            <div className="value-number">01</div>

            <h3>Baked Fresh</h3>

            <p>
              Every cake is freshly prepared for your order using carefully
              selected ingredients.
            </p>
          </div>

          <div className="value-item">
            <div className="value-number">02</div>

            <h3>Handcrafted</h3>

            <p>
              Thoughtfully designed and finished by hand to make every
              celebration feel special.
            </p>
          </div>

          <div className="value-item">
            <div className="value-number">03</div>

            <h3>Made for You</h3>

            <p>
              Choose your preferred size, colours and details to create
              something that feels personal.
            </p>
          </div>
        </div>
      </section>

      {/* ================= NEWSLETTER ================= */}

      {/* <section className="newsletter-section">

        <div className="container newsletter-content">

          <div>

            <span className="section-kicker">

              A LITTLE MORE SWEETNESS

            </span>

            <h2>Join our cake club.</h2>

            <p>

              Be the first to hear about new designs

              and seasonal collections.

            </p>

          </div>

          <form

            className="newsletter-form"

            onSubmit={(event) =>

              event.preventDefault()

            }

          >

            <input

              type="email"

              placeholder="Your email address"

            />

            <button type="submit">

              Subscribe

              <ArrowRight size={17} />

            </button>

          </form>

        </div>

      </section> */}
    </div>
  );
};
export default Home;
