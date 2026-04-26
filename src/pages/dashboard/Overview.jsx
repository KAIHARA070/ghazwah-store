import { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Package } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Overview() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeProducts: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Get Products Count
      const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
      
      // Get Orders
      const { data: orders } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      
      let revenue = 0;
      let orderCount = 0;
      let recent = [];
      
      if (orders) {
        orderCount = orders.length;
        revenue = orders.reduce((sum, order) => sum + Number(order.total_price), 0);
        recent = orders.slice(0, 3);
      }

      setStats({
        totalRevenue: revenue,
        totalOrders: orderCount,
        activeProducts: productsCount || 0
      });
      setRecentOrders(recent);
      setLoading(false);
    }
    
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Dashboard Overview</h1>
      
      <div className="grid grid-cols-3 mb-5">
        <div className="glass stat-card">
          <div className="stat-header">
            <span>Total Pendapatan</span>
            <DollarSign className="text-gradient" size={24} />
          </div>
          <div className="stat-value">RM {stats.totalRevenue.toLocaleString('ms-MY')}</div>
          <div className="stat-desc">Berdasarkan semua pesanan</div>
        </div>
        
        <div className="glass stat-card">
          <div className="stat-header">
            <span>Total Pesanan</span>
            <ShoppingCart className="text-gradient" size={24} />
          </div>
          <div className="stat-value">{stats.totalOrders}</div>
          <div className="stat-desc">Pesanan masuk</div>
        </div>
        
        <div className="glass stat-card">
          <div className="stat-header">
            <span>Produk Aktif</span>
            <Package className="text-gradient" size={24} />
          </div>
          <div className="stat-value">{stats.activeProducts}</div>
          <div className="stat-desc">Di katalog toko</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2">
        <div className="glass p-4" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <h3 className="mb-4">Pesanan Terbaru</h3>
          <div className="table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="3" className="text-center">Memuat...</td></tr>
                ) : recentOrders.length === 0 ? (
                  <tr><td colSpan="3" className="text-center">Belum ada pesanan</td></tr>
                ) : (
                  recentOrders.map(order => (
                    <tr key={order.id}>
                      <td style={{ fontSize: '0.8rem' }}>{order.id.substring(0,8)}...</td>
                      <td>RM {Number(order.total_price).toLocaleString('ms-MY')}</td>
                      <td>
                        <span className={`status-badge status-${order.status === 'Selesai' ? 'success' : order.status === 'Pending' ? 'warning' : 'danger'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="glass p-4" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <h3 className="mb-4">Performa Kategori</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Top-Up Game</span>
                <span>65%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '65%', height: '100%', background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Digital Products</span>
                <span>25%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '25%', height: '100%', background: 'linear-gradient(90deg, var(--color-accent), var(--color-primary))' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Jasa Website</span>
                <span>10%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '10%', height: '100%', background: 'var(--success)' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

