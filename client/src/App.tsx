import { type } from 'os';
import React, { useEffect, useState } from 'react';
import SocketIOClient from 'socket.io-client';
import './App.css';
interface somedata{
  data: string
}

function App() {
  const [response, setResponse] = useState<somedata | undefined>(undefined);

  useEffect(() => {
    const socket = SocketIOClient("http://localhost:49160");
    socket.on("init", data => {
      console.log(data);
      setResponse(data);
    });
  }, []);

  return (
    <p>
      It's {response?.data}
    </p>
  );
}

export default App;
