async function getProducts() {
  try {
    const res = await fetch('/api/products', { cache: 'no-store' });
    const data = await res.json();
    return data;
  } catch (error) {
    return { products: [] };
  }
}

export default async function CheckProducts() {
  const { products } = await getProducts();
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">All Products in Database</h1>
      
      <div className="mb-4">
        <p className="text-lg">Total products: {products.length}</p>
      </div>

      {products.map((product) => (
        <div key={product._id} className="border rounded-lg p-4 mb-4 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>ID:</strong> {product._id}</p>
              <p><strong>Name:</strong> {product.name}</p>
              <p><strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  product.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {product.status}
                </span>
              </p>
              <p><strong>Slug:</strong> {product.slug}</p>
            </div>
            <div>
              <p><strong>Brand:</strong> {product.brand}</p>
              <p><strong>Price:</strong> ${product.price}</p>
              <p><strong>Stock:</strong> {product.stock}</p>
              <p><strong>SKU:</strong> {product.sku}</p>
            </div>
          </div>
          
          {/* Quick action buttons */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(product._id);
                alert('Product ID copied to clipboard!');
              }}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              Copy ID
            </button>
            <a 
              href={`/test-put?id=${product._id}`}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              Test Update
            </a>
          </div>
        </div>
      ))}
      
      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📦</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h2>
          <p className="text-gray-600">The database is empty or there's a connection issue.</p>
        </div>
      )}
    </div>
  );
}