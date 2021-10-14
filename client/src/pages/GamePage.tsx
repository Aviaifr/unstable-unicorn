import { useContext, useEffect, useState } from "react"
import SocketContext from '../components/socketContext'
import {IPlayer, IGame, emptyPlayer} from '../components/gameTypes'
import Card from '../components/Card/Card'
import useClasses from "hooks/useClasses"
import { styles } from './GamePageStyles'
import Stable from '../components/Stable'
import Hand from '../components/Hand'

export default function GamePage() {
    const socket = useContext(SocketContext);
    const [game, setGame] = useState<IGame | null>(null);
    const [player, setPlayer] = useState<IPlayer>(emptyPlayer);
    const [otherPlayer, setotherPlayer] = useState<IPlayer>(emptyPlayer);
    const [gameState, setgameState] = useState('');
    const classes = useClasses(styles);
    useEffect(() => {
        socket?.emit('get_game', (data: IGame) => {setGame(data)});
        socket?.on('game_update', setGame);
    },[socket]);

    useEffect(() => {
        if(game){
            setPlayer(game.players.find(player => player.currentPlayer) ?? emptyPlayer);
            setotherPlayer(game.players.find(player => !player.currentPlayer) ?? emptyPlayer);
        }
    }, [game, game?.players]);
    const highlightTargets = (targets: Array<String>) => {
        
    }
    const {stable, hand} = player;
    const {stable: otherstable, hand: otherHand} = otherPlayer;
    return (
        <div>
            <div>
                <div>
                    {otherHand.map(card => (<Card key={card.uid} cardData={card} onClickHandler={() => console.log(card.slug)}></Card>))}
                </div>
            </div>
            <Stable stable={otherstable}/>
            <div className={classes.mainArea}>
                <div className={classes.infermary}>
                    <Card onClickHandler={()=>{}} cardData={{uid: 'deckCards', name: undefined, slug: undefined, text: undefined, type: 'baby'}} />
                </div>
                <div className={classes.infermary} style={{border:'1px solid black'}}>discard</div>
                <div className={classes.infermary}>
                <Card onClickHandler={()=>{}} cardData={{uid: 'deckCards', name: undefined, slug: undefined, text: undefined, type: 'back'}} />
                </div>
                
            </div>
            <Stable stable={stable}/>
            <Hand player={player}/>
        </div>
    );
}
