import { Rocket } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer" style={{ borderTop: '1px solid var(--glass-border)', marginTop: 'auto', padding: '4rem 0 2rem', background: 'rgba(11, 14, 20, 0.8)' }}>
      <div className="container">
        <div className="grid grid-cols-4 mb-5" style={{ gap: '3rem' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
              <img src="/logo.jpg" alt="Ghazwah Store" style={{ height: '50px', width: 'auto', objectFit: 'contain' }} />
              <span className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.5px' }}>Ghazwah Store</span>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '400px' }}>
              Platform e-commerce premium untuk produk digital, top-up game tercepat, dan layanan pembuatan website profesional.
            </p>
              <span style={{ fontSize: '0.9rem' }}>Ikuti kami di media sosial</span>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '1.5rem' }}>Produk</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-muted)' }}>
              <li><a href="#">Top-Up Game</a></li>
              <li><a href="#">Software & Lisensi</a></li>
              <li><a href="#">Akun Premium</a></li>
              <li><a href="#">E-Books</a></li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '1.5rem' }}>Layanan</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-muted)' }}>
              <li><a href="#">Buat Website</a></li>
              <li><a href="#">Desain Grafis</a></li>
              <li><a href="#">SEO Optimization</a></li>
              <li><a href="#">Konsultasi Digital</a></li>
            </ul>
          </div>
        </div>
        
        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <p>&copy; {new Date().getFullYear()} Ghazwah Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
