import { TypedEmitter, ListenerSignature} from 'tiny-typed-emitter';
import { Player } from "./Player";
import { Card } from "./Card";
import { cardList, CardDescriptor } from "./cardLists";
import { generateUID, shuffleArray } from "../utils";
import { IGame } from "../DB/Schema/game";
import { Events } from './Events';

const INITIAL_HAND_SIZE = 5;

interface MyClassEvents {
    [Events.CARD_PLAYED]: (card: Card, player: Player, area: string, targetedPlayer?: Player ) => void;
    [Events.ADD_GAME_ACTION]: (actionName: string, player: Player) => void;
    [Events.RESOLVE_CHAIN]: () => void;
    [Events.BEFORE_RESOLVE_CHAIN]:  () => void;
    [Events.DISCARDED]: (card: Card) => void;
    [Events.ON_PLAYER_ACTION]: (action: string, choice: string, player: Player) => void;
    [Events.REMOVE_EXPECTED_ACTION]: (actionToRemove: string, player: Player) => void;
    [Events.PUSH_TO_CHAIN]: (card: Card) => void;
    [Events.DISCARD_FROM_CHAIN_IF_EXISTS]: (card: Card, limit?: number) => void;
  }

interface ExpectedAction {
    player: string,
    action: string
}
export default class Game extends TypedEmitter<MyClassEvents>{
    players : Array<Player> = [];
    deck: Array<Card> = [];
    discard: Array<Card> = [];
    nursery: Array<Card> = [];
    inPlay: Array<Card> = [];
    currentPlayer: Player = new Player('noPlayer');
    uid: string = '';
    hasStarted: boolean = false;
    expectedActions: Array<ExpectedAction> = [];
    currentChain: Array<Card> = [];

    constructor(players: Array<Player>, template: boolean = false){
        super();
        if(!template){
            this.uid = generateUID();
            this.players = players;
            this.currentPlayer = this.players[0];
            this.hasStarted = false;
            //later we will know if it is an expension, right now using base cards only
            for(const [key, value] of Object.entries(cardList.base)){
                for (let i = 0; i < (value as CardDescriptor).count; i++){
                    if(value.type === 'baby'){
                        this.nursery.push(new Card(key, value));
                    }else{
                        this.deck.push(new Card(key, value));
                    }
                }
            }/*
            for(const [key, value] of Object.entries(cardList.expension)){
                for (let i = 0; i < (value as CardDescriptor).count; i++){
                    this.deck.push(new Card(key));
                }
            }*/
        }
        this.initEvents()
    }

    private initEvents() {
        this.on(Events.ADD_GAME_ACTION, (actionName, byPlayer) => this.expectedActions.push({action: actionName, player: byPlayer.uid}));
        this.on(Events.REMOVE_EXPECTED_ACTION, (actionToRemove, byPlayer) => 
            this.expectedActions = this.expectedActions.filter(action => action.action !== actionToRemove && action.player !== byPlayer.uid)
        );
        this.on(Events.PUSH_TO_CHAIN, (card) => this.currentChain.push(card));
        this.on(Events.DISCARD_FROM_CHAIN_IF_EXISTS, (card, limit) => {
            if(this.currentChain.includes(card)){
                limit = limit ?? this.currentChain.length;
                for (let i = 0; i < limit; i++) {
                    let c: Card | undefined;
                    (c = this.currentChain.pop()) && this.discard.push(c) && this.emit(Events.DISCARDED, c);
                }
            }
        });
        this.on(Events.BEFORE_RESOLVE_CHAIN, () => this.expectedActions.length === 0 && this.emit(Events.RESOLVE_CHAIN));
    }

    DoAction(action: string, choice: string, player: Player) {
        this.emit(Events.ON_PLAYER_ACTION, action, choice, player);
    }

    StartGame(){
        if(!this.hasStarted){
            shuffleArray(this.deck);
            shuffleArray(this.deck);
            this.players.forEach((player: Player) => {
                for (let index = 0; index < INITIAL_HAND_SIZE; index++) {
                    player.Draw(this.deck, this);
                }
            });
            this.giveBabyUnicorn();
            this.hasStarted = true;
        }
    }

    Play(cardUid: string, area: string, targetedPlayer?:string){
        const card: Card | undefined = this.currentPlayer.hand.find(card => card.uid === cardUid);
        const player : Player | undefined = this.players.find(player => player.uid === targetedPlayer);
        if(!card){
            console.log('card does not exist in players hand')
            return;
        }
        if(area === 'play'){
            this.putCardInPlay(card);
        }else{
            if(!player){
                console.log(`failed to add card into player ${targetedPlayer} ${area}`);
                return;
            }
            player.stable.addCard(card, area);
        }
        player?.removeCardFromHand(card);
        this.currentChain.push(card);
        this.emit(Events.CARD_PLAYED, card, this.currentPlayer, area, player)
        if(this.expectedActions.length === 0){
            this.nextPlayer();
        }else{
            this.once(Events.RESOLVE_CHAIN, () => this.nextPlayer());
        }
    }

    nextPlayer() {
        const currentPlayerIndex = this.players.indexOf(this.currentPlayer);
        this.currentPlayer = currentPlayerIndex === this.players.length - 1 ? this.players[0] : this.players[currentPlayerIndex + 1];
    }

    putCardInPlay(card: Card) {
        this.inPlay.push(card);
    }

    toJson(currentPlayer: Player | null){
        return {
            players: this.players.map(player => player.toJson(currentPlayer)),
            discard: this.discard.map(card => card.toJson()),
            nursery: this.nursery.map(card => card.toJson()),
            currentPlayer: this.currentPlayer.uid,
            uid: this.uid,
            pendingAction: this.expectedActions.filter(action => action.player === currentPlayer?.uid),
        }
    }

    toDB(){
        return {
            players: this.players.map(player => player.uid),
            deck: this.deck.map(card => card.slug),
            discard: this.discard.map(card => card.slug),
            nursery: this.nursery.map(card => card.slug),
            inPlay: this.inPlay.map(card => card.slug),
            currentPlayer: this.currentPlayer.uid,
            uid: this.uid,
            hasStarted: this.hasStarted
        }
    }

    static fromDB(data : IGame, players: Array<Player>) {
        const res = new this([], true)
        res.deck = data.deck.map(slug => new Card(slug));
        res.discard = data.discard.map(slug => new Card(slug));
        res.nursery = data.nursery.map(slug => new Card(slug));
        res.inPlay = data.inPlay?.map(slug => new Card(slug));
        res.players = players,
        res.currentPlayer = players.find(player => player.uid === data.currentPlayer) ?? players[0];
        res.hasStarted = data.hasStarted;
        res.uid = data.uid;
        players.forEach(player => player.registerCards(res))
        return res;
    }
    
    private giveBabyUnicorn() {
        shuffleArray(this.nursery);
        this.players.forEach(player => {
            const card = this.nursery.pop()
            if(card){
                player.stable.unicorns.push(card);
            }
        });
    }
}


