import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, X, Database, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { products as mockProducts } from '../../data/products';

const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Edit Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editOriginalPrice, setEditOriginalPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editFullDescription, setEditFullDescription] = useState("");
  const [editIngredients, setEditIngredients] = useState("");
  const [editBenefits, setEditBenefits] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const [useEditUpload, setUseEditUpload] = useState(false);

  // Add Product Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newOriginalPrice, setNewOriginalPrice] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newCategory, setNewCategory] = useState("serums");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newFullDescription, setNewFullDescription] = useState("");
  const [newIngredients, setNewIngredients] = useState("");
  const [newBenefits, setNewBenefits] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [useUpload, setUseUpload] = useState(true);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const fixImageUrl = (url: string) => {
    if (url.includes('drive.google.com/file/d/')) {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://lh3.googleusercontent.com/u/0/d/${match[1]}`;
      }
    }
    return url;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false });
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
    setEditOriginalPrice(product.original_price ? product.original_price.toString() : "");
    setEditStock(product.stock_quantity.toString());
    setEditCategory(product.category);
    setEditImageUrl(product.image_url || "");
    setEditDescription(product.description || "");
    setEditFullDescription(product.full_description || "");
    setEditIngredients(product.ingredients ? product.ingredients.join('\n') : "");
    setEditBenefits(product.benefits ? product.benefits.join('\n') : "");
    setEditPreview(product.image_url || "");
    setShowEditModal(true);
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditFile(file);
      setEditPreview(URL.createObjectURL(file));
      setUseEditUpload(true);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setUploading(true);
    try {
      let finalImageUrl = editImageUrl;

      if (useEditUpload && editFile) {
        const fileExt = editFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, editFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrl;
      } else {
        finalImageUrl = fixImageUrl(editImageUrl);
      }

      const { error } = await supabase
        .from('products')
        .update({
          name: editName,
          price: parseFloat(editPrice),
          original_price: editOriginalPrice ? parseFloat(editOriginalPrice) : null,
          stock_quantity: parseInt(editStock, 10),
          category: editCategory,
          image_url: finalImageUrl,
          description: editDescription,
          full_description: editFullDescription,
          ingredients: editIngredients.split('\n').map(s => s.trim()).filter(s => s !== ''),
          benefits: editBenefits.split('\n').map(s => s.trim()).filter(s => s !== ''),
          is_active: true
        })
        .eq('id', editingId);

      if (error) throw error;
      
      toast.success("Product updated successfully");
      setShowEditModal(false);
      setEditingId(null);
      setEditFile(null);
      setEditPreview(null);
      fetchProducts();
    } catch (error: any) {
      toast.error("Failed to update product: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product? This will remove it from the shop and dashboard, but keep it in your record history.")) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error: any) {
      toast.error("Deletion failed: " + (error.message || "Unknown error occurred"));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setUploadPreview(URL.createObjectURL(file));
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let finalImageUrl = newImageUrl;

      // Handle direct file upload to Supabase Storage
      if (useUpload && imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrl;
      } else {
        finalImageUrl = fixImageUrl(newImageUrl);
      }

      const { error } = await supabase.from('products').insert([
        {
          name: newName,
          price: parseFloat(newPrice),
          original_price: newOriginalPrice ? parseFloat(newOriginalPrice) : null,
          stock_quantity: parseInt(newStock, 10),
          category: newCategory,
          image_url: finalImageUrl,
          description: newDescription || "Premium Skincare Product",
          full_description: newFullDescription,
          ingredients: newIngredients.split('\n').map(s => s.trim()).filter(s => s !== ''),
          benefits: newBenefits.split('\n').map(s => s.trim()).filter(s => s !== ''),
          is_active: true
        }
      ]);

      if (error) throw error;

      toast.success("Successfully added new product to database!");
      setShowAddModal(false);
      setNewName("");
      setNewPrice("");
      setNewOriginalPrice("");
      setNewStock("");
      setNewImageUrl("");
      setNewDescription("");
      setNewFullDescription("");
      setNewIngredients("");
      setNewBenefits("");
      setImageFile(null);
      setUploadPreview(null);
      fetchProducts();
    } catch (error: any) {
      toast.error("Failed to add product: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSeedDatabase = async () => {
    try {
      const seedData = mockProducts.map(p => ({
        name: p.name,
        description: p.description || "Premium Skincare Product",
        full_description: p.fullDescription || p.description,
        price: p.price,
        original_price: p.originalPrice || null,
        stock_quantity: 100,
        category: p.category,
        image_url: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null,
        ingredients: p.ingredients || [],
        benefits: p.benefits || []
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b pb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-['Playfair_Display']">Product Management</h1>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
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

      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm -mx-4 sm:mx-0 mb-6">
        <table className="min-w-[800px] w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Prices (Offer/MRP)</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product.id}>
                 <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">₹{product.price}</span>
                    {product.original_price && (
                      <span className="text-[10px] text-gray-400 line-through">MRP: ₹{product.original_price}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {product.stock_quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => handleEditInit(product)} 
                      className="text-[#8d4745] hover:text-[#7a3f3d] p-1.5 bg-gray-50 rounded-lg transition-colors border border-gray-100"
                      title="Full Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)} 
                      className="text-red-500 hover:text-red-700 p-1.5 bg-red-50 rounded-lg transition-colors border border-red-100"
                      title="Delete Product"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
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

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold font-['Instrument_Serif'] text-[#8d4745]">Edit Product</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input type="text" required value={editName} onChange={e => setEditName(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-[#8d4745] focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer Price (₹)</label>
                  <input type="number" step="0.01" required value={editPrice} onChange={e => setEditPrice(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-[#8d4745] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ordinary Price (₹)</label>
                  <input type="number" step="0.01" value={editOriginalPrice} onChange={e => setEditOriginalPrice(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-[#8d4745] focus:outline-none" placeholder="MRP" />
                </div>
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                 <input type="number" required value={editStock} onChange={e => setEditStock(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-[#8d4745] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={editCategory} onChange={e => setEditCategory(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-[#8d4745] focus:outline-none">
                  <option value="serums">Serums</option>
                  <option value="moisturizers">Moisturizers</option>
                  <option value="cleansers">Cleansers</option>
                  <option value="treatments">Treatments</option>
                  <option value="suncare">Suncare</option>
                </select>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">Change Image</label>
                  <button type="button" onClick={() => setUseEditUpload(!useEditUpload)} className="text-xs text-[#8d4745] hover:underline">
                    {useEditUpload ? "Back to Current" : "Upload New"}
                  </button>
                </div>
                {useEditUpload ? (
                  <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#8d4745] cursor-pointer bg-gray-50 h-32 flex flex-col items-center justify-center">
                    <input type="file" ref={fileInputRef} onChange={handleEditFileChange} className="hidden" accept="image/*" />
                    {editPreview ? <img src={editPreview} className="h-full w-full object-contain" /> : <Upload size={24} className="text-gray-400" />}
                  </div>
                ) : (
                  <input type="url" value={editImageUrl} onChange={e => setEditImageUrl(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-[#8d4745] focus:outline-none" />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Summary</label>
                <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-[#8d4745] focus:outline-none" rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Description (Tabs Content)</label>
                <textarea value={editFullDescription} onChange={e => setEditFullDescription(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-[#8d4745] focus:outline-none" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients (One per line)</label>
                  <textarea value={editIngredients} onChange={e => setEditIngredients(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-[#8d4745] focus:outline-none" rows={4} placeholder="Vitamin C&#10;Hyaluronic Acid" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Benefits (One per line)</label>
                  <textarea value={editBenefits} onChange={e => setEditBenefits(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-[#8d4745] focus:outline-none" rows={4} placeholder="Brightens skin&#10;Hydrates" />
                </div>
              </div>
              <button disabled={uploading} type="submit" className="w-full bg-[#8d4745] text-white py-3 rounded-lg hover:bg-[#7a3f3d] font-medium transition-colors mt-4">
                {uploading ? "Saving Changes..." : "Save All Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer Price (₹)</label>
                  <input type="number" step="0.01" required value={newPrice} onChange={e => setNewPrice(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-[#8d4745] focus:outline-none" placeholder="Price" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ordinary Price (₹)</label>
                  <input type="number" step="0.01" value={newOriginalPrice} onChange={e => setNewOriginalPrice(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-[#8d4745] focus:outline-none" placeholder="MRP (Optional)" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock</label>
                <input type="number" required value={newStock} onChange={e => setNewStock(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-[#8d4745] focus:outline-none" placeholder="100" />
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
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">Product Image</label>
                  <button 
                    type="button" 
                    onClick={() => setUseUpload(!useUpload)}
                    className="text-xs text-[#8d4745] hover:underline"
                  >
                    {useUpload ? "Switch to URL" : "Switch to Upload"}
                  </button>
                </div>

                {useUpload ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#8d4745] cursor-pointer transition-colors bg-gray-50 h-32 flex flex-col items-center justify-center overflow-hidden"
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept="image/*" 
                    />
                    {uploadPreview ? (
                      <img src={uploadPreview} alt="Preview" className="h-full w-full object-contain" />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400">
                        <Upload size={24} className="mb-1" />
                        <span className="text-xs uppercase font-bold tracking-tight">Drop photo here or Click</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input 
                      type="url" 
                      value={newImageUrl} 
                      onChange={e => setNewImageUrl(e.target.value)} 
                      className="w-full border rounded-lg p-2 focus:ring-[#8d4745] focus:outline-none" 
                      placeholder="https://example.com/image.png" 
                    />
                  </div>
                )}
                <p className="text-[10px] text-gray-500">Note: Use JPG/PNG files for professional storefront results.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Summary</label>
                <textarea value={newDescription} onChange={e => setNewDescription(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-[#8d4745] focus:outline-none" rows={2} placeholder="Brief highlight..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Description (Tabs Content)</label>
                <textarea value={newFullDescription} onChange={e => setNewFullDescription(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-[#8d4745] focus:outline-none" rows={3} placeholder="Detailed product story..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients (One per line)</label>
                  <textarea value={newIngredients} onChange={e => setNewIngredients(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-[#8d4745] focus:outline-none" rows={4} placeholder="Item 1&#10;Item 2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Benefits (One per line)</label>
                  <textarea value={newBenefits} onChange={e => setNewBenefits(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-[#8d4745] focus:outline-none" rows={4} placeholder="Benefit 1&#10;Benefit 2" />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={uploading}
                className={`w-full text-white py-3 rounded-lg font-medium transition-colors mt-4 flex items-center justify-center gap-2 ${
                  uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#8d4745] hover:bg-[#7a3f3d]'
                }`}
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/50 border-t-white" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <ImageIcon size={18} />
                    Deploy Product to Store
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
