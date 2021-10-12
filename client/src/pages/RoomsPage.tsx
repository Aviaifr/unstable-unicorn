import { useContext, useEffect, useState } from "react"
import { Button } from "@material-ui/core";

import SocketContext from '../components/socketContext'
import {IPlayer} from '../components/gameTypes'

export interface IRoom{
    uuid: string;
    maxPlayers: number;
    players: Array<IPlayer>;
    creator: string;
    game: string;
  }
  
type Props = {
    onGameStarted: () => void
}

export default function RoomsPage({onGameStarted} : Props) {
    const socket= useContext(SocketContext);
    const [rooms, setRooms] = useState<Array<string>>([]);
    const [currentRoom, setCurrentRoom] = useState<IRoom | null>(null);
    const [player, setPlayer] = useState<IPlayer | undefined>(undefined);
    const startGame = () =>{
        socket?.emit("start_game", onGameStarted);
    }

    useEffect(() => {
        if(currentRoom && currentRoom.game){
            onGameStarted();
        }
    }, [currentRoom])

    useEffect(()=>{
        socket?.emit('get_rooms', (data : any) => {setRooms(data.rooms); setCurrentRoom(data.currentRoom); setPlayer(data.player); console.log(data.player);});
        socket?.on('current_room_update', setCurrentRoom);
        socket?.on('room_list', setRooms);
        socket?.on('game_started', onGameStarted);
    },[socket]);

    return (
        <div>
            <br />
            <br />
            <br />
            <br />
            <br /><br /><br />
            <h2>Hi {player?.name}</h2>
            <div style={{display:'inline-block'}}>
                <h1>Rooms</h1>
                {rooms.map(room => (<Button key={room} onClick={(e) => socket?.emit('join_room', room)}>Join Room {room}</Button>))}
            </div>
            <div style={{display:'inline-block'}}>
            {!currentRoom ? (
                <div>
                    <h1>Create Room</h1>
                    <Button onClick={() => socket?.emit('create_room')}>Create a new room</Button>
                </div>
                ) : (
                    <div>
                        <div>Room code: {currentRoom.uuid}</div>
                        <div>Max players: {currentRoom.maxPlayers}</div>
                        <div>Connected Players: 
                            <ul>
                                {currentRoom.players.map(player => (<li key={player.name}>{player.name}</li>))}
                            </ul>
                        </div>
                        {currentRoom.creator === player?.uid && (
                            <Button onClick={(e) => startGame()}>Start Game</Button> 
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
