import { useContext, useEffect, useState } from "react"
import SocketContext from '../components/socketContext'
import {IPlayer, IGame, emptyPlayer, IPlayingCard, emptyCard, ExpectedAction} from '../components/gameTypes'
import Card from '../components/Card/Card'
import useClasses from "hooks/useClasses"
import { styles } from './GamePageStyles'
import Stable from '../components/Stable'
import Hand from '../components/Hand'
import getTarget from "components/Card/CardTargets"
import CardContainer from 'components/CardContrainer'
import DiscardPile from 'components/DiscardPile'

export default function GamePage() {
    const socket = useContext(SocketContext);
    const [game, setGame] = useState<IGame | null>(null);
    const [player, setPlayer] = useState<IPlayer>(emptyPlayer);
    const [otherPlayer, setotherPlayer] = useState<IPlayer>(emptyPlayer);
    const [playerTarget, setPlayerTargets] = useState('');
    const [enemyTarget, setEnemyTargets] = useState('');
    const [selectedCardUid, setSelectedCardUid] = useState('');
    const [expectedActions, setExpectedActions] = useState<Array<ExpectedAction>>([]);
    const classes = useClasses(styles);
    
    useEffect(() => {
        socket?.emit('get_game', (data: IGame) => {setGame(data)});
        socket?.on('game_update', setGame);
    },[socket]);
    //game loaded - setPlayers
    useEffect(() => {
        if(game){
            setPlayer(game.players.find(player => player.currentPlayer) ?? emptyPlayer);
            setotherPlayer(game.players.find(player => !player.currentPlayer) ?? emptyPlayer);
            onCardSelected(emptyCard);
            setExpectedActions(game.pendingAction);
            console.log(game);
        }
    }, [game, game?.players]);

    useEffect(() => {
        console.log(expectedActions);
        expectedActions.forEach(action => {
            if(action.action === 'neigh'){
                // eslint-disable-next-line no-restricted-globals
                const res = confirm("Neigh Card?");
                socket?.emit("pendingAction", 'neigh', res? 'yes' : 'no');
            }
        })
    }, [expectedActions])

    const onCardSelected = (cardData?: IPlayingCard) => {
        const targets = getTarget(cardData?.type ?? '');
        setEnemyTargets(targets === 'stable' ? '': targets);
        setPlayerTargets(targets);
        setSelectedCardUid(cardData?.uid ?? '' );
    };

    const onSelectableAreaClick = (area: string, playerUid: string) => {
        socket?.emit('play_card', {target: area, targetPlayer: playerUid, card: selectedCardUid});
    }
    
    const {stable} = player;
    const {stable: otherstable, hand: otherHand} = otherPlayer;
    return (
        <div>
            <div>
                <div>
                    {otherHand.map(card => (<Card key={card.uid} cardData={card} onClickHandler={() => console.log(card.slug)}></Card>))}
                </div>
            </div>
            <Stable stable={otherstable} highlight={enemyTarget} onSelectedClick={(area: string) => onSelectableAreaClick(area, otherPlayer.uid) }/>
            <div className={classes.mainArea}>
                <div className={classes.infermary}>
                    <Card onClickHandler={()=>{}} cardData={{uid: 'deckCards', name: undefined, slug: undefined, text: undefined, type: 'baby'}} />
                </div>
                    <DiscardPile onCardClickHandler={() => {} } pile={game?.discard ?? []}/>
                <div className={classes.infermary}>
                <Card onClickHandler={()=>{}} cardData={{uid: 'deckCards', name: undefined, slug: undefined, text: undefined, type: 'back'}} />
                </div>
                
            </div>
            <div>{player.uid}</div>
            <Stable stable={stable} highlight={playerTarget} onSelectedClick={(area: string) => onSelectableAreaClick(area, player.uid) }/>
            <Hand player={player} onCardSelected={onCardSelected}/>
        </div>
    );
}
