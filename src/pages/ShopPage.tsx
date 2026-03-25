import React, { useState, useMemo } from 'react';
import { Filter, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import AnimatedSection from '../components/AnimatedSection';
import { products } from '../data/products';
import { FilterState } from '../types';

const ShopPage: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    priceRange: [0, 200],
    skinType: 'all',
    bestSellers: false
  });

  const categories = ['all', 'serums', 'moisturizers', 'cleansers', 'treatments', 'suncare'];
  const skinTypes = ['all', 'normal', 'dry', 'oily', 'sensitive', 'combination', 'mature', 'acne-prone'];

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }

      // Price filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // Skin type filter
      if (filters.skinType !== 'all' && !product.skinType.includes(filters.skinType)) {
        return false;
      }

      // Best sellers filter
      if (filters.bestSellers && !product.isBestSeller) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      priceRange: [0, 200],
      skinType: 'all',
      bestSellers: false
    });
  };

  return (
    <div style={{backgroundColor:'#f4ece6'}} className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <AnimatedSection className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-['Playfair_Display'] mb-2">
                Shop All Products
              </h1>
              <p className="text-gray-600">
                Discover our complete collection of premium skincare products
              </p>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="mt-4 sm:mt-0 inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
        </AnimatedSection>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <AnimatedSection animation="slide-right">
              <div className="bg-white p-6 rounded-lg shadow-sm sticky top-20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[#8d4745] hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Category</h4>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <label key={category} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={filters.category === category}
                          onChange={(e) => handleFilterChange('category', e.target.value)}
                          className="text-[#8d4745] focus:ring-[#8d4745]"
                        />
                        <span className="ml-2 text-sm text-gray-600 capitalize">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Price Range</h4>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                      className="w-full accent-[#8d4745]"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹0</span>
                      <span>₹{filters.priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Skin Type Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Skin Type</h4>
                  <select
                    value={filters.skinType}
                    onChange={(e) => handleFilterChange('skinType', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#8d4745] focus:border-[#8d4745]"
                  >
                    {skinTypes.map(type => (
                      <option key={type} value={type}>
                        {type === 'all' ? 'All Skin Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Best Sellers */}
                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.bestSellers}
                      onChange={(e) => handleFilterChange('bestSellers', e.target.checked)}
                      className="text-[#8d4745] focus:ring-[#8d4745]"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Best Sellers Only
                    </span>
                  </label>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <AnimatedSection animation="slide-left">
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  Showing {filteredProducts.length} products
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <AnimatedSection key={product.id} delay={index * 100} animation="slide-up">
                    <ProductCard product={product} />
                  </AnimatedSection>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No products found matching your filters.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 bg-[#8d4745] text-white px-6 py-2 rounded-full hover:bg-[#7a3f3d] transition-colors duration-300"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* Mobile filter overlay */}
       {showFilters && (
  <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
    <div className="bg-white w-80 h-full overflow-y-auto shadow-lg">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button onClick={() => setShowFilters(false)}>
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Filter Content */}
      <div className="p-6 space-y-6">
        {/* Category Filter */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Category</h4>
          <div className="space-y-2">
            {categories.map(category => (
              <label key={category} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={filters.category === category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="text-[#8d4745] focus:ring-[#8d4745]"
                />
                <span className="ml-2 text-sm text-gray-600 capitalize">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Price Range</h4>
          <input
            type="range"
            min="0"
            max="200"
            value={filters.priceRange[1]}
            onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
            className="w-full accent-[#8d4745]"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>$0</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>

        {/* Skin Type */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Skin Type</h4>
          <select
            value={filters.skinType}
            onChange={(e) => handleFilterChange('skinType', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#8d4745] focus:border-[#8d4745]"
          >
            {skinTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Skin Types' : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Best Sellers */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.bestSellers}
              onChange={(e) => handleFilterChange('bestSellers', e.target.checked)}
              className="text-[#8d4745] focus:ring-[#8d4745]"
            />
            <span className="ml-2 text-sm text-gray-600">Best Sellers Only</span>
          </label>
        </div>

        <button
          onClick={() => setShowFilters(false)}
          className="w-full bg-[#8d4745] text-white py-2 rounded-lg hover:bg-[#7a3f3d] transition-colors duration-300"
        >
          Apply Filters
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default ShopPage;