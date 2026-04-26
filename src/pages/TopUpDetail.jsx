import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { HelpCircle, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

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
          { id: '1', name: '13 Diamonds', price: 1.00 },
          { id: '2', name: '38 Diamonds', price: 3.00 },
          { id: '3', name: '64 Diamonds', price: 5.00 },
          { id: '4', name: '127 Diamonds', price: 10.00 },
          { id: '5', name: '254 Diamonds', price: 20.00 },
          { id: '6', name: '317 Diamonds', price: 25.00 },
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
      const orderData = {
        user_email: email || 'Guest',
        total_price: selectedPackage.price,
        items_count: 1,
        status: 'Pending',
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
    <div className="section" style={{ minHeight: 'calc(100vh - 70px)', background: '#0f1016' }}>
      {/* Banner Background Effect */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '300px', backgroundImage: `url(${game.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15, maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)', zIndex: 0 }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Top Header Panel */}
        <div className="glass-card mb-5 flex flex-col md:flex-row gap-4 items-center p-5" style={{ background: 'rgba(20, 21, 31, 0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px' }}>
          <img src={game.image_url} alt={game.name} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={16} className="text-primary" />
              <span className="text-gradient" style={{ fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>OFFICIAL DISTRIBUTOR</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>{game.name}</h1>
            <p className="text-muted" style={{ fontSize: '1rem', fontWeight: '500' }}>{game.publisher}</p>
          </div>
        </div>

        <div className="layout-sidebar">
          
          <div className="flex flex-col gap-4">
            
            {/* Step 1: User ID */}
            <div className="glass-card p-6" style={{ background: 'rgba(20, 21, 31, 0.8)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px' }}>
              <div className="flex justify-between items-center mb-5 border-b border-gray-800 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <h2 className="flex items-center gap-3" style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                  <span style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', boxShadow: '0 4px 10px rgba(var(--primary-rgb), 0.3)' }}>1</span>
                  Masukkan User ID
                </h2>
                <div className="text-muted flex items-center gap-1 hover:text-white transition-colors" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                  <HelpCircle size={16} /> Cara Mencari?
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="form-group flex-1">
                  <input type="text" className="form-input" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem 1rem', fontSize: '1rem', borderRadius: '12px' }} required />
                </div>
                <div className="form-group flex-1">
                  <input type="text" className="form-input" placeholder="Zone ID (Optional)" value={zoneId} onChange={(e) => setZoneId(e.target.value)} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem 1rem', fontSize: '1rem', borderRadius: '12px' }} />
                </div>
              </div>
              <p className="text-muted mt-3" style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
                Untuk mencari User ID, ketuk avatar Anda di sudut kiri atas layar profil. User ID akan ditampilkan di bawah Nama Anda.
              </p>
            </div>

            {/* Step 2: Select Package */}
            <div className="glass-card p-6" style={{ background: 'rgba(20, 21, 31, 0.8)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px' }}>
              <div className="flex items-center gap-3 mb-5 border-b border-gray-800 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <h2 className="flex items-center gap-3" style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                  <span style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', boxShadow: '0 4px 10px rgba(var(--primary-rgb), 0.3)' }}>2</span>
                  Pilih Jumlah
                </h2>
              </div>
              
              <div className="mb-4 p-3 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '600', borderLeft: '3px solid var(--primary)' }}>
                <Zap size={18} className="text-primary" /> Item Top-Up
              </div>

              <div className="grid grid-cols-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--space-sm)' }}>
                {packages.length === 0 ? (
                  <div className="text-muted text-center" style={{ gridColumn: '1/-1', padding: '2rem 0' }}>Tiada pakej tersedia.</div>
                ) : (
                  packages.map(pkg => (
                    <div 
                      key={pkg.id} 
                      className="glass-card package-card" 
                      style={{ 
                        padding: '1.2rem', 
                        cursor: 'pointer', 
                        borderRadius: '16px',
                        border: selectedPackage?.id === pkg.id ? '2px solid var(--primary)' : '2px solid rgba(255,255,255,0.05)',
                        background: selectedPackage?.id === pkg.id ? 'linear-gradient(145deg, rgba(var(--primary-rgb), 0.15) 0%, rgba(var(--secondary-rgb), 0.05) 100%)' : 'rgba(0,0,0,0.2)',
                        transform: selectedPackage?.id === pkg.id ? 'translateY(-2px)' : 'none',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        minHeight: '110px'
                      }}
                      onClick={() => setSelectedPackage(pkg)}
                    >
                      {selectedPackage?.id === pkg.id && (
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', color: 'var(--primary)', background: '#fff', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                          <CheckCircle2 size={22} />
                        </div>
                      )}
                      <div className="flex flex-col items-center gap-2 mb-2">
                        <img src="https://cdn-icons-png.flaticon.com/512/2850/2850730.png" alt="Diamond" style={{ width: '32px', filter: 'hue-rotate(180deg) drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
                        <div style={{ fontSize: '0.95rem', fontWeight: '700', lineHeight: 1.2 }}>{pkg.name}</div>
                      </div>
                      <div className="text-gradient mt-1" style={{ fontWeight: '800', fontSize: '1.1rem' }}>MYR {Number(pkg.price).toFixed(2)}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Right Sidebar: Checkout */}
          <div>
            <div className="glass-card p-6 sticky" style={{ top: '2rem', background: 'rgba(20, 21, 31, 0.8)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
              <h2 className="mb-5" style={{ fontSize: '1.4rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '2px' }}>
                <span style={{ width: '4px', height: '24px', background: 'var(--primary)', borderRadius: '4px', marginRight: '10px' }}></span>
                Checkout
              </h2>
              
              <div className="flex justify-between mb-3" style={{ fontSize: '0.95rem' }}>
                <span className="text-muted">Item</span>
                <span style={{ textAlign: 'right', fontWeight: '700', color: 'white', maxWidth: '60%' }}>{selectedPackage ? selectedPackage.name : '-'}</span>
              </div>
              <div className="flex justify-between mb-5" style={{ fontSize: '0.95rem' }}>
                <span className="text-muted">Game</span>
                <span style={{ textAlign: 'right', color: 'white', fontWeight: '500', maxWidth: '60%' }}>{game.name}</span>
              </div>

              <hr style={{ borderColor: 'rgba(255,255,255,0.05)', margin: '1.5rem 0' }} />

              <div className="form-group mb-5">
                <label className="form-label text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Email Address (Opsional)</label>
                <input type="email" className="form-input" placeholder="Email untuk resit" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '0.8rem 1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '0.95rem' }} />
              </div>

              <div className="flex justify-between items-end mb-6">
                <span style={{ fontWeight: '600', color: 'var(--color-text-muted)' }}>Total Harga</span>
                <span className="text-gradient" style={{ fontSize: '1.8rem', fontWeight: '900', lineHeight: 1 }}>
                  MYR {selectedPackage ? Number(selectedPackage.price).toFixed(2) : '0.00'}
                </span>
              </div>

              <button 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '1rem', fontWeight: 'bold', fontSize: '1.1rem', borderRadius: '12px', boxShadow: '0 8px 20px rgba(var(--primary-rgb), 0.3)', textTransform: 'uppercase', letterSpacing: '1px' }} 
                onClick={handlePurchase}
                disabled={submitting}
              >
                {submitting ? 'Memproses...' : 'Purchase Now'}
              </button>
              
              <div className="text-center text-muted mt-4" style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
                Dengan membeli, Anda menyetujui <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>Syarat & Ketentuan</span> layanan kami.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

