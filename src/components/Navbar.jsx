import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Rocket, LayoutDashboard, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState, useRef, useEffect } from 'react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar glass">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.jpeg" alt="Ghazwah Store Logo" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
          <span className="text-gradient" style={{ fontWeight: '800', fontSize: '1.2rem', letterSpacing: '1px' }}>Ghazwah Store</span>
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/store" className="nav-link">Digital Store</Link>
          <Link to="/topup" className="nav-link">Game Top-Up</Link>
          <Link to="/services" className="nav-link">Services</Link>
          <Link to="/videos" className="nav-link">Videos</Link>
        </div>

        <div className="navbar-actions">
          <Link to="/cart" className="cart-btn">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <div className={`user-dropdown ${isDropdownOpen ? 'open' : ''}`} ref={dropdownRef}>
              <div className="user-dropdown-toggle" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <div className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 500, marginRight: '4px' }}>{user.name.split(' ')[0]}</span>
              </div>
              
              <div className="dropdown-menu">
                <div style={{ padding: '0.5rem 1rem', marginBottom: '4px' }}>
                  <div style={{ fontWeight: 600 }}>{user.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{user.email}</div>
                </div>
                
                <div className="dropdown-divider"></div>
                
                {user.role === 'admin' && (
                  <Link to="/dashboard" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                )}
                
                <Link to="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                  <User size={16} /> Profil Saya
                </Link>
                
                <Link to="/settings" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                  <Settings size={16} /> Tetapan
                </Link>
                
                <div className="dropdown-divider"></div>
                
                <button onClick={handleLogout} className="dropdown-item" style={{ width: '100%', color: 'var(--danger)' }}>
                  <LogOut size={16} /> Log Keluar
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              <User size={16} /> Login
            </Link>
          )}
          
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu glass ${isMobileMenuOpen ? 'open' : ''}`}>
        <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
        <Link to="/store" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Digital Store</Link>
        <Link to="/topup" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Game Top-Up</Link>
        <Link to="/services" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
        <Link to="/videos" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Videos</Link>
        
        <div className="mobile-auth-actions md:hidden">
          {user ? (
            <>
              <div className="user-greeting" style={{ display: 'block', marginBottom: '0.5rem' }}>Hi, {user.name}</div>
              {user.role === 'admin' && (
                <Link to="/dashboard" className="btn btn-secondary" onClick={() => setIsMobileMenuOpen(false)}>
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
              )}
              <Link to="/profile" className="btn btn-secondary" onClick={() => setIsMobileMenuOpen(false)}>
                <User size={16} /> Profil Saya
              </Link>
              <Link to="/settings" className="btn btn-secondary" onClick={() => setIsMobileMenuOpen(false)}>
                <Settings size={16} /> Tetapan
              </Link>
              <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="btn btn-danger">
                <LogOut size={16} /> Log Keluar
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary" onClick={() => setIsMobileMenuOpen(false)}>
              <User size={16} /> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
