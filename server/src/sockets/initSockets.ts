import sharedsession from "express-socket.io-session";
import { Server } from "socket.io";
import http from "http";
import { Express, RequestHandler } from 'express';

import { getSessionPlayer, setUserName} from './playerUtil'
import { createNewRoom, getRoomsData, initRooms, joinRoom } from "./roomUtil";
import { expectedAction, initGames, playCard, returnGameData, startGame } from "./gameUtils";

export const initSockets = (app : Express,server: http.Server, session: RequestHandler) => {
    const io = new Server(server, {
        cors: {
          origin: 'http://localhost:3050',
          credentials: true
        }
      });
    io.use(sharedsession(session));
    initGames(io);
    initRooms(io);
    io.on("connection", function(socket) {
        socket.emit('init', {data: socket.id});
        const sessID = (socket.handshake as any).sessionID;

        socket.on('setUserName', (uname:string, fn: CallableFunction) => setUserName(sessID, uname, fn));
        socket.on('create_room', () => createNewRoom(socket) );
        socket.on('get_rooms', (fn: CallableFunction) => getRoomsData(socket, fn));
        socket.on('join_room', data => joinRoom(data, socket));
        socket.on('get_game', (fn: CallableFunction) => returnGameData(socket, fn));
        socket.on('start_game', () => startGame(socket));
        socket.on('get_player_name', (fn: CallableFunction) =>  fn(getSessionPlayer(sessID)?.name));
        socket.on('play_card', (data) => playCard(socket, data));
        socket.on("pendingAction", (action, choice) => expectedAction(socket, action, choice));
    });
}

