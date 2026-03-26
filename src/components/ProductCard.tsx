import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { dispatch } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  return (
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
      <div className="relative overflow-hidden shrink-0">
        <Link to={`/product/${product.id}`} className="block bg-gray-50">
          <img
            src={product.image_url || (product.images && product.images[0]) || 'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=800'}
            alt={product.name}
            className="w-full h-64 object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=800';
            }}
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {product.isBestSeller && (
            <span className="bg-[#8d4745] text-white px-2 py-1 text-xs rounded-full">
              Bestseller
            </span>
          )}
          {product.isNew && (
            <span className="bg-green-600 text-white px-2 py-1 text-xs rounded-full">
              New
            </span>
          )}
          {product.originalPrice && (
            <span className="bg-red-500 text-white px-2 py-1 text-xs rounded-full">
              Sale
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-100">
          <Heart className="h-4 w-4 text-gray-600" />
        </button>

        {/* Quick add to cart */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-[#8d4745] text-white px-4 py-2 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:bg-[#7a3f3d] flex items-center space-x-2 shadow-lg whitespace-nowrap"
        >
          <ShoppingCart className="h-4 w-4" />
          <span className="text-sm font-medium">Add to Cart</span>
        </button>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-[#8d4745] transition-colors duration-200 line-clamp-2 min-h-[3.5rem] flex items-center">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex-1"></div>

        {/* Rating */}
        <div className="flex items-center mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating || 5)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            ({product.reviews || Math.floor(Math.random() * 50) + 10})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center mt-3">
          <span className="text-lg font-bold text-[#8d4745]">
            ₹{product.price}
          </span>
            {product.originalPrice && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {/* Stock Status Notification */}
          <div className="mt-2 min-h-[20px]">
            {product.stock_quantity === 0 ? (
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Out of Stock</span>
            ) : product.stock_quantity !== undefined && product.stock_quantity <= 2 ? (
              <div className="flex items-center gap-1.5 animate-pulse">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                <span className="text-xs font-bold text-red-500 uppercase">Only {product.stock_quantity} Left!</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
};

export default ProductCard;