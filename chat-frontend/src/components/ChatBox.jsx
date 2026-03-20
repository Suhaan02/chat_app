import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import socket from '../socket';

export default function ChatBox({ username, room }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    axios.get(`http://10.252.142.220:3001/messages/${room}`)
      .then(res => setMessages(res.data));
  }, [room]);

  useEffect(() => {
    socket.on('receive_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    socket.on('user_joined', ({ username }) => {
      setMessages(prev => [...prev, { username: 'System', text: `${username} joined` }]);
    });
    return () => {
      socket.off('receive_message');
      socket.off('user_joined');
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;
    socket.emit('send_message', { room, username, text });
    setText('');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100%',
      maxWidth: '700px',
      margin: '0 auto',
      background: 'white',
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem 1.5rem',
        background: '#4f46e5',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ color: 'white', margin: 0 }}>💬 {room}</h3>
        <span style={{ fontSize: '13px', opacity: 0.8 }}>logged in as {username}</span>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        background: '#f9fafb'
      }}>
        {messages.length === 0 && (
          <p style={{ color: '#9ca3af', textAlign: 'center', marginTop: '2rem' }}>
            No messages yet. Say something!
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.username === username ? 'flex-end' : 'flex-start',
            background: msg.username === username ? '#4f46e5' : 'white',
            color: msg.username === username ? 'white' : '#1f2937',
            padding: '0.6rem 1rem',
            borderRadius: '12px',
            maxWidth: '60%',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            fontSize: '14px'
          }}>
            {msg.username !== username && (
              <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '2px', color: '#6b7280' }}>
                {msg.username}
              </div>
            )}
            {msg.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '1rem 1.5rem',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        gap: '0.5rem',
        background: 'white'
      }}>
        <input
          style={{ flex: 1, width: 'auto' }}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}