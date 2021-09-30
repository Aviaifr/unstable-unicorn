'use strict';
import { Game } from "./src/GameModules/Game";
import { Player } from "./src/GameModules/Player";
import express from 'express';
import path from "path";
import http from "http";
import { Server, Socket } from "socket.io";
import { setupSession } from "./setupSession";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Room } from "./src/Rooms/Room";
import { generateUID , cleanPlayersDataForAll} from "./src/utils";

const RoomsMap: Map<string, Room> = new Map<string, Room>();
const sessionsRoomsMap: Map<string, Room | null> = new Map<string, Room | null>();
const sessionsPlayers: Map<string, Player | null> = new Map<string, Player | null>();

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App and servers
const app = express();
const server = http.createServer(app);
const io = new Server(server);
setupSession(app, io);


const rooms : Array<Room> = [];
app.use(express.static(path.join(__dirname, "public")));

io.on('connection', client => {
  const sessID = (client.handshake as any).sessionID;
  client.emit('init', {data: "Connected"});
  console.log(sessID);
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
  client.on('joinGame', data => joinRoom(sessID, data, client));
  client.on('startGame', () => startGame(sessID, client));
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