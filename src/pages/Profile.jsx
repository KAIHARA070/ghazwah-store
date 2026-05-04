import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="section text-center">
        <div className="container">
          <p>Sila log masuk untuk melihat profil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 70px - 300px)' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h1 className="hero-title mb-4" style={{ fontSize: '2rem' }}>Profil Saya</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="user-avatar" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ marginBottom: '4px' }}>{user.name}</h2>
              <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
                <Shield size={14} /> Peranan: <strong style={{ color: 'var(--color-primary)' }}>{user.role.toUpperCase()}</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1" style={{ gap: '1rem' }}>
            <div className="form-group mb-0">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={16} /> Nama Penuh
              </label>
              <input type="text" className="form-input" value={user.name} readOnly style={{ opacity: 0.8 }} />
            </div>
            
            <div className="form-group mb-0">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={16} /> Alamat Emel
              </label>
              <input type="email" className="form-input" value={user.email} readOnly style={{ opacity: 0.8 }} />
            </div>
          </div>
          
          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Maklumat Akaun</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '0' }}>Akaun ini disambungkan dengan sistem keselamatan selamat Supabase. Sebarang penukaran kata laluan harus dilakukan melalui fungsi 'Lupa Kata Laluan' pada masa hadapan.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
