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
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#313338'
    }}>
      <div style={{
        background: '#2b2d31',
        padding: '2.5rem',
        borderRadius: '16px',
        width: '380px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <div style={{
            width: '56px', height: '56px',
            background: '#5865f2',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '28px'
          }}>💬</div>
          <h2 style={{ color: 'white', fontSize: '22px', fontWeight: '700' }}>Welcome back</h2>
          <p style={{ color: '#b5bac1', fontSize: '14px', marginTop: '4px' }}>Jump into a room and start chatting</p>
        </div>

        {/* Username */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ color: '#b5bac1', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Username
          </label>
          <input
            placeholder="Enter your username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{
              background: '#1e1f22',
              border: '1px solid #1e1f22',
              color: 'white',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '15px',
              width: '100%'
            }}
          />
        </div>

        {/* Room */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ color: '#b5bac1', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Room Name
          </label>
          <input
            placeholder="Enter room name"
            value={room}
            onChange={e => setRoom(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
            style={{
              background: '#1e1f22',
              border: '1px solid #1e1f22',
              color: 'white',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '15px',
              width: '100%'
            }}
          />
        </div>

        <button onClick={handleJoin} style={{
          background: '#5865f2',
          color: 'white',
          padding: '12px',
          borderRadius: '8px',
          fontSize: '15px',
          fontWeight: '600',
          marginTop: '0.5rem',
          transition: 'background 0.2s'
        }}
          onMouseOver={e => e.target.style.background = '#4752c4'}
          onMouseOut={e => e.target.style.background = '#5865f2'}
        >
          Join Room
        </button>
      </div>
    </div>
  );
}