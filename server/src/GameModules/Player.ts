import { Card } from "./Card";
import { Stable } from "./Stable";
import { generateUID } from "../utils"
import { IDBPlayer } from "../DB/Schema/player";
import EventEmitter from "events";
import { Events } from "./Events";

export class Player {
    name: string;
    hand: Array<Card>;
    stable: Stable;
    handVisibleToPlayers: Map<string, Array<string>> = new Map();
    neighBlockedBy: Array<string> = [];
    canUseInstantBlockedBy: Array<string> = [];
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
    /* istanbul ignore next */ 
    toJson(player: Player | null){
        return {
            name: this.name,
            hand: this.hand.map((card:Card) => {
                return (player && Array.from(this.handVisibleToPlayers.values()).some(arr => arr.includes(player.uid))) ||
                player === this ? card.toJson() : card.toAnonymousJson();
            }),
            stable: this.stable,
            uid: this.uid,
            currentPlayer: player === this
        }
    }

    /* istanbul ignore next */ 
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

    /* istanbul ignore next */ 
    static fromDB(data : IDBPlayer) {
        return new this(
            data.name,
            data.uid,
            Stable.fromDB(data.stable),
            data.hand.map(slug => new Card(slug)))
    }

    registerCards(em: EventEmitter): void {
        em.on(Events.CHANGE_HAND_VISIBILITY, (targetPlayer: string, initiatingCard: Card, players: Array<string>, visible: boolean) => {
            if(targetPlayer !== this.uid){
                return;
            }

            const onDiscarded = (initiator :Card) => {
                if(Array.from(this.handVisibleToPlayers.keys()).includes(initiatingCard.uid)){
                    this.handVisibleToPlayers.delete(initiatingCard.uid);
                    em.off(Events.DISCARDED, onDiscarded)
                }
            }

            if(visible){
                this.handVisibleToPlayers.set(initiatingCard.uid, players)
                em.on(Events.DISCARDED, onDiscarded)
            }else{
                this.handVisibleToPlayers.delete(initiatingCard.uid);
            }
        })
        this.hand.forEach(card => card.registerEvents(em, this));
        this.stable.registerEvents(em, this);
    }

    IsNeighable() {
        return this.neighBlockedBy.length === 0;
    }

    setIsNeigable(val: boolean, initiatorUid: string){
        const index = this.neighBlockedBy.indexOf(initiatorUid);
        if (index > -1) {
            val && this.neighBlockedBy.splice(index, 1);
        } else if(!val){
            this.neighBlockedBy.push(initiatorUid);
        }
    }
    
    setCanUseInstant(val: boolean, initiatorUid: string){
        const index = this.canUseInstantBlockedBy.indexOf(initiatorUid);
        if (index > -1) {
            val && this.canUseInstantBlockedBy.splice(index, 1);
        } else if(!val){
            this.canUseInstantBlockedBy.push(initiatorUid);
        }
    }
    canUseInstant():boolean {
        return this.canUseInstantBlockedBy.length === 0;
    }

    getDestroyable(initiator?: Card, type?: string): Array<string> {
        return this.stable.getDestroyableCards(type, initiator);
    }
}

module.exports.Player = Player;