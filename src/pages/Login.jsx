import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithEmail } = useAuth();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginWithEmail(email, password);
      
      // Determine redirect based on role
      let role = 'user';
      if (data && data.user && data.user.user_metadata) {
        role = data.user.user_metadata.role || 'user';
      } else if (data === true) {
        // Mock fallback
        const stored = JSON.parse(localStorage.getItem('user') || '{}');
        role = stored.role || 'user';
      }

      if (role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/store');
      }
    } catch (err) {
      setError('Email atau password salah.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 70px - 300px)', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '450px' }}>
        <div className="glass-card" style={{ padding: '3rem 2rem' }}>
          <div className="text-center mb-4">
            <h1 className="hero-title mb-1" style={{ fontSize: '2.5rem' }}>Login</h1>
            <p className="text-muted">Masuk ke akun Ghazwah Store Anda</p>
          </div>
          
          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleEmailSubmit}>
            <div className="form-group mb-3">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required 
              />
            </div>
            <div className="form-group mb-4">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-input" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required 
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Memuat...' : 'Masuk'}
            </button>
            
            <p className="text-center mt-4 text-muted" style={{ fontSize: '0.9rem' }}>
              Belum punya akun? <Link to="/register" className="text-gradient">Daftar sekarang</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
