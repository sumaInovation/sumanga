
'use client';

import { useState, useEffect } from 'react';

export default function ProductFilters({ 
  products, 
  onFilterChange,
  onSortChange,
  currentFilters,
  currentSort
}) {
  const [filters, setFilters] = useState(currentFilters);
  const [sortBy, setSortBy] = useState(currentSort);
  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 10000,
    currentMin: 0,
    currentMax: 10000
  });

  // Sync with parent state
  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  useEffect(() => {
    setSortBy(currentSort);
  }, [currentSort]);

  // Calculate min and max prices from products
  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map(p => p.price).filter(price => typeof price === 'number');
      if (prices.length > 0) {
        const minPrice = Math.floor(Math.min(...prices));
        const maxPrice = Math.ceil(Math.max(...prices));
        setPriceRange({
          min: minPrice,
          max: maxPrice,
          currentMin: minPrice,
          currentMax: maxPrice
        });
      }
    }
  }, [products]);

  // Extract categories from products
  const extractCategories = () => {
    const categorySet = new Set();
    
    products.forEach(product => {
      if (Array.isArray(product.categories)) {
        product.categories.forEach(cat => {
          if (cat && cat !== 'all') {
            categorySet.add(cat);
          }
        });
      }
      
      if (product.category && product.category !== 'all') {
        categorySet.add(product.category);
      }
      
      if (Array.isArray(product.tags)) {
        product.tags.forEach(tag => {
          if (tag && tag !== 'all') {
            categorySet.add(tag);
          }
        });
      }
    });

    const categories = ['all', ...Array.from(categorySet)];
    return categories;
  };

  const categories = extractCategories();
  const finalCategories = categories.length > 1 ? categories : [
    'all', 'electronics', 'clothing', 'home', 'sports', 'books'
  ];

  // Sort options
  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Best Rating' },
    { value: 'name', label: 'Name: A to Z' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    onSortChange(value);
  };

  const handlePriceRangeChange = (min, max) => {
    setPriceRange(prev => ({ ...prev, currentMin: min, currentMax: max }));
    handleFilterChange('priceRange', `${min}-${max}`);
  };

  const handleMinPriceChange = (e) => {
    const min = Math.min(Number(e.target.value), priceRange.currentMax - 100);
    handlePriceRangeChange(min, priceRange.currentMax);
  };

  const handleMaxPriceChange = (e) => {
    const max = Math.max(Number(e.target.value), priceRange.currentMin + 100);
    handlePriceRangeChange(priceRange.currentMin, max);
  };

  const clearFilters = () => {
    const resetFilters = {
      category: 'all',
      priceRange: 'all',
      inStock: false,
      onSale: false,
      featured: false,
      rating: 0
    };
    setFilters(resetFilters);
    setSortBy('featured');
    setPriceRange(prev => ({
      ...prev,
      currentMin: prev.min,
      currentMax: prev.max
    }));
    onFilterChange(resetFilters);
    onSortChange('featured');
  };

  const hasActiveFilters = () => {
    return filters.category !== 'all' || 
           filters.priceRange !== 'all' || 
           filters.inStock || 
           filters.onSale || 
           filters.featured || 
           filters.rating > 0;
  };

  const formatCategoryName = (category) => {
    if (category === 'all') return 'All Categories';
    return category
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        <button
          onClick={clearFilters}
          disabled={!hasActiveFilters() && sortBy === 'featured'}
          className={`px-3 py-1 text-xs font-medium rounded transition-all ${
            hasActiveFilters() || sortBy !== 'featured'
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Clear
        </button>
      </div>

      {/* Sort By - First Row */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-800">
          🔄 Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400 transition-colors"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category Filter - Second Row */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-800">
          📦 Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400 transition-colors"
        >
          {finalCategories.map(category => (
            <option key={category} value={category}>
              {formatCategoryName(category)}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range - Third Row */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-800">
          💰 Price Range
        </label>
        <div className="space-y-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center text-xs font-medium text-gray-600">
            <span>{priceRange.currentMin} LKR</span>
            <span>{priceRange.currentMax} LKR</span>
          </div>

          {/* Min Price Slider */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Min Price</label>
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={priceRange.currentMin}
              onChange={handleMinPriceChange}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
          </div>

          {/* Max Price Slider */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Max Price</label>
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={priceRange.currentMax}
              onChange={handleMaxPriceChange}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
          </div>
        </div>
      </div>

      {/* Rating Filter - Fourth Row */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-800">
          ⭐ Rating
        </label>
        <select
          value={filters.rating}
          onChange={(e) => handleFilterChange('rating', parseInt(e.target.value))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400 transition-colors"
        >
          <option value={0}>All Ratings</option>
          <option value={4}>4+ Stars</option>
          <option value={3}>3+ Stars</option>
          <option value={2}>2+ Stars</option>
          <option value={1}>1+ Stars</option>
        </select>
      </div>

      {/* Quick Filters - Fifth Row */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-800">
          🏷️ Quick Filters
        </label>
        <div className="space-y-2">
          <label className="flex items-center group cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => handleFilterChange('inStock', e.target.checked)}
              className="w-4 h-4 rounded border border-gray-300 text-green-600 focus:ring-green-500 group-hover:border-green-400 transition-colors"
            />
            <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors">
              ✅ In Stock
            </span>
          </label>
          
          <label className="flex items-center group cursor-pointer">
            <input
              type="checkbox"
              checked={filters.onSale}
              onChange={(e) => handleFilterChange('onSale', e.target.checked)}
              className="w-4 h-4 rounded border border-gray-300 text-orange-600 focus:ring-orange-500 group-hover:border-orange-400 transition-colors"
            />
            <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors">
              🔥 On Sale
            </span>
          </label>
          
          <label className="flex items-center group cursor-pointer">
            <input
              type="checkbox"
              checked={filters.featured}
              onChange={(e) => handleFilterChange('featured', e.target.checked)}
              className="w-4 h-4 rounded border border-gray-300 text-blue-600 focus:ring-blue-500 group-hover:border-blue-400 transition-colors"
            />
            <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
              🌟 Featured
            </span>
          </label>
        </div>
      </div>

      {/* Custom CSS for slider */}
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        
        .slider-thumb::-webkit-slider-thumb:hover {
          background: #2563eb;
        }
        
        .slider-thumb::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}