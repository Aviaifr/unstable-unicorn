import { TypedEmitter, ListenerSignature } from "tiny-typed-emitter";
import { Player } from "./Player";
import { Card } from "./Card";
import { cardList, CardDescriptor } from "./cardLists";
import { generateUID, shuffleArray } from "../utils";
import { IGame } from "../DB/Schema/game";
import { Events } from "./Events";

const INITIAL_HAND_SIZE = 5;

interface MyClassEvents {
  [Events.CARD_PLAYED]: (
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
  [Events.DISCARDED]: (card: Card) => void;
  [Events.ON_PLAYER_ACTION]: (
    action: string,
    choice: string,
    player: Player
  ) => void;
  [Events.REMOVE_EXPECTED_ACTION]: (
    actionToRemove: string,
    player: Player,
    initiatingCard?: Card
  ) => void;
  [Events.PUSH_TO_CHAIN]: (card: Card) => void;
  [Events.DISCARD_FROM_CHAIN_IF_EXISTS]: (card: Card, limit?: number) => void;
  [Events.BEFORE_TURN_START]: (turnPlayer: Player) => void;
  [Events.TURN_START]: (turnPlayer: Player) => void;
  [Events.DESTROYED]: (cardID: string, initiatingCard?: Card) => void;
  [Events.AFTER_DESTROY]: (destroyerCard: Card, initiatingCard?: Card) => void;
  [Events.FORCE_END_TURN]: () => void;
}

interface ExpectedAction {
  player: string;
  action: string;
  blocking?: boolean;
  data?: Array<string>;
  initiator?: Card;
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
      (actionName, byPlayer, isBlocking?, initiator?) => {
        if (isBlocking) {
          this.pendingActions = this.expectedActions;
          this.expectedActions = [];
        }
        let data: Array<string> = [];
        switch (actionName) {
          case "destroy":
            data = this.getDestroyableCards(byPlayer);
            break;
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
    this.on(Events.PUSH_TO_CHAIN, (card) => this.currentChain.push(card));
    this.on(Events.DISCARD_FROM_CHAIN_IF_EXISTS, (card, limit) => {
      if (this.currentChain.includes(card)) {
        limit = limit ?? this.currentChain.length;
        for (let i = 0; i < limit; i++) {
          let c: Card | undefined;
          (c = this.currentChain.pop()) &&
            this.discard.push(c) &&
            this.emit(Events.DISCARDED, c);
        }
      }
    });
    this.on(
      Events.BEFORE_RESOLVE_CHAIN,
      () => this.expectedActions.length === 0 && this.emit(Events.RESOLVE_CHAIN)
    );
    this.on(Events.ON_PLAYER_ACTION, (action, choice, player) => {
      switch (action) {
        case "draw":
          choice === "y" && this.Draw(player);
          break;
        case "destroy":
          this.destroyCard(choice);
          break;
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
    this.on(Events.FORCE_END_TURN, this.nextPlayer);
  }

  private destroyCard(choice: string) {
    const destroyAction = this.expectedActions.find(
      (action) => action.action === "destroy"
    );
    if (destroyAction) {
      this.emit(Events.DESTROYED, choice, destroyAction.initiator); //need user/stable to listen to dfestroy event and emit AFTER_DESTROY
    }
  }

  private afterDestroy(card: Card, initiatingCard?: Card) {
    card.type === "baby" ? this.nursery.push(card) : this.discard.push(card);
    console.log("avihai");
    this.emit(
      Events.REMOVE_EXPECTED_ACTION,
      "destroy",
      this.currentPlayer,
      initiatingCard
    );
  }

  DoAction(action: string, choice: string, player: Player) {
    this.emit(Events.ON_PLAYER_ACTION, action, choice, player);
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
    if (area === "play") {
      this.putCardInPlay(card);
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
    if (this.expectedActions.length === 0) {
      this.nextPlayer();
    } else {
      this.once(Events.RESOLVE_CHAIN, () => this.nextPlayer());
    }
  }

  nextPlayer() {
    this.expectedActions = [];
    const currentPlayerIndex = this.players.indexOf(this.currentPlayer);
    this.currentPlayer =
      currentPlayerIndex === this.players.length - 1
        ? this.players[0]
        : this.players[currentPlayerIndex + 1];
    this.expectedActions.push({
      action: "draw",
      player: this.currentPlayer.uid,
      blocking: true,
    });
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
      this.nextPlayer();
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
