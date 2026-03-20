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
    <div style={{ padding: '2rem' }}>
      <h2>Join a Chat Room</h2>
      <input placeholder="Username" value={username}
        onChange={e => setUsername(e.target.value)} /><br /><br />
      <input placeholder="Room name" value={room}
        onChange={e => setRoom(e.target.value)} /><br /><br />
      <button onClick={handleJoin}>Join</button>
    </div>
  );
}
