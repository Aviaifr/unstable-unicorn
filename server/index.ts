'use strict';
import { Game } from "./src/GameModules/Game";
import { Player } from "./src/GameModules/Player";
import express from 'express';
import path from "path";
import http from "http";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Room } from "./src/Rooms/Room";
import cors from 'cors';
import sessions from 'express-session';
import sharedsession from "express-socket.io-session";

const RoomsMap: Map<string, Room> = new Map<string, Room>();
const sessionsRoomsMap: Map<string, Room | null> = new Map<string, Room | null>();
const sessionsPlayers: Map<string, Player | null> = new Map<string, Player | null>();

// Constants
const PORT = 3060;
const HOST = '0.0.0.0';

// App and servers
const app = express();
app.use(cors({
  credentials: true
}));
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3050',
    credentials: true
  }
});

const session = sessions({
  secret: "my-secret",
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly:true,
    domain: 'localhost'
  }
});
app.use(session);
io.use(sharedsession(session));
 
io.on("connection", function(socket) {
    socket.emit('init', {data: socket.id});
    socket.on('setUserName', (uname:string, fn: CallableFunction) => {
      const sessID = (socket.handshake as any).sessionID;
      const player = getSessionPlayer(sessID);
      player.name = uname;
      sessionsPlayers.set(sessID, player);
      fn();
    });
    socket.on('create_room', () => CreateNewRoom(socket) );
    socket.on('get_rooms', (fn: CallableFunction) => getRoomsData(socket, fn));
    socket.on('join_room', data => joinRoom(data, socket));
    socket.on('get_game', (fn: CallableFunction) => returnGameData(socket, fn))
    socket.on('start_game', () => startGame(socket))
});

app.get('/api', (req: any, res: any) => {
  res.send('Good morning!');
});

app.use('/static-resources', express.static(path.join(__dirname, "public")))
server.listen(PORT, HOST, () =>console.log(`App Started at ${PORT}`));

//Rooms functions

function getRoomsData(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>, callbackFN: CallableFunction){
  const rooms = Array.from(RoomsMap.keys());
  const sessID = (socket.handshake as any).sessionID;
  const currentRoom = sessionsRoomsMap.get(sessID) ?? null;
  if(currentRoom){
    socket.join(`room_${currentRoom.uuid}`);
  }
  callbackFN({rooms: rooms, currentRoom: currentRoom?.toJSON(getSessionPlayer(sessID))});
}
function CreateNewRoom(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>): void {
  const sessID = (socket.handshake as any).sessionID;
  const player: Player = getSessionPlayer(sessID);
  let room = Array.from(RoomsMap.values()).find((room: Room) => room.getCreator() === player);
  if(!room){
    room = new Room(2, player);
    RoomsMap.set(room.uuid, room);
    sessionsRoomsMap.set(sessID, room);
    socket.join(`room_${room.uuid}`);
    io.emit('room_list', Array.from(RoomsMap.keys()));
    io.sockets.adapter.rooms.get(`room_${room.uuid}`)?.forEach( clientId => {
      const sid =(io.sockets.sockets.get(clientId)?.handshake as any)?.sessionID;
      io.to(clientId).emit('current_room_update', room?.toJSON(getSessionPlayer(sid)));
    });
  }
}

function joinRoom(roomName: string, socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>): void {
  const sessID = (socket.handshake as any).sessionID;
  const player: Player = getSessionPlayer(sessID);
  const room: Room | undefined = RoomsMap.get(roomName);
  if(!room || !room.joinRoom(player)){
    return;
  }
  if(room){
    sessionsRoomsMap.set(sessID, room);
    socket.join(`room_${room.uuid}`);
    io.emit('room_list', Array.from(RoomsMap.keys()));
    io.sockets.adapter.rooms.get(`room_${room.uuid}`)?.forEach( clientId => {
      const sid =(io.sockets.sockets.get(clientId)?.handshake as any)?.sessionID;
      io.to(clientId).emit('current_room_update', room?.toJSON(getSessionPlayer(sid)));
    });
  }
}

//Player functions

function getSessionPlayer(sessID : string) : Player{
  let player: Player | undefined | null = sessionsPlayers.get(sessID);
    if(!player){
      player = new Player(sessID);
      sessionsPlayers.set(sessID, player);
    }
    return player;
}


//game function
function returnGameData(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>, fn: CallableFunction): void {
  var result = undefined;
  const sessID = (socket.handshake as any).sessionID;
  const room = sessionsRoomsMap.get(sessID);
  if(room){
    result = room?.game?.toJson(getSessionPlayer(sessID));
  }
  
  fn(result);
}

function startGame(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>): void {
  const sessID = (socket.handshake as any).sessionID;
  const room = sessionsRoomsMap.get(sessID);
  const player= getSessionPlayer(sessID)
  if(!room){
    //you are not in any game
    return;
  }
  else if (room.getCreator() === player){
    const game = room.startGame(player);
    if(game){
      game.StartGame();
      io.sockets.adapter.rooms.get(`room_${room.uuid}`)?.forEach( clientId => {
        const sid =(io.sockets.sockets.get(clientId)?.handshake as any)?.sessionID;
        io.to(clientId).emit('game_started', game.toJson(getSessionPlayer(sid)));
      });
    }
  }
}
/*
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3050',
    credentials: true
  }
});
setupSession(app, io);


const rooms : Array<Room> = [];

app.get('/shake', (req: any, res: any) => {
  res.send('Good morning!');
});

io.on('connection', client => {
  const sessID = (client.handshake as any).sessionID;
  client.emit('init', {data: "Connected"});
  console.log(sessID);
  console.log('1');
  //check if session in room
  const room : Room | null | undefined = sessionsRoomsMap.get(sessID);
  const player = sessionsPlayers.get(sessID);
  if(room && player){
    client.emit('joinedRoom', {"roomID": room.uuid , "status": 200, 'players': room.getPlayers()});
    client.join(`room_${room.uuid}`);
    io.to(`room_${room.uuid}`).emit('playersList', {'players' : cleanPlayersDataForAll(player, room.getPlayers())});
  }
  client.on('newGame', () => CreateNewRoom(sessID, client));
  //client.on('joinRandom', joinRandomGame);
  client.on('startGame', () => startGame(sessID, client));
  client.on('login', (data, fn) => setUserName(sessID, data, fn));
});

server.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);


function CreateNewRoom(sessID: any, client: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>): void {
  let room = Array.from(RoomsMap.values()).find((room: Room) => room.getCreator() === sessID)
  if(!room){
    room = new Room(2, sessID);
    RoomsMap.set(room.uuid, room);
    client.emit('room_created', {"roomID": room.uuid})
    joinRoom(sessID, room.uuid, client);
  }
}

function getSessionPlayer(sessID : string) : Player{
  let player: Player | undefined | null = sessionsPlayers.get(sessID);
    if(!player){
      player = new Player(sessID);
      sessionsPlayers.set(sessID, player);
    }
    return player;
}


function joinRoom(sessID: string, roomName: string, client: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>): void {
  const player: Player = getSessionPlayer(sessID);
  const room: Room | undefined = RoomsMap.get(roomName);
  let status: number = 200;
  if(!room){
    status = 404;
  } else if(!room.joinRoom(player)){
    status = 403;
  }
  let players = room ? cleanPlayersDataForAll(player, room.getPlayers()) : [];
  client.emit('joinedRoom', {"roomID": roomName, "status": status, 'players': players});
  if(room && status === 200){
    sessionsRoomsMap.set(sessID, room);
    client.join(`room_${roomName}`);
    io.to(`room_${roomName}`).emit('playersList', {'players' : cleanPlayersDataForAll(player, room.getPlayers())});
  }
}

function startGame(sessID: string, client: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>): void {
  const room = sessionsRoomsMap.get(sessID);
  if(!room){
    //you are not in any game
    return;
  }
  else if (room.getCreator() === sessID){
    const game = room.startGame(sessID);
    game.StartGame();
    io.to(`room_${room.uuid}`).emit('gameStarted', {'game' : room.getCleanedGame(getSessionPlayer(sessID))});
  }

}

function setUserName(sessID: string, data: string, callbackFN: (data:any) => void): void {
  getSessionPlayer(sessID).name = data;
  callbackFN(RoomsMap);
}
*/