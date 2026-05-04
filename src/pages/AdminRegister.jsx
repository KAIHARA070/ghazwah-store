import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';

export default function AdminRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { registerWithEmail } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    // Simple security check for admin registration
    if (adminCode !== 'GHAZWAH2026') {
      setError('Kode admin tidak valid!');
      return;
    }

    setLoading(true);
    try {
      const data = await registerWithEmail(email, password, name, 'admin');
      if (data && !data.session) {
        setError('Pendaftaran Admin berjaya! Sila semak emel anda dan klik pautan pengesahan sebelum log masuk.');
      } else {
        navigate('/dashboard'); // Redirect to dashboard for admin
      }
    } catch (err) {
      setError(err.message || 'Gagal mendaftar. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 70px - 300px)', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '450px' }}>
        <div className="glass-card" style={{ padding: '3rem 2rem', borderTop: '4px solid var(--primary)' }}>
          <div className="text-center mb-4 flex flex-col items-center">
            <Rocket size={40} className="text-gradient mb-3" />
            <h1 className="hero-title mb-1" style={{ fontSize: '2rem' }}>Admin Portal</h1>
            <p className="text-muted">Buat akun Administrator baru</p>
          </div>
          
          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="form-group mb-3">
              <label className="form-label">Nama Lengkap</label>
              <input 
                type="text" 
                className="form-input" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Admin Name"
                required 
              />
            </div>
            <div className="form-group mb-3">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ghazwah.com"
                required 
              />
            </div>
            <div className="form-group mb-3">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-input" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required 
                minLength={6}
              />
            </div>
            <div className="form-group mb-4">
              <label className="form-label">Kode Rahasia Admin</label>
              <input 
                type="password" 
                className="form-input" 
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                placeholder="Masukkan kode rahasia"
                required 
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Mendaftar...' : 'Daftar Sebagai Admin'}
            </button>
            
            <p className="text-center mt-4 text-muted" style={{ fontSize: '0.9rem' }}>
              Sudah punya akun? <Link to="/login" className="text-gradient">Masuk di sini</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
