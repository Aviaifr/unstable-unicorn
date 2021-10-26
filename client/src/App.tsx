import { useEffect, useState } from 'react';
import SocketContext, { socket } from "components/socketContext";

import Router from './components/Router'
import './App.css';

function App() {
  const [isShookHand, setIsShookHand] = useState(false);
  function connect(){
    fetch('http://localhost:8000/api',{
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    }).then(response => {
      if(response.status === 200 && !isShookHand){
        setIsShookHand(true);
      }else{
        setTimeout(connect, 2000)
      }
    })
  }

  useEffect(() => {
    connect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  
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
