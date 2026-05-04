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
            <h1 className="hero-title" style={{ textShadow: '0 0 20px rgba(168, 85, 247, 0.5)' }}>
              Elevate Your <span className="text-gradient">Digital</span> Experience
            </h1>
            <p className="hero-subtitle" style={{ fontSize: '1.1rem', opacity: 0.9 }}>
              Platform premium untuk produk digital, top-up game instan, dan layanan pembuatan website modern. Mulai perjalanan digital Anda bersama kami.
            </p>
            <div className="hero-actions">
              <Link to="/store" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Jelajahi Produk</Link>
              <Link to="/services" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Buat Website</Link>
            </div>
          </div>
          <div className="hero-image-wrapper" style={{ position: 'relative' }}>
            <div className="hero-glow" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, rgba(236,72,153,0.1) 50%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }}></div>
            <img 
              src="/gamer-hero.png" 
              alt="Gamer Experience" 
              className="hero-image glass-card"
              style={{ position: 'relative', zIndex: 1, border: '1px solid rgba(168, 85, 247, 0.4)', boxShadow: '0 0 40px rgba(168, 85, 247, 0.3)' }}
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
