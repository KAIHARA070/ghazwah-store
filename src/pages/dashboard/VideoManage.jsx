import { useState, useEffect } from 'react';
import { Video, Plus, Link as LinkIcon, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function VideoManage() {
  const [videos, setVideos] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setFetching(true);
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error.message);
    } finally {
      setFetching(false);
    }
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    if (!title || !videoUrl) return;

    try {
      setLoading(true);
      // Extraksi ID YouTube jika memungkinkan untuk thumbnail
      let thumbnail = '';
      if (videoUrl.includes('youtube.com/watch?v=')) {
        const videoId = new URLSearchParams(new URL(videoUrl).search).get('v');
        thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      } else if (videoUrl.includes('youtu.be/')) {
        const videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
        thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      } else {
        thumbnail = 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=500&q=80';
      }

      const newVideo = {
        title,
        url: videoUrl,
        thumbnail,
        status: 'Aktif',
        views: '0'
      };

      const { data, error } = await supabase
        .from('videos')
        .insert([newVideo])
        .select();

      if (error) throw error;
      
      alert('Video berhasil ditambahkan ke halaman Tech Videos!');
      setVideoUrl('');
      setTitle('');
      if (data) setVideos([data[0], ...videos]);
    } catch (error) {
      console.error('Error adding video:', error.message);
      alert('Gagal menambahkan video.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus video ini?')) return;
    
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setVideos(videos.filter(v => v.id !== id));
    } catch (error) {
      console.error('Error deleting video:', error.message);
      alert('Gagal menghapus video.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Kelola Video Teknologi</h1>
      </div>

      <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
        <div className="glass p-4" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <h3 className="mb-4 flex items-center gap-2"><Video size={20} className="text-gradient" /> Upload Video Baru</h3>
          <form onSubmit={handleAddVideo}>
            <div className="form-group mb-4">
              <label className="form-label block mb-2">Judul Video</label>
              <input 
                type="text" 
                className="form-input w-full" 
                style={{ width: '100%' }}
                placeholder="Contoh: Review iPhone 16"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-4">
              <label className="form-label block mb-2">URL Video (YouTube)</label>
              <div className="flex items-center gap-2">
                <LinkIcon size={18} className="text-muted" />
                <input 
                  type="url" 
                  className="form-input flex-1" 
                  style={{ width: '100%' }}
                  placeholder="https://youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Menambahkan...' : <><Plus size={16} /> Tambahkan ke Galeri</>}
            </button>
          </form>
        </div>

        <div className="glass p-4" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <h3 className="mb-4">Daftar Video Aktif</h3>
          <div className="table-container" style={{ overflowX: 'auto' }}>
            <table className="dashboard-table" style={{ width: '100%', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th style={{ padding: '0.75rem' }}>Judul</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                  <th style={{ padding: '0.75rem' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {fetching ? (
                  <tr><td colSpan="3" style={{ padding: '1rem', textAlign: 'center' }}>Memuat...</td></tr>
                ) : videos.length === 0 ? (
                  <tr><td colSpan="3" style={{ padding: '1rem', textAlign: 'center' }}>Belum ada video.</td></tr>
                ) : (
                  videos.map(video => (
                    <tr key={video.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ fontWeight: 500, fontSize: '0.9rem', padding: '0.75rem' }}>{video.title}</td>
                      <td style={{ padding: '0.75rem' }}><span className="status-badge status-success" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem' }}>{video.status}</span></td>
                      <td style={{ padding: '0.75rem' }}>
                        <button 
                          onClick={() => handleDelete(video.id)}
                          className="btn btn-sm" 
                          style={{ padding: '0.4rem', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
