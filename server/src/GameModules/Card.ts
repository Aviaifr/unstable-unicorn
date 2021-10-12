import { loadCardEffects, EventEffectMap } from "./effects/effectsLoader";
import { generateUID } from "../utils"
import { CardDescriptor, cardList} from "./cardLists";

export class Card {
    name: string;
    effects : Array<EventEffectMap> = [];
    uid: string;
    type:string;
    text: string;
    slug: string;
    
    constructor(slug: string, description: CardDescriptor | null = null){
        const desc: CardDescriptor = description ?? (
            (cardList.base as Object).hasOwnProperty(slug) ? (cardList.base as any)[slug] :
             (cardList.expension as Object).hasOwnProperty(slug) ? (cardList.expension as any)[slug] : cardList.base.neigh);
        this.slug = slug;
        this.name = desc.name;
        loadCardEffects(this.name);
        this.uid = generateUID();
        this.type = desc.type;
        this.text = desc.text;
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