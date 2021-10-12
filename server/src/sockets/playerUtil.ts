import { Player } from '../GameModules/Player'
import SessionPlayer, { ISessionUser } from '../DB/Schema/player'
import Mongoose, { Document } from 'mongoose'

export const sessionsPlayers: Map<string, Player | null> = new Map<string, Player | null>();

export function initDBPlayers(){
  SessionPlayer.find(function (err, sessionPlayer) {
    if (err) return console.error(err);
    sessionPlayer.forEach(player => populatePlayerSession(player));
  });
}

export function getSessionPlayer(sessID : string) : Player | null{
  return sessionsPlayers.get(sessID) ?? null;
}

export const setUserName = (sessionID: string, uname:string, fn: CallableFunction) => {
  let player = getSessionPlayer(sessionID);
  if(!player){
    player = new Player(sessionID);
    sessionsPlayers.set(sessionID, player);
  }
  player.name = uname;
  sessionsPlayers.set(sessionID, player);
  SessionPlayer.findOneAndUpdate({session: sessionID}, { 'player.name' : uname},{},(error, res) => {
    if (!res) {
      const dbplayer = new SessionPlayer({session: sessionID, player: player?.toDB()});
      dbplayer.save();
    }
  });
  fn();
};


function populatePlayerSession(sessionPlayer: ISessionUser & { _id: Mongoose.Types.ObjectId; }): void {
  const player = Player.fromDB(sessionPlayer.player);
  sessionsPlayers.set(sessionPlayer.session, player);
}


export function updateRoomPlayersHand(roomPLayers: Array<Player>) {
  roomPLayers.forEach(player => {
    const hand = Array.from(player.toDB().hand);
    SessionPlayer.findOneAndUpdate({'player.uid' : player.uid}, {$push:{'player.hand':{$each: hand}}},{}, (error, res) => {
      if(!res){
        console.log('failed to update player hand')
      }
    });
  })
}