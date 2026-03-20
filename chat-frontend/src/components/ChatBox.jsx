import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import socket from '../socket';

export default function ChatBox({ username, room }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/messages/${room}`)
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
    <div style={{ padding: '1rem' }}>
      <h3>Room: {room}</h3>
      <div style={{ height: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '1rem' }}>
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.username}:</strong> {msg.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <input value={text} onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
        placeholder="Type a message..." />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}