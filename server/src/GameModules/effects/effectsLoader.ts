import EventEmitter from "events";
import { Card } from "../Card";
import { Events } from "../Events";
import { Player } from "../Player";
import ExpectedAction from "../Actions/ExpectedActions";
import { rm } from "fs";
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
          && owner.canUseInstant()
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
        em.emit(Events.REMOVE_EXPECTED_ACTION, 'draw', byPlayer);
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
    {
      eventName: Events.AFTER_CARD_PLAYED,
      fn: (em: EventEmitter, owner: Player, thisCard: Card) => () =>{
        em.emit(Events.REMOVE_EXPECTED_ACTION, 'draw', owner);
      }
    }
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

cardEventMap.set("majesticflying", [
  {
    eventName: Events.ENTERED_STABLE,
    fn:
      (em: EventEmitter, owner: Player, thisCard: Card) =>
      (card: Card, stableOwner: Player) => {
        if (card !== thisCard) {
          return;
        }
        em.emit(Events.ADD_GAME_ACTION, thisCard.uid, owner, true, thisCard);
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
        if (initiatingCard === thisCard && action === thisCard.uid && choice == 'yes') {
          em.emit(
            Events.ADD_GAME_ACTION,
            "choose_discard",
            owner,
            false,
            thisCard,
            'unicorn'
          );
        }
      },
  },
  {
    eventName: [Events.AFTER_DESTROY, Events.AFTER_SACRIFICE],
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

cardEventMap.set("rainbowaura", [
  {
    eventName: Events.BEFORE_DESTROY,
    fn: (em: EventEmitter, owner: Player, thisCard: Card) => (target: string, destroyinPlayer:Player, destroyer: Card) => {
      const destroyedCard = owner.stable.findInStable(target)
      if(destroyedCard && owner.stable.findInStable(thisCard.uid) && destroyedCard.baseType === 'unicorn'){
          em.emit(Events.REMOVE_EXPECTED_ACTION, 'destroy', destroyinPlayer);
      }
    },
  },
]);
//Events.CHECK_PRECONDITION, card, this.players.filter(p => p !== this.currentPlayer));

cardEventMap.set("queenbee", [
  {
    eventName: Events.CHECK_PRECONDITION,
    fn: (em: EventEmitter, owner: Player, thisCard: Card) => (playedCard: Card, otherPlayers: Array<Player>, destroyer: Card) => {
      if(!owner.hand.includes(playedCard)){
        em.emit(Events.FAILED_CHECK_PRECONDITION, thisCard, 'Queen Bee effect');
      }
    },
  },
]);
cardEventMap.set("extremelydestructive", [
  {
    eventName: Events.ENTERED_STABLE,
    fn:
      (em: EventEmitter, owner: Player, thisCard: Card) =>
      (card: Card, stableOwner: Player) => {
        if (card === thisCard) {
          em.emit(Events.ADD_GAME_ACTION, 'sacrifice', owner, true, thisCard, 'all');
        }
      },
  },
  {
    eventName: Events.AFTER_SACRIFICE,
    fn :(em: EventEmitter, owner: Player, thisCard: Card) =>
      (card: Card, stableOwner: Player, initiatingCard: Card) => {
        if(initiatingCard === thisCard){
          em.emit(Events.REMOVE_EXPECTED_ACTION, 'sacrifice', stableOwner, thisCard);
          if(card === thisCard){
            em.once(Events.BEFORE_TURN_END, (turnPlayer: Player) => {
              em.emit(Events.DISCARDED, thisCard);
            })
          }
        }
      }
  },
  {
    eventName: [Events.AFTER_SACRIFICE, Events.AFTER_DESTROY],
    fn :(em: EventEmitter, owner: Player, thisCard: Card)=>
      (card: Card, stableOwner: Player, initiatingCard: Card) => {
        if(card === thisCard && thisCard !== initiatingCard){
          em.emit(Events.DISCARDED, thisCard);
        }
    }
  }
]);

cardEventMap.set("americorn", [
  {
    eventName: Events.ENTERED_STABLE,
    fn:
      (em: EventEmitter, owner: Player, thisCard: Card) =>
      (card: Card, stableOwner: Player) => {
        if (card === thisCard) {
          em.emit(Events.ADD_GAME_ACTION, 'steal_card', owner, true, thisCard);
        }
      },
  },
]);

cardEventMap.set("extremelyfertile", [
  {
    eventName: Events.BEFORE_TURN_START,
    fn:
      (em: EventEmitter, owner: Player, initiatingCard: Card) =>
      (turnPlayer: Player) => {
        if (
          turnPlayer != owner ||
          !owner.stable.unicorns.find((card) => card === initiatingCard) ||
          owner.hand.length === 0
        ) {
          return;
        }
        em.emit(
          Events.ADD_GAME_ACTION,
          initiatingCard.uid,
          owner,
          false,
          initiatingCard,
          owner.hand.map(c => c.uid).join(';')
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
        em.emit(Events.ADD_GAME_ACTION, "discard", owner, true, initiatingCard, action.data?.join(';'));
      },
  },
  {
    eventName: Events.REMOVE_EXPECTED_ACTION,
    fn: (em: EventEmitter, owner: Player, thisCard: Card) =>
      (actionToRemove: string, byPlayer: Player, initiatingCard?: Card) => {
        if(actionToRemove === 'discard' && initiatingCard === thisCard){
          em.emit(Events.REMOVE_EXPECTED_ACTION, 'discard', byPlayer);
          em.emit(Events.ADD_GAME_ACTION, 'add_baby',  owner, true, thisCard);
          em.emit(Events.REMOVE_EXPECTED_ACTION, 'add_baby',  owner, thisCard);
        }
      }
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
    eventName: [Events.AFTER_DESTROY, Events.AFTER_SACRIFICE],
    fn: (em: EventEmitter, owner: Player, thisCard: Card) =>
    (card: Card) => {
      card === thisCard && em.emit(Events.DISCARDED, thisCard);
    }
  }
  
]);

cardEventMap.set("glitterbomb", [
  {
    eventName: Events.BEFORE_TURN_START,
    fn:
      (em: EventEmitter, owner: Player, initiatingCard: Card) =>
      (turnPlayer: Player) => {
        if (
          turnPlayer != owner ||
          !owner.stable.upgrades.find((card) => card === initiatingCard) ||
          owner.hand.length === 0
        ) {
          return;
        }
        em.emit(
          Events.ADD_GAME_ACTION,
          initiatingCard.uid,
          owner,
          false,
          initiatingCard,
          owner.stable.getCardsByType('all').map(c => c.uid).join(';')
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
        em.emit(Events.ADD_GAME_ACTION, "sacrifice", owner, true, initiatingCard, action.data?.join(';'));
      },
  },
  {
    eventName: Events.AFTER_SACRIFICE,
    fn: (em: EventEmitter, owner: Player, thisCard: Card) =>
      ( sacrificedCard: Card, owner: Player, initiatingCard: Card) => {
        if(initiatingCard === thisCard){
          em.emit(Events.REMOVE_EXPECTED_ACTION, 'sacrifice',  owner, thisCard);
          em.emit(Events.ADD_GAME_ACTION, 'destroy',  owner, true, thisCard);
        }
      }
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
]);

cardEventMap.set("unicornonthecob", [
  {
    eventName: Events.ENTERED_STABLE,
    fn:
    (em: EventEmitter, owner: Player, thisCard: Card) =>
    (card: Card, stableOwner: Player) => {
        if (thisCard === card && owner === stableOwner){
          em.emit(
            Events.ADD_GAME_ACTION,
            'draw',
            owner,
            true,
            thisCard,
          );
          const on2ndDraw = (actionName: string, byPlayer: Player, initiatingCard: Card) => {
            if(actionName === 'draw' && byPlayer === owner && initiatingCard === thisCard){
              em.emit(
                Events.ADD_GAME_ACTION,
                'discard',
                owner,
                true,
                thisCard,
              );
            }else{
              em.once(Events.REMOVE_EXPECTED_ACTION, on2ndDraw);
            }
          }
          const onDraw = (actionName: string, byPlayer: Player, initiatingCard: Card) => {
              if(actionName === 'draw' && byPlayer === owner && initiatingCard === thisCard){
                em.emit(
                  Events.ADD_GAME_ACTION,
                  'draw',
                  owner,
                  true,
                  thisCard,
                );
                em.once(Events.REMOVE_EXPECTED_ACTION, on2ndDraw);
              }else{
                em.once(Events.REMOVE_EXPECTED_ACTION, onDraw);
              }
          }
          em.once(Events.REMOVE_EXPECTED_ACTION, onDraw);
        }
      },
    }
]);

cardEventMap.set("magicalkittencorn", [
  {
    eventName: Events.ENTERED_STABLE,
    fn:
    (em: EventEmitter, owner: Player, thisCard: Card) =>
    (card: Card, stableOwner: Player) => {
        if (thisCard === card && owner === stableOwner){
          !thisCard.isAffectedBy.has(thisCard.uid) &&
           thisCard.isAffectedBy.set(thisCard.uid, (initiator: Card) => initiator.baseType !== 'magic');
        }
    },
  },
  {
    eventName: Events.GAME_LOADED,
    fn:
    (em: EventEmitter, owner: Player, thisCard: Card) =>
    () => {
        if (owner.stable.findInStable(thisCard.uid)){
          !thisCard.isAffectedBy.has(thisCard.uid) &&
           thisCard.isAffectedBy.set(thisCard.uid, (initiator: Card) => initiator.baseType !== 'magic');
        }
    },
  },
  {
    eventName: [Events.AFTER_DESTROY, Events.AFTER_SACRIFICE],
    fn: (em: EventEmitter, owner: Player, thisCard: Card) =>
    (card: Card) => {
      thisCard.isAffectedBy.delete(thisCard.uid)
    }
  }
]);

cardEventMap.set("gooddeal", [
  {
    eventName: Events.REMOVE_EXPECTED_ACTION,
    fn: (em: EventEmitter, owner: Player, thisCard: Card) => 
    (actionName: string, byPlayer: Player, initiatingCard: Card) => {
      if(actionName === 'discard' && byPlayer === owner && initiatingCard === thisCard){
        em.emit(Events.DISCARDED, thisCard);
      }
    }
  },
  {
    eventName: Events.BEFORE_CARD_RESOLVE,
    fn: (em: EventEmitter, owner: Player, thisCard: Card) => (card: Card) => {
      let drawCount = 0;
        if (thisCard === card){
          em.emit(
            Events.ADD_GAME_ACTION,
            'draw',
            owner,
            true,
            thisCard,
          );
          const onDraw = (actionName: string, byPlayer: Player, initiatingCard: Card) => {
              if(actionName === 'draw' && byPlayer === owner && initiatingCard === thisCard){
                drawCount++;
                if(drawCount === 3){
                  em.emit(
                    Events.ADD_GAME_ACTION,
                    'discard',
                    owner,
                    true,
                    thisCard,
                  );
                  return;
                }
                em.emit(
                  Events.ADD_GAME_ACTION,
                  'draw',
                  owner,
                  true,
                  thisCard,
                );
              }
              em.once(Events.REMOVE_EXPECTED_ACTION, onDraw);
          }
          em.once(Events.REMOVE_EXPECTED_ACTION, onDraw);
        }
      },
    }
]);

cardEventMap.set("shabby", [
  {
    eventName: Events.ENTERED_STABLE,
    fn:
    (em: EventEmitter, owner: Player, thisCard: Card) =>
    (card: Card, stableOwner: Player) => {
        if (stableOwner == owner && card === thisCard) {
          em.emit(
            Events.ADD_GAME_ACTION,
            thisCard.uid,
            owner,
            false,
            thisCard
          );
        }
      },
  },
  {
    eventName: Events.ON_PLAYER_ACTION,
    fn:
      (em: EventEmitter, owner: Player, initiatingCard: Card) =>
      (action: ExpectedAction, choice: string, byPlayer: Player) => {
        if (action.action === initiatingCard.uid && choice === 'y') {
          em.emit(Events.REMOVE_EXPECTED_ACTION, action, byPlayer);
          em.emit(Events.ADD_GAME_ACTION, 'pick_from_deck', owner, true, initiatingCard, '{"type": "downgrade"}');
        }
      },
  },
]);

export function loadCardEffects(cardSlug: string): Array<EventEffectMap> {
  return cardEventMap.get(cardSlug) ?? [];
}
