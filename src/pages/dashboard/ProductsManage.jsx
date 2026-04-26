import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ProductsManage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Digital',
    image: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    // Only fetch Digital products if they are mixed, or fetch all from `products` table
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) {
        fetchProducts();
      } else {
        alert('Gagal menghapus produk: ' + error.message);
      }
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    const { error } = await supabase.from('products').insert([
      { 
        name: newProduct.name, 
        description: newProduct.description, 
        price: parseFloat(newProduct.price), 
        category: 'Digital', 
        image: newProduct.image 
      }
    ]);
    if (!error) {
      setShowAddForm(false);
      setNewProduct({ name: '', description: '', price: '', category: 'Digital', image: '' });
      fetchProducts();
    } else {
      alert('Gagal menambah produk: ' + error.message);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Manajemen Produk Digital</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? <X size={16} /> : <Plus size={16} />} 
          {showAddForm ? ' Batal' : ' Tambah Produk'}
        </button>
      </div>

      {showAddForm && (
        <div className="glass p-4 mb-5" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <h3 className="mb-4">Tambah Produk Digital</h3>
          <form onSubmit={handleAdd}>
            <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Nama Produk</label>
                <input type="text" className="form-input" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Harga (RM)</label>
                <input type="number" step="0.01" className="form-input" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">URL Gambar</label>
                <input type="url" className="form-input" required value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} />
              </div>
            </div>
            <div className="form-group mb-4">
              <label className="form-label">Deskripsi</label>
              <textarea className="form-input" rows="3" required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})}></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Simpan Produk</button>
          </form>
        </div>
      )}

      <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
        <div className="table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Gambar</th>
                <th>Nama Produk</th>
                <th>Harga (RM)</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="text-center py-4">Memuat produk...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-4">Belum ada produk.</td></tr>
              ) : (
                products.map(product => (
                  <tr key={product.id}>
                    <td>
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} 
                      />
                    </td>
                    <td style={{ fontWeight: 500 }}>{product.name}</td>
                    <td>RM {Number(product.price).toLocaleString('ms-MY')}</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-sm btn-danger" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleDelete(product.id)}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
