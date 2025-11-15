
'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';

export default function ProductsClient({ initialProducts }) {
  // Ensure we always have an array
  const safeInitialProducts = initialProducts || [];
  
  const [products] = useState(safeInitialProducts);
  const [filteredProducts, setFilteredProducts] = useState(safeInitialProducts);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    inStock: false,
    onSale: false,
    featured: false,
    rating: 0
  });
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false); // Add this missing state

  // Apply filters and sorting
  useEffect(() => {
    if (!products || products.length === 0) {
      setFilteredProducts([]);
      return;
    }

    setLoading(true);
    
    const timeout = setTimeout(() => {
      let result = [...products];

      // Apply filters
      if (filters.category !== 'all') {
        result = result.filter(product => 
          product.categories?.includes(filters.category)
        );
      }

      if (filters.priceRange !== 'all') {
        const [min, max] = filters.priceRange.split('-').map(Number);
        result = result.filter(product => {
          if (max === 9999) return product.price >= min;
          return product.price >= min && product.price <= max;
        });
      }

      if (filters.inStock) {
        result = result.filter(product => product.isInStock);
      }

      if (filters.onSale) {
        result = result.filter(product => product.isOnSale);
      }

      if (filters.featured) {
        result = result.filter(product => product.isFeatured);
      }

      if (filters.rating > 0) {
        result = result.filter(product => (product.rating || 0) >= filters.rating);
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          break;
        case 'price-low':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'name':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'featured':
        default:
          result.sort((a, b) => {
            if (a.isFeatured && !b.isFeatured) return -1;
            if (!a.isFeatured && b.isFeatured) return 1;
            return a.name.localeCompare(b.name);
          });
          break;
      }

      setFilteredProducts(result || []);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [products, filters, sortBy]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const clearAllFilters = () => {
    setFilters({
      category: 'all',
      priceRange: 'all',
      inStock: false,
      onSale: false,
      featured: false,
      rating: 0
    });
    setSortBy('featured');
  };

  const hasActiveFilters = () => {
    return filters.category !== 'all' || 
           filters.priceRange !== 'all' || 
           filters.inStock || 
           filters.onSale || 
           filters.featured || 
           filters.rating > 0;
  };

  // Safe length access
  const productsLength = products?.length || 0;
  const filteredProductsLength = filteredProducts?.length || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
        >
          <span>🎯</span>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            {hasActiveFilters() ? 'Active' : 'All'}
          </span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar - Now narrower */}
        <div className={`
          ${showFilters ? 'block' : 'hidden'} 
          lg:block lg:w-64
        `}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-6">
            <ProductFilters 
              products={products}
              onFilterChange={handleFilterChange}
              onSortChange={handleSortChange}
              currentFilters={filters}
              currentSort={sortBy}
            />
          </div>
        </div>

        {/* Products Section - Now wider */}
        <div className="flex-1 min-w-0"> {/* min-w-0 prevents flex item from overflowing */}
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">All Products</h2>
              <p className="text-gray-600 text-sm mt-1">
                Showing {filteredProductsLength} of {productsLength} product{filteredProductsLength !== 1 ? 's' : ''}
                {(hasActiveFilters() || sortBy !== 'featured') && ' • '}
                {(hasActiveFilters() || sortBy !== 'featured') && (
                  <button
                    onClick={clearAllFilters}
                    className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
                  >
                    Clear all
                  </button>
                )}
              </p>
            </div>
            
            {/* Mobile sort dropdown */}
            <div className="mt-3 sm:mt-0">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Best Rating</option>
                <option value="newest">Newest First</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* No Results State */}
          {!loading && filteredProductsLength === 0 && (
            <div className="text-center py-8">
              <div className="text-3xl mb-3">🔍</div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">No Products Found</h2>
              <p className="text-gray-600 mb-4 text-sm">Try adjusting your filters to find what you're looking for.</p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Products Grid */}
          {!loading && filteredProductsLength > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Load More */}
              {filteredProductsLength > 6 && (
                <div className="text-center mt-8">
                  <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:border-gray-400 transition-colors text-sm">
                    Load More Products
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}