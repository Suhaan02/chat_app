import { useState } from 'react';
import JoinScreen from './components/JoinScreen';
import ChatBox from './components/ChatBox';

export default function App() {
  const [user, setUser] = useState(null);

  if (!user) return <JoinScreen onJoin={setUser} />;
  return <ChatBox username={user.username} room={user.room} />;
}