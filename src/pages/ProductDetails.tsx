import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import AnimatedSection from '../components/AnimatedSection';
import SEO from '../components/SEO';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'benefits'>('description');
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        setLoading(true);
        const { data } = await supabase.from('products').select('*').eq('id', id).single();
        if (data) {
          setProduct(data);
          // Try to load related
          const { data: relatedInCategory } = await supabase
            .from('products')
            .select('*')
            .eq('category', data.category)
            .eq('is_active', true)
            .neq('id', id)
            .limit(4);
            
          let finalRelated = relatedInCategory || [];
          
          if (finalRelated.length < 4) {
            const relatedIds = finalRelated.map(p => p.id);
            // If we have some, exclude them. If none, we still need a valid UUID format for the 'in' filter fallback
            const excludeIds = relatedIds.length > 0 ? `(${relatedIds.join(',')})` : '(00000000-0000-0000-0000-000000000000)';
            
            const { data: otherProducts } = await supabase
              .from('products')
              .select('*')
              .eq('is_active', true)
              .neq('id', id)
              .filter('id', 'not.in', excludeIds)
              .limit(4 - finalRelated.length);
              
            if (otherProducts) {
              finalRelated = [...finalRelated, ...otherProducts];
            }
          }
          
          setRelatedProducts(finalRelated);
        }
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) return <div className="pt-24 min-h-screen flex items-center justify-center">Loading product...</div>;

  if (!product) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <Link to="/shop" className="text-[#8d4745] hover:underline">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: 'ADD_TO_CART', payload: product });
    }
  };

  const imagesArray = product.images || (product.image_url ? [product.image_url] : ['https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=800']);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imagesArray.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imagesArray.length) % imagesArray.length);
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <SEO 
        title={product.name}
        description={product.description}
        ogImage={product.image_url || imagesArray[0]}
        ogType="product"
        schema={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.name,
          "image": product.image_url || imagesArray[0],
          "description": product.fullDescription || product.description,
          "brand": {
            "@type": "Brand",
            "name": "TerraSkin"
          },
          "offers": {
            "@type": "Offer",
            "url": window.location.href,
            "priceCurrency": "INR",
            "price": product.price,
            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
          },
          "aggregateRating": product.rating ? {
            "@type": "AggregateRating",
            "ratingValue": product.rating,
            "reviewCount": product.reviews || 0
          } : undefined
        }}
      />
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
                  src={imagesArray[currentImageIndex]}
                  alt={product.name}
                  className="w-full aspect-square sm:h-96 object-contain bg-gray-50"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=800';
                  }}
                />
                
                {imagesArray.length > 1 && (
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
                  {(() => {
                    const original = product.originalPrice || product.original_price;
                    if (original && original > product.price) {
                      const discount = Math.round(((original - product.price) / original) * 100);
                      return (
                        <span className="bg-red-500 text-white px-3 py-1 text-sm rounded-full font-bold">
                          {discount}% OFF
                        </span>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>

              {/* Thumbnail images */}
              {imagesArray.length > 1 && (
                <div className="flex space-x-2">
                  {imagesArray.map((image: string, index: number) => (
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
                        className="w-full h-full object-contain bg-gray-50"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=800';
                        }}
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
                {(product.originalPrice || product.original_price) && (
                  <span className="ml-3 text-xl text-gray-500 line-through">
                    ₹{product.originalPrice || product.original_price}
                  </span>
                )}
              </div>

              {/* Stock Status Notification */}
              <div className="mb-6">
                {product.stock_quantity === 0 ? (
                  <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                    <span className="text-sm font-bold text-red-600 uppercase tracking-wider block">Currently Out of Stock</span>
                    <p className="text-xs text-red-500 mt-1">Check back soon or contact support for restock updates.</p>
                  </div>
                ) : product.stock_quantity !== undefined && product.stock_quantity <= 2 ? (
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-center gap-3 animate-pulse">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div>
                      <span className="text-sm font-bold text-red-600 uppercase">Only {product.stock_quantity} Items Left!</span>
                      <p className="text-xs text-red-500">Less than 2 items in stock. Grab yours before it's gone!</p>
                    </div>
                  </div>
                ) : null}
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Skin Types */}
              {product.skinType && Array.isArray(product.skinType) && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Suitable for:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.skinType.map((type: string, index: number) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm capitalize"
                      >
                        {type} skin
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="flex items-center space-x-4 mb-8">
                <div className="flex items-center space-x-3">
                  <label className="text-sm font-medium text-gray-700">Quantity:</label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={product.stock_quantity === 0}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">{product.stock_quantity === 0 ? 0 : quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock_quantity || 1, quantity + 1))}
                      disabled={product.stock_quantity === 0 || quantity >= (product.stock_quantity || 0)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className={`flex-1 py-3 px-6 rounded-full transition-colors duration-300 flex items-center justify-center space-x-2 font-semibold shadow-lg ${
                    product.stock_quantity === 0 
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                      : 'bg-[#8d4745] text-white hover:bg-[#7a3f3d]'
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>{product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
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
                    <p className="text-gray-600 leading-relaxed">{product.full_description || product.fullDescription || product.description}</p>
                  )}
                  {activeTab === 'ingredients' && (
                    <div className="space-y-2">
                      {product.ingredients && Array.isArray(product.ingredients) ? product.ingredients.map((ingredient: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-gray-600">{ingredient}</span>
                        </div>
                      )) : <p className="text-gray-500 text-sm">Ingredient list not generated for this product.</p>}
                    </div>
                  )}
                  {activeTab === 'benefits' && (
                    <div className="space-y-2">
                      {product.benefits && Array.isArray(product.benefits) ? product.benefits.map((benefit: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-gray-600">{benefit}</span>
                        </div>
                      )) : <p className="text-gray-500 text-sm">No specific benefits listed.</p>}
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
                {relatedProducts.length > 0 && relatedProducts.every(rp => rp.category === product.category)
                  ? `Discover other products in the ${product.category} collection`
                  : "Discover other products you may love"}
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