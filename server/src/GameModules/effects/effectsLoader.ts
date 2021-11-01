import EventEmitter from "events";
import { Card } from "../Card";
import { Events } from "../Events" 
import { Player } from "../Player";
import ExpectedAction from "../Actions/ExpectedActions";
export interface EventEffectMap {
    eventName: Events;
    fn: (em: EventEmitter, owner: Player, card: Card) => (...args : any) => void;
}

const cardEventMap = new Map<string, Array<EventEffectMap>>();
cardEventMap.set('neigh', 
    [
        {
            eventName: Events.AFTER_CARD_RESOLVED,
            fn: (em: EventEmitter, owner: Player, thisCard: Card) => (card: Card) => 
                thisCard === card && em.emit(Events.DISCARDED, card)
            
        },
        {
            eventName: Events.BEFORE_CARD_RESOLVE,
            fn: (em: EventEmitter, owner: Player, thisCard: Card) => (card: Card) => {
                if(thisCard !== card){
                    return;
                }
                em.emit(Events.DISCARD_FROM_CHAIN_IF_EXISTS, thisCard, 1);
            }
        },
        {
            eventName: Events.BEFORE_CARD_PLAYED,
            fn: (em: EventEmitter, owner: Player, thisCard: Card) => (card: Card, player: Player, area: string, targetedPlayer?: Player ) => {
                if(player!== owner && owner.hand.includes(thisCard)){
                    em.emit(Events.ADD_GAME_ACTION, 'neigh', owner, true, thisCard)
                    em.once(Events.ON_PLAYER_ACTION, (action: ExpectedAction, choice: string, byPlayer: Player) => {
                        if(action.action !== 'neigh' || byPlayer !== owner || action.initiator !== thisCard){
                            return;
                        }
                        em.emit(Events.REMOVE_EXPECTED_ACTION, action.action, byPlayer); //player made decision, no need for action anymore
                        if(choice === 'yes'){
                            em.emit(Events.PUSH_TO_CHAIN, thisCard);
                            byPlayer.removeCardFromHand(thisCard);
                            em.emit(Events.CARD_PLAYED, thisCard, byPlayer, 'play');
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
                const activateEffect = (action: ExpectedAction, choice: string, byPlayer: Player) => {
                    if(action.action != initiatingCard.uid){
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
                const onEffectDisabled = (initiator: Card) => {
                    em.emit(Events.REMOVE_EXPECTED_ACTION, initiatingCard.uid, owner)
                    if(initiatingCard === initiatingCard){
                        em.off(Events.TURN_START, disableEffect);
                        em.off(Events.ON_PLAYER_ACTION, activateEffect);
                        em.off(Events.ON_PLAYER_ACTION, activateEffect);
                        em.off(Events.EFFECT_DISABLED, onEffectDisabled);
                    }
                }
                em.on(Events.EFFECT_DISABLED, onEffectDisabled);
                em.on(Events.TURN_START, disableEffect);
                em.on(Events.ON_PLAYER_ACTION, activateEffect);
            }
        }
    ]);

    cardEventMap.set('twoforone', [
        {
            eventName: Events.BEFORE_CARD_RESOLVE,
            fn: (em: EventEmitter, owner: Player, initiatingCard: Card) => (card: Card) => {
                if(initiatingCard !== card){
                    return;
                }
                em.emit(Events.ADD_GAME_ACTION, 'sacrifice', owner, true, initiatingCard);
                const onSecondDestroy = (target: string, destroyerCard: Card) =>{
                    if(destroyerCard === initiatingCard){
                        em.emit(Events.CARD_RESOLVED, initiatingCard, owner);
                    }else{
                        em.once(Events.AFTER_DESTROY, onSecondDestroy);
                    }
                }
                const onFirstDestroy = (target: string, destroyerCard: Card) =>{
                    if(destroyerCard === initiatingCard){
                        em.emit(Events.ADD_GAME_ACTION, 'destroy', owner, true, initiatingCard);
                        em.once(Events.AFTER_DESTROY, onSecondDestroy);
                    }else{
                        em.once(Events.AFTER_DESTROY, onFirstDestroy);
                    }
                }
                const onSacrifice = (target: string, destroyerCard: Card) => {
                    if(destroyerCard === initiatingCard){
                        em.emit(Events.REMOVE_EXPECTED_ACTION, 'sacrifice', owner)
                        em.emit(Events.ADD_GAME_ACTION, 'destroy', owner, true, initiatingCard);
                        em.once(Events.AFTER_DESTROY, onFirstDestroy);
                        em.off(Events.SACRIFICE, onSacrifice);
                    }
                }
                const onEffectDisabled = (initiator?: Card) => {
                    if(initiator && initiator === initiatingCard){
                        em.off(Events.SACRIFICE, onSacrifice)
                        em.off(Events.EFFECT_DISABLED, onEffectDisabled);
                        em.off(Events.AFTER_DESTROY, onSecondDestroy);
                        em.off(Events.AFTER_DESTROY, onFirstDestroy);
                        em.emit(Events.CARD_RESOLVED, initiatingCard, owner);
                    }
                };
                em.on(Events.EFFECT_DISABLED, onEffectDisabled);
                em.on(Events.SACRIFICE, onSacrifice);
            }
    }]);

    cardEventMap.set('blatantthievery', [
        {
            eventName: Events.BEFORE_CARD_RESOLVE,
            fn: (em: EventEmitter, owner: Player, thisCard: Card) => (card: Card) => {
                if(thisCard !== card){
                    return;
                }

                em.emit(Events.ADD_GAME_ACTION, 'hand_select', owner, true, thisCard);
                const onPlayerSelected = (action: string, player: Player, initiatingCard: Card, choice: string) => {
                    if(initiatingCard === thisCard && action === 'hand_select'){
                        em.emit(Events.ADD_GAME_ACTION, 'hand_card_select', owner, true, thisCard, choice);
                    }else{
                        em.once(Events.REMOVE_EXPECTED_ACTION, onPlayerSelected);
                    }
                };
                em.once(Events.REMOVE_EXPECTED_ACTION, onPlayerSelected);

                const onEffectDisabled = (initiator?: Card) => {
                    if(initiator && initiator === thisCard){
                        em.off(Events.PLAYER_SELECTED, onPlayerSelected);
                        em.on(Events.EFFECT_DISABLED, onEffectDisabled);
                        em.emit(Events.CARD_RESOLVED, thisCard, owner);

                    }
                };
                em.on(Events.EFFECT_DISABLED, onEffectDisabled);
            }
        }
    ]);

    /*1. When this card enters your Stable, you may choose any player.
            That player must DISCARD a card.
      2. If this card is sacrificed or destroyed, return it to your hand.

*/
    cardEventMap.set('annoying', [
        {
            eventName: Events.ENTERED_STABLE,
            fn: (em: EventEmitter, owner: Player, thisCard: Card) => (card: Card, stableOwner: Player) => {
                if(card !== thisCard){
                    return;
                }
                //add action to select a player
                //after player was selected make selected player to discard a card 

            }
        },
        {
            eventName: Events.DESTROYED,
            fn: (em: EventEmitter, owner: Player, thisCard: Card) => (card: Card, stableOwner: Player) => {
                if(thisCard !== card){
                    return;
                }
                sendBackToHand(card, stableOwner)

            }
        },
        {
            eventName: Events.SACRIFICE,
            fn: (em: EventEmitter, owner: Player, thisCard: Card) => (card: Card, stableOwner: Player) => {
                if(thisCard !== card){
                    return;
                }
                sendBackToHand(card, stableOwner);
            }
        }
    ]);

const sendBackToHand = (card: Card, handOwner: Player) => {
    handOwner.hand.push(card);
    //make sure to remove card from previous container (discard?)
}

export function loadCardEffects(cardSlug: string) : Array<EventEffectMap>{
    return cardEventMap.get(cardSlug) ?? [];
}