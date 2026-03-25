import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Save, X, Database } from 'lucide-react';
import { toast } from 'react-toastify';
import { products as mockProducts } from '../../data/products';

const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Temporary edit states
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");

  // Add Product Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newCategory, setNewCategory] = useState("serums");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleEditInit = (product: any) => {
    setEditingId(product.id);
    setEditName(product.name);
    setEditPrice(product.price.toString());
    setEditStock(product.stock_quantity.toString());
  };

  const handleSave = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: editName,
          price: parseFloat(editPrice),
          stock_quantity: parseInt(editStock, 10)
        })
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Product updated securely");
      setEditingId(null);
      fetchProducts();
    } catch (error: any) {
      toast.error("Failed to execute update: " + error.message);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('products').insert([
        {
          name: newName,
          price: parseFloat(newPrice),
          stock_quantity: parseInt(newStock, 10),
          category: newCategory,
          image_url: newImageUrl,
          description: newDescription || "Premium Skincare Product"
        }
      ]);

      if (error) throw error;

      toast.success("Successfully added new product to database!");
      setShowAddModal(false);
      setNewName("");
      setNewPrice("");
      setNewStock("");
      setNewImageUrl("");
      setNewDescription("");
      fetchProducts();
    } catch (error: any) {
      toast.error("Failed to add product: " + error.message);
    }
  };

  const handleSeedDatabase = async () => {
    try {
      const seedData = mockProducts.map(p => ({
        name: p.name,
        description: p.description || p.fullDescription || "Premium Skincare Product",
        price: p.price,
        stock_quantity: 100,
        category: p.category,
        image_url: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null
      }));

      const { error } = await supabase.from('products').insert(seedData);
      if (error) throw error;
      
      toast.success("Successfully migrated all starting products to your live database!");
      fetchProducts();
    } catch (error: any) {
      toast.error("Failed to seed database: " + error.message);
    }
  };

  if (loading) return <div className="text-gray-500">Loading products database...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
        <div className="flex items-center gap-3">
          {products.length === 0 && !loading && (
            <button 
              onClick={handleSeedDatabase}
              className="bg-gray-100 border border-gray-300 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded flex items-center gap-2 transition-colors"
            >
              <Database size={18} /> Seed Standard Inventory
            </button>
          )}
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#8d4745] hover:bg-[#7a3f3d] text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
          >
            <Plus size={18} /> Add New Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {editingId === product.id ? (
                    <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="border p-1 w-full rounded" />
                  ) : product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {editingId === product.id ? (
                    <input type="number" step="0.01" value={editPrice} onChange={e => setEditPrice(e.target.value)} className="border p-1 w-24 rounded" />
                  ) : `₹${product.price}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {editingId === product.id ? (
                    <input type="number" value={editStock} onChange={e => setEditStock(e.target.value)} className="border p-1 w-20 rounded" />
                  ) : product.stock_quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                  {editingId === product.id ? (
                    <div className="flex justify-end gap-2">
                       <button onClick={() => handleSave(product.id)} className="text-green-600 hover:text-green-900 p-1"><Save size={18} /></button>
                       <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600 p-1"><X size={18} /></button>
                    </div>
                  ) : (
                    <button onClick={() => handleEditInit(product)} className="text-[#8d4745] hover:text-[#7a3f3d] p-1 transition-colors">
                      <Edit2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No products found in the database.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold font-['Instrument_Serif'] text-[#8d4745]">Add New Product</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input type="text" required value={newName} onChange={e => setNewName(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-[#8d4745] focus:outline-none" placeholder="e.g. Glowing Vitamin C Serum" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input type="number" step="0.01" required value={newPrice} onChange={e => setNewPrice(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-[#8d4745] focus:outline-none" placeholder="45.99" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock</label>
                  <input type="number" required value={newStock} onChange={e => setNewStock(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-[#8d4745] focus:outline-none" placeholder="100" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-[#8d4745] focus:outline-none">
                  <option value="serums">Serums</option>
                  <option value="moisturizers">Moisturizers</option>
                  <option value="cleansers">Cleansers</option>
                  <option value="treatments">Treatments</option>
                  <option value="suncare">Suncare</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input type="url" value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-[#8d4745] focus:outline-none" placeholder="https://example.com/image.png" />
                <p className="text-[10px] text-gray-500 mt-1">Note: Use direct image links (ending in .jpg/png) for best results.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={newDescription} onChange={e => setNewDescription(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-[#8d4745] focus:outline-none" rows={3} placeholder="Describe the benefits..." />
              </div>
              <button type="submit" className="w-full bg-[#8d4745] text-white py-3 rounded-lg hover:bg-[#7a3f3d] font-medium transition-colors mt-4">
                Deploy Product to Store
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
