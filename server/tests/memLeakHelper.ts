import EventEmitter from "events";
import { Events } from "../src/GameModules/Events";
import { Player } from "../src/GameModules/Player";

export const ZERO_SUM_LISTERENS: any = {
    addAction: 1,
    REMOVE_EXPECTED_ACTION: 1,
    PUSH_TO_CHAIN: 1,
    DISCARD_FROM_CHAIN_IF_EXISTS: 1,
    resolve: 1,
    BEFORE_RESOLVE_CHAIN: 1,
    ON_PLAYER_ACTION: 1,
    TURN_START: 1,
    AFTER_DESTROY: 1,
    AFTER_SACRIFICE: 1,
    FORCE_END_TURN: 1,
    cardPlayed: 1,
    afterCardPlayed: 1,
    REMOVE_FROM_DISCARD: 1,
    CHANGE_HAND_VISIBILITY: 2,
    SACRIFICE: 2,
    destroyed: 2,
    cardDiscard: 2,
    AFTER_CARD_RESOLVED: 2,
    FAILED_CHECK_PRECONDITION: 1
  };

export function checkForListenersMemLeak(players: Array<Player>, em: EventEmitter) {
    let listenersCount = em
      .eventNames()
      .map((eventName) => ({ [eventName]: em.listenerCount(eventName) }))
      .reduce((r, c) => Object.assign(r, c), {});
    const expectedListeners = { ...ZERO_SUM_LISTERENS };
    //calculate expected event number starting with base (empty game):
    players.forEach((player) =>
      player.hand
        .concat(player.stable.unicorns)
        .concat(player.stable.upgrades)
        .concat(player.stable.downgrades)
        .forEach((card) => {
          //every card in hand with an effect has a discarded event as well
          expectedListeners[Events.DISCARDED] += card.effects.length > 0 ? 1 : 0;
          card.effects.forEach((e) => {
            if(!Array.isArray(e.eventName)){
              expectedListeners[e.eventName]
                ? expectedListeners[e.eventName]++
                : (expectedListeners[e.eventName] = 1);
            }else{
              e.eventName.forEach(event => expectedListeners[event]
                ? expectedListeners[event]++
                : (expectedListeners[event] = 1))
            }
          });
        })
    );
    //console.log(em.listeners(Events.REMOVE_EXPECTED_ACTION).map(l => l.toString() + '---------------------------------------------'));
    Object.keys(listenersCount).forEach((key) =>
      expect({ [key]: listenersCount[key] }).toEqual({
        [key]: expectedListeners[key],
      })
    );
  }