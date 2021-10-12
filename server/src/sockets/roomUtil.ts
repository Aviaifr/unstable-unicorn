import { Socket, Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import Mongoose from 'mongoose'

import { Room } from '../Rooms/Room';
import { getSessionPlayer , sessionsPlayers } from "./playerUtil";
import { Player } from "../GameModules/Player";
import SessionRoom, { ISessionRoom }from '../DB/Schema/room'
import DBGames, { IGame } from '../DB/Schema/game'
import Game from '../GameModules/Game'
import room from "../DB/Schema/room";

let io: Server | null = null;
export function initRooms(ioServer : Server){
  io = ioServer;
  DBGames.find(function (err, games){
    SessionRoom.find(function (err, sessionRooms) {
      if (err) return console.error(err);
      sessionRooms.forEach(sessionRoom => populateRoomSession(sessionRoom, games));
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
    SessionRoom.create({session: sessID, room: room.toDB()});
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
    socket.join(`room_${room.uuid}`);
    io?.emit('room_list', Array.from(RoomsMap.keys()));
    io?.sockets.adapter.rooms.get(`room_${room.uuid}`)?.forEach( clientId => {
      const sid =(io?.sockets.sockets.get(clientId)?.handshake as any)?.sessionID;
      io?.to(clientId).emit('current_room_update', room?.toJSON(getSessionPlayer(sid)));
    });
  }
}


function populateRoomSession(sessionRoom: Mongoose.Document<any, any, ISessionRoom> & ISessionRoom & { _id: Mongoose.Types.ObjectId; }, games: (Mongoose.Document<any, any, IGame> & IGame & { _id: Mongoose.Types.ObjectId; })[]): void {
  const relevantPlayers = Array.from(sessionsPlayers.values())
    .filter((player) => player && (player.uid === sessionRoom.room.creator || sessionRoom.room.players.includes(player.uid))) as Array<Player>;
  const game = games.find(game => game.uid === sessionRoom.room.game);
  if(sessionRoom.room.game && !game){
    throw `Could not find game`;
  }else{
    const room = Room.fromDB(sessionRoom.room, relevantPlayers, !game ? null : Game.fromDB(game, relevantPlayers));
    if(!RoomsMap.has(room.uuid)){
      RoomsMap.set(room.uuid, room);
    }
    SessionsRoomsMap.set(sessionRoom.session, room);
  }
}

