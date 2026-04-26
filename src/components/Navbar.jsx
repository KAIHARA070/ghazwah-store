import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Rocket, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar glass">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.jpg" alt="Ghazwah Store Logo" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
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
            <div className="user-menu">
              <span className="user-greeting">Hi, {user.name}</span>
              {user.role === 'admin' && (
                <Link to="/dashboard" className="btn btn-secondary btn-sm" style={{ padding: '0.4rem 0.8rem' }}>
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-danger btn-sm">
                <LogOut size={16} /> Logout
              </button>
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
      {isMobileMenuOpen && (
        <div className="mobile-menu glass">
          <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/store" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Digital Store</Link>
          <Link to="/topup" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Game Top-Up</Link>
          <Link to="/services" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
          <Link to="/videos" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Videos</Link>
        </div>
      )}
    </nav>
  );
}
