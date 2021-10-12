import React from "react";
import io, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";

let socketInstance: Socket | null= null;
const SOCKET_URL = 'http://localhost:8000/';
export function socket() : Socket{
    if(!socketInstance){
        socketInstance = io(SOCKET_URL, {withCredentials: true});
    }
    return socketInstance
}
const SocketContext = React.createContext<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
export default SocketContext;