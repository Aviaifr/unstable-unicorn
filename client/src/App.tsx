import React, { useEffect, useState } from 'react';
import SocketContext, { socket } from "components/socketContext";

import Router from './components/Router'
import './App.css';

function App() {
  const [isShookHand, setIsShookHand] = useState(false);
  useEffect(() => {
    fetch('http://localhost:8000/api',{
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    }).then(response => setIsShookHand(true))
  }, [])
  /*
  const req = new XMLHttpRequest()
  req.open('GET', 'http://localhost:8000/api');
  req.addEventListener("load", () => );
  //req.addEventListener("error", transferFailed); - SHOW ERROR ON SCREEN
  req.send();
  */
   return (
    <div className='App'>
      <h1>Unstable Unicorn</h1>
      {!isShookHand ? (
        <div>
          CONNECTING!
        </div>
          ) : (
            <SocketContext.Provider value={socket()}>
              <Router />
            </SocketContext.Provider>
          )}
    </div>
  );
}

export default App;
