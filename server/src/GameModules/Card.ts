import EventEmitter from "events";
import { loadCardEffects, EventEffectMap } from "./effects/effectsLoader";
import { generateUID } from "../utils"
import { CardDescriptor, cardList} from "./cardLists";
import { Player } from "./Player";
import { Events } from "./Events";

export class Card {
    isDestroyable(): boolean {
        return this.destroyable;
    }
    name: string;
    effects : Array<EventEffectMap> = [];
    uid: string;
    type:string;
    text: string;
    slug: string;
    destroyable: boolean = true;
    
    constructor(slug: string, description: CardDescriptor | null = null){
        const desc: CardDescriptor = description ?? (
            (cardList.base as Object).hasOwnProperty(slug) ? (cardList.base as any)[slug] :
             (cardList.expension as Object).hasOwnProperty(slug) ? (cardList.expension as any)[slug] : cardList.base.neigh);
        this.slug = slug;
        this.name = desc.name;
        this.effects = loadCardEffects(this.slug);
        this.uid = generateUID();
        this.type = desc.type;
        this.text = desc.text;
    }

    registerEvents(em: EventEmitter, owner: Player) {
        this.effects.forEach(ef => {
            const fn = ef.fn(em, owner, this);
            const discarded = (card: Card) => {
                this === card && em.off(ef.eventName, fn) && em.off(Events.DISCARDED, discarded);
            }
            em.on(ef.eventName, fn);
            em.on(Events.DISCARDED, discarded);
        })
    }

    toAnonymousJson(){
        return {
            uid: this.uid,
        }
    }
    toJson(){
        return {
            name: this.name,
            uid: this.uid,
            type: this.type,
            text: this.text,
            slug: this.slug,
        }
    }
}

module.exports.Card = Card;