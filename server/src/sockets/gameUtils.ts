import { Socket, Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { Room } from '../Rooms/Room';
import { getSessionPlayer, updateRoomPlayers } from "./playerUtil";
import { SessionsRoomsMap } from "./roomUtil";
import DBGame from '../DB/Schema/game'
import DBRoom from '../DB/Schema/room'
import { Player } from "../GameModules/Player";
import Game from "../GameModules/Game";

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
          DBRoom.findOneAndUpdate({'uid' : room.uuid}, {'game' : game.uid},{}, (err, doc,res) => {
            //update player cards in db
            updateRoomPlayers(room.getPlayers())
          });
          
        });
        io?.sockets.adapter.rooms.get(`room_${room.uuid}`)?.forEach( clientId => {
          const sid =(io?.sockets.sockets.get(clientId)?.handshake as any)?.sessionID;
          io?.to(clientId).emit('game_started', game.toJson(getSessionPlayer(sid)));
        });
      }
    }
  }

function getSessionGameObjects(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>)
: {room: Room, player: Player, game: Game } | null{
  const sessID = (socket.handshake as any).sessionID;
  const room: Room | null | undefined = SessionsRoomsMap.get(sessID);
  const player = getSessionPlayer(sessID);
  if(!room || !player){
    console.log('room or player not found');
    return null;
  }
  const game = room.game;
  if(!game || !game.hasStarted){
    console.log('game not started');
    return null;
  }
  return {room: room, player: player, game: game };
}

export function playCard(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>, 
  playData: {target: string, targetPlayer: string, card: string}) : void {
    const gameData = getSessionGameObjects(socket);
    if(!gameData){
      return;
    }
    const {room, game} = gameData
    game.Play(playData.card, playData.target, playData.targetPlayer)

    updateRoomGameUpdate(room.uuid, game);
}

export function expectedAction(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>, 
  action: string, choice : string){
    const gameData = getSessionGameObjects(socket);
    if(!gameData){
      return;
    }
    const {room, game, player} = gameData
    game.DoAction(action, choice, player);
    updateRoomGameUpdate(room.uuid, game);
  }

function updateRoomGameUpdate(roomUuid: string, game: Game){
  io?.sockets.adapter.rooms.get(`room_${roomUuid}`)?.forEach( clientId => {
    const sid =(io?.sockets.sockets.get(clientId)?.handshake as any)?.sessionID;
    io?.to(clientId).emit('game_update', game.toJson(getSessionPlayer(sid)));
  });
}
