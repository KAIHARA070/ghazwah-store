import { useState, useEffect } from 'react';
import { PlayCircle, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function TechVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('status', 'Aktif')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    try {
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = new URLSearchParams(new URL(url).search).get('v');
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      } else if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
    } catch (e) {
      console.error('Error parsing video URL', e);
    }
    // Return original url if parsing fails (might not work in iframe if not embed-friendly)
    return url;
  };

  const openVideo = (url) => {
    setActiveVideoUrl(getEmbedUrl(url));
  };

  const closeVideo = () => {
    setActiveVideoUrl(null);
  };

  return (
    <div className="section relative">
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="mb-2">Tech <span className="text-gradient">Videos</span></h1>
          <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Temukan berita teknologi terkini, ulasan gadget, dan tips produktivitas dari para ahli.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner" style={{ margin: '0 auto' }}></div>
            <p className="mt-3 text-muted">Memuat video...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3" style={{ gap: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {videos.length === 0 ? (
              <p className="text-center text-muted" style={{ gridColumn: '1 / -1' }}>Belum ada video saat ini.</p>
            ) : (
              videos.map(video => (
                <div key={video.id} onClick={() => openVideo(video.url)} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="glass-card" style={{ cursor: 'pointer', overflow: 'hidden', height: '100%' }}>
                    <div style={{ position: 'relative', width: '100%', height: '220px' }}>
                      <img 
                        src={video.thumbnail || 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=500&q=80'} 
                        alt={video.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }} className="hover:bg-black/50">
                        <PlayCircle size={48} color="white" style={{ opacity: 0.9, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }} />
                      </div>
                      <div style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.7)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                        {video.views || '0'} views
                      </div>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', lineHeight: 1.3 }}>{video.title}</h3>
                      <p className="text-muted" style={{ fontSize: '0.85rem' }}>Ghazwah Tech &bull; Baru saja</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {activeVideoUrl && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <button 
            onClick={closeVideo}
            style={{
              position: 'absolute',
              top: '20px', right: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '40px', height: '40px',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              cursor: 'pointer',
              color: 'white',
              zIndex: 10000
            }}
          >
            <X size={24} />
          </button>
          
          <div style={{ width: '90%', maxWidth: '1000px', aspectRatio: '16/9', background: '#000', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <iframe 
              src={activeVideoUrl} 
              style={{ width: '100%', height: '100%', border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
