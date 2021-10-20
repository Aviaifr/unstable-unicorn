import EventEmitter from "events";
import { Card } from "../Card";
import { Events } from "../Events" 
import { Player } from "../Player";

export interface EventEffectMap {
    eventName: Events;
    fn: (em: EventEmitter, owner: Player) => (...args : any) => void;
}

const cardEventMap = new Map<string, Array<EventEffectMap>>();
cardEventMap.set('neigh', 
    [
        {
            eventName: Events.CARD_PLAYED,
            fn: (em: EventEmitter, owner: Player) => (card: Card, player: Player, area: string, targetedPlayer?: Player ) => {
                if(player!== owner){
                    em.emit(Events.ADD_GAME_ACTION, 'neigh', owner)
                    em.once(Events.ON_PLAYER_ACTION, (action: string, choice: string, byPlayer: Player) => {
                        em.emit(Events.REMOVE_EXPECTED_ACTION, action, byPlayer);
                        if(choice === 'yes'){
                            const card = byPlayer.hand.find(card => card.slug === 'neigh');
                            if(card){
                                em.emit(Events.PUSH_TO_CHAIN, card);
                                byPlayer.removeCardFromHand(card);
                                em.emit(Events.CARD_PLAYED, card, byPlayer, 'play');
                                em.emit(Events.DISCARDED, card)
                                em.once(Events.RESOLVE_CHAIN, () => {
                                    em.emit(Events.DISCARD_FROM_CHAIN_IF_EXISTS, card, 2);
                                })
                                em.emit(Events.BEFORE_RESOLVE_CHAIN);
                            }
                        }else{
                            em.emit(Events.RESOLVE_CHAIN);
                        }
                    })
                }
            }
        }   
    ]);

export function loadCardEffects(cardSlug: string) : Array<EventEffectMap>{
    return cardEventMap.get(cardSlug) ?? [];
}