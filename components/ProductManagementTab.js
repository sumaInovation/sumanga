
// components/ProductManagementTab.js
"use client";

import { useState, useEffect } from "react";

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

  // Form state - expanded to match Product schema
  const [formData, setFormData] = useState({
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
  });

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
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
  };

  // Extract categories from products
  useEffect(() => {
    if (products.length > 0) {
      const allCats = [];
      products.forEach(product => {
        if (product.category) {
          allCats.push(product.category);
        }
      });
      setCategories(allCats);
    }
  }, [products]);

  // Add new category
  const addNewCategory = () => {
    const newCategory = newCategoryInput.trim();
    if (newCategory) {
      setCategories([...categories, newCategory]);
      setFormData({...formData, category: newCategory});
      setNewCategoryInput('');
    }
  };

  // Handle image URL changes
  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    setImageUrls(newImageUrls);
  };

  // Add new image URL field
  const addImageUrlField = () => {
    setImageUrls([...imageUrls, '']);
  };

  // Remove image URL field
  const removeImageUrlField = (index) => {
    const newImageUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newImageUrls);
  };

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
      // ✅ ADD THIS: Include the createdBy field (use the same ID as your Arduino product)
      createdBy: "6916ba84f8d28cd7a989ef1a", // Use the same ID from your existing product
      
      // Convert string numbers to actual numbers
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      discount: formData.discount ? parseFloat(formData.discount) : 0,
      stock: parseInt(formData.stock),
      lowStockAlert: parseInt(formData.lowStockAlert),
      
      // Images data
      images: processedImages,
      thumbnail: thumbnailUrl || (processedImages.length > 0 ? processedImages[0].url : ''),
      
      // Convert weight and dimensions
      weight: {
        ...formData.weight,
        value: formData.weight.value ? parseFloat(formData.weight.value) : undefined
      },
      dimensions: {
        ...formData.dimensions,
        length: formData.dimensions.length ? parseFloat(formData.dimensions.length) : undefined,
        width: formData.dimensions.width ? parseFloat(formData.dimensions.width) : undefined,
        height: formData.dimensions.height ? parseFloat(formData.dimensions.height) : undefined
      },
      
      // Convert shipping cost
      shipping: {
        ...formData.shipping,
        cost: formData.shipping.cost ? parseFloat(formData.shipping.cost) : 0
      },
      
      // Ensure arrays are properly formatted
      keywords: Array.isArray(formData.keywords) ? formData.keywords : [],
      features: Array.isArray(formData.features) ? formData.features : [],
      tags: Array.isArray(formData.tags) ? formData.tags : [],
      specifications: formData.specifications || {}
    };

    const url = editingProduct 
      ? `/api/products/${editingProduct._id}`
      : '/api/products';
    
    const method = editingProduct ? 'PUT' : 'POST';

    console.log('🟢 Sending request to:', url);
    console.log('🟢 Submit data:', submitData);

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
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

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      shortDescription: '',
      price: '',
      originalPrice: '',
      discount: '',
      currency: 'USD',
      category: '',
      subcategory: '',
      brand: '',
      images: [],
      thumbnail: '',
      sku: '',
      stock: '',
      lowStockAlert: 10,
      metaTitle: '',
      metaDescription: '',
      keywords: [],
      status: 'draft',
      isFeatured: false,
      isOnSale: false,
      specifications: {},
      features: [],
      tags: [],
      weight: { value: '', unit: 'kg' },
      dimensions: { length: '', width: '', height: '', unit: 'cm' },
      shipping: {
        isFree: false,
        cost: '',
        weightBasedCost: false
      },
      vendor: ''
    });
    setNewCategoryInput('');
    setImageUrls(['']);
    setThumbnailUrl('');
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    
    // Set image URLs from product data
    if (product.images && product.images.length > 0) {
      setImageUrls(product.images.map(img => img.url));
    } else {
      setImageUrls(['']);
    }
    
    // Set thumbnail URL
    setThumbnailUrl(product.thumbnail || '');

    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription || '',
      price: product.price.toString(),
      originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
      discount: product.discount ? product.discount.toString() : '',
      currency: product.currency || 'USD',
      category: product.category || '',
      subcategory: product.subcategory || '',
      brand: product.brand,
      images: product.images || [],
      thumbnail: product.thumbnail || '',
      sku: product.sku,
      stock: product.stock.toString(),
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
  };

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

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="text-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <span>+</span>
          Add New Product
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="">All Categories</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto text-gray-900">
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
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
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
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      placeholder="product-name-slug"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Short Description
                    </label>
                    <textarea
                      rows={2}
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      placeholder="Brief description for product listings"
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="bg-gray-50 p-4 rounded-lg">
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
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        placeholder="https://example.com/product-image.jpg"
                      />
                      {imageUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageUrlField(index)}
                          className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addImageUrlField}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-2"
                  >
                    + Add Another Image URL
                  </button>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Add multiple product image URLs. The first image will be used as primary.
                  </p>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-4">Pricing</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (USD) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Original Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
                      onChange={(e) => setFormData({...formData, discount: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({...formData, currency: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Category & Brand */}
              <div className="bg-gray-50 p-4 rounded-lg">
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
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat, index) => (
                          <option key={index} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCategoryInput}
                          onChange={(e) => setNewCategoryInput(e.target.value)}
                          placeholder="New category"
                          className="w-40 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        />
                        <button
                          type="button"
                          onClick={addNewCategory}
                          disabled={!newCategoryInput.trim()}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
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
                      onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Inventory */}
              <div className="bg-gray-50 p-4 rounded-lg">
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
                      onChange={(e) => setFormData({...formData, sku: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Low Stock Alert
                    </label>
                    <input
                      type="number"
                      value={formData.lowStockAlert}
                      onChange={(e) => setFormData({...formData, lowStockAlert: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Product Status */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-4">Product Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Featured Product</span>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isOnSale}
                        onChange={(e) => setFormData({...formData, isOnSale: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
                      onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded object-cover"
                        src={product.thumbnail || product.images?.[0]?.url || '/default-product.png'}
                        alt={product.name}
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
                        className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50"
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

        {products.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">📦</div>
            <p className="text-lg font-medium">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}