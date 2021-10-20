import { Socket, Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import Mongoose from 'mongoose'

import { Room } from '../Rooms/Room';
import { getSessionPlayer , sessionsPlayers } from "./playerUtil";
import { Player } from "../GameModules/Player";
import SessionRoom, { ISessionRoom }from '../DB/Schema/sessionRoom'
import DBRooms, { IRoom }from '../DB/Schema/room'
import DBGames, { IGame } from '../DB/Schema/game'
import Game from '../GameModules/Game'

let io: Server | null = null;
export function initRooms(ioServer : Server){
  io = ioServer;
  DBGames.find(function (err, games){
    DBRooms.find(function (err, rooms){
      if (err) return console.error(err);
      rooms.forEach(room => populateRoom(room, games));
      SessionRoom.find(function (err, sessionRooms) {
        if (err) return console.error(err);
        sessionRooms.forEach(sessionRoom => populateRoomSession(sessionRoom));
      });
    });  
  });
}

export const SessionsRoomsMap: Map<string, Room | null> = new Map<string, Room | null>();
export const RoomsMap: Map<string, Room> = new Map<string, Room>();

export function getRoomsData(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>, callbackFN: CallableFunction){
  const rooms = Array.from(RoomsMap.keys());
  const sessID = (socket.handshake as any).sessionID;
  const currentRoom = SessionsRoomsMap.get(sessID) ?? null;
  if(currentRoom){
    socket.join(`room_${currentRoom.uuid}`);
  }
  const sessionPlayer = getSessionPlayer(sessID);
  callbackFN({rooms: rooms, currentRoom: currentRoom?.toJSON(sessionPlayer), player: sessionPlayer?.toJson(sessionPlayer)});
}

export function createNewRoom(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>): void {
  const sessID = (socket.handshake as any).sessionID;
  const player = getSessionPlayer(sessID);
  if(!player){
    console.log('Failed to open room - session has no player assigned');
    return;
  }
  let room = Array.from(RoomsMap.values()).find((room: Room) => room.getCreator() === player);
  if(!room){
    room = new Room(2, player);
    RoomsMap.set(room.uuid, room);
    SessionsRoomsMap.set(sessID, room);
    DBRooms.create(room.toDB())
    SessionRoom.create({session: sessID, room: room.uuid});
    socket.join(`room_${room.uuid}`);
    io?.emit('room_list', Array.from(RoomsMap.keys()));
    io?.sockets.adapter.rooms.get(`room_${room.uuid}`)?.forEach( clientId => {
      const sid =(io?.sockets.sockets.get(clientId)?.handshake as any)?.sessionID;
      io?.to(clientId).emit('current_room_update', room?.toJSON(getSessionPlayer(sid)));
    });
  }
}

export function joinRoom(roomName: string, socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>): void {
  const sessID = (socket.handshake as any).sessionID;
  const player = getSessionPlayer(sessID);
  const room: Room | undefined = RoomsMap.get(roomName);
  if(!player ||!room || !room.joinRoom(player)){
    console.error("Failed to join room");
    return;
  }
  if(room){
    SessionsRoomsMap.set(sessID, room);
    SessionRoom.create({session: sessID, room: room.uuid});
    DBRooms.findOneAndUpdate({uid: room.uuid}, {$addToSet:{players: player.uid}},{}, (err, doc,res) => {});
    socket.join(`room_${room.uuid}`);
    io?.emit('room_list', Array.from(RoomsMap.keys()));
    io?.sockets.adapter.rooms.get(`room_${room.uuid}`)?.forEach( clientId => {
      const sid =(io?.sockets.sockets.get(clientId)?.handshake as any)?.sessionID;
      io?.to(clientId).emit('current_room_update', room?.toJSON(getSessionPlayer(sid)));
    });
  }
}


function populateRoomSession(sessionRoom: Mongoose.Document<any, any, ISessionRoom> & ISessionRoom & { _id: Mongoose.Types.ObjectId; }): void {
    const room = RoomsMap.get(sessionRoom.room)
    if(!room){
      throw `Could not find room`;
    }
    SessionsRoomsMap.set(sessionRoom.session, room);
}

function populateRoom(room: Mongoose.Document<any, any, IRoom> & IRoom & { _id: Mongoose.Types.ObjectId; }, games: (Mongoose.Document<any, any, IGame> & IGame & { _id: Mongoose.Types.ObjectId; })[]): void {
  const relevantPlayers =
  Array.from(sessionsPlayers.values())
    .filter((player) => player && (player.uid === room.creator || room.players.includes(player.uid))) as Array<Player>;
  const game = games.find(game => game.uid === room.game);
  if(room.game && !game){
    throw `Could not find game`;
  }else{
    const roomObj = Room.fromDB(room, relevantPlayers, !game ? null : Game.fromDB(game, relevantPlayers));
    if(!RoomsMap.has(room.uuid)){
      RoomsMap.set(room.uuid, roomObj);
    }
  }
}

