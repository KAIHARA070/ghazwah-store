import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, User, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminChat() {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef(null);

  // Fetch unique sessions
  useEffect(() => {
    fetchSessions();

    const subscription = supabase
      .channel('admin_chats')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chats' }, (payload) => {
        // If it's a new message for the active session, add it
        if (activeSession && payload.new.session_id === activeSession) {
          setMessages(prev => [...prev, payload.new]);
        }
        // Refresh sessions list to update "last message" implicitly (or just re-fetch)
        fetchSessions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [activeSession]);

  useEffect(() => {
    if (activeSession) {
      fetchMessages(activeSession);
    }
  }, [activeSession]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchSessions = async () => {
    try {
      // Supabase doesn't have a distinct query, so we fetch all and group manually
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by session_id
      const sessionMap = new Map();
      data.forEach(chat => {
        if (!sessionMap.has(chat.session_id)) {
          sessionMap.set(chat.session_id, chat);
        }
      });

      setSessions(Array.from(sessionMap.values()));
    } catch (error) {
      console.error('Error fetching sessions:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (sessionId) => {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error.message);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim() || !activeSession) return;

    const newMsg = {
      session_id: activeSession,
      sender: 'admin',
      text: reply
    };

    // Optimistic
    setMessages(prev => [...prev, { id: Date.now(), ...newMsg }]);
    setReply('');

    const { error } = await supabase
      .from('chats')
      .insert([newMsg]);

    if (error) {
      console.error('Error sending reply:', error.message);
    }
  };

  return (
    <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageCircle size={24} className="text-gradient" /> Customer Chats
        </h1>
      </div>

      <div className="glass flex chat-layout flex-1 overflow-hidden" style={{ borderRadius: 'var(--radius-lg)' }}>
        {/* Sidebar Sessions */}
        <div className="chat-sidebar" style={{ width: '300px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <div className="flex items-center gap-2 px-3 py-2" style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
              <Search size={16} className="text-muted" />
              <input 
                type="text" 
                placeholder="Cari sesi..." 
                style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <p className="text-center text-muted p-4">Memuat pesan...</p>
            ) : sessions.length === 0 ? (
              <p className="text-center text-muted p-4">Belum ada pesan.</p>
            ) : (
              sessions.map(s => (
                <div 
                  key={s.id}
                  onClick={() => setActiveSession(s.session_id)}
                  style={{ 
                    padding: '1rem', 
                    cursor: 'pointer', 
                    borderBottom: '1px solid var(--border-color)',
                    background: activeSession === s.session_id ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
                    borderLeft: activeSession === s.session_id ? '3px solid var(--primary)' : '3px solid transparent'
                  }}
                  className="hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={20} className="text-muted" />
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <h4 style={{ margin: 0, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        Customer {s.session_id.substring(8, 12).toUpperCase()}
                      </h4>
                      <p className="text-muted" style={{ margin: 0, fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {s.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {activeSession ? (
            <>
              {/* Header */}
              <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={20} className="text-muted" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Customer {activeSession.substring(8, 12).toUpperCase()}</h3>
                  <p className="text-muted" style={{ margin: 0, fontSize: '0.8rem' }}>Session ID: {activeSession}</p>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(0,0,0,0.2)' }}>
                {messages.map(msg => (
                  <div 
                    key={msg.id} 
                    style={{ 
                      alignSelf: msg.sender === 'admin' ? 'flex-end' : 'flex-start',
                      maxWidth: '70%'
                    }}
                  >
                    <div style={{ 
                      background: msg.sender === 'admin' ? 'var(--primary)' : 'var(--bg-secondary)',
                      color: msg.sender === 'admin' ? '#fff' : 'var(--text-primary)',
                      padding: '0.75rem 1rem',
                      borderRadius: '1rem',
                      borderBottomRightRadius: msg.sender === 'admin' ? '4px' : '1rem',
                      borderBottomLeftRadius: msg.sender === 'user' ? '4px' : '1rem',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}>
                      {msg.text}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem', textAlign: msg.sender === 'admin' ? 'right' : 'left' }}>
                      {new Date(msg.created_at || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
                <form onSubmit={handleSendReply} className="flex gap-2">
                  <input 
                    type="text" 
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    placeholder="Ketik balasan..." 
                    style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                  />
                  <button 
                    type="submit" 
                    disabled={!reply.trim()}
                    style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: reply.trim() ? 'pointer' : 'not-allowed', opacity: reply.trim() ? 1 : 0.5 }}
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <MessageCircle size={64} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <h3>Pilih sesi untuk melihat pesan</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
