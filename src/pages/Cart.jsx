import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Cart() {
  const { cart, removeFromCart, cartTotal, cartCount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      alert("Anda harus login terlebih dahulu untuk melakukan pembayaran.");
      navigate('/login');
    } else {
      try {
        const { error } = await supabase.from('orders').insert([
          {
            user_email: user.email,
            total_price: cartTotal,
            items_count: cartCount,
            status: 'Pending'
          }
        ]);

        if (error) throw error;

        alert("Pesanan berhasil dibuat! Mengarahkan ke payment gateway BayarCash.com...");
        clearCart();
        // Nantinya logika API BayarCash.com akan ditambahkan di sini
        // window.location.href = "https://bayarcash.com/checkout/YOUR_ID";
      } catch (error) {
        alert("Gagal membuat pesanan: " + error.message);
      }
    }
  };

  if (cart.length === 0) {
    return (
      <div className="section" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center">
          <h2>Keranjang Kosong</h2>
          <p className="text-muted mb-4 mt-2">Anda belum menambahkan produk apapun ke keranjang.</p>
          <button className="btn btn-primary" onClick={() => navigate('/store')}>Belanja Sekarang</button>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="hero-title mb-5" style={{ fontSize: '2.5rem' }}>Keranjang <span className="text-gradient">Belanja</span></h1>
        
        <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
          <div className="glass-card" style={{ gridColumn: 'span 2', padding: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                  <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ marginBottom: '0.25rem' }}>{item.name}</h4>
                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>RM {item.price.toLocaleString('ms-MY')} x {item.quantity}</p>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                    RM {(item.price * item.quantity).toLocaleString('ms-MY')}
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass-card" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 className="mb-4">Ringkasan Pesanan</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
              <span>Total Harga</span>
              <span>RM {cartTotal.toLocaleString('ms-MY')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
              <span>Biaya Layanan</span>
              <span>Gratis</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)', fontSize: '1.25rem', fontWeight: 800 }}>
              <span>Total Bayar</span>
              <span className="text-gradient">RM {cartTotal.toLocaleString('ms-MY')}</span>
            </div>
            
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }} onClick={handleCheckout}>
              <CreditCard size={18} /> Bayar dengan BayarCash
            </button>
            
            {!user && (
              <p className="text-center mt-3 text-muted" style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>
                *Anda harus login untuk melanjutkan
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

