import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { supabase } from '../lib/supabase';
import { Shield, Zap, Headphones } from 'lucide-react';
import './Home.css';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*').limit(4);
      if (!error && data) {
        setFeaturedProducts(data);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero section">
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Elevate Your <span className="text-gradient">Digital</span> Experience
            </h1>
            <p className="hero-subtitle">
              Platform premium untuk produk digital, top-up game instan, dan layanan pembuatan website modern. Mulai perjalanan digital Anda bersama kami.
            </p>
            <div className="hero-actions">
              <Link to="/store" className="btn btn-primary">Jelajahi Produk</Link>
              <Link to="/services" className="btn btn-secondary">Buat Website</Link>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <div className="hero-glow"></div>
            <img 
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Digital Experience" 
              className="hero-image glass-card"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container grid grid-cols-3">
          <div className="feature-card glass-card">
            <div className="feature-icon-wrapper"><Zap className="text-gradient" size={32} /></div>
            <h3>Proses Instan</h3>
            <p>Transaksi diproses otomatis 24/7 tanpa perlu menunggu lama.</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon-wrapper"><Shield className="text-gradient" size={32} /></div>
            <h3>Aman & Terpercaya</h3>
            <p>Pembayaran dijamin aman dengan perlindungan data pelanggan.</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon-wrapper"><Headphones className="text-gradient" size={32} /></div>
            <h3>Layanan Support</h3>
            <p>Tim support kami siap membantu Anda kapanpun dibutuhkan.</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <div className="section-header justify-between items-center flex mb-4">
            <h2 className="section-title">Produk <span className="text-gradient">Unggulan</span></h2>
            <Link to="/store" className="btn btn-secondary btn-sm">Lihat Semua</Link>
          </div>
          <div className="grid grid-cols-4">
            {loading ? <p>Loading...</p> : 
              featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
