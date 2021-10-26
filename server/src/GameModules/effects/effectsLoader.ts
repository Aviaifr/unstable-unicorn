import EventEmitter from "events";
import { Card } from "../Card";
import { Events } from "../Events" 
import { Player } from "../Player";

export interface EventEffectMap {
    eventName: Events;
    fn: (em: EventEmitter, owner: Player, card: Card) => (...args : any) => void;
}

const cardEventMap = new Map<string, Array<EventEffectMap>>();
cardEventMap.set('neigh', 
    [
        {
            eventName: Events.CARD_PLAYED,
            fn: (em: EventEmitter, owner: Player, initiatingCard: Card) => (card: Card, player: Player, area: string, targetedPlayer?: Player ) => {
                if(player!== owner){
                    em.emit(Events.ADD_GAME_ACTION, 'neigh', owner)
                    em.once(Events.ON_PLAYER_ACTION, (action: string, choice: string, byPlayer: Player) => {
                        if(action !== 'neigh'){
                            return;
                        }
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

    cardEventMap.set('rhinocorn', [
        {
            eventName: Events.BEFORE_TURN_START,
            fn: (em: EventEmitter, owner: Player, initiatingCard: Card) => (turnPlayer: Player) => {
                if(turnPlayer != owner || !owner.stable.unicorns.find(card => card === initiatingCard)){
                    return;
                }
                em.emit(Events.ADD_GAME_ACTION, initiatingCard.uid, owner);
                const activateEffect =(action: string, choice: string, byPlayer: Player) => {
                    if(action != initiatingCard.uid){
                        return;
                    }
                    em.off(Events.ON_PLAYER_ACTION, activateEffect);
                    em.emit(Events.REMOVE_EXPECTED_ACTION, action, byPlayer);
                    em.emit(Events.ADD_GAME_ACTION, 'destroy', owner, true, initiatingCard);
                    const onDestroy = (target: string, destroyerCard: Card) =>{
                        if(destroyerCard === initiatingCard){
                            em.off(Events.DESTROYED, onDestroy);
                        }
                    }
                    const onAfterDestroyed = (destroyedCard: Card, byCard?: Card) => {
                        if(initiatingCard === byCard){
                            em.emit(Events.FORCE_END_TURN);
                            em.off(Events.AFTER_DESTROY, onAfterDestroyed)
                        }
                    };
                    em.on(Events.AFTER_DESTROY, onAfterDestroyed)
                    em.on(Events.DESTROYED, onDestroy);
                };
                const disableEffect = () => {
                    em.emit(Events.REMOVE_EXPECTED_ACTION, initiatingCard.uid, owner);
                    em.off(Events.TURN_START, disableEffect);
                }
                em.on(Events.TURN_START, disableEffect);
                em.on(Events.ON_PLAYER_ACTION, activateEffect);
            }
        }
    ]);

export function loadCardEffects(cardSlug: string) : Array<EventEffectMap>{
    return cardEventMap.get(cardSlug) ?? [];
}