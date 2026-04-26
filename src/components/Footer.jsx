import { Rocket } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer" style={{ borderTop: '1px solid var(--glass-border)', marginTop: 'auto', padding: 'var(--space-xl) 0 var(--space-lg)', background: 'rgba(11, 14, 20, 0.8)' }}>
      <div className="container">
        <div className="grid grid-cols-4 mb-5">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo.jpeg" alt="Ghazwah Store" style={{ height: '50px', width: 'auto', objectFit: 'contain' }} />
              <span className="text-gradient" style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', fontWeight: 800, letterSpacing: '0.5px' }}>Ghazwah Store</span>
            </div>
            <p className="text-muted mb-3" style={{ maxWidth: '400px' }}>
              Platform e-commerce premium untuk produk digital, top-up game tercepat, dan layanan pembuatan website profesional.
            </p>
              <span style={{ fontSize: '0.9rem' }}>Ikuti kami di media sosial</span>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '1.5rem' }}>Produk</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--color-text-muted)' }}>
              <li><a href="#">Top-Up Game</a></li>
              <li><a href="#">Software & Lisensi</a></li>
              <li><a href="#">Akun Premium</a></li>
              <li><a href="#">E-Books</a></li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '1.5rem' }}>Layanan</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--color-text-muted)' }}>
              <li><a href="#">Buat Website</a></li>
              <li><a href="#">Desain Grafis</a></li>
              <li><a href="#">SEO Optimization</a></li>
              <li><a href="#">Konsultasi Digital</a></li>
            </ul>
          </div>
        </div>
        
        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '2rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          <p>&copy; {new Date().getFullYear()} Ghazwah Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

