import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { supabase } from '../lib/supabase';

export default function Store() {
  const [filter, setFilter] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const categories = ['All', 'Top-Up', 'Digital'];
  
  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <div className="section">
      <div className="container">
        <div className="flex justify-between items-center mb-5 flex-wrap gap-4">
          <div>
            <h1 className="hero-title mb-1" style={{ fontSize: '3rem' }}>Katalog <span className="text-gradient">Produk</span></h1>
            <p className="text-muted">Temukan produk digital dan top-up game terbaik.</p>
          </div>
          
          <div className="glass" style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem', borderRadius: '100px' }}>
            {categories.map(cat => (
              <button 
                key={cat}
                className={`btn btn-sm ${filter === cat ? 'btn-primary' : ''}`}
                style={{ borderRadius: '100px' }}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4">
          {loading ? <p>Loading products...</p> : 
            filteredProducts.length > 0 ? filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          )) : <p>Tidak ada produk ditemukan.</p>}
        </div>
      </div>
    </div>
  );
}
