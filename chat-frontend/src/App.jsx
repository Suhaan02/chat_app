import { useState } from 'react';
import JoinScreen from './components/JoinScreen';
import ChatBox from './components/ChatBox';
import RoomList from './components/RoomList';

export default function App() {
  const [user, setUser] = useState(null);
  const [room, setRoom] = useState('');

  if (!user) return <JoinScreen onJoin={(data) => { setUser(data); setRoom(data.room); }} />;
  
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
      <RoomList currentRoom={room} username={user.username} onSwitch={setRoom} />
      <ChatBox username={user.username} room={room} />
    </div>
  );
}