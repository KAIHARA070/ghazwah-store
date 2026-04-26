import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './CustomerChat.css';

export default function CustomerChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const chatBodyRef = useRef(null);

  useEffect(() => {
    // Generate or get session ID from local storage
    let currentSessionId = localStorage.getItem('ghazwah_chat_session');
    if (!currentSessionId) {
      currentSessionId = 'session_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('ghazwah_chat_session', currentSessionId);
    }
    setSessionId(currentSessionId);

    // Fetch previous chats
    const fetchChats = async () => {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('session_id', currentSessionId)
        .order('created_at', { ascending: true });

      if (data && data.length > 0) {
        setChatHistory(data);
      } else {
        // Initial greeting
        setChatHistory([
          { id: 'welcome', sender: 'admin', text: 'Halo! Ada yang bisa kami bantu seputar produk atau pesanan Anda?' }
        ]);
      }
    };
    fetchChats();

    // Subscribe to new messages
    const subscription = supabase
      .channel('public:chats')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chats', filter: `session_id=eq.${currentSessionId}` }, (payload) => {
        setChatHistory((prev) => {
          // Prevent duplicate if we already added it locally
          if (prev.find(c => c.id === payload.new.id)) return prev;
          return [...prev, payload.new];
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatHistory, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      session_id: sessionId,
      sender: 'user',
      text: message
    };

    // Optimistic update
    const tempId = Date.now().toString();
    setChatHistory((prev) => [...prev, { id: tempId, ...newMessage }]);
    setMessage('');

    // Insert to Supabase
    const { data, error } = await supabase
      .from('chats')
      .insert([newMessage])
      .select();
      
    if (error) {
      console.error('Error sending message:', error.message);
    }
  };

  return (
    <div className="chat-widget-container">
      {/* Tombol Floating */}
      <button 
        className={`chat-toggle-btn ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle size={28} />
      </button>

      {/* Jendela Chat */}
      <div className={`chat-window glass ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <div className="flex items-center gap-2">
            <div className="chat-avatar">GS</div>
            <div>
              <h4 className="m-0" style={{ fontSize: '1rem', marginBottom: 0 }}>Ghazwah Support</h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>● Online</span>
            </div>
          </div>
          <button className="chat-close-btn" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="chat-body" ref={chatBodyRef}>
          {chatHistory.map((chat) => (
            <div key={chat.id} className={`chat-bubble-wrapper ${chat.sender === 'user' ? 'user' : 'admin'}`}>
              <div className={`chat-bubble ${chat.sender === 'user' ? 'user-bubble' : 'admin-bubble'}`}>
                {chat.text}
              </div>
            </div>
          ))}
        </div>

        <form className="chat-footer" onSubmit={handleSend}>
          <input 
            type="text" 
            className="chat-input" 
            placeholder="Ketik pesan..." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className="chat-send-btn text-gradient" disabled={!message.trim()}>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
