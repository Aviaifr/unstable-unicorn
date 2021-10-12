import { Player } from "./Player";
import { Card } from "./Card";
import { cardList, CardDescriptor } from "./cardLists";
import { generateUID, shuffleArray } from "../utils";
import { IGame } from "../DB/Schema/game";
const INITIAL_HAND_SIZE = 5;
export default class Game{
    players : Array<Player> = [];
    deck: Array<Card> = [];
    discard: Array<Card> = [];
    nursery: Array<Card> = [];
    currentPlayer: string = '';
    uid: string = '';
    hasStarted: boolean = false;

    constructor(players: Array<Player>, template: boolean = false){
        if(!template){
            this.uid = generateUID();
            this.players = players;
            this.currentPlayer = this.players[0].uid;
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
    }

    StartGame(){
        if(!this.hasStarted){
            shuffleArray(this.deck);
            shuffleArray(this.deck);
            this.players.forEach((player: Player) => {
                for (let index = 0; index < INITIAL_HAND_SIZE; index++) {
                    player.Draw(this.deck);
                }
            });
            this.hasStarted = true;
        }
    }

    toJson(currentPlayer: Player | null){
        return {
            players: this.players.map(player => player.toJson(currentPlayer)),
            discard: this.discard.map(card => card.toJson()),
            nursery: this.nursery.map(card => card.toJson()),
            currentPlayer: this.currentPlayer,
            uid: this.uid,
        }
    }

    toDB(){
        return {
            players: this.players.map(player => player.uid),
            deck: this.deck.map(card => card.slug),
            discard: this.discard.map(card => card.slug),
            nursery: this.nursery.map(card => card.slug),
            currentPlayer: this.currentPlayer,
            uid: this.uid,
            hasStarted: this.hasStarted
        }
    }

    static fromDB(data : IGame, players: Array<Player>) {
        const res = new this([], true)
        res.deck = data.deck.map(slug => new Card(slug));
        res.discard = data.discard.map(slug => new Card(slug));
        res.nursery = data.nursery.map(slug => new Card(slug));
        res.players = players,
        res.currentPlayer = data.currentPlayer;
        res.hasStarted = data.hasStarted;
        res.uid = data.uid;
        return res;
    }
}