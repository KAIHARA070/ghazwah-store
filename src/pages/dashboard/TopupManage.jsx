import { useState, useEffect } from 'react';
import { Plus, X, Gamepad2, Package as PackageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function TopupManage() {
  const [games, setGames] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [activeTab, setActiveTab] = useState('games'); // 'games' or 'packages'
  const [showGameForm, setShowGameForm] = useState(false);
  const [showPkgForm, setShowPkgForm] = useState(false);
  const [selectedGameFilter, setSelectedGameFilter] = useState('');

  // Form State
  const [newGame, setNewGame] = useState({ name: '', publisher: '', image_url: '' });
  const [newPkg, setNewPkg] = useState({ game_id: '', name: '', price: '' });

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    if (activeTab === 'packages') {
      fetchPackages();
    }
  }, [activeTab]);

  // -- GAMES --
  const fetchGames = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('games').select('*').order('name');
    if (!error) setGames(data || []);
    setLoading(false);
  };

  const handleAddGame = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('games').insert([newGame]);
    if (!error) {
      setShowGameForm(false);
      setNewGame({ name: '', publisher: '', image_url: '' });
      fetchGames();
    } else {
      alert('Gagal menambah game: ' + error.message);
    }
  };

  const handleDeleteGame = async (id) => {
    if (confirm('Hapus game ini? Semua pakej di dalamnya juga akan terhapus!')) {
      const { error } = await supabase.from('games').delete().eq('id', id);
      if (!error) fetchGames();
      else alert('Gagal: ' + error.message);
    }
  };

  // -- PACKAGES --
  const fetchPackages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('topup_packages')
      .select('*, games(name)')
      .order('price', { ascending: true });
    if (!error) setPackages(data || []);
    setLoading(false);
  };

  const handleAddPkg = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('topup_packages').insert([{
      game_id: newPkg.game_id,
      name: newPkg.name,
      price: parseFloat(newPkg.price)
    }]);
    if (!error) {
      setShowPkgForm(false);
      setNewPkg({ game_id: newPkg.game_id, name: '', price: '' }); // keep selected game
      fetchPackages();
    } else {
      alert('Gagal menambah pakej: ' + error.message);
    }
  };

  const handleDeletePkg = async (id) => {
    if (confirm('Hapus pakej ini?')) {
      const { error } = await supabase.from('topup_packages').delete().eq('id', id);
      if (!error) fetchPackages();
      else alert('Gagal: ' + error.message);
    }
  };

  // Filter packages if a game is selected
  const filteredPackages = selectedGameFilter 
    ? packages.filter(p => p.game_id === selectedGameFilter) 
    : packages;

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Manajemen Game Top-Up</h1>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-700 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <button 
          className={`btn ${activeTab === 'games' ? 'btn-primary' : ''}`} 
          onClick={() => setActiveTab('games')}
          style={activeTab !== 'games' ? { background: 'transparent', border: 'none', color: 'var(--color-text-muted)' } : {}}
        >
          <Gamepad2 size={18} className="mr-2" /> Data Game
        </button>
        <button 
          className={`btn ${activeTab === 'packages' ? 'btn-primary' : ''}`} 
          onClick={() => setActiveTab('packages')}
          style={activeTab !== 'packages' ? { background: 'transparent', border: 'none', color: 'var(--color-text-muted)' } : {}}
        >
          <PackageIcon size={18} className="mr-2" /> Pakej Top-Up
        </button>
      </div>

      {/* GAMES TAB */}
      {activeTab === 'games' && (
        <>
          <div className="flex justify-end mb-4">
            <button className="btn btn-primary btn-sm" onClick={() => setShowGameForm(!showGameForm)}>
              {showGameForm ? <X size={16} /> : <Plus size={16} />} Tambah Game
            </button>
          </div>

          {showGameForm && (
            <div className="glass p-4 mb-5" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
              <h3 className="mb-4">Tambah Game Baru</h3>
              <form onSubmit={handleAddGame}>
                <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Nama Game (Cth: Mobile Legends)</label>
                    <input type="text" className="form-input" required value={newGame.name} onChange={e => setNewGame({...newGame, name: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Publisher (Cth: Moonton)</label>
                    <input type="text" className="form-input" required value={newGame.publisher} onChange={e => setNewGame({...newGame, publisher: e.target.value})} />
                  </div>
                  <div className="form-group col-span-2" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">URL Gambar Cover</label>
                    <input type="url" className="form-input" required value={newGame.image_url} onChange={e => setNewGame({...newGame, image_url: e.target.value})} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">Simpan Game</button>
              </form>
            </div>
          )}

          <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Game</th>
                  <th>Publisher</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan="4" className="text-center">Memuat...</td></tr> : 
                 games.length === 0 ? <tr><td colSpan="4" className="text-center">Belum ada game.</td></tr> :
                 games.map(g => (
                   <tr key={g.id}>
                     <td><img src={g.image_url} alt={g.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}/></td>
                     <td style={{ fontWeight: 'bold' }}>{g.name}</td>
                     <td>{g.publisher}</td>
                     <td>
                       <button className="btn btn-sm btn-danger" onClick={() => handleDeleteGame(g.id)}>Hapus</button>
                     </td>
                   </tr>
                 ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* PACKAGES TAB */}
      {activeTab === 'packages' && (
        <>
          <div className="flex justify-between mb-4">
            <select className="form-input" style={{ width: '250px' }} value={selectedGameFilter} onChange={e => setSelectedGameFilter(e.target.value)}>
              <option value="">Semua Game</option>
              {games.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
            <button className="btn btn-primary btn-sm" onClick={() => setShowPkgForm(!showPkgForm)}>
              {showPkgForm ? <X size={16} /> : <Plus size={16} />} Tambah Pakej
            </button>
          </div>

          {showPkgForm && (
            <div className="glass p-4 mb-5" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
              <h3 className="mb-4">Tambah Pakej Top-Up</h3>
              <form onSubmit={handleAddPkg}>
                <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group col-span-2" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Pilih Game</label>
                    <select className="form-input" required value={newPkg.game_id} onChange={e => setNewPkg({...newPkg, game_id: e.target.value})}>
                      <option value="">-- Pilih Game --</option>
                      {games.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nama Item (Cth: 13 Diamonds)</label>
                    <input type="text" className="form-input" required value={newPkg.name} onChange={e => setNewPkg({...newPkg, name: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Harga (RM)</label>
                    <input type="number" step="0.01" className="form-input" required value={newPkg.price} onChange={e => setNewPkg({...newPkg, price: e.target.value})} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">Simpan Pakej</button>
              </form>
            </div>
          )}

          <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Game</th>
                  <th>Item Pakej</th>
                  <th>Harga (RM)</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan="4" className="text-center">Memuat...</td></tr> : 
                 filteredPackages.length === 0 ? <tr><td colSpan="4" className="text-center">Belum ada pakej.</td></tr> :
                 filteredPackages.map(p => (
                   <tr key={p.id}>
                     <td><span className="status-badge" style={{ background: 'rgba(255,255,255,0.1)' }}>{p.games?.name || 'Unknown'}</span></td>
                     <td style={{ fontWeight: 'bold' }}>{p.name}</td>
                     <td className="text-gradient" style={{ fontWeight: 'bold' }}>RM {Number(p.price).toFixed(2)}</td>
                     <td>
                       <button className="btn btn-sm btn-danger" onClick={() => handleDeletePkg(p.id)}>Hapus</button>
                     </td>
                   </tr>
                 ))}
              </tbody>
            </table>
          </div>
        </>
      )}

    </div>
  );
}

