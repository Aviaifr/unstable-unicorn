import { loadCardEffects, EventEffectMap } from "./effects/effectsLoader";
import { generateUID } from "../utils"
import { cardList, CardDescriptor } from "./cardLists";
export class Card {
    name: string;
    effects : Array<EventEffectMap> = [];
    uid: string;
    type:string;
    text: string;
    slug: string;
    
    constructor(slug: string, desc: CardDescriptor){
        this.slug = slug;
        this.name = desc.name;
        loadCardEffects(this.name);
        this.uid = generateUID();
        this.type = desc.type;
        this.text = desc.text;
    }
}

module.exports.Card = Card;