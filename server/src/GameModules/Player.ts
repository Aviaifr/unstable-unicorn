import { Card } from "./Card";
import { Stable } from "./Stable";
import { generateUID } from "../utils"
import { IDBPlayer } from "../DB/Schema/player";
import EventEmitter from "events";
import Game from "./Game";

export class Player {
    getDestroyable(): Array<string> {
        return this.stable.getDestroyableCards();
    }
    name: string;
    hand: Array<Card>;
    stable: Stable;
    private _uid: string;
  
    constructor(name: string, uid: string | null = null, stable : Stable | null = null, hand: Array<Card> | null = null){
        this.name = name;
        this.stable = stable ?? new Stable();
        this._uid = uid ?? generateUID();
        this.hand = hand ?? [];
    }

    public get uid(): string {
        return this._uid;
    }
    public set uid(value: string) {
        this._uid = value;
    }

    Draw(deck: Array<Card>, em : EventEmitter ) : void{
        let card: Card | null = deck.pop() ??  null;
        if(card){
            this.hand.push(card);
            card.registerEvents(em, this);
        }
    }

    removeCardFromHand(card : Card) {
        const index = this.hand.indexOf(card);
        if (index > -1) {
            this.hand.splice(index, 1);
        }
    }

    toJson(player: Player | null){
        return {
            name: this.name,
            hand: this.hand.map((card:Card) => player === this ? card.toJson() : card.toAnonymousJson()),
            stable: this.stable,
            uid: this.uid,
            currentPlayer: player === this
        }
    }
    toDB(): IDBPlayer {
        return {
            name: this.name,
            uid: this.uid,
            hand: this.hand.map(card =>  card.slug),
            stable: {
                downgrades: this.stable.downgrades.map(card =>  card.slug),
                upgrades: this.stable.upgrades.map(card =>  card.slug),
                unicorns: this.stable.unicorns.map(card =>  card.slug),
            }

        }
    }
    static fromDB(data : IDBPlayer) {
        return new this(
            data.name,
            data.uid,
            Stable.fromDB(data.stable),
            data.hand.map(slug => new Card(slug)))
    }

    registerCards(em: EventEmitter): void {
        this.hand.forEach(card => card.registerEvents(em, this));
        this.stable.registerEvents(em, this);
    }
}

module.exports.Player = Player;