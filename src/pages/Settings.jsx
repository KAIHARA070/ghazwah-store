import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, Bell, Shield, Moon } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="section text-center">
        <div className="container">
          <p>Sila log masuk untuk melihat tetapan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 70px - 300px)' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
            <SettingsIcon size={28} className="text-gradient" />
            <h1 className="hero-title mb-0" style={{ fontSize: '2rem' }}>Tetapan</h1>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <Bell size={20} className="text-primary" />
                <h3 style={{ fontSize: '1.2rem', marginBottom: 0 }}>Notifikasi</h3>
              </div>
              <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Urus bagaimana anda menerima pemberitahuan tentang pesanan dan tawaran.</p>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked />
                <span>Terima emel untuk kemas kini pesanan</span>
              </label>
            </div>

            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <Moon size={20} className="text-primary" />
                <h3 style={{ fontSize: '1.2rem', marginBottom: 0 }}>Tema Paparan</h3>
              </div>
              <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Sistem ini menggunakan tema Gelap Premium secara lalai untuk pengalaman yang lebih baik.</p>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-primary btn-sm" disabled style={{ opacity: 0.8 }}>Tema Gelap</button>
              </div>
            </div>

            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <Shield size={20} className="text-primary" />
                <h3 style={{ fontSize: '1.2rem', marginBottom: 0 }}>Keselamatan</h3>
              </div>
              <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Ghazwah Store menggunakan teknologi keselamatan terkini untuk melindungi data anda.</p>
              <button className="btn btn-secondary btn-sm" onClick={() => alert('Ciri ini akan datang!')}>
                Tukar Kata Laluan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
