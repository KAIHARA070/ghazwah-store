import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { HelpCircle, CheckCircle2 } from 'lucide-react';

export default function TopUpDetail() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [game, setGame] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [userId, setUserId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [email, setEmail] = useState(user?.email || '');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchGameDetails();
  }, [gameId]);

  const fetchGameDetails = async () => {
    try {
      // Fetch Game
      const { data: gameData, error: gameError } = await supabase.from('games').select('*').eq('id', gameId).single();
      
      // Fallback mock logic
      if (gameError && gameError.message.includes('does not exist')) {
        setGame({ id: gameId, name: 'Mobile Legends: Bang Bang', publisher: 'Moonton', image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=500&q=80' });
        setPackages([
          { id: '1', name: '13 Diamonds + 1 Bonus', price: 1.00 },
          { id: '2', name: '38 Diamonds + 4 Bonus', price: 3.00 },
          { id: '3', name: '64 Diamonds + 6 Bonus', price: 5.00 },
          { id: '4', name: '127 Diamonds + 13 Bonus', price: 10.00 },
          { id: '5', name: '254 Diamonds + 30 Bonus', price: 20.00 },
          { id: '6', name: '317 Diamonds + 38 Bonus', price: 25.00 },
        ]);
        setLoading(false);
        return;
      }
      
      if (gameError) throw gameError;
      setGame(gameData);

      // Fetch Packages
      const { data: pkgData, error: pkgError } = await supabase.from('topup_packages').select('*').eq('game_id', gameId).order('price', { ascending: true });
      if (pkgError) throw pkgError;
      setPackages(pkgData || []);
      
    } catch (err) {
      console.error('Failed to fetch game details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!userId) {
      alert('Sila masukkan User ID Anda.');
      return;
    }
    if (!selectedPackage) {
      alert('Sila pilih pakej Top-Up terlebih dahulu.');
      return;
    }
    
    setSubmitting(true);
    try {
      // Create Direct Order
      const orderData = {
        user_email: email || 'Guest',
        total_price: selectedPackage.price,
        items_count: 1,
        status: 'Pending',
        // We can't store additional unstructured data easily if we don't have a JSONB column in orders,
        // so we'll just save it like this for now. A robust system would have order_items.
      };
      
      const { error } = await supabase.from('orders').insert([orderData]);
      
      if (error && !error.message.includes('does not exist')) {
        throw error;
      }

      alert(`Pesanan Berjaya Dibuat!\n\nGame: ${game.name}\nID: ${userId} (${zoneId})\nItem: ${selectedPackage.name}\nTotal: RM ${selectedPackage.price.toFixed(2)}`);
      navigate('/');
    } catch (err) {
      console.error('Purchase failed:', err);
      alert('Gagal memproses pesanan.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-5"><div className="spinner" style={{ margin: '0 auto' }}></div></div>;
  }

  if (!game) {
    return <div className="text-center py-5 text-muted">Game tidak dijumpai.</div>;
  }

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 70px)', background: 'linear-gradient(to bottom, rgba(20,20,30,1) 0%, rgba(10,10,15,1) 100%)' }}>
      <div className="container">
        
        {/* Top Header Panel */}
        <div className="glass-card mb-4 flex flex-col md-flex-row gap-4 items-center p-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <img src={game.image_url} alt={game.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '12px' }} />
          <div>
            <div className="text-gradient mb-1" style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>OFFICIAL DISTRIBUTOR</div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>{game.name}</h1>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>{game.publisher}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg-grid-cols-3" style={{ gap: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr 350px' }}>
          
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Step 1: User ID */}
            <div className="glass-card p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="flex items-center gap-2" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                  <span style={{ background: 'var(--primary)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>1</span>
                  Masukkan User ID
                </h2>
                <div className="text-muted flex items-center gap-1" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                  <HelpCircle size={16} /> Cara Mencari?
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="form-group flex-1">
                  <input type="text" className="form-input" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} style={{ background: 'rgba(0,0,0,0.2)' }} required />
                </div>
                <div className="form-group flex-1">
                  <input type="text" className="form-input" placeholder="Zone ID (Optional)" value={zoneId} onChange={(e) => setZoneId(e.target.value)} style={{ background: 'rgba(0,0,0,0.2)' }} />
                </div>
              </div>
              <p className="text-muted mt-3" style={{ fontSize: '0.8rem' }}>
                Untuk mencari User ID, ketuk avatar Anda di sudut kiri atas layar profil. User ID akan ditampilkan di bawah Nama Anda.
              </p>
            </div>

            {/* Step 2: Select Package */}
            <div className="glass-card p-4">
              <h2 className="flex items-center gap-2 mb-4" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                <span style={{ background: 'var(--primary)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>2</span>
                Pilih Jumlah
              </h2>
              
              <div className="mb-3 p-2" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                💎 Item Top-Up
              </div>

              <div className="grid grid-cols-2 md-grid-cols-3" style={{ gap: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
                {packages.length === 0 ? (
                  <div className="text-muted text-center" style={{ gridColumn: '1/-1' }}>Tiada pakej tersedia.</div>
                ) : (
                  packages.map(pkg => (
                    <div 
                      key={pkg.id} 
                      className="glass-card" 
                      style={{ 
                        padding: '1rem', 
                        cursor: 'pointer', 
                        border: selectedPackage?.id === pkg.id ? '2px solid var(--primary)' : '2px solid transparent',
                        background: selectedPackage?.id === pkg.id ? 'rgba(var(--primary-rgb), 0.1)' : 'rgba(255,255,255,0.03)',
                        transition: 'all 0.2s',
                        position: 'relative'
                      }}
                      onClick={() => setSelectedPackage(pkg)}
                    >
                      {selectedPackage?.id === pkg.id && (
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', color: 'var(--primary)', background: '#fff', borderRadius: '50%' }}>
                          <CheckCircle2 size={20} />
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <img src="https://cdn-icons-png.flaticon.com/512/2850/2850730.png" alt="Diamond" style={{ width: '24px', filter: 'hue-rotate(180deg)' }} />
                        <div style={{ fontSize: '0.85rem', fontWeight: 'bold', lineHeight: 1.2 }}>{pkg.name}</div>
                      </div>
                      <div className="text-gradient" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>MYR {Number(pkg.price).toFixed(2)}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Right Sidebar: Checkout */}
          <div>
            <div className="glass-card p-4 sticky top-4">
              <h2 className="mb-4" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Checkout</h2>
              
              <div className="flex justify-between mb-2 text-muted" style={{ fontSize: '0.9rem' }}>
                <span>Item</span>
                <span style={{ textAlign: 'right', fontWeight: 'bold', color: 'white' }}>{selectedPackage ? selectedPackage.name : '-'}</span>
              </div>
              <div className="flex justify-between mb-4 text-muted" style={{ fontSize: '0.9rem' }}>
                <span>Game</span>
                <span style={{ textAlign: 'right', color: 'white' }}>{game.name}</span>
              </div>

              <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1rem 0' }} />

              <div className="form-group mb-4">
                <label className="form-label" style={{ fontSize: '0.85rem' }}>Email Address (Opsional)</label>
                <input type="email" className="form-input" placeholder="Email untuk bukti resit" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.2)' }} />
              </div>

              <div className="flex justify-between items-center mb-4">
                <span style={{ fontWeight: 'bold' }}>Total</span>
                <span className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  MYR {selectedPackage ? Number(selectedPackage.price).toFixed(2) : '0.00'}
                </span>
              </div>

              <button 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '0.8rem', fontWeight: 'bold' }} 
                onClick={handlePurchase}
                disabled={submitting}
              >
                {submitting ? 'Memproses...' : 'Purchase Now'}
              </button>
              
              <div className="text-center text-muted mt-3" style={{ fontSize: '0.75rem' }}>
                Dengan membeli, Anda menyetujui Syarat dan Ketentuan layanan.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
