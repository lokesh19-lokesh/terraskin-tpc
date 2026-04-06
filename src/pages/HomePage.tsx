import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Award, Leaf, Heart } from 'lucide-react';
import HeroSlider from '../components/HeroSlider';
import ProductCard from '../components/ProductCard';
import AnimatedSection from '../components/AnimatedSection';
import SEO from '../components/SEO';
import { testimonials } from '../data/products';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import acne from "../images/shop-1.webp";
import antiAgeing from "../images/shop-2.jpg";
import hydration from "../images/shop-3.jpg";
import darkCircles from "../images/shop-4.jpg";
import sun from "../images/shop-5.webp";
import abt from "../images/about-us.png";
import key from "../images/k.png";
import k from "../images/k-2.jpg";
import acid from "../images/k-4.jpg";

import img1 from "../images/terra/1.jpg";
import img2 from "../images/terra/2.jpg";
import img3 from "../images/terra/3.jpg";
import img4 from "../images/terra/4.jpg";
import img5 from "../images/terra/5.jpg";
import img6 from "../images/terra/6.jpg";
import img7 from "../images/terra/7.jpg";
import img8 from "../images/terra/8.jpg";
import img9 from "../images/terra/9.jpg";
import img10 from "../images/terra/10.jpg";
import img11 from "../images/terra/11.jpg";
import img12 from "../images/terra/12.jpg";
import c1 from "../images/why-1.webp";
import c2 from "../images/why-2.webp";
import c3 from "../images/why-3.webp";
import c4 from "../images/why-4.webp";


const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = React.useState<Product[]>([]);
  const [bestSellers, setBestSellers] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          // For demo/simplicity, using newly added as bestSellers/featured
          // if you want official flags, add is_new/is_bestseller to DB later
          setFeaturedProducts(data.slice(0, 4));
          setBestSellers(data.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching home products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeProducts();
  }, []);

  const concerns = [
    { id: 1, img: acne, label: "ACNE-PRONED SKIN" },
    { id: 2, img: antiAgeing, label: "ANTI-AGEING" },
    { id: 3, img: hydration, label: "SKIN HYDRATION" },
    { id: 4, img: darkCircles, label: "DARK CIRCLES" },
    // Duplicate for continuous scroll
    { id: 5, img: acne, label: "ACNE-PRONED SKIN" },
    { id: 6, img: antiAgeing, label: "ANTI-AGEING" },
    { id: 7, img: hydration, label: "SKIN HYDRATION" },
    { id: 8, img: darkCircles, label: "DARK CIRCLES" },
    { id: 9, img: sun, label: "Sun Protection" }
  ];

  const benefits = [
    {
      id: 1,
      title: "",
      image: c1, // replace with your image path
    },
    {
      id: 2,
      title: "",
      image: c2,
    },
    {
      id: 3,
      title: "",
      image: c3,
    },
    {
      id: 4,
      title: "",
      image: c4,
    },
  ];

  const ingredients = [
    {
      img: key, // Replace with your image 
      title: "Japanese Yuzu Ceramide",
      desc: "Plant-derived ceramide extracted from the Yuzu fruit that helps deliver deep, long-lasting hydration and barrier repair.",
    },
    {
      img: k, // Replace with your image
      title: "Squalane",
      desc: "It is a natural occurring oil which protects your skin from dryness and environmental damage.",
    },
    {
      img: acid, // Replace with your image
      title: "Hydrolyzed Hyaluronic Acid",
      desc: "Unlike standard HA, it penetrates deeply to hydrate skin from within and improve elasticity.",
    },
  ];

  const instagramImages = [
    { src: img1, alt: "Instagram post 1" },
    { src: img2, alt: "Instagram post 2" },
    { src: img3, alt: "Instagram post 3" },
    { src: img4, alt: "Instagram post 3" },
    { src: img5, alt: "Instagram post 3" },
    { src: img6, alt: "Instagram post 3" },
    { src: img7, alt: "Instagram post 3" },
    { src: img8, alt: "Instagram post 3" },
    { src: img9, alt: "Instagram post 3" },
    { src: img10, alt: "Instagram post 3" },
    { src: img11, alt: "Instagram post 3" },
    { src: img12, alt: "Instagram post 3" },




  ];

  return (
    <div style={{ backgroundColor: '#f4ece6' }} className="pt-16 text-[#f4ece6]">
      <SEO
        title="TerraSkin | Premium Skincare for Healthy, Radiant Skin"
        description="Discover TerraSkin's collection of premium, dermatologist-tested skincare products. Natural ingredients and science-backed formulations for your best skin yet."
        schema={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "TerraSkin",
          "url": "https://terraskin.in",
          "logo": "https://terraskin.in/src/images/terra-skin-logo.png",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "9836985999",
            "contactType": "customer service"
          },
          "sameAs": [
            "https://facebook.com/terraskin",
            "https://instagram.com/terraskin",
            "https://twitter.com/terraskin"
          ]
        }}
      />
      {/* Hero Slider */}
      <HeroSlider />

      {/* Features Section */}
      <AnimatedSection className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-[#8d4745] text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-[#8d4745] mb-2">Natural Ingredients</h3>

              <p className="text-gray-600">Carefully sourced botanical extracts and scientifically proven actives</p>
            </div>
            <div className="text-center">
              <div className="bg-[#8d4745] text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-[#8d4745] mb-2">Dermatologist Tested</h3>
              <p className="text-gray-600">All products are clinically tested and recommended by skincare experts</p>
            </div>
            <div className="text-center">
              <div className="bg-[#8d4745] text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-[#8d4745] mb-2">Cruelty Free</h3>
              <p className="text-gray-600">Never tested on animals and made with love for your skin</p>
            </div>
          </div>
        </div>
      </AnimatedSection>
      {/* About section */}
      <section className="w-full py-20 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#8d4745]">
              About <span className="text-[#8d4745]">Us</span>
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Founded by MaralaMarala Tanuja, TerraSkin was born from a passion for creating effective, gentle skincare solutions that work in harmony with your skin's natural processes.
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Left Side Image */}
            <div className="flex justify-center">
              <img style={{ objectFit: 'cover' }}
                src={abt}
                alt="About Us"
                className="rounded-2xl shadow-lg w-full max-w-md object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Right Side Content */}
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-semibold text-[#8d4745]">
                Who We Are
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We are a team of creative thinkers and problem-solvers, dedicated to
                turning ideas into reality. Our mission is to deliver innovative
                solutions with professionalism and passion, helping businesses achieve
                growth and success in a competitive world.
              </p>
              <Link
                to="/about"
                className="inline-block px-8 py-3 rounded-lg bg-[#8d4745] text-white hover:bg-[#732f2d] transition-all font-medium shadow-lg"
              >
                Read More
              </Link>

            </div>
          </div>
        </div>
      </section>


      {/* Featured Products */}
      <AnimatedSection animation="slide-up" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#8d4745] font-['Playfair_Display'] mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our latest innovations and customer favorites, carefully formulated for radiant, healthy skin
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse h-80 rounded-lg"></div>
              ))
            ) : (
              featuredProducts.map((product, index) => (
                <AnimatedSection key={product.id} delay={index * 100} animation="slide-up">
                  <ProductCard product={product} />
                </AnimatedSection>
              ))
            )}
          </div>

          <div className="text-center">
            <Link
              to="/shop"
              className="inline-block bg-[#8d4745] text-white px-8 py-3 rounded-full hover:bg-[#7a3f3d] transition-colors duration-300 font-semibold"
            >
              View All Products
            </Link>
          </div>
        </div>
      </AnimatedSection>

      <section className="w-full bg-[#f4ece6] py-20 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-[#6b4226]">
              Our Key Ingredients
            </h2>
          </div>

          {/* Grid Cards */}
          <div className="grid md:grid-cols-3 gap-10">
            {ingredients.map((item, index) => (
              <div
                key={index}
                className="bg-[#f4ece6] rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-500"
              >
                <Link to="./shop">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-64 object-cover rounded-t-xl"
                  />
                </Link>

                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-[#6b4226] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <AnimatedSection animation="fade-in" className="py-16 bg-[#8d4745] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">
            Transform Your Skin Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers who have discovered the power of premium skincare
          </p>
          <Link
            to="/shop"
            className="inline-block bg-white text-[#8d4745] px-8 py-3 rounded-full hover:bg-gray-100 transition-colors duration-300 font-semibold text-lg"
          >
            Start Your Journey
          </Link>
        </div>
      </AnimatedSection>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-center mb-12 text-[#8d4745]">
            Why choose Terraskin?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.id}
                className="relative rounded-xl overflow-hidden shadow-lg group cursor-pointer transform hover:scale-105 transition-transform duration-300"
              >
                <Link to="./shop">
                  <img
                    src={benefit.image}
                    alt={benefit.title}
                    className="w-full h-96 object-cover"
                  />
                </Link>

                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-center px-4">
                  <p className="text-white font-semibold text-lg">
                    {benefit.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>




      {/* Best Sellers */}
      <AnimatedSection animation="slide-up" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#8d4745] font-['Playfair_Display'] mb-4">
              Customer Favorites
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These bestselling products are loved by our community for their proven results and luxurious feel
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse h-80 rounded-lg"></div>
              ))
            ) : (
              bestSellers.map((product, index) => (
                <AnimatedSection key={product.id} delay={index * 100} animation="slide-up">
                  <ProductCard product={product} />
                </AnimatedSection>
              ))
            )}
          </div>
        </div>
      </AnimatedSection>

      <section className="py-16">
        <h2 className="text-3xl font-semibold text-[#8d4745] mb-8 text-center">
          Shop by Concern
        </h2>
        <div className="overflow-hidden relative">
          <div className="flex animate-scroll gap-6">
            {concerns.map((concern) => (
              <div
                key={concern.id}
                className="min-w-[250px] flex-shrink-0 rounded-lg overflow-hidden text-[#8d4745]"
              >
                <Link to="./shop">
                  <img
                    src={concern.img}
                    alt={concern.label}
                    className="w-full h-64 object-cover"
                  />
                </Link>

                <p className="text-center font-bold mt-2">{concern.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <AnimatedSection animation="fade-in" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#8d4745] font-['Playfair_Display'] mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real results from real people who have transformed their skin with our products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <AnimatedSection key={testimonial.id} delay={index * 150} animation="slide-up">
                <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <div className="flex items-center">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic mb-3">"{testimonial.comment}"</p>
                  <p className="text-sm text-[#8d4745] font-medium">{testimonial.product}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <section className="w-full  py-16 px-6">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#8d4745] ">
            Follow us On Instagram
          </h2>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {instagramImages.map((img, index) => (
            <div key={index} className="overflow-hidden rounded-lg hover:scale-105 transition-transform duration-300">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-32 sm:h-40 md:h-48 object-cover"
              />
            </div>
          ))}
        </div>
      </section>


    </div>
  );
};

export default HomePage;