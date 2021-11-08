import EventEmitter from "events";
import { Card } from "./Card";
import { Events } from "./Events";
import { Player } from "./Player";

export class Stable {

    getCardsByType(type: string, isInitialType?: boolean) {
        return this.unicorns.concat(this.upgrades).concat(this.downgrades)
            .filter(card => type === 'all' || ( isInitialType ? card.type === type : type.split(',').includes(card.baseType)));

    }
    getDestroyableCards(type?: string): string[] {
        return this.unicorns.filter(card => card.isDestroyable(type)).map(card => card.uid).concat(
            this.upgrades.filter(card => card.isDestroyable(type)).map(card => card.uid)).concat(
            this.downgrades.filter(card => card.isDestroyable(type)).map(card => card.uid));
    }
    unicorns: Array<Card>;
    upgrades: Array<Card>;
    downgrades: Array<Card>;
    
    constructor(){
        this.unicorns = [];
        this.upgrades = [];
        this.downgrades = [];
    }

    removeFromStable(cardToRemove: Card) {
        this.unicorns = this.unicorns.filter(card => card !== cardToRemove);
        this.upgrades = this.upgrades.filter(card => card !== cardToRemove);
        this.downgrades = this.downgrades.filter(card => card !== cardToRemove);
    }

    registerEvents(em: EventEmitter, player: Player) {
        em.on(Events.SACRIFICE, (cardID: string, initiatingCard?: Card) =>
        removeFromStable(cardID, 'sacrifice', initiatingCard));
        
        em.on(Events.DESTROYED, (cardID: string, initiatingCard?: Card) =>
            removeFromStable(cardID, 'destroy', initiatingCard));

        em.on(Events.DISCARDED, (card: Card) => removeFromStable(card.uid, null));

        const removeFromStable = (cardID: string, reason: string | null, initiatingCard?: Card) =>{
            const cardToDestroy = this.findInStable(cardID);
                if(cardToDestroy){
                    this.removeFromStable(cardToDestroy);
                    reason &&
                    em.emit(reason === 'destroy' ? Events.AFTER_DESTROY : Events.AFTER_SACRIFICE ,
                        cardToDestroy,
                        player,
                        initiatingCard
                    );
                }
        }

        em.on(Events.AFTER_CARD_RESOLVED, (card: Card) => {
            const newInStable = this.findInStable(card.uid);

            newInStable && 
            em.emit(Events.ENTERED_STABLE, newInStable, player);
        })
        
        this.unicorns.forEach(card => card.registerEvents(em, player));
        this.upgrades.forEach(card => card.registerEvents(em, player));
        this.downgrades.forEach(card => card.registerEvents(em, player));
    }

    findInStable(cardID: string){
        return this.unicorns
            .concat(this.downgrades)
            .concat(this.upgrades)
            .find(card => card.uid === cardID)
    }

    addCard(card: Card, area?: string) {
        if(!area){
            area = this.getAreaByCardType(card.baseType);
        }
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
    getAreaByCardType(baseType: string): string {
        if(['unicorn', 'panda'].includes(baseType)){
            return 'stable';
        }
        return baseType;
    }
    
    /* istanbul ignore next */ 
    static fromDB(stable: { downgrades: string[]; upgrades: string[]; unicorns: string[]; }) : Stable {
        const val = new this();
        val.downgrades = stable.downgrades?.map(slug => new Card(slug));
        val.upgrades = stable.upgrades?.map(slug => new Card(slug));
        val.unicorns = stable.unicorns?.map(slug => new Card(slug));
        return val;
    }
}
