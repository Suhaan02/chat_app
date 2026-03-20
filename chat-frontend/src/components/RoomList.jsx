import { useState, useEffect } from 'react';
import axios from 'axios';
import socket from '../socket';

export default function RoomList({ currentRoom, username, onSwitch }) {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState('');

  useEffect(() => {
    axios.get('http://10.252.142.220:3001/rooms')
      .then(res => {
        const unique = [...new Map(res.data.map(r => [r.name, r])).values()];
        setRooms(unique);
      });
  }, []);

  const handleSwitch = (roomName) => {
    socket.emit('join_room', { room: roomName, username });
    onSwitch(roomName);
  };

  const handleCreate = () => {
    if (!newRoom.trim()) return;
    socket.emit('join_room', { room: newRoom, username });
    onSwitch(newRoom);
    setRooms(prev => {
      const exists = prev.find(r => r.name === newRoom);
      if (exists) return prev;
      return [...prev, { name: newRoom }];
    });
    setNewRoom('');
  };

  const handleDelete = async (roomName) => {
  if (roomName === currentRoom) return alert("Can't delete the room you're in!");
  await axios.delete(`http://10.252.142.220:3001/rooms/${roomName}`);
  setRooms(prev => prev.filter(r => r.name !== roomName));
};

  return (
    <div style={{
      width: '240px',
      background: '#2b2d31',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      height: '100vh'
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid #1e1f22',
        color: 'white',
        fontWeight: '700',
        fontSize: '15px'
      }}>
        ChatApp
      </div>

      {/* Room list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
        <p style={{ color: '#80848e', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '0.5rem 0.75rem', marginBottom: '2px' }}>
          Rooms
        </p>
        {rooms.map((r, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.4rem 0.75rem',
            borderRadius: '6px',
            background: currentRoom === r.name ? '#404249' : 'transparent',
            marginBottom: '2px',
            cursor: 'pointer',
            transition: 'background 0.1s'
          }}
            onMouseOver={e => { if (currentRoom !== r.name) e.currentTarget.style.background = '#35373c' }}
            onMouseOut={e => { if (currentRoom !== r.name) e.currentTarget.style.background = 'transparent' }}
          >
            <span onClick={() => handleSwitch(r.name)} style={{
              color: currentRoom === r.name ? 'white' : '#949ba4',
              fontSize: '14px',
              flex: 1,
              fontWeight: currentRoom === r.name ? '600' : '400'
            }}>
              # {r.name}
            </span>
            {currentRoom !== r.name && (
              <span onClick={() => handleDelete(r.name)} style={{
                color: '#f87171',
                fontSize: '18px',
                paddingLeft: '0.5rem',
                opacity: 0.7,
                lineHeight: 1
              }}>×</span>
            )}
          </div>
        ))}
      </div>

      {/* Create room */}
      <div style={{
        padding: '0.75rem',
        borderTop: '1px solid #1e1f22',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        <input
          placeholder="New room name..."
          value={newRoom}
          onChange={e => setNewRoom(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
          style={{
            background: '#1e1f22',
            border: 'none',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '13px',
            width: '100%'
          }}
        />
        <button onClick={handleCreate} style={{
          background: '#5865f2',
          color: 'white',
          padding: '8px',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: '600'
        }}>
          + Create Room
        </button>
      </div>

      {/* User info */}
      <div style={{
        padding: '0.75rem 1rem',
        background: '#232428',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <div style={{
          width: '32px', height: '32px',
          background: '#5865f2',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: '700', fontSize: '14px',
          flexShrink: 0
        }}>
          {username[0]?.toUpperCase()}
        </div>
        <span style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>{username}</span>
      </div>
    </div>
  );
}