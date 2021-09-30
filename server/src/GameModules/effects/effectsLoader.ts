import { Events } from "../Events" 

export interface EventEffectMap {
    eventName: Events;
    (something: string) : void;
}

export function loadCardEffects(cardName: string) : Array<EventEffectMap>{
    return [];
}