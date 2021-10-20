import EventEmitter from "events";
import { Card } from "./Card";
import { Events } from "./Events";
import { Player } from "./Player";

export class Stable {
    unicorns: Array<Card>;
    upgrades: Array<Card>;
    downgrades: Array<Card>;
    
    constructor(){
        this.unicorns = [];
        this.upgrades = [];
        this.downgrades = [];
    }

    registerEvents(em: EventEmitter, player: Player) {
        em.on(Events.DISCARDED, (discardedCard: Card) => {
            this.unicorns = this.unicorns.filter(card => card !== discardedCard);
            this.upgrades = this.upgrades.filter(card => card !== discardedCard);
            this.downgrades = this.downgrades.filter(card => card !== discardedCard);
        });
        this.unicorns.forEach(card => card.registerEvents(em, player));
        this.upgrades.forEach(card => card.registerEvents(em, player));
        this.downgrades.forEach(card => card.registerEvents(em, player));
    }

    addCard(card: Card, area: string) {
        switch(area){
            case 'stable':
                this.unicorns.push(card);
                break;
            case 'upgrade':
                this.upgrades.push(card);
                break;
            case 'downgrade':
                this.downgrades.push(card);
                break;
            default:
                console.log(`unkown area ${area}`)
        }
    }

    static fromDB(stable: { downgrades: string[]; upgrades: string[]; unicorns: string[]; }) : Stable {
        const val = new this();
        val.downgrades = stable.downgrades?.map(slug => new Card(slug));
        val.upgrades = stable.upgrades?.map(slug => new Card(slug));
        val.unicorns = stable.unicorns?.map(slug => new Card(slug));
        return val;
    }
}
