import { ArrowRight, CakeSlice, Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { getCustomerCategories, getFeaturedCakes } from "../../utils/catalog";
import CategoryCard from "../../components/customer/CategoryCard";
import CakeCard from "../../components/customer/CakeCard";
import { useState } from "react";
;

const Home = () => {
  const [categories] = useState(() => getCustomerCategories());

  const [featuredCakes] = useState(() => getFeaturedCakes());

  return (
    <div>
      {/* ================= HERO ================= */}

      <section className="hero-section">
        <div className="hero-background-shape hero-shape-one"></div>
        <div className="hero-background-shape hero-shape-two"></div>

        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span></span>
              Handcrafted in Lahore
            </div>

            <h1>
              Cakes made for
              <br />
              <em>beautiful moments.</em>
            </h1>

            <p>
              Elegant, handcrafted cakes made fresh with thoughtful details,
              premium ingredients and a little bit of magic.
            </p>

            <div className="hero-buttons">
              <Link to="/cakes" className="primary-button">
                Explore Cakes
                <ArrowRight size={18} />
              </Link>

              <a href="#categories" className="text-button">
                Browse Collections
              </a>
            </div>

            <div className="hero-features">
              <div>
                <Sparkles size={18} />
                <span>Freshly Baked</span>
              </div>

              <div>
                <Heart size={18} />
                <span>Made With Love</span>
              </div>

              <div>
                <CakeSlice size={18} />
                <span>Custom Designs</span>
              </div>
            </div>
          </div>

          <div className="hero-image-area">
            <div className="hero-image-main">
              <img
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=90"
                alt="Elegant homemade cake"
              />

              <div className="hero-floating-card">
                <span>Our favourite</span>
                <strong>Chocolate Bliss</strong>

                <div>
                  Starting from
                  <b>Rs. 1,800</b>
                </div>
              </div>
            </div>

            <div className="hero-small-image">
              <img
                src="https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=500&q=80"
                alt="Homemade cake detail"
              />
            </div>

            <div className="hero-script">made with love</div>
          </div>
        </div>
      </section>

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

          <div className="category-grid">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURED CAKES ================= */}

      <section className="featured-section">
        <div className="container">
          <div className="center-section-heading">
            <span className="section-kicker">OUR FAVOURITES</span>
            <h2>Made to make you smile.</h2>

            <p>A few of our most-loved handcrafted creations.</p>
          </div>

          <div className="cake-grid">
            {featuredCakes.map((cake) => (
              <CakeCard key={cake.id} cake={cake} />
            ))}
          </div>

          <div className="featured-button">
            <Link to="/cakes" className="outline-button">
              Shop All Cakes
              <ArrowRight size={17} />
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
            <span className="section-kicker">MADE JUST FOR YOU</span>

            <h2>
              Have something
              <br />
              <em>special</em> in mind?
            </h2>

            <p>
              Tell us about your celebration and we'll help create a cake that
              feels uniquely yours — from colours and flavours to every
              beautiful finishing detail.
            </p>

            <Link to="/cakes" className="primary-button">
              Create Your Cake
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

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

      <section className="newsletter-section">
        <div className="container newsletter-content">
          <div>
            <span className="section-kicker">A LITTLE MORE SWEETNESS</span>

            <h2>Join our cake club.</h2>

            <p>
              Be the first to hear about new designs and seasonal collections.
            </p>
          </div>

          <form
            className="newsletter-form"
            onSubmit={(event) => event.preventDefault()}
          >
            <input type="email" placeholder="Your email address" />

            <button type="submit">
              Subscribe
              <ArrowRight size={17} />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
