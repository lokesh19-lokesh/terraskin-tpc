import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { products } from '../data/products';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import AnimatedSection from '../components/AnimatedSection';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'benefits'>('description');

  useEffect(() => {
    if (id) {
      const foundProduct = products.find(p => p.id === id);
      setProduct(foundProduct || null);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <Link to="/shop" className="text-[#8d4745] hover:underline">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: 'ADD_TO_CART', payload: product });
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-sm">
            <Link to="/" className="text-gray-500 hover:text-[#8d4745]">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link to="/shop" className="text-gray-500 hover:text-[#8d4745]">Shop</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <AnimatedSection animation="slide-right">
            <div className="space-y-4">
              <div className="relative bg-white rounded-lg overflow-hidden shadow-sm">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
                
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-md transition-all duration-200"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-md transition-all duration-200"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                  {product.isBestSeller && (
                    <span className="bg-[#8d4745] text-white px-3 py-1 text-sm rounded-full">
                      Bestseller
                    </span>
                  )}
                  {product.isNew && (
                    <span className="bg-green-600 text-white px-3 py-1 text-sm rounded-full">
                      New
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="bg-red-500 text-white px-3 py-1 text-sm rounded-full">
                      Sale
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail images */}
              {product.images.length > 1 && (
                <div className="flex space-x-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors duration-200 ${
                        index === currentImageIndex ? 'border-[#8d4745]' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </AnimatedSection>

          {/* Product Info */}
          <AnimatedSection animation="slide-left">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h1 className="text-3xl font-bold text-gray-900 font-['Playfair_Display'] mb-4">
                {product.name}
              </h1>

              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <div className="flex items-center mb-6">
                <span className="text-3xl font-bold text-[#8d4745]">
                  ₹{product.price}
                </span>
                {product.originalPrice && (
                  <span className="ml-3 text-xl text-gray-500 line-through">
                    ₹{product.originalPrice}
                  </span>

                )}
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Skin Types */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Suitable for:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.skinType.map((type, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm capitalize"
                    >
                      {type} skin
                    </span>
                  ))}
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center space-x-4 mb-8">
                <div className="flex items-center space-x-3">
                  <label className="text-sm font-medium text-gray-700">Quantity:</label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#8d4745] text-white py-3 px-6 rounded-full hover:bg-[#7a3f3d] transition-colors duration-300 flex items-center justify-center space-x-2 font-semibold"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>
                <button className="p-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors duration-200">
                  <Heart className="h-5 w-5" />
                </button>
              </div>

              {/* Product Details Tabs */}
              <div className="border-t pt-8">
                <div className="flex space-x-8 mb-6">
                  {['description', 'ingredients', 'benefits'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`text-sm font-medium capitalize pb-2 border-b-2 transition-colors duration-200 ₹{
                        activeTab === tab
                          ? 'text-[#8d4745] border-[#8d4745]'
                          : 'text-gray-600 border-transparent hover:text-gray-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="min-h-32">
                  {activeTab === 'description' && (
                    <p className="text-gray-600 leading-relaxed">{product.fullDescription}</p>
                  )}
                  {activeTab === 'ingredients' && (
                    <div className="space-y-2">
                      {product.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-gray-600">{ingredient}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {activeTab === 'benefits' && (
                    <div className="space-y-2">
                      {product.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-gray-600">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <AnimatedSection animation="slide-up" className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 font-['Playfair_Display'] mb-4">
                You May Also Like
              </h2>
              <p className="text-gray-600">
                Discover other products in the {product.category} collection
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <AnimatedSection key={relatedProduct.id} delay={index * 100} animation="slide-up">
                  <ProductCard product={relatedProduct} />
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;