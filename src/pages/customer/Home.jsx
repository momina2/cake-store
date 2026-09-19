// import { useEffect, useState } from "react";
// import { ArrowRight, CakeSlice, Heart, Sparkles } from "lucide-react";
// import { Link } from "react-router-dom";
// import logo from "../../assets/images/just-bake-it-logo.jpeg";

// import CategoryCard from "../../components/customer/CategoryCard";
// import CakeCard from "../../components/customer/CakeCard";

// const API_ROOT = "https://coreops.pk/cakes/api";

// const Home = () => {
//   const [categories, setCategories] = useState([]);
//   const [featuredCakes, setFeaturedCakes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ==========================================
//   // NORMALIZE CAKE
//   // ==========================================

//   const normalizeCake = (cake) => {
//     const category = typeof cake.category === "object" ? cake.category : null;

//     const images = Array.isArray(cake.images)
//       ? cake.images
//           .map((image) =>
//             typeof image === "string"
//               ? image
//               : image.image_url || image.url || "",
//           )
//           .filter(Boolean)
//       : [];

//     const sizes = Array.isArray(cake.sizes)
//       ? cake.sizes
//           .filter((size) => !size.status || size.status === "Active")
//           .map((size) => ({
//             id: Number(size.size_id || size.id || 0),
//             size: size.size_name || size.name || size.size || "",
//             name: size.size_name || size.name || size.size || "",
//             price: Number(size.price || 0),
//           }))
//       : [];

//     const colors = Array.isArray(cake.colors)
//       ? cake.colors
//           .filter((color) => !color.status || color.status === "Active")
//           .map((color) => ({
//             id: Number(color.color_id || color.id || 0),
//             name: color.color_name || color.name || "",
//             hex: color.hex_code || color.hex || "#ffffff",
//           }))
//       : [];

//     return {
//       id: Number(cake.id),

//       name: cake.name || "",

//       category: category?.name || cake.category_name || cake.category || "",

//       categoryId: Number(category?.id || cake.category_id || 0),

//       description: cake.description || cake.short_description || "",

//       shortDescription: cake.short_description || "",

//       image: cake.main_image || cake.image || images[0] || "",

//       mainImage: cake.main_image || cake.image || images[0] || "",

//       images,

//       sizes,

//       colors,

//       featured: Number(cake.featured) === 1 || cake.featured === true,

//       status: cake.status || "Active",
//     };
//   };

//   // ==========================================
//   // LOAD HOME DATA
//   // ==========================================

//   useEffect(() => {
//     const loadHomeData = async () => {
//       try {
//         setLoading(true);

//         const [categoryResponse, cakeResponse] = await Promise.all([
//           fetch(`${API_ROOT}/Categories/getAll.php`),
//           fetch(`${API_ROOT}/Cakes/getAll.php`),
//         ]);

//         const categoryResult = await categoryResponse.json();

//         const cakeResult = await cakeResponse.json();

//         // ======================================
//         // CATEGORIES
//         // ======================================

//         const categoryRows = Array.isArray(categoryResult.data)
//           ? categoryResult.data
//           : [];

//         const activeCategories = categoryRows
//           .filter((category) => category.status === "Active")
//           .map((category) => ({
//             id: Number(category.id),
//             name: category.name || "",
//             description: category.description || "",
//             image: category.image_url || "",
//             image_url: category.image_url || "",
//             slug: category.slug || "",
//           }));

//         setCategories(activeCategories);

//         // ======================================
//         // CAKES
//         // ======================================

//         const cakeRows = Array.isArray(cakeResult.data) ? cakeResult.data : [];

//         const activeCakes = cakeRows
//           .map(normalizeCake)
//           .filter((cake) => cake.status === "Active" && cake.sizes.length > 0);

//         const featured = activeCakes.filter((cake) => cake.featured);

//         setFeaturedCakes(
//           featured.length > 0 ? featured.slice(0, 4) : activeCakes.slice(0, 4),
//         );
//       } catch (error) {
//         console.error("Home data loading error:", error);

//         setCategories([]);
//         setFeaturedCakes([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadHomeData();
//   }, []);

//   return (
//     <div>
//       {/* ================= ORDER NOTICE ================= */}

//       <div className="order-notice-bar">
//         <div className="order-notice-track">
//           <span>
//             ✦ Note: Place your order 3 days before, otherwise the order will not
//             be accepted.
//           </span>

//           <span>
//             ✦ Note: Place your order 3 days before, otherwise the order will not
//             be accepted.
//           </span>

//           <span>
//             ✦ Note: Place your order 3 days before, otherwise the order will not
//             be accepted.
//           </span>
//         </div>
//       </div>

//       {/* ================= HERO ================= */}

//       <section className="hero-section">
//         <div className="hero-background-shape hero-shape-one" />
//         <div className="hero-background-shape hero-shape-two" />

//         <div className="container hero-grid">
//           <div className="hero-content">
//             <div className="home-brand-intro">
//               <img
//                 src={logo}
//                 alt="Just Bake It Official"
//                 className="home-brand-logo"
//               />

//               <div>
//                 <span>JUST BAKE IT OFFICIAL</span>
//                 <strong>Fresh & Delicious Cakes</strong>
//               </div>
//             </div>

//             <div className="hero-eyebrow">
//               <span />
//               Handcrafted in Lahore
//             </div>

//             <h1>
//               Cakes made for
//               <br />
//               <em>beautiful moments.</em>
//             </h1>

//             <p>
//               Elegant, handcrafted cakes made fresh with thoughtful details,
//               premium ingredients and a little bit of magic.
//             </p>

//             <div className="hero-buttons">
//               <Link to="/cakes" className="primary-button">
//                 Explore Cakes
//                 <ArrowRight size={18} />
//               </Link>

//               <a href="#categories" className="text-button">
//                 Browse Collections
//               </a>
//             </div>

//             <div className="hero-features">
//               <div>
//                 <Sparkles size={18} />
//                 <span>Freshly Baked</span>
//               </div>

//               <div>
//                 <Heart size={18} />
//                 <span>Made With Love</span>
//               </div>

//               <div>
//                 <CakeSlice size={18} />
//                 <span>Custom Designs</span>
//               </div>
//             </div>
//           </div>

//           <div className="hero-image-area">
//             <div className="hero-image-main">
//               <img
//                 src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=90"
//                 alt="Elegant homemade cake"
//               />

//               <div className="hero-floating-card">
//                 <span>Our favourite</span>
//                 <strong>{featuredCakes[0]?.name || "Chocolate Bliss"}</strong>

//                 <div>
//                   Starting from
//                   <b>
//                     Rs.{" "}
//                     {Number(
//                       featuredCakes[0]?.sizes?.[0]?.price || 1800,
//                     ).toLocaleString()}
//                   </b>
//                 </div>
//               </div>
//             </div>

//             <div className="hero-small-image">
//               <img
//                 src="https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=500&q=80"
//                 alt="Homemade cake detail"
//               />
//             </div>

//             <div className="hero-script">made with love</div>
//           </div>
//         </div>
//       </section>

//       {/* ================= INTRO ================= */}

//       <section className="intro-section">
//         <div className="container intro-content">
//           <span className="section-kicker">A LITTLE SOMETHING SWEET</span>

//           <h2>
//             Every celebration deserves
//             <br />
//             something <em>extraordinary.</em>
//           </h2>

//           <p>
//             From intimate birthdays to unforgettable celebrations, every cake is
//             handcrafted to look beautiful and taste even better.
//           </p>
//         </div>
//       </section>

//       {/* ================= CATEGORIES ================= */}

//       <section id="categories" className="category-section">
//         <div className="container">
//           <div className="section-heading">
//             <div>
//               <span className="section-kicker">SHOP BY OCCASION</span>

//               <h2>Our Collections</h2>
//             </div>

//             <Link to="/cakes" className="section-link">
//               View all cakes
//               <ArrowRight size={17} />
//             </Link>
//           </div>

//           {!loading && (
//             <div className="category-grid">
//               {categories.map((category) => (
//                 <CategoryCard key={category.id} category={category} />
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* ================= FEATURED ================= */}

//       <section className="featured-section">
//         <div className="container">
//           <div className="center-section-heading">
//             <span className="section-kicker">OUR FAVOURITES</span>

//             <h2>Made to make you smile.</h2>

//             <p>A few of our most-loved handcrafted creations.</p>
//           </div>

//           {!loading && (
//             <div className="cake-grid">
//               {featuredCakes.map((cake) => (
//                 <CakeCard key={cake.id} cake={cake} />
//               ))}
//             </div>
//           )}

//           <div className="featured-button">
//             <Link to="/cakes" className="outline-button">
//               Shop All Cakes
//               <ArrowRight size={17} />
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* ================= CUSTOM CAKE ================= */}

//       <section className="custom-cake-section">
//         <div className="container custom-cake-wrapper">
//           <div className="custom-cake-image">
//             <img
//               src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1200&q=90"
//               alt="Custom cake"
//             />
//           </div>

//           <div className="custom-cake-content">
//             <span className="section-kicker">MADE JUST FOR YOU</span>

//             <h2>
//               Have something
//               <br />
//               <em>special</em> in mind?
//             </h2>

//             <p>
//               Tell us about your celebration and we'll help create a cake that
//               feels uniquely yours — from colours and flavours to every
//               beautiful finishing detail.
//             </p>

//             <Link to="/cakes" className="primary-button">
//               Create Your Cake
//               <ArrowRight size={18} />
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* ================= VALUES ================= */}

//       <section id="about" className="values-section">
//         <div className="container values-grid">
//           <div className="value-item">
//             <div className="value-number">01</div>

//             <h3>Baked Fresh</h3>

//             <p>
//               Every cake is freshly prepared for your order using carefully
//               selected ingredients.
//             </p>
//           </div>

//           <div className="value-item">
//             <div className="value-number">02</div>

//             <h3>Handcrafted</h3>

//             <p>
//               Thoughtfully designed and finished by hand to make every
//               celebration feel special.
//             </p>
//           </div>

//           <div className="value-item">
//             <div className="value-number">03</div>

//             <h3>Made for You</h3>

//             <p>
//               Choose your preferred size, colours and details to create
//               something that feels personal.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* ================= NEWSLETTER ================= */}

//       <section className="newsletter-section">
//         <div className="container newsletter-content">
//           <div>
//             <span className="section-kicker">A LITTLE MORE SWEETNESS</span>

//             <h2>Join our cake club.</h2>

//             <p>
//               Be the first to hear about new designs and seasonal collections.
//             </p>
//           </div>

//           <form
//             className="newsletter-form"
//             onSubmit={(event) => event.preventDefault()}
//           >
//             <input type="email" placeholder="Your email address" />

//             <button type="submit">
//               Subscribe
//               <ArrowRight size={17} />
//             </button>
//           </form>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;




import { useEffect, useState } from "react";
import {
  ArrowRight,
  CakeSlice,
  Heart,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import logo from "../../assets/images/just-bake-it-logo.jpeg";

import CategoryCard from "../../components/customer/CategoryCard";
import CakeCard from "../../components/customer/CakeCard";

const API_ROOT = "https://coreops.pk/cakes/api";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredCakes, setFeaturedCakes] = useState([]);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // NORMALIZE CAKE
  // ==========================================

  const normalizeCake = (cake) => {
    const category =
      typeof cake.category === "object"
        ? cake.category
        : null;

    const images = Array.isArray(cake.images)
      ? cake.images
          .map((image) =>
            typeof image === "string"
              ? image
              : image.image_url || image.url || ""
          )
          .filter(Boolean)
      : [];

    const sizes = Array.isArray(cake.sizes)
      ? cake.sizes
          .filter(
            (size) =>
              !size.status ||
              size.status === "Active"
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
          }))
      : [];

    const colors = Array.isArray(cake.colors)
      ? cake.colors
          .filter(
            (color) =>
              !color.status ||
              color.status === "Active"
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
          }))
      : [];

    return {
      id: Number(cake.id),

      name: cake.name || "",

      category:
        category?.name ||
        cake.category_name ||
        cake.category ||
        "",

      categoryId: Number(
        category?.id ||
          cake.category_id ||
          0
      ),

      description:
        cake.description ||
        cake.short_description ||
        "",

      shortDescription:
        cake.short_description || "",

      image:
        cake.main_image ||
        cake.image ||
        images[0] ||
        "",

      mainImage:
        cake.main_image ||
        cake.image ||
        images[0] ||
        "",

      images,

      sizes,

      colors,

      featured:
        Number(cake.featured) === 1 ||
        cake.featured === true,

      status:
        cake.status || "Active",
    };
  };

  // ==========================================
  // LOAD HOME DATA
  // ==========================================

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);

        const [
          categoryResponse,
          cakeResponse,
          heroResponse,
        ] = await Promise.all([
          fetch(
            `${API_ROOT}/Categories/getAll.php`
          ),

          fetch(
            `${API_ROOT}/Cakes/getAll.php`
          ),

          fetch(
            `${API_ROOT}/HomeBanner/get.php`
          ),
        ]);

        // ======================================
        // READ RESPONSES
        // ======================================

        const categoryResult =
          await categoryResponse.json();

        const cakeResult =
          await cakeResponse.json();

        const heroResult =
          await heroResponse.json();

        // ======================================
        // HERO
        // ======================================

        if (
          heroResponse.ok &&
          heroResult.status === "success" &&
          heroResult.data
        ) {
          setHero({
            ...heroResult.data,

            id: Number(
              heroResult.data.id || 0
            ),

            is_active:
              Number(
                heroResult.data.is_active
              ) === 1
                ? 1
                : 0,
          });
        } else {
          console.error(
            "Unable to load home hero:",
            heroResult
          );

          setHero(null);
        }

        // ======================================
        // CATEGORIES
        // ======================================

        const categoryRows =
          Array.isArray(
            categoryResult.data
          )
            ? categoryResult.data
            : [];

        const activeCategories =
          categoryRows
            .filter(
              (category) =>
                category.status ===
                "Active"
            )
            .map((category) => ({
              id: Number(
                category.id
              ),

              name:
                category.name || "",

              description:
                category.description ||
                "",

              image:
                category.image_url ||
                "",

              image_url:
                category.image_url ||
                "",

              slug:
                category.slug || "",
            }));

        setCategories(
          activeCategories
        );

        // ======================================
        // CAKES
        // ======================================

        const cakeRows =
          Array.isArray(
            cakeResult.data
          )
            ? cakeResult.data
            : [];

        const activeCakes =
          cakeRows
            .map(normalizeCake)
            .filter(
              (cake) =>
                cake.status ===
                  "Active" &&
                cake.sizes.length > 0
            );

        const featured =
          activeCakes.filter(
            (cake) => cake.featured
          );

        setFeaturedCakes(
          featured.length > 0
            ? featured.slice(0, 4)
            : activeCakes.slice(0, 4)
        );
      } catch (error) {
        console.error(
          "Home data loading error:",
          error
        );

        setCategories([]);
        setFeaturedCakes([]);
        setHero(null);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  // ==========================================
  // HERO BUTTON
  // ==========================================

  const renderHeroButton = (
    text,
    link,
    className,
    showArrow = false
  ) => {
    if (!text) {
      return null;
    }

    const target =
      link || "/cakes";

    /*
     * Hash link
     * Example: #categories
     */

    if (target.startsWith("#")) {
      return (
        <a
          href={target}
          className={className}
        >
          {text}

          {showArrow && (
            <ArrowRight
              size={18}
            />
          )}
        </a>
      );
    }

    /*
     * External link
     */

    if (
      target.startsWith("http://") ||
      target.startsWith("https://")
    ) {
      return (
        <a
          href={target}
          className={className}
          target="_blank"
          rel="noreferrer"
        >
          {text}

          {showArrow && (
            <ArrowRight
              size={18}
            />
          )}
        </a>
      );
    }

    /*
     * React route
     */

    return (
      <Link
        to={target}
        className={className}
      >
        {text}

        {showArrow && (
          <ArrowRight
            size={18}
          />
        )}
      </Link>
    );
  };

  return (
    <div>

      {/* ================= ORDER NOTICE ================= */}

      <div className="order-notice-bar">
        <div className="order-notice-track">

          <span>
            ✦ Note: Place your order 3 days before,
            otherwise the order will not be accepted.
          </span>

          <span>
            ✦ Note: Place your order 3 days before,
            otherwise the order will not be accepted.
          </span>

          <span>
            ✦ Note: Place your order 3 days before,
            otherwise the order will not be accepted.
          </span>

        </div>
      </div>

      {/* ================= HERO ================= */}

      {!loading &&
        hero &&
        Number(hero.is_active) === 1 && (
          <section className="hero-section">

            <div className="hero-background-shape hero-shape-one" />

            <div className="hero-background-shape hero-shape-two" />

            <div className="container hero-grid">

              {/* ================= LEFT SIDE ================= */}

              <div className="hero-content">

                {/* BRAND */}

                <div className="home-brand-intro">

                  <img
                    src={logo}
                    alt="Just Bake It Official"
                    className="home-brand-logo"
                  />

                  <div>

                    {hero.brand_small_text && (
                      <span>
                        {hero.brand_small_text}
                      </span>
                    )}

                    {hero.brand_title && (
                      <strong>
                        {hero.brand_title}
                      </strong>
                    )}

                  </div>
                </div>

                {/* EYEBROW */}

                {hero.eyebrow_text && (
                  <div className="hero-eyebrow">

                    <span />

                    {hero.eyebrow_text}

                  </div>
                )}

                {/* MAIN HEADING */}

                {(hero.heading ||
                  hero.heading_highlight) && (
                  <h1>

                    {hero.heading}

                    {hero.heading &&
                      hero.heading_highlight && (
                        <br />
                      )}

                    {hero.heading_highlight && (
                      <em>
                        {
                          hero.heading_highlight
                        }
                      </em>
                    )}

                  </h1>
                )}

                {/* DESCRIPTION */}

                {hero.subheading && (
                  <p>
                    {hero.subheading}
                  </p>
                )}

                {/* BUTTONS */}

                <div className="hero-buttons">

                  {renderHeroButton(
                    hero.button_text,
                    hero.button_link,
                    "primary-button",
                    true
                  )}

                  {renderHeroButton(
                    hero.secondary_button_text,
                    hero.secondary_button_link,
                    "text-button",
                    false
                  )}

                </div>

                {/* FEATURES */}

                <div className="hero-features">

                  {hero.feature_one && (
                    <div>
                      <Sparkles
                        size={18}
                      />

                      <span>
                        {
                          hero.feature_one
                        }
                      </span>
                    </div>
                  )}

                  {hero.feature_two && (
                    <div>
                      <Heart
                        size={18}
                      />

                      <span>
                        {
                          hero.feature_two
                        }
                      </span>
                    </div>
                  )}

                  {hero.feature_three && (
                    <div>
                      <CakeSlice
                        size={18}
                      />

                      <span>
                        {
                          hero.feature_three
                        }
                      </span>
                    </div>
                  )}

                </div>
              </div>

              {/* ================= RIGHT SIDE ================= */}

              <div className="hero-image-area">

                {/* VERTICAL TEXT */}

                {hero.vertical_text && (
                  <div className="hero-script">
                    {hero.vertical_text}
                  </div>
                )}

                {/* MAIN IMAGE */}

                <div className="hero-image-main">

                  {hero.image_url ? (
                    <img
                      src={
                        hero.image_url
                      }
                      alt={
                        hero.product_title ||
                        "Just Bake It Official cake"
                      }
                    />
                  ) : (
                    <div className="hero-image-placeholder">
                      <CakeSlice
                        size={50}
                      />
                    </div>
                  )}

                  {/* FLOATING PRODUCT CARD */}

                  {(hero.product_label ||
                    hero.product_title ||
                    hero.product_price) && (
                    <div className="hero-floating-card">

                      {hero.product_label && (
                        <span>
                          {
                            hero.product_label
                          }
                        </span>
                      )}

                      {hero.product_title && (
                        <strong>
                          {
                            hero.product_title
                          }
                        </strong>
                      )}

                      {hero.product_price && (
                        <div>

                          Starting from

                          <b>
                            {
                              hero.product_price
                            }
                          </b>

                        </div>
                      )}

                    </div>
                  )}

                </div>

                {/* SECONDARY IMAGE */}

                {hero.secondary_image_url && (
                  <div className="hero-small-image">

                    <img
                      src={
                        hero.secondary_image_url
                      }
                      alt="Featured cake"
                    />

                  </div>
                )}

              </div>
            </div>
          </section>
        )}

      {/* ================= INTRO ================= */}

      <section className="intro-section">

        <div className="container intro-content">

          <span className="section-kicker">
            A LITTLE SOMETHING SWEET
          </span>

          <h2>
            Every celebration deserves
            <br />
            something{" "}
            <em>
              extraordinary.
            </em>
          </h2>

          <p>
            From intimate birthdays to unforgettable
            celebrations, every cake is handcrafted to
            look beautiful and taste even better.
          </p>

        </div>
      </section>

      {/* ================= CATEGORIES ================= */}

      <section
        id="categories"
        className="category-section"
      >

        <div className="container">

          <div className="section-heading">

            <div>

              <span className="section-kicker">
                SHOP BY OCCASION
              </span>

              <h2>
                Our Collections
              </h2>

            </div>

            <Link
              to="/cakes"
              className="section-link"
            >
              View all cakes

              <ArrowRight
                size={17}
              />
            </Link>

          </div>

          {!loading && (
            <div className="category-grid">

              {categories.map(
                (category) => (
                  <CategoryCard
                    key={
                      category.id
                    }
                    category={
                      category
                    }
                  />
                )
              )}

            </div>
          )}

        </div>
      </section>

      {/* ================= FEATURED ================= */}

      <section className="featured-section">

        <div className="container">

          <div className="center-section-heading">

            <span className="section-kicker">
              OUR FAVOURITES
            </span>

            <h2>
              Made to make you smile.
            </h2>

            <p>
              A few of our most-loved handcrafted
              creations.
            </p>

          </div>

          {!loading && (
            <div className="cake-grid">

              {featuredCakes.map(
                (cake) => (
                  <CakeCard
                    key={cake.id}
                    cake={cake}
                  />
                )
              )}

            </div>
          )}

          <div className="featured-button">

            <Link
              to="/cakes"
              className="outline-button"
            >
              Shop All Cakes

              <ArrowRight
                size={17}
              />
            </Link>

          </div>

        </div>
      </section>

      {/* ================= CUSTOM CAKE ================= */}

      <section className="custom-cake-section">

        <div className="container custom-cake-wrapper">

          <div className="custom-cake-image">

            <img
              src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1200&q=90"
              alt="Custom cake"
            />

          </div>

          <div className="custom-cake-content">

            <span className="section-kicker">
              MADE JUST FOR YOU
            </span>

            <h2>
              Have something
              <br />
              <em>
                special
              </em>{" "}
              in mind?
            </h2>

            <p>
              Tell us about your celebration and we'll
              help create a cake that feels uniquely
              yours — from colours and flavours to every
              beautiful finishing detail.
            </p>

            <Link
              to="/cakes"
              className="primary-button"
            >
              Create Your Cake

              <ArrowRight
                size={18}
              />
            </Link>

          </div>

        </div>
      </section>

      {/* ================= VALUES ================= */}

      <section
        id="about"
        className="values-section"
      >

        <div className="container values-grid">

          <div className="value-item">

            <div className="value-number">
              01
            </div>

            <h3>
              Baked Fresh
            </h3>

            <p>
              Every cake is freshly prepared for your
              order using carefully selected ingredients.
            </p>

          </div>

          <div className="value-item">

            <div className="value-number">
              02
            </div>

            <h3>
              Handcrafted
            </h3>

            <p>
              Thoughtfully designed and finished by hand
              to make every celebration feel special.
            </p>

          </div>

          <div className="value-item">

            <div className="value-number">
              03
            </div>

            <h3>
              Made for You
            </h3>

            <p>
              Choose your preferred size, colours and
              details to create something that feels
              personal.
            </p>

          </div>

        </div>
      </section>

      {/* ================= NEWSLETTER ================= */}

      <section className="newsletter-section">

        <div className="container newsletter-content">

          <div>

            <span className="section-kicker">
              A LITTLE MORE SWEETNESS
            </span>

            <h2>
              Join our cake club.
            </h2>

            <p>
              Be the first to hear about new designs and
              seasonal collections.
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

              <ArrowRight
                size={17}
              />

            </button>

          </form>

        </div>
      </section>

    </div>
  );
};

export default Home;