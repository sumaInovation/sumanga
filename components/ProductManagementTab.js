
// components/ProductManagementTab.js
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

// ✅ Slug generation utilities (memoized)
const generateSlug = (text) => {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars except hyphens
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

const generateProductSlug = (productName) => {
  if (!productName) return '';
  
  // Common words to remove for shorter slugs
  const wordsToRemove = [
    'cn', 'compact', 'unit', 'module', 'series', 'version', 
    'edition', 'basic', 'advanced', 'professional', 'controller'
  ];
  
  const slug = generateSlug(productName);
  
  // Remove common redundant words for cleaner URLs
  const parts = slug.split('-');
  const filteredParts = parts.filter(part => 
    !wordsToRemove.includes(part.toLowerCase())
  );
  
  return filteredParts.join('-');
};

// ✅ Default form data to avoid repetition
const defaultFormData = {
  // Basic Information
  name: '',
  slug: '',
  description: '',
  shortDescription: '',
  
  // Pricing
  price: '',
  originalPrice: '',
  discount: '',
  currency: 'USD',
  
  // Category & Brand
  category: '',
  subcategory: '',
  brand: '',
  
  // Images
  images: [],
  thumbnail: '',
  
  // Inventory
  sku: '',
  stock: '',
  lowStockAlert: 10,
  
  // SEO Fields
  metaTitle: '',
  metaDescription: '',
  keywords: [],
  
  // Product Status
  status: 'draft',
  isFeatured: false,
  isOnSale: false,
  
  // Specifications
  specifications: {},
  features: [],
  tags: [],
  
  // Dimensions & Weight
  weight: { value: '', unit: 'kg' },
  dimensions: { length: '', width: '', height: '', unit: 'cm' },
  
  // Shipping
  shipping: {
    isFree: false,
    cost: '',
    weightBasedCost: false
  },
  
  // Vendor
  vendor: ''
};

export default function ProductManagementTab() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: 'all'
  });
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [imageUrls, setImageUrls] = useState(['']); // For multiple image URLs
  const [thumbnailUrl, setThumbnailUrl] = useState(''); // For thumbnail URL

  // ✅ NEW: Track if slug was manually edited
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Form state - expanded to match Product schema
  const [formData, setFormData] = useState(defaultFormData);

  // ✅ Memoized filtered products for better performance
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = !filters.search || 
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.brand.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.sku.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesCategory = !filters.category || product.category === filters.category;
      const matchesStatus = filters.status === 'all' || product.status === filters.status;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, filters]);

  // ✅ Auto-generate slug when name changes (only for new products)
  useEffect(() => {
    if (formData.name && !editingProduct && !slugManuallyEdited) {
      const generatedSlug = generateProductSlug(formData.name);
      setFormData(prev => ({
        ...prev,
        slug: generatedSlug
      }));
    }
  }, [formData.name, editingProduct, slugManuallyEdited]);

  // ✅ Optimized fetch products with useCallback
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.search) queryParams.append('search', filters.search);

      const response = await fetch(`/api/products?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.products) {
        setProducts(data.products);
      } else if (data.product) {
        setProducts([data.product]);
      } else {
        setProducts([]);
      }
      
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ✅ Optimized category extraction
  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = [...new Set(products
        .map(product => product.category)
        .filter(Boolean)
      )];
      setCategories(uniqueCategories);
    }
  }, [products]);

  // ✅ Optimized handlers
  const addNewCategory = useCallback(() => {
    const newCategory = newCategoryInput.trim();
    if (newCategory && !categories.includes(newCategory)) {
      setCategories(prev => [...prev, newCategory]);
      setFormData(prev => ({ ...prev, category: newCategory }));
      setNewCategoryInput('');
    }
  }, [newCategoryInput, categories]);

  const handleImageUrlChange = useCallback((index, value) => {
    setImageUrls(prev => {
      const newImageUrls = [...prev];
      newImageUrls[index] = value;
      return newImageUrls;
    });
  }, []);

  const addImageUrlField = useCallback(() => {
    setImageUrls(prev => [...prev, '']);
  }, []);

  const removeImageUrlField = useCallback((index) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  }, []);

  // ✅ Handle slug field changes
  const handleSlugChange = useCallback((e) => {
    const newSlug = e.target.value;
    setFormData(prev => ({ ...prev, slug: newSlug }));
    
    // If user manually edits the slug, stop auto-generation
    if (newSlug !== generateProductSlug(formData.name)) {
      setSlugManuallyEdited(true);
    }
  }, [formData.name]);

  // ✅ Regenerate slug manually
  const regenerateSlug = useCallback(() => {
    if (formData.name) {
      const newSlug = generateProductSlug(formData.name);
      setFormData(prev => ({ ...prev, slug: newSlug }));
      setSlugManuallyEdited(false);
    }
  }, [formData.name]);

  // ✅ Optimized form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Process image URLs into the images array format
      const processedImages = imageUrls
        .filter(url => url.trim() !== '')
        .map(url => ({
          url: url.trim(),
          alt: formData.name,
          isPrimary: false
        }));

      // Set first image as primary if exists
      if (processedImages.length > 0) {
        processedImages[0].isPrimary = true;
      }

      const submitData = {
        ...formData,
        createdBy: "6916ba84f8d28cd7a989ef1a",
        
        // Convert string numbers to actual numbers with validation
        price: Math.max(0, parseFloat(formData.price) || 0),
        originalPrice: formData.originalPrice ? Math.max(0, parseFloat(formData.originalPrice)) : undefined,
        discount: Math.min(100, Math.max(0, parseFloat(formData.discount) || 0)),
        stock: Math.max(0, parseInt(formData.stock) || 0),
        lowStockAlert: Math.max(0, parseInt(formData.lowStockAlert) || 10),
        
        // Images data
        images: processedImages,
        thumbnail: thumbnailUrl || (processedImages.length > 0 ? processedImages[0].url : ''),
        
        // Convert weight and dimensions with validation
        weight: {
          ...formData.weight,
          value: formData.weight.value ? Math.max(0, parseFloat(formData.weight.value)) : undefined
        },
        dimensions: {
          ...formData.dimensions,
          length: formData.dimensions.length ? Math.max(0, parseFloat(formData.dimensions.length)) : undefined,
          width: formData.dimensions.width ? Math.max(0, parseFloat(formData.dimensions.width)) : undefined,
          height: formData.dimensions.height ? Math.max(0, parseFloat(formData.dimensions.height)) : undefined
        },
        
        // Convert shipping cost
        shipping: {
          ...formData.shipping,
          cost: Math.max(0, parseFloat(formData.shipping.cost) || 0)
        },
        
        // Ensure arrays are properly formatted
        keywords: Array.isArray(formData.keywords) ? formData.keywords.filter(k => k.trim()) : [],
        features: Array.isArray(formData.features) ? formData.features.filter(f => f.trim()) : [],
        tags: Array.isArray(formData.tags) ? formData.tags.filter(t => t.trim()) : [],
        specifications: formData.specifications || {}
      };

      const url = editingProduct 
        ? `/api/products/${editingProduct._id}`
        : '/api/products';
      
      const method = editingProduct ? 'PUT' : 'POST';

      console.log('🟢 Sending request to:', url);

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Something went wrong');
      }

      if (data.success) {
        await fetchProducts();
        resetForm();
        setShowAddForm(false);
        setEditingProduct(null);
        alert(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Optimized reset form
  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
    setNewCategoryInput('');
    setImageUrls(['']);
    setThumbnailUrl('');
    setSlugManuallyEdited(false);
  }, []);

  // ✅ Optimized edit handler
  const handleEdit = useCallback((product) => {
    setEditingProduct(product);
    setSlugManuallyEdited(true);
    
    // Set image URLs from product data
    if (product.images && product.images.length > 0) {
      setImageUrls(product.images.map(img => img.url));
    } else {
      setImageUrls(['']);
    }
    
    // Set thumbnail URL
    setThumbnailUrl(product.thumbnail || '');

    setFormData({
      name: product.name || '',
      slug: product.slug || '',
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      price: product.price?.toString() || '',
      originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
      discount: product.discount ? product.discount.toString() : '',
      currency: product.currency || 'USD',
      category: product.category || '',
      subcategory: product.subcategory || '',
      brand: product.brand || '',
      images: product.images || [],
      thumbnail: product.thumbnail || '',
      sku: product.sku || '',
      stock: product.stock?.toString() || '',
      lowStockAlert: product.lowStockAlert || 10,
      metaTitle: product.metaTitle || '',
      metaDescription: product.metaDescription || '',
      keywords: product.keywords || [],
      status: product.status || 'draft',
      isFeatured: product.isFeatured || false,
      isOnSale: product.isOnSale || false,
      specifications: product.specifications || {},
      features: product.features || [],
      tags: product.tags || [],
      weight: product.weight || { value: '', unit: 'kg' },
      dimensions: product.dimensions || { length: '', width: '', height: '', unit: 'cm' },
      shipping: product.shipping || {
        isFree: false,
        cost: '',
        weightBasedCost: false
      },
      vendor: product.vendor || ''
    });
    setShowAddForm(true);
  }, []);

  // ✅ Optimized delete handler
  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete product');
      }

      if (data.success) {
        await fetchProducts();
        alert('Product deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product: ' + error.message);
    }
  };

  // ✅ Memoized status badge color
  const getStatusBadgeColor = useCallback((status) => {
    const statusColors = {
      'published': 'bg-green-100 text-green-800',
      'draft': 'bg-yellow-100 text-yellow-800',
      'archived': 'bg-gray-100 text-gray-800',
      'out_of_stock': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-blue-100 text-blue-800';
  }, []);

  // ✅ Loading state component
  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading products...</span>
      </div>
    );
  }

  return (
    <div className="text-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors duration-200"
        >
          <span>+</span>
          Add New Product
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({...prev, search: e.target.value}))}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({...prev, category: e.target.value}))}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-colors duration-200"
            >
              <option value="">All Categories</option>
              {categories.map((cat, index) => (
                <option key={`${cat}-${index}`} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-colors duration-200"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add/Edit Product Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto text-gray-900 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button 
                onClick={() => {
                  setShowAddForm(false);
                  setEditingProduct(null);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl transition-colors duration-200"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-lg font-semibold mb-4">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-colors duration-200"
                      placeholder="e.g., Simatic S7-200 CN CPU 224 Compact Unit"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Slug will be auto-generated from the product name
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug *
                      {!slugManuallyEdited && (
                        <span className="ml-2 text-xs text-green-600">(Auto-generated)</span>
                      )}
                      {slugManuallyEdited && (
                        <span className="ml-2 text-xs text-blue-600">(Custom)</span>
                      )}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={handleSlugChange}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-colors duration-200"
                        placeholder="product-name-slug"
                      />
                      <button
                        type="button"
                        onClick={regenerateSlug}
                        disabled={!formData.name}
                        className="bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap transition-colors duration-200"
                        title="Regenerate slug from product name"
                      >
                        🔄
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {slugManuallyEdited 
                        ? "You're using a custom slug. Click the refresh button to auto-generate again."
                        : "Edit manually if needed, or leave as-is for auto-generation."
                      }
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-colors duration-200 resize-vertical"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Short Description
                    </label>
                    <textarea
                      rows={2}
                      value={formData.shortDescription}
                      onChange={(e) => setFormData(prev => ({...prev, shortDescription: e.target.value}))}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-colors duration-200 resize-vertical"
                      placeholder="Brief description for product listings"
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-lg font-semibold mb-4">Product Images</h4>
                
                {/* Thumbnail URL */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-colors duration-200"
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Main product image for listings. If empty, first image URL will be used as thumbnail.
                  </p>
                </div>

                {/* Multiple Image URLs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image URLs
                  </label>
                  {imageUrls.map((url, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleImageUrlChange(index, e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-colors duration-200"
                        placeholder="https://example.com/product-image.jpg"
                      />
                      {imageUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageUrlField(index)}
                          className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors duration-200"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addImageUrlField}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-2 transition-colors duration-200"
                  >
                    + Add Another Image URL
                  </button>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Add multiple product image URLs. The first image will be used as primary.
                  </p>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-lg font-semibold mb-4">Pricing</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (USD) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({...prev, price: e.target.value}))}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Original Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData(prev => ({...prev, originalPrice: e.target.value}))}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.discount}
                      onChange={(e) => setFormData(prev => ({...prev, discount: e.target.value}))}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData(prev => ({...prev, currency: e.target.value}))}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-colors duration-200"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Category & Brand */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-lg font-semibold mb-4">Category & Brand</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <div className="flex gap-3">
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-colors duration-200"
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat, index) => (
                          <option key={`${cat}-${index}`} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCategoryInput}
                          onChange={(e) => setNewCategoryInput(e.target.value)}
                          placeholder="New category"
                          className="w-40 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-colors duration-200"
                        />
                        <button
                          type="button"
                          onClick={addNewCategory}
                          disabled={!newCategoryInput.trim()}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subcategory
                    </label>
                    <input
                      type="text"
                      value={formData.subcategory}
                      onChange={(e) => setFormData(prev => ({...prev, subcategory: e.target.value}))}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-colors duration-200"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.brand}
                      onChange={(e) => setFormData(prev => ({...prev, brand: e.target.value}))}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-colors duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Inventory */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-lg font-semibold mb-4">Inventory</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SKU *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.sku}
                      onChange={(e) => setFormData(prev => ({...prev, sku: e.target.value}))}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-colors duration-200"
                      placeholder="SKU-001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData(prev => ({...prev, stock: e.target.value}))}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Low Stock Alert
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.lowStockAlert}
                      onChange={(e) => setFormData(prev => ({...prev, lowStockAlert: e.target.value}))}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-colors duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Product Status */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-lg font-semibold mb-4">Product Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({...prev, status: e.target.value}))}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-colors duration-200"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData(prev => ({...prev, isFeatured: e.target.checked}))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors duration-200"
                      />
                      <span className="ml-2 text-sm text-gray-700">Featured Product</span>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isOnSale}
                        onChange={(e) => setFormData(prev => ({...prev, isOnSale: e.target.checked}))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors duration-200"
                      />
                      <span className="ml-2 text-sm text-gray-700">On Sale</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vendor
                    </label>
                    <input
                      type="text"
                      value={formData.vendor}
                      onChange={(e) => setFormData(prev => ({...prev, vendor: e.target.value}))}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-colors duration-200"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded object-cover"
                        src={product.thumbnail || product.images?.[0]?.url || '/default-product.png'}
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = '/default-product.png';
                        }}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-semibold">${product.price}</div>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="text-xs text-gray-500 line-through">
                        ${product.originalPrice}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.stock > 20 ? 'bg-green-100 text-green-800' : 
                      product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(product.status)}`}>
                      {product.status}
                    </span>
                    {product.isFeatured && (
                      <span className="ml-1 inline-flex px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50 transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">📦</div>
            <p className="text-lg font-medium">No products found</p>
            {products.length > 0 && (
              <p className="text-sm text-gray-400 mt-2">
                Try adjusting your search filters
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}