import { useState } from "react";
import { useQuery } from "react-query";
import SocketContext, { socket } from "components/socketContext";
import Router from "./components/Router";
import { appConnectionOld } from "services/services";
import "./App.css";

function App() {
  const [isShookHand, setIsShookHand] = useState(false);

  const { isLoading, error, data, isFetching } = useQuery(
    "appConnection",
    appConnectionOld,
    {
      enabled: !isShookHand,
      onSuccess: () => setIsShookHand(true),
    }
  );

  return (
    <div className="App">
      <h1>Unstable Unicorn</h1>
      {isLoading || isFetching ? (
        <div>CONNECTING!</div>
      ) : (
        <SocketContext.Provider value={socket()}>
          <Router />
        </SocketContext.Provider>
      )}
    </div>
  );
}

export default App;
