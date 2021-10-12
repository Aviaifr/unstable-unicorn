import { Socket, Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { Room } from '../Rooms/Room';
import { getSessionPlayer, updateRoomPlayersHand } from "./playerUtil";
import { Player } from "../GameModules/Player"; 
import { SessionsRoomsMap } from "./roomUtil";
import DBGame from '../DB/Schema/game'
import SessionRooms from '../DB/Schema/room'

let io: Server | null = null;
export function initGames(ioServer : Server){
  io = ioServer;
}

export function returnGameData(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>, fn: CallableFunction): void {
    var result = undefined;
    const sessID = (socket.handshake as any).sessionID;
    const a = SessionsRoomsMap;
    const room = SessionsRoomsMap.get(sessID);
    if(room){
      result = room?.game?.toJson(getSessionPlayer(sessID));
    }
    
    fn(result);
  }
  
export function startGame(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>): void {
    const sessID = (socket.handshake as any).sessionID;
    const room: Room | null | undefined = SessionsRoomsMap.get(sessID);
    const player = getSessionPlayer(sessID)
    if(!room || !player){
      //you are not in any game
      return;
    }
    else if (room.getCreator() === player){
      const game = room.startGame(player);
      if(game){
        game.StartGame();
        DBGame.findOneAndUpdate({uid : game.uid}, game.toDB(), {}, (error, res) => {
          if (!res) {
            DBGame.create(game.toDB());
          }
          SessionRooms.findOneAndUpdate({'room.uid' : room.uuid}, {'room.game' : game.uid},{}, (err, doc,res) => {
            //update player cards in db
            updateRoomPlayersHand(room.getPlayers())
          });
          
        });
        io?.sockets.adapter.rooms.get(`room_${room.uuid}`)?.forEach( clientId => {
          const sid =(io?.sockets.sockets.get(clientId)?.handshake as any)?.sessionID;
          io?.to(clientId).emit('game_started', game.toJson(getSessionPlayer(sid)));
        });
      }
    }
  }

