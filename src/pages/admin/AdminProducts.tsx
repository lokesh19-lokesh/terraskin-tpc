import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Save, X } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Temporary edit states
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");

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

  if (loading) return <div className="text-gray-500">Loading products database...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
        <button className="bg-[#8d4745] hover:bg-[#7a3f3d] text-white px-4 py-2 rounded flex items-center gap-2 transition-colors">
          <Plus size={18} /> Add New Product
        </button>
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
                  ) : `$${product.price}`}
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
    </div>
  );
};

export default AdminProducts;
