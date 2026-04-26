import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function TopUp() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase.from('games').select('*').order('name');
      if (error) throw error;
      setGames(data || []);
    } catch (err) {
      console.error('Failed to fetch games:', err.message);
      // Fallback for mock/test data if table doesn't exist
      if (err.message.includes('does not exist')) {
        setGames([
          { id: '1', name: 'Mobile Legends: Bang Bang', publisher: 'Moonton', image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=500&q=80' },
          { id: '2', name: 'PUBG Mobile', publisher: 'Tencent Games', image_url: 'https://images.unsplash.com/photo-1533282960533-51328aa265f6?auto=format&fit=crop&w=500&q=80' },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="hero-title mb-2" style={{ fontSize: '3rem' }}>Game <span className="text-gradient">Top-Up</span></h1>
          <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Instant Top-Up! Pilih game favoritmu dan top-up sekarang juga dengan aman dan cepat.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner" style={{ margin: '0 auto' }}></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md-grid-cols-4 lg-grid-cols-5" style={{ gap: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {games.length === 0 ? (
              <p className="text-center text-muted" style={{ gridColumn: '1 / -1' }}>Belum ada game tersedia.</p>
            ) : (
              games.map((game) => (
                <Link to={`/topup/${game.id}`} key={game.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="glass-card" style={{ padding: '0', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    <div style={{ position: 'relative', width: '100%', paddingTop: '100%' /* 1:1 Aspect Ratio */ }}>
                      <img 
                        src={game.image_url} 
                        alt={game.name} 
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                    <div style={{ padding: '1rem', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }}>
                      <div>
                        <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>{game.publisher}</p>
                        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}>{game.name}</h3>
                      </div>
                      <button className="btn" style={{ width: '100%', border: '1px solid var(--primary)', color: 'var(--primary)', background: 'transparent', padding: '0.4rem' }}>
                        TOP UP
                      </button>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
