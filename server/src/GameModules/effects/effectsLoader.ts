import EventEmitter from "events";
import { Card } from "../Card";
import { Events } from "../Events";
import { Player } from "../Player";
import ExpectedAction from "../Actions/ExpectedActions";
export interface EventEffectMap {
  eventName: Events | Array<Events>;
  fn: (em: EventEmitter, owner: Player, card: Card) => (...args: any) => void;
}

const cardEventMap = new Map<string, Array<EventEffectMap>>();
cardEventMap.set("neigh", [
  {
    eventName: Events.AFTER_CARD_RESOLVED,
    fn: (em: EventEmitter, owner: Player, thisCard: Card) => {
      const fn = (card: Card) => {
        if (thisCard === card) {
          em.emit(Events.DISCARDED, card);
          em.off(Events.AFTER_CARD_RESOLVED, fn);
        }
      };
      return fn;
    },
  },
  {
    eventName: Events.BEFORE_CARD_RESOLVE,
    fn: (em: EventEmitter, owner: Player, thisCard: Card) => (card: Card) => {
      if (thisCard !== card) {
        return;
      }
      em.emit(Events.DISCARD_FROM_CHAIN_IF_EXISTS, thisCard, 1);
    },
  },
  {
    eventName: Events.BEFORE_CARD_PLAYED,
    fn:
      (em: EventEmitter, owner: Player, thisCard: Card) =>
      (card: Card, player: Player, area: string, targetedPlayer?: Player) => {
        if (
          player !== owner &&
          owner.hand.includes(thisCard) &&
          player.IsNeighable()
        ) {
          em.emit(Events.ADD_GAME_ACTION, "neigh", owner, true, thisCard);
          em.once(
            Events.ON_PLAYER_ACTION,
            (action: ExpectedAction, choice: string, byPlayer: Player) => {
              if (
                action.action !== "neigh" ||
                byPlayer !== owner ||
                action.initiator !== thisCard
              ) {
                return;
              }
              em.emit(Events.REMOVE_EXPECTED_ACTION, action.action, byPlayer); //player made decision, no need for action anymore
              if (choice === "yes") {
                em.emit(Events.PUSH_TO_CHAIN, thisCard);
                byPlayer.removeCardFromHand(thisCard);
                em.emit(Events.CARD_PLAYED, thisCard, byPlayer, "play");
              }
            }
          );
        }
      },
  },
]);

cardEventMap.set("rhinocorn", [
  {
    eventName: Events.BEFORE_TURN_START,
    fn:
      (em: EventEmitter, owner: Player, initiatingCard: Card) =>
      (turnPlayer: Player) => {
        if (
          turnPlayer != owner ||
          !owner.stable.unicorns.find((card) => card === initiatingCard)
        ) {
          return;
        }
        em.emit(
          Events.ADD_GAME_ACTION,
          initiatingCard.uid,
          owner,
          false,
          initiatingCard
        );
      },
  },
  {
    eventName: Events.ON_PLAYER_ACTION,
    fn:
      (em: EventEmitter, owner: Player, initiatingCard: Card) =>
      (action: ExpectedAction, choice: string, byPlayer: Player) => {
        if (action.action != initiatingCard.uid) {
          return;
        }
        em.emit(Events.REMOVE_EXPECTED_ACTION, action, byPlayer);
        em.emit(Events.ADD_GAME_ACTION, "destroy", owner, true, initiatingCard);
      },
  },
  {
    eventName: Events.TURN_START,
    fn:
      (em: EventEmitter, owner: Player, initiatingCard: Card) =>
      (turnPlayer: Player) => {
        if (owner !== turnPlayer) {
          return;
        }
        em.emit(
          Events.REMOVE_EXPECTED_ACTION,
          initiatingCard.uid,
          owner,
          initiatingCard
        );
      },
  },
  {
    eventName: Events.AFTER_DESTROY,
    fn:
      (em: EventEmitter, owner: Player, thisCard: Card) =>
      (destroyedCard: Card, destroyedOwner: Player, byCard?: Card) => {
        if (byCard === thisCard) {
          em.emit(Events.FORCE_END_TURN);
        }
      },
  },
  {
    eventName: Events.EFFECT_DISABLED,
    fn:
      (em: EventEmitter, owner: Player, thisCard: Card) =>
      (initiator: Card) => {
        if (thisCard === initiator) {
          em.emit(Events.REMOVE_EXPECTED_ACTION, thisCard.uid, owner, thisCard);
        }
      },
  },
]);

cardEventMap.set("twoforone", [
  {
    eventName: Events.BEFORE_CARD_RESOLVE,
    fn:
      (em: EventEmitter, owner: Player, initiatingCard: Card) =>
      (card: Card) => {
        if (
          initiatingCard !== card ||
          owner.stable.getCardsByType("all").length === 0
        ) {
          em.emit(Events.CARD_RESOLVED, initiatingCard, owner);
          em.emit(Events.DISCARDED, initiatingCard);
          return;
        }
        em.emit(
          Events.ADD_GAME_ACTION,
          "sacrifice",
          owner,
          true,
          initiatingCard
        );
        const onSecondDestroy = (
          target: string,
          destroyedOwner: Player,
          destroyerCard: Card
        ) => {
          if (destroyerCard === initiatingCard) {
            em.emit(Events.CARD_RESOLVED, initiatingCard, owner);
            em.emit(Events.DISCARDED, initiatingCard);
          } else {
            em.once(Events.AFTER_DESTROY, onSecondDestroy);
          }
        };
        const onFirstDestroy = (
          target: string,
          destroyedOwner: Player,
          destroyerCard: Card
        ) => {
          if (destroyerCard === initiatingCard) {
            if (destroyedOwner.stable.getCardsByType("all").length === 0) {
              em.emit(Events.CARD_RESOLVED, initiatingCard, owner);
              em.emit(Events.DISCARDED, initiatingCard);
              return;
            }
            em.emit(
              Events.ADD_GAME_ACTION,
              "destroy",
              owner,
              true,
              initiatingCard
            );
            em.once(Events.AFTER_DESTROY, onSecondDestroy);
          } else {
            em.once(Events.AFTER_DESTROY, onFirstDestroy);
          }
        };
        const onSacrifice = (target: string, destroyerCard: Card) => {
          if (destroyerCard === initiatingCard) {
            em.emit(Events.REMOVE_EXPECTED_ACTION, "sacrifice", owner);
            em.emit(
              Events.ADD_GAME_ACTION,
              "destroy",
              owner,
              true,
              initiatingCard
            );
            em.once(Events.AFTER_DESTROY, onFirstDestroy);
            em.off(Events.SACRIFICE, onSacrifice);
          }
        };
        const onEffectDisabled = (initiator?: Card) => {
          if (initiator && initiator === initiatingCard) {
            em.off(Events.SACRIFICE, onSacrifice);
            em.off(Events.EFFECT_DISABLED, onEffectDisabled);
            em.off(Events.AFTER_DESTROY, onSecondDestroy);
            em.off(Events.AFTER_DESTROY, onFirstDestroy);
            em.emit(Events.CARD_RESOLVED, initiatingCard, owner);
            em.off(Events.DISCARDED, onEffectDisabled);
          }
        };
        em.on(Events.EFFECT_DISABLED, onEffectDisabled);
        em.on(Events.DISCARDED, onEffectDisabled);
        em.on(Events.SACRIFICE, onSacrifice);
      },
  },
]);

cardEventMap.set("blatantthievery", [
  {
    eventName: Events.BEFORE_CARD_RESOLVE,
    fn: (em: EventEmitter, owner: Player, thisCard: Card) => (card: Card) => {
      if (thisCard !== card) {
        return;
      }

      em.emit(Events.ADD_GAME_ACTION, "hand_select", owner, true, thisCard);
    },
  },
  {
    eventName: Events.REMOVE_EXPECTED_ACTION,
    fn:
      (em: EventEmitter, owner: Player, thisCard: Card) =>
      (
        action: string,
        player: Player,
        initiatingCard: Card,
        choice: string
      ) => {
        if (initiatingCard === thisCard && action === "hand_select") {
          em.emit(
            Events.ADD_GAME_ACTION,
            "hand_card_select",
            owner,
            false,
            thisCard,
            choice
          );
        }
      },
  },
  {
    eventName: Events.REMOVE_EXPECTED_ACTION,
    fn:
      (em: EventEmitter, owner: Player, thisCard: Card) =>
      (
        action: string,
        player: Player,
        initiatingCard: Card,
        choice: string
      ) => {
        if (initiatingCard === thisCard && action === "steal") {
          em.emit(Events.DISCARDED, thisCard);
        }
      },
  },
]);

cardEventMap.set("annoying", [
  {
    eventName: Events.ENTERED_STABLE,
    fn:
      (em: EventEmitter, owner: Player, thisCard: Card) =>
      (card: Card, stableOwner: Player) => {
        if (card !== thisCard) {
          return;
        }
        em.emit(Events.ADD_GAME_ACTION, "hand_select", owner, true, thisCard);
      },
  },
  {
    eventName: Events.REMOVE_EXPECTED_ACTION,
    fn:
      (em: EventEmitter, owner: Player, thisCard: Card) =>
      (
        action: string,
        player: Player,
        initiatingCard: Card,
        choice: string
      ) => {
        if (initiatingCard === thisCard && action === "hand_select") {
          em.emit(
            Events.ADD_GAME_ACTION,
            "player_discard",
            owner,
            false,
            thisCard,
            choice
          );
        }
      },
  },
  {
    eventName: Events.AFTER_DESTROY,
    fn:
      (em: EventEmitter, owner: Player, thisCard: Card) =>
      (card: Card, stableOwner: Player, initiatingCard: Card) => {
        if (thisCard !== card) {
          return;
        }
        stableOwner.hand.push(card);
        em.emit(Events.REMOVE_FROM_DISCARD, card);
      },
  },
  {
    eventName: Events.AFTER_SACRIFICE,
    fn:
      (em: EventEmitter, owner: Player, thisCard: Card) =>
      (card: Card, stableOwner: Player, initiatingCard: Card) => {
        if (thisCard !== card) {
          return;
        }
        stableOwner.hand.push(card);
        em.emit(Events.REMOVE_FROM_DISCARD, card);
      },
  },
]);

cardEventMap.set("unicornpoison", [
  {
    eventName: Events.BEFORE_CARD_RESOLVE,
    fn: (em: EventEmitter, owner: Player, thisCard: Card) => (card: Card) => {
      if (card === thisCard) {
        em.emit(
          Events.ADD_GAME_ACTION,
          "destroy",
          owner,
          true,
          thisCard,
          "unicorn"
        );
        em.emit(Events.DISCARDED, thisCard);
      }
    },
  },
]);

cardEventMap.set("yay", [
  {
    eventName: Events.BEFORE_CARD_RESOLVE,
    fn: (em: EventEmitter, owner: Player, thisCard: Card) => (card: Card) => {
      if (card === thisCard) {
        owner.setIsNeigable(false, thisCard.uid);
      }
    },
  },
  {
    eventName: Events.GAME_LOADED,
    fn: (em: EventEmitter, owner: Player, thisCard: Card) => () => {
      if (
        owner.stable
          .getCardsByType("all")
          .map((c) => c.slug)
          .includes("yay")
      ) {
        owner.setIsNeigable(false, thisCard.uid);
      }
    },
  },
  {
      eventName: [Events.EFFECT_DISABLED, Events.DESTROYED, Events.SACRIFICE],
      fn: (em: EventEmitter, owner: Player, thisCard: Card) => (target: string, destroyer: Card) => {
          if(target === thisCard.uid){
              owner.setIsNeigable(true, thisCard.uid)
          }
      }
  },
  {
    eventName: [Events.AFTER_DESTROY, Events.AFTER_SACRIFICE],
    fn: (em: EventEmitter, owner: Player, thisCard: Card) => (destroyedCard: Card) => {
      if(thisCard === destroyedCard){
        em.emit(Events.DISCARDED, thisCard);
      }
    }
    
  }
]);

//Trade a Unicorn in your Stable for a Unicorn in any player’s Stable.
cardEventMap.set("unicornswap", [
  {
    eventName: Events.BEFORE_CARD_RESOLVE,
    fn: (em: EventEmitter, owner: Player, thisCard: Card) => (card: Card) => {
      if (card === thisCard) {
        em.emit(Events.ADD_GAME_ACTION, "hand_select", owner, true, thisCard);
      }
    },
  },
  {
    eventName: Events.REMOVE_EXPECTED_ACTION,
    fn:
      (em: EventEmitter, owner: Player, thisCard: Card) =>
      (
        actionToRemove: string,
        player: Player,
        initiatingCard?: Card,
        choice?: string
      ) => {
        if (thisCard !== initiatingCard || !["hand_select", "give"]) {
          //if owner cannot give a unicorn - do not use
          return;
        }
        if (
          actionToRemove === "hand_select" &&
          owner.stable.getCardsByType("unicorn").length !== 0
        ) {
          em.emit(
            Events.ADD_GAME_ACTION,
            "give",
            owner,
            true,
            thisCard,
            choice
          );
          em.emit(
            Events.ADD_GAME_ACTION,
            "snatch",
            owner,
            true,
            thisCard,
            choice
          );
        } else {
          em.emit(Events.DISCARDED, thisCard);
        }
      },
  },
]);

cardEventMap.set("extratail", [
    {
      eventName: Events.CHECK_PRECONDITION,
      fn: (em: EventEmitter, owner: Player, thisCard: Card) => (card: Card, otherPlayers : Array<Player>) => {
        if (card === thisCard && owner.stable.getCardsByType('basic', true).length === 0) {
            em.emit(Events.FAILED_CHECK_PRECONDITION, thisCard, 'No basic unicorn in stable');
        }
      },
    },
    {
      eventName: Events.TURN_START,
      fn:
        (em: EventEmitter, owner: Player, thisCard: Card) =>
        (turnPlayer: Player) => {
          if (owner === turnPlayer && owner.stable.findInStable(thisCard.uid)) {
            em.emit(
              Events.ADD_GAME_ACTION,
              "draw",
              owner,
              false,
              thisCard
            );
          } 
        },
    },
]);

cardEventMap.set("unfairbargain", [
  
  {
    eventName: Events.BEFORE_CARD_RESOLVE,
    fn: (em: EventEmitter, owner: Player, thisCard: Card) => (card: Card, otherPlayers : Array<Player>) => {
      if (card === thisCard && owner.stable.getCardsByType('basic', true).length === 0) {
        em.emit(Events.ADD_GAME_ACTION, "hand_select", owner, true, thisCard);
      }
    },
  },
  {
    eventName: Events.REMOVE_EXPECTED_ACTION,
    fn:
      (em: EventEmitter, owner: Player, thisCard: Card) =>
      (
        action: string,
        player: Player,
        initiatingCard: Card,
        choice: string
      ) => {
        if(thisCard === initiatingCard && action === 'hand_select'){
          em.emit(Events.ADD_GAME_ACTION, 'swap_hands', player, false, thisCard, choice);
          em.emit(Events.DISCARDED, thisCard);
        }
      }
    }
  
]);

cardEventMap.set("targeteddestruction", [

  {
    eventName: Events.BEFORE_CARD_RESOLVE,
    fn: (em: EventEmitter, owner: Player, thisCard: Card) => (card: Card, otherPlayers : Array<Player>) => {
      if (card === thisCard) {
        em.emit(Events.ADD_GAME_ACTION, "destroy", owner, true, thisCard, 'upgrade,downgrade;true');
        em.emit(Events.DISCARDED, thisCard);
      }
    },
  },
]);

cardEventMap.set("slowdown", [
  {
    eventName: Events.BEFORE_CARD_RESOLVE,
    fn: (em: EventEmitter, owner: Player, thisCard: Card) => (card: Card) => {
      if (card === thisCard) {
        owner.setCanUseInstant(false, thisCard.uid);
      }
    },
  },
  {
    eventName: Events.GAME_LOADED,
    fn: (em: EventEmitter, owner: Player, thisCard: Card) => () => {
      if (
        owner.stable
          .getCardsByType("all")
          .map((c) => c.slug)
          .includes("slowdown")
      ) {
        owner.setCanUseInstant(false, thisCard.uid);
      }
    },
  },
  {
      eventName: [Events.EFFECT_DISABLED, Events.DESTROYED, Events.SACRIFICE],
      fn: (em: EventEmitter, owner: Player, thisCard: Card) => (target: string, destroyer: Card) => {
          if(target === thisCard.uid){
              owner.setCanUseInstant(true, thisCard.uid)
          }
      }
  },
  {
    eventName: [Events.AFTER_DESTROY, Events.AFTER_SACRIFICE],
    fn: (em: EventEmitter, owner: Player, thisCard: Card) => (destroyedCard: Card) => {
      if(thisCard === destroyedCard){
        em.emit(Events.DISCARDED, thisCard);
      }
    }
    
  }
]);

cardEventMap.set("barbedwire", [
  {
    eventName: [Events.DESTROYED, Events.SACRIFICE],
    fn: (em: EventEmitter, owner: Player, thisCard: Card) => (target: string, destroyer: Card) => {
      const destroyedCard = owner.stable.findInStable(target)
      if(destroyedCard && owner.stable.findInStable(thisCard.uid) && destroyedCard.baseType === 'unicorn'){
          em.emit(Events.ADD_GAME_ACTION, 'discard', owner, true, thisCard)
      }
    },
  },
  {
    eventName: [Events.AFTER_DESTROY, Events.AFTER_SACRIFICE],
    fn: (em: EventEmitter, owner: Player, thisCard: Card) => (destroyedCard: Card) => {
      if(thisCard === destroyedCard){
        em.emit(Events.DISCARDED, thisCard);
      }
    }
    
  }
]);

cardEventMap.set("blackknight", [
  {
    eventName: Events.BEFORE_DESTROY,
    fn: (em: EventEmitter, owner: Player, thisCard: Card) => (target: string, destroyinPlayer:Player, destroyer: Card) => {
      const destroyedCard = owner.stable.findInStable(target)
      if(destroyedCard && owner.stable.findInStable(thisCard.uid) && destroyedCard.baseType === 'unicorn'){
          em.emit(Events.REMOVE_EXPECTED_ACTION, 'destroy', destroyinPlayer);
          em.emit(Events.ADD_GAME_ACTION, thisCard.uid, owner, true, thisCard, target)
      }
    },
  },
  {
    eventName: Events.ON_PLAYER_ACTION,
    fn:
      (em: EventEmitter, owner: Player, thisCard: Card) =>
      (action: ExpectedAction, choice: string, byPlayer: Player) => {
        if (action.action != thisCard.uid) {
          return;
        }
        if(choice === 'yes'){
          em.emit(Events.SACRIFICE, thisCard.uid, thisCard); 
          em.emit(Events.DISCARDED, thisCard);
        }else{
          action.data && action.data[0] && em.emit(Events.DESTROYED, action.data[0], thisCard);
        }
      },
    }
]);

export function loadCardEffects(cardSlug: string): Array<EventEffectMap> {
  return cardEventMap.get(cardSlug) ?? [];
}
