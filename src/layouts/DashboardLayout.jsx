import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Menu, X, Rocket, Video, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './DashboardLayout.css';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Overview', path: '/dashboard', end: true, icon: <LayoutDashboard size={20} /> },
    { name: 'Produk Digital', path: '/dashboard/products', end: false, icon: <Package size={20} /> },
    { name: 'Game Top-Up', path: '/dashboard/topup', end: false, icon: <Rocket size={20} /> },
    { name: 'Orders', path: '/dashboard/orders', end: false, icon: <ShoppingCart size={20} /> },
    { name: 'Kelola Video', path: '/dashboard/videos', end: false, icon: <Video size={20} /> },
    { name: 'Customer Chats', path: '/dashboard/chat', end: false, icon: <MessageCircle size={20} /> },
  ];

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Only allow admin access to dashboard
  if (user.role !== 'admin') {
    return <Navigate to="/store" replace />;
  }

  return (
    <div className="dashboard-container">
      {/* Mobile Header */}
      <div className="dashboard-mobile-header glass">
        <div className="flex items-center gap-3 font-bold text-lg">
          <img src="/logo.jpeg" alt="Logo" style={{ height: '32px', width: 'auto' }} />
          <span className="text-gradient" style={{ letterSpacing: '0.5px' }}>Ghazwah Store</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar glass ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.jpeg" alt="Logo" style={{ height: '40px', width: 'auto' }} />
          <span className="text-gradient font-bold" style={{ fontSize: '1.25rem', letterSpacing: '0.5px' }}>Ghazwah Store</span>
        </div>

        <div className="sidebar-user mb-4 p-3" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Logged in as Admin</div>
          <div style={{ fontWeight: '600' }}>{user.name}</div>
        </div>

        <nav className="sidebar-nav">
          {navLinks.map((link) => (
            <NavLink 
              key={link.name} 
              to={link.path}
              end={link.end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsSidebarOpen(false)}
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-link text-danger w-100" onClick={handleLogout} style={{ color: 'var(--danger)', justifyContent: 'flex-start' }}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
          <NavLink to="/" className="sidebar-link mt-2" style={{ justifyContent: 'flex-start' }}>
            <span>&larr; Back to Store</span>
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
