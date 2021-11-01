import { TypedEmitter, ListenerSignature } from "tiny-typed-emitter";
import { Player } from "./Player";
import { Card } from "./Card";
import { cardList, CardDescriptor } from "./cardLists";
import { generateUID, shuffleArray } from "../utils";
import { IGame } from "../DB/Schema/game";
import { Events } from "./Events";
import ExpectedAction from "./Actions/ExpectedActions";
import { resolve } from "path/posix";

const INITIAL_HAND_SIZE = 5;

interface MyClassEvents {
  [Events.CARD_PLAYED]: (
    card: Card,
    player: Player,
    area: string,
    targetedPlayer?: Player
  ) => void;
  [Events.BEFORE_CARD_PLAYED]: (
    card: Card,
    player: Player,
    area: string,
    targetedPlayer?: Player
  ) => void;
  [Events.AFTER_CARD_PLAYED]: (
    card: Card,
    player: Player,
    area: string,
    targetedPlayer?: Player
  ) => void;
  [Events.ADD_GAME_ACTION]: (
    actionName: string,
    player: Player,
    isBlocking: boolean,
    initiator?: Card
  ) => void;
  [Events.RESOLVE_CHAIN]: () => void;
  [Events.BEFORE_RESOLVE_CHAIN]: () => void;
  [Events.AFTER_RESOLVE_CHAIN]: () => void;
  [Events.DISCARDED]: (card: Card) => void;
  [Events.ON_PLAYER_ACTION]: (
    action: ExpectedAction,
    choice: string,
    player: Player
  ) => void;
  [Events.REMOVE_EXPECTED_ACTION]: (
    actionToRemove: string,
    player: Player,
    initiatingCard?: Card,
    choice?: string
  ) => void;
  [Events.PUSH_TO_CHAIN]: (card: Card) => void;
  [Events.DISCARD_FROM_CHAIN_IF_EXISTS]: (card: Card, limit?: number) => void;
  [Events.BEFORE_TURN_START]: (turnPlayer: Player) => void;
  [Events.TURN_START]: (turnPlayer: Player) => void;
  [Events.DESTROYED]: (cardID: string, initiatingCard?: Card) => void;
  [Events.AFTER_DESTROY]: (destroyerCard: Card, initiatingCard?: Card) => void;
  [Events.AFTER_SACRIFICE]: (destroyerCard: Card, initiatingCard?: Card) => void;
  [Events.FORCE_END_TURN]: () => void;
  [Events.BEFORE_CARD_RESOLVE]: (card: Card) => void;
  [Events.AFTER_CARD_RESOLVED]: (card: Card) => void;
  [Events.CARD_RESOLVED]: (card: Card, byPlayer: Player) => void;
  [Events.SACRIFICE]: (cardID: string, initiatingCard?: Card) => void;
  [Events.EFFECT_DISABLED] : (disabledEffectCard?: Card) => void;
  [Events.CHANGE_HAND_VISIBILITY]: (targetPlayer: string, initiatingCard: Card, players: Array<string>, visible: boolean) => void
}

export default class Game extends TypedEmitter<MyClassEvents> {
  players: Array<Player> = [];
  deck: Array<Card> = [];
  discard: Array<Card> = [];
  nursery: Array<Card> = [];
  inPlay: Array<Card> = [];
  currentPlayer: Player = new Player("noPlayer");
  uid: string = "";
  hasStarted: boolean = false;
  expectedActions: Array<ExpectedAction> = [];
  currentChain: Array<Card> = [];
  pendingActions: Array<ExpectedAction> = [];

  constructor(players: Array<Player>, template: boolean = false) {
    super();
    if (!template) {
      this.uid = generateUID();
      this.players = players;
      this.currentPlayer = this.players[0];
      this.hasStarted = false;
      //later we will know if it is an expension, right now using base cards only
      for (const [key, value] of Object.entries(cardList.base)) {
        for (let i = 0; i < (value as CardDescriptor).count; i++) {
          if (value.type === "baby") {
            this.nursery.push(new Card(key, value));
          } else {
            this.deck.push(new Card(key, value));
          }
        }
      } /*
            for(const [key, value] of Object.entries(cardList.expension)){
                for (let i = 0; i < (value as CardDescriptor).count; i++){
                    this.deck.push(new Card(key));
                }
            }*/
    }
    this.initEvents();
  }

  private initEvents() {
    this.on(
      Events.ADD_GAME_ACTION,
      (actionName, byPlayer, isBlocking?, initiator?, extraData?: string) => {
        let data: Array<string> = [];
        switch (actionName) {
            case "neigh":
              if(this.expectedActions.find(act => act.action === 'neigh' && act.player === byPlayer.uid)){
                return;
              }
              break;
            case "destroy":
                data = this.getDestroyableCards(byPlayer);
                if(data.length === 0){
                    this.emit(Events.EFFECT_DISABLED, initiator);
                    return;
                }
                break;
            case "sacrifice":
                data = byPlayer.getDestroyable();
                if(data.length === 0){
                    this.emit(Events.EFFECT_DISABLED, initiator);
                    return;
                }
                break;
            case 'hand_card_select':
              if(!initiator){
                return;
              }
              actionName = 'steal'
              this.emit(Events.CHANGE_HAND_VISIBILITY, extraData ?? '', initiator, [byPlayer.uid], true);  
              extraData && (data = [extraData]);
              break;
            default:
                extraData && (data = [extraData]);
                break;
        }
        if (isBlocking) {
            this.pendingActions = this.expectedActions;
            this.expectedActions = [];
          }
        this.expectedActions.push({
          action: actionName,
          player: byPlayer.uid,
          blocking: isBlocking,
          data: data,
          initiator: initiator,
        });
      }
    );
    this.on(
      Events.REMOVE_EXPECTED_ACTION,
      (actionToRemove, byPlayer, initiatingCard) => {
        this.expectedActions = this.expectedActions.filter(
          (action) =>
            !(
              action.action === actionToRemove &&
              action.player === byPlayer.uid &&
              (!initiatingCard || initiatingCard === action.initiator)
            )
        );
        if (!this.expectedActions.find((action) => action.blocking)) {
          this.expectedActions = this.expectedActions.concat(
            this.pendingActions
          );
          this.pendingActions = [];
        }
      }
    );
    this.on(Events.PUSH_TO_CHAIN, (card) => {
      this.currentChain.push(card);
      !this.discard.includes(card) && this.discard.push(card);
    });
    this.on(Events.DISCARD_FROM_CHAIN_IF_EXISTS, (card, limit) => {
      limit = limit ?? this.currentChain.length;
      for (let i = 0; i < limit; i++) {
        let c: Card | undefined;
        if(c = this.currentChain.pop()){
          !this.discard.includes(c) && this.discard.push(c);
          this.emit(Events.DISCARDED, c);
        }
      }
    });
    this.on(Events.RESOLVE_CHAIN, () => {
      let card : Card | undefined;
      while(card = this.currentChain.pop()){
        this.emit(Events.BEFORE_CARD_RESOLVE, card);
        this.emit(Events.AFTER_CARD_RESOLVED, card);

      }
      this.emit(Events.AFTER_RESOLVE_CHAIN);
    });
    this.on(
      Events.BEFORE_RESOLVE_CHAIN,
      () => this.expectedActions.length === 0 && this.emit(Events.RESOLVE_CHAIN)
    );
    this.on(Events.ON_PLAYER_ACTION, (action, choice, player) => {
      
      switch (action.action) {
        case "draw":
          choice === "y" && this.Draw(player);
          break;
        case "destroy":
        case "sacrifice":
          this.removeCard(choice, action.action);
          break;
        case "hand_select":
          this.emit(Events.REMOVE_EXPECTED_ACTION, action.action, player, action.initiator, choice);
          break;
        case "steal":
          if(action.data && action.data[0]){
            const stealFromUid = action.data[0];
            const playerToStealFrom = this.players.find(player => player.uid === stealFromUid);
            if(playerToStealFrom){
              const card = playerToStealFrom.hand.find(card => card.uid === choice);
              if(card){
                this.currentPlayer.hand.push(card);
                playerToStealFrom.removeCardFromHand(card);
              }
            }
            this.emit(Events.REMOVE_EXPECTED_ACTION, action.action, player, action?.initiator, choice);
            //remove listener from card blatantthievery + make sure turn ends
          }else{
            console.error('No data to steal');
            return;
          }
      }
    });
    this.on(Events.TURN_START, (turnPlayer) => {
      this.expectedActions.push({
        action: "draw",
        player: turnPlayer.uid,
        blocking: false,
      });
    });
    this.on(Events.AFTER_DESTROY, this.afterDestroy);
    this.on(Events.AFTER_SACRIFICE, this.afterSacrifice);
    this.on(Events.FORCE_END_TURN, this.nextPlayer);
    this.on(Events.CARD_PLAYED, (card, player, area, targetedPlayer) => {
      this.emit(Events.BEFORE_CARD_PLAYED, card, player, area, targetedPlayer);
      this.emit(Events.AFTER_CARD_PLAYED, card, player, area, targetedPlayer);
    });
    this.on(Events.AFTER_CARD_PLAYED, (card, player, area, targetedPlayer) => {
      if(this.expectedActions.length === 0){
        this.emit(Events.RESOLVE_CHAIN);
      }
    });
  }

  private removeCard(choice: string, reason: string) {
    const destroyAction = this.expectedActions.find(
      (action) => action.action === reason
    );
    if (destroyAction) {
        switch(reason){
            case 'destroy':
                this.emit(Events.DESTROYED, choice, destroyAction.initiator);
            break;
            case 'sacrifice': 
                this.emit(Events.SACRIFICE, choice, destroyAction.initiator); 
        }
    }
  }

  private afterDestroy(card: Card, initiatingCard?: Card) {
    if(card.type === "baby"){
        this.nursery.push(card)
     }else {
        !this.discard.includes(card) && this.discard.push(card);
     }
    this.emit(
      Events.REMOVE_EXPECTED_ACTION,
      "destroy",
      this.currentPlayer,
      initiatingCard
    );
  }

  private afterSacrifice(card: Card, initiatingCard?: Card) {
    if(card.type === "baby"){
        this.nursery.push(card)
     }else {
        !this.discard.includes(card) && this.discard.push(card);
     }
  }

  DoAction(action: string, choice: string, player: Player) {
    const selectAction = this.expectedActions.find(act => action === act.action && act.player === player.uid);
    if(!selectAction){
      return;
    }
    this.emit(Events.ON_PLAYER_ACTION, selectAction, choice, player);
    if(this.expectedActions.length === 0){
      this.emit(Events.RESOLVE_CHAIN);
      if(this.expectedActions.length === 0){
        this.nextPlayer();
      } 
    }
  }

  StartGame() {
    if (!this.hasStarted) {
      shuffleArray(this.deck);
      shuffleArray(this.deck);
      this.players.forEach((player: Player) => {
        for (let index = 0; index < INITIAL_HAND_SIZE; index++) {
          player.Draw(this.deck, this);
        }
      });
      this.giveBabyUnicorn();
      this.hasStarted = true;
    }
  }

  Play(cardUid: string, area: string, targetedPlayer?: string) {
    if (this.expectedActions.find((action) => action.blocking)) {
      return;
    }
    const card: Card | undefined = this.currentPlayer.hand.find(
      (card) => card.uid === cardUid
    );
    const player: Player | undefined = this.players.find(
      (player) => player.uid === targetedPlayer
    );
    if (!card) {
      console.log("card does not exist in players hand");
      return;
    }
    if (area === "discard") {
        !this.discard.includes(card) && this.discard.push(card);
    } else {
      if (!player) {
        console.log(`failed to add card into player ${targetedPlayer} ${area}`);
        return;
      }
      player.stable.addCard(card, area);
    }
    this.emit(Events.REMOVE_EXPECTED_ACTION, "draw", this.currentPlayer);
    this.currentPlayer?.removeCardFromHand(card);
    this.currentChain.push(card);
    this.emit(Events.CARD_PLAYED, card, this.currentPlayer, area, player);
    if(this.expectedActions.length === 0){
      this.nextPlayer();
    }
  }


  nextPlayer() {
    this.expectedActions = [];
    this.currentChain = [];
    const currentPlayerIndex = this.players.indexOf(this.currentPlayer);
    this.currentPlayer =
      currentPlayerIndex === this.players.length - 1
        ? this.players[0]
        : this.players[currentPlayerIndex + 1];
        this.emit(Events.ADD_GAME_ACTION, "draw", this.currentPlayer, true)
    this.emit(Events.BEFORE_TURN_START, this.currentPlayer);
  }

  Draw(player: Player) {
    if (player !== this.currentPlayer) {
      return;
    }
    player.Draw(this.deck, this);
    let drawAction = this.expectedActions.find(
      (action) =>
        action.action === "draw" && action.player === this.currentPlayer.uid
    );
    if (drawAction && drawAction.blocking) {
      this.emit(Events.REMOVE_EXPECTED_ACTION, "draw", player);
      this.emit(Events.TURN_START, player);
    } else {
      this.emit(Events.REMOVE_EXPECTED_ACTION, "draw", player);
    }
  }

  putCardInPlay(card: Card) {
    this.inPlay.push(card);
  }

  toJson(currentPlayer: Player | null) {
    return {
      players: this.players.map((player) => player.toJson(currentPlayer)),
      discard: this.discard.map((card) => card.toJson()),
      nursery: this.nursery.map((card) => card.toJson()),
      currentPlayer: this.currentPlayer.uid,
      uid: this.uid,
      pendingAction: this.expectedActions
        .filter((action) => action.player === currentPlayer?.uid)
        .map((action) => {
          let { initiator, ...res } = action;
          return res;
        }),
    };
  }

  toDB() {
    return {
      players: this.players.map((player) => player.uid),
      deck: this.deck.map((card) => card.slug),
      discard: this.discard.map((card) => card.slug),
      nursery: this.nursery.map((card) => card.slug),
      inPlay: this.inPlay.map((card) => card.slug),
      currentPlayer: this.currentPlayer.uid,
      uid: this.uid,
      hasStarted: this.hasStarted,
    };
  }

  static fromDB(data: IGame, players: Array<Player>) {
    const res = new this([], true);
    res.deck = data.deck.map((slug) => new Card(slug));
    res.discard = data.discard.map((slug) => new Card(slug));
    res.nursery = data.nursery.map((slug) => new Card(slug));
    res.inPlay = data.inPlay?.map((slug) => new Card(slug)) ?? [];
    (res.players = players),
      (res.currentPlayer =
        players.find((player) => player.uid === data.currentPlayer) ??
        players[0]);
    res.hasStarted = data.hasStarted;
    res.uid = data.uid;
    players.forEach((player) => player.registerCards(res));
    res.expectedActions.push({
      action: "draw",
      player: res.currentPlayer.uid,
      blocking: true,
    });
    res.emit(Events.BEFORE_TURN_START, res.currentPlayer);

    return res;
  }

  private giveBabyUnicorn() {
    shuffleArray(this.nursery);
    this.players.forEach((player) => {
      const card = this.nursery.pop();
      if (card) {
        player.stable.unicorns.push(card);
      }
    });
  }

  private getDestroyableCards(destroyingPlayer: Player): Array<string> {
    return this.players
      .filter((player) => player !== destroyingPlayer)
      .map((player) => player.getDestroyable())
      .reduce((arr1, arr2) => arr1.concat(arr2), []);
  }
}
