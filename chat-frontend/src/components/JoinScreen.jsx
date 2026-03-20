import { useState } from 'react';
import socket from '../socket';

export default function JoinScreen({ onJoin }) {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');

  const handleJoin = () => {
    if (!username.trim() || !room.trim()) return;
    socket.emit('join_room', { room, username });
    onJoin({ username, room });
  };

  return (
    <div style={{
      background: 'white',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      width: '320px',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <h2 style={{ textAlign: 'center' }}>💬 Join a Room</h2>
      <input
        placeholder="Your username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        placeholder="Room name"
        value={room}
        onChange={e => setRoom(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleJoin()}
      />
      <button onClick={handleJoin}>Join Room</button>
    </div>
  );
}