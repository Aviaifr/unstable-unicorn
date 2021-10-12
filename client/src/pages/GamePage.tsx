import { useContext, useEffect, useState } from "react"
import SocketContext from '../components/socketContext'
import {IPlayer, IGame} from '../components/gameTypes'
import Card from '../components/Card/Card'
import useClasses from "hooks/useClasses"
import { styles } from './GamePageStyles'

export default function GamePage() {
    const socket = useContext(SocketContext);
    const [game, setGame] = useState<IGame | null>(null);
    const [player, setPlayer] = useState<IPlayer | undefined>(undefined);
    const [gameState, setgameState] = useState('');
    const classes = useClasses(styles);
    useEffect(() => {
        socket?.emit('get_game', (data: IGame) => {setGame(data)});
        socket?.on('game_update', setGame);
    },[socket]);

    useEffect(() => {
        if(game){
            setPlayer(game.players.find(player => player.currentPlayer));
            //parse pending actions
        }
    }, [game, game?.players]);

    return (
        <div>
            <br />
            <br />
            <br />
            <br />
            <br /><br /><br />
            <div className={classes.infermary}></div>
            <div>
                <h1>Hand</h1>
                {player?.hand.map(card => (<Card key={card.uid} cardData={card} onClickHandler={() => console.log(card.slug)}></Card>))}
            </div>
        </div>
    );
}
