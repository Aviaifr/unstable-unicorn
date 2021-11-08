import EventEmitter from "events";
import { loadCardEffects, EventEffectMap } from "./effects/effectsLoader";
import { generateUID } from "../utils";
import { CardDescriptor, cardList } from "./cardLists";
import { Player } from "./Player";
import { Events } from "./Events";

export class Card {
  isDestroyable(type?: string): boolean {
    return this.destroyable && (!type || this.baseType === type || type.split(',').includes(this.baseType));
  }
  name: string;
  effects: Array<EventEffectMap> = [];
  uid: string;
  type: string;
  baseType: string;
  text: string;
  slug: string;
  destroyable: boolean = true;
  unregisterFunction: (card: Card) => void = () => {};

  constructor(slug: string, description: CardDescriptor | null = null) {
    const desc: CardDescriptor =
      description ??
      ((cardList.base as Object).hasOwnProperty(slug.toString())
        ? (cardList.base as any)[slug]
        : (cardList.expension as Object).hasOwnProperty(slug)
        ? (cardList.expension as any)[slug]
        : cardList.base.neigh);
    this.slug = slug;
    this.name = desc.name;
    this.effects = loadCardEffects(this.slug);
    this.uid = generateUID();
    this.type = desc.type;
    this.text = desc.text;
    this.baseType = this.getBaseType();
  }
  getBaseType(): string {
    if (["baby", "magical", "basic"].includes(this.type)) {
      return "unicorn";
    }
    return this.type;
  }

  ResetEvent(em: EventEmitter, newOwner: Player) {
    this.unregisterFunction(this);
    em.off(Events.DISCARDED, this.unregisterFunction);
    this.registerEvents(em, newOwner);
  }

  registerEvents(em: EventEmitter, owner: Player) {
    const discardFunctions: Array<Function> = [];
    this.effects.forEach((ef) => {
      if (Array.isArray(ef.eventName)) {
          ef.eventName.forEach(event => this.registerEvent(em, owner, event, ef.fn, discardFunctions))
      } else {
        this.registerEvent(em, owner, ef.eventName, ef.fn, discardFunctions);
      }
    });
    this.unregisterFunction = (card: Card) => {
      if (card === this) {
        discardFunctions.forEach((fn) => fn(card));
        em.off(Events.DISCARDED, this.unregisterFunction);
      }
    };
    if (discardFunctions.length > 0) {
      em.on(Events.DISCARDED, this.unregisterFunction);
    }
  }
  registerEvent(
    em: EventEmitter,
    owner: Player,
    eventName: Events,
    func: (em: EventEmitter, owner: Player, card: Card) => (...args: any) => void,
    discardFunctions: Function[]
  ) {
    const fn = func(em, owner, this);
        const discarded = (card: Card) => {
            if(this === card){
                    em.off(eventName, fn);
            };
        }
        discardFunctions.push(discarded);

        em.prependListener(eventName, fn);
  }

  /*private registerEvent(em: EventEmitter, newOwner: Player, effectName: Event, fn:typeof EventEffectMap.fn){
        
    }*/

  toAnonymousJson() {
    return {
      uid: this.uid,
    };
  }
  toJson() {
    return {
      name: this.name,
      uid: this.uid,
      type: this.type,
      text: this.text,
      slug: this.slug,
    };
  }
}

module.exports.Card = Card;
