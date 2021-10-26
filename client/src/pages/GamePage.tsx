import { useContext, useEffect, useState } from "react"
import { Button } from "@material-ui/core"

import SocketContext from '../components/socketContext'
import {IPlayer, IGame, emptyPlayer, IPlayingCard, emptyCard, ExpectedAction} from '../components/gameTypes'
import Card from '../components/Card/Card'
import useClasses from "hooks/useClasses"
import { styles } from './GamePageStyles'
import Stable from '../components/Stable'
import getTarget from "components/Card/CardTargets"
import DiscardPile from 'components/DiscardPile'
import NeighDialog from 'components/NeighDialog'
import ActivateableContext from 'components/context/ActivateableCardsContext'
import TargetedContext from 'components/context/TargetableCardsContext'
import Hand from 'components/Hand'

export default function GamePage() {
    const socket = useContext(SocketContext);
    const [game, setGame] = useState<IGame | null>(null);
    const [player, setPlayer] = useState<IPlayer>(emptyPlayer);
    const [otherPlayer, setotherPlayer] = useState<IPlayer>(emptyPlayer);
    const [playerTarget, setPlayerTargets] = useState('');
    const [enemyTarget, setEnemyTargets] = useState('');
    const [selectedCardUid, setSelectedCardUid] = useState('');
    const [expectedActions, setExpectedActions] = useState<Array<ExpectedAction>>([]);
    const [showNeighDialog, setShowNeighDialog] = useState(false);
    const [activateableCards, setActivateableCards] = useState<Array<string>>([]);
    const [targetCards, setTargetCards] = useState<Array<string>>([]);
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
        }
    }, [game, game?.players]);

    useEffect(() => {
        console.log(expectedActions);
        setActivateableCards([]);
        setTargetCards([]);
        const activateables: Array<string> = [];
        expectedActions.forEach(action => {
            switch(action.action){
                case 'neigh' :
                    setShowNeighDialog(true);
                    break;
                case 'destroy':
                    setTargetCards(action.data ?? []);
                    break;
                default:
                    activateables.push(action.action);
            }
        });
        setActivateableCards(activateables);
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
        <TargetedContext.Provider value={targetCards}>
            <div>
                <div>
                    {otherHand.map(card => (<Card key={card.uid} cardData={card} onClickHandler={() => console.log(card.slug)}></Card>))}
                </div>
            </div>
            <NeighDialog 
                setResponse={(toNeigh) =>{
                    socket?.emit('pendingAction', 'neigh', toNeigh? 'yes' : 'no');
                    setShowNeighDialog(false);
                }} open={showNeighDialog}/>
            <Stable stable={otherstable} highlight={enemyTarget} onSelectedClick={(area: string) => onSelectableAreaClick(area, otherPlayer.uid) }/>
            <div className={classes.mainArea}>
                <div className={classes.infermary}>
                    <Card onClickHandler={()=>{}} cardData={{uid: 'deckCards', name: undefined, slug: undefined, text: undefined, type: 'baby'}} />
                </div>
                    <DiscardPile onCardClickHandler={() => {} } pile={game?.discard.slice().reverse() ?? []}/>
                <div className={classes.infermary}>
                <Card
                    onClickHandler={()=>{socket?.emit('pendingAction', 'draw', 'y')}}
                    cardData={{uid: 'deckCards', name: undefined, slug: undefined, text: undefined, type: 'back'}}
                    selected={activateableCards.includes('draw')}/>
                </div>
                
            </div>
            <div>{player.uid}</div>
            <ActivateableContext.Provider value={activateableCards}>
                <Stable stable={stable} highlight={playerTarget} onSelectedClick={(area: string) => onSelectableAreaClick(area, player.uid) }/>
            </ActivateableContext.Provider>
            <Hand player={player} onCardSelected={onCardSelected}/>
            <Button onClick={()=> {socket?.emit('save')}}>Save</Button>
        </TargetedContext.Provider>
    );
}
