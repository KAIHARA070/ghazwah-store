import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  }

  async function updateStatus(id, newStatus) {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    if (!error) {
      fetchOrders();
    } else {
      alert('Gagal update status: ' + error.message);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Daftar Pesanan</h1>
      </div>

      <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
        <div className="table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Pelanggan</th>
                <th>Tanggal</th>
                <th>Item</th>
                <th>Total (RM)</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-4">Memuat pesanan...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-4">Belum ada pesanan.</td></tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 600, color: 'var(--accent-primary)', fontSize: '0.8rem' }}>
                      {order.id.substring(0, 8)}...
                    </td>
                    <td>{order.user_email}</td>
                    <td className="text-muted" style={{ fontSize: '0.9rem' }}>
                      {new Date(order.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td>{order.items_count} produk</td>
                    <td style={{ fontWeight: 600 }}>RM {Number(order.total_price).toLocaleString('ms-MY')}</td>
                    <td>
                      <span className={`status-badge status-${order.status === 'Selesai' ? 'success' : order.status === 'Pending' ? 'warning' : 'danger'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <select 
                        className="form-input" 
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', width: 'auto' }} 
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                      >
                        <option value="Pending">Set Pending</option>
                        <option value="Selesai">Set Selesai</option>
                        <option value="Dibatalkan">Batalkan</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
