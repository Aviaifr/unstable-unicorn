import { TypedEmitter } from "tiny-typed-emitter";
import { Player } from "./Player";
import { Card } from "./Card";
import { cardList, CardDescriptor } from "./cardLists";
import { generateUID, shuffleArray } from "../utils";
import { IGame } from "../DB/Schema/game";
import { Events } from "./Events";
import ExpectedAction from "./Actions/ExpectedActions";
import player from "../DB/Schema/player";

const INITIAL_HAND_SIZE = 5;

interface MyClassEvents {
  [Events.REMOVE_FROM_DISCARD]: (card: Card) => void;
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
    initiator?: Card,
    extraData?: string
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
    choice?: string,
    extraData?: string[]
  ) => void;
  [Events.PUSH_TO_CHAIN]: (card: Card) => void;
  [Events.DISCARD_FROM_CHAIN_IF_EXISTS]: (card: Card, limit?: number) => void;
  [Events.BEFORE_TURN_START]: (turnPlayer: Player) => void;
  [Events.BEFORE_TURN_END]: (turnPlayer: Player) => void;
  [Events.TURN_START]: (turnPlayer: Player) => void;
  [Events.BEFORE_DESTROY]: (cardID: string, destroyingPlayer: Player, initiatingCard?: Card) => void;
  [Events.DESTROYED]: (cardID: string, initiatingCard?: Card) => void;
  [Events.AFTER_DESTROY]: (destroyerCard: Card, destroyedOwner: Player, initiatingCard?: Card) => void;
  [Events.AFTER_SACRIFICE]: (destroyerCard: Card, cardOwner: Player, initiatingCard?: Card) => void;
  [Events.FORCE_END_TURN]: () => void;
  [Events.GAME_LOADED]: () => void;
  [Events.BEFORE_CARD_RESOLVE]: (card: Card) => void;
  [Events.AFTER_CARD_RESOLVED]: (card: Card) => void;
  [Events.CARD_RESOLVED]: (card: Card, byPlayer: Player) => void;
  [Events.SACRIFICE]: (cardID: string, initiatingCard?: Card) => void;
  [Events.EFFECT_DISABLED] : (disabledEffectCard?: Card) => void;
  [Events.CHANGE_HAND_VISIBILITY]: (targetPlayer: string, initiatingCard: Card, players: Array<string>, visible: boolean) => void
  [Events.ENTERED_STABLE]: (card: Card, player: Player) => void;
  [Events.CHECK_PRECONDITION]: (card: Card, otherPlayers: Array<Player>) => void;
  [Events.FAILED_CHECK_PRECONDITION]: (card: Card, error: string) => void;
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
  playPreconditionMet: boolean = true;
  playerDeckVisiblityArray: Array<Player> = [];

  constructor(players: Array<Player>, template: boolean = false) {
    super();
    this.setMaxListeners(100);
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
    this.on(Events.FAILED_CHECK_PRECONDITION, (card: Card, error: string) => this.playPreconditionMet = false);
    this.on(
      Events.ADD_GAME_ACTION,
      (actionName, byPlayer?, isBlocking?, initiator?, extraData?: string) => {
        let data: Array<string> = [];
        if(initiator && initiator.type === 'instant'){
          if(byPlayer && !byPlayer.canUseInstant()){
            return;
          }
        }
        switch (actionName) {
          case 'add_baby':
            shuffleArray(this.nursery);
            const BabyCard = this.nursery.pop()
            if(!BabyCard){
              return;
            }
            byPlayer.stable.addCard(BabyCard);
            break;
          case 'choose_discard':
            data = this.discard.filter(c => !extraData || c.baseType === extraData).map(c => c.uid);
            if(data.length === 0){
              return;
            }
            break;
          case "swap_hands":
            const swapWithPlayer = this.players.find(p=> p.uid === extraData);
            if(!swapWithPlayer){
              console.error("player not found");
              return;
            }
            const tmpHand = this.currentPlayer.hand;
            this.currentPlayer.hand = swapWithPlayer.hand;
            swapWithPlayer.hand = tmpHand;
            swapWithPlayer.hand.forEach(card => card.ResetEvent(this, swapWithPlayer));
            this.currentPlayer.hand.forEach(card => card.ResetEvent(this, this.currentPlayer));
            return;
          case "neigh":
            if(this.expectedActions.find(act => act.action === 'neigh' && act.player === byPlayer.uid)){
              return;
            }
            break;
          case "destroy":
              const extraDataSplit = extraData?.split(';');
              const choice = extraData?.split(';')[0];
              const includeCurrentPlayer = extraDataSplit && extraDataSplit.length > 1 ? extraDataSplit[1] : '';
              data = this.getDestroyableCards(byPlayer, choice , includeCurrentPlayer === 'true', initiator) ;
              if(data.length === 0){
                  this.emit(Events.EFFECT_DISABLED, initiator);
                  return;
              }
              break;
          case "sacrifice":
            if(extraData === 'all'){
              this.players.forEach(p=> {
                this.emit(Events.ADD_GAME_ACTION, 'sacrifice', p, false, initiator);
              });
              return;
            }
              data = extraData ? extraData.split(';') :byPlayer.getDestroyable(initiator);
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
          case 'steal_card':
            if(!this.players.find(p => (!extraData || p.uid === extraData) && p.hand.length > 0)){//if nothing to steal
              this.emit(Events.EFFECT_DISABLED, initiator);
              return;
            }
            extraData && (data = [extraData ?? '']);
            break;
          case 'player_discard': 
            actionName = 'discard';
            const discardingPlayer = this.players.find(player => player.uid === extraData);
            if(!discardingPlayer){
              console.error(`cannot add discard action, ${extraData} does not exist`);
              return;
            }
            data = discardingPlayer.hand.map(card => card.uid);
            if(data.length === 0){ //no cards to discard
              return;
            }
            byPlayer = discardingPlayer;
            break;
          case 'snatch':
            const snatchFrom = this.players.find(player => player.uid === extraData);
            if(!snatchFrom){
              console.error(`cannot add discard action, ${extraData} does not exist`);
              return;
            }
            data = snatchFrom.stable.getCardsByType('unicorn').map(card => card.uid);
            if(data.length === 0){ //no cards to discard
              this.pendingActions = []; //reset continous actions
              return;
            }
            break;
          case "give":
            extraData && data.push(extraData);
            data = data.concat(byPlayer.stable.getCardsByType('unicorn').map(card => card.uid));
            break;
          case 'discard':
            extraData && (data = extraData.split(';'));
            break;
          case 'pick_from_deck':
            let filters = extraData ? JSON.parse(extraData) : {};
            data = this.deck.filter(card => !filters.text || card.name.includes(filters.text) || card.text.includes(filters.text))
              .filter(card => !filters.type || filters.type === card.type).map(card => card.uid);
            this.playerDeckVisiblityArray.push(byPlayer);
            break;
          default:
              extraData && (data = [extraData]);
              break;
        }
        if (isBlocking) {
            this.pendingActions = this.pendingActions.concat(this.expectedActions.filter(act => act.managed === false));
            this.expectedActions = this.expectedActions.filter(act => act.managed === true);
        }
        if(this.expectedActions.find(a => a.action === actionName && a.player === byPlayer.uid)){
          this.pendingActions.push({
            action: actionName,
            player: byPlayer.uid,
            blocking: isBlocking,
            data: data,
            initiator: initiator,
            managed: false
          });
        }else{
          this.expectedActions.push({
            action: actionName,
            player: byPlayer.uid,
            blocking: isBlocking,
            data: data,
            initiator: initiator,
            managed: false
          });
        }
      }
    );
    this.on(
      Events.REMOVE_EXPECTED_ACTION,
      (actionToRemove, byPlayer, initiatingCard) => {
        const duplicates = this.expectedActions.filter(
          (action) =>
            (
              action.action === actionToRemove &&
              action.player === byPlayer.uid &&
              (!initiatingCard || initiatingCard === action.initiator)
            )
        );
        this.expectedActions = this.expectedActions.filter( act => !duplicates.includes(act));
        for(let i = 1 ; i< duplicates.length ; i++){
          this.expectedActions.push(duplicates[i]);
        }
        if (!this.expectedActions.find((action) => action.blocking && !action.managed)) {
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
      let backupPlayer = player; //for use in case we need some swapping 
      switch (action.action) {
        case 'choose_discard':
          const discardedCard = this.discard.find(c => c.uid === choice);
          if(!discardedCard){
            return;
          }
          this.discard = this.discard.filter(c => c !== discardedCard);
          discardedCard.uid = generateUID();
          player.hand.push(discardedCard);
          discardedCard.registerEvents(this, player);
          break;
        case "draw":
          choice === "y" && this.Draw(player);
          return;
        case "destroy":
        case "sacrifice":
          this.removeCard(choice, action.action);
          return;
        case 'discard':
          const card = player.hand.find(card => card.uid === choice);
          if(!card || (action.data && action.data.length > 0 && !action.data.includes(choice)) ){
            console.error(`cannot discard card, cannot find card ${choice} in ${player.uid} player hand`);
            return;
          }
          player.removeCardFromHand(card);
          this.discard.push(card);
          this.emit(Events.DISCARDED, card);
          break;
        case 'give':
          const giveToPlayer = this.players.find(player => player.uid === (action.data ? action.data[0] : ''));
          if(!giveToPlayer){
            return;
          }
          backupPlayer = giveToPlayer;//fallback is needed here
        case 'snatch':
          const stealingFrom = this.players.find(player => !!player.stable.findInStable(choice));
          if(!stealingFrom ){
            return;
          }
          const stolenCard = stealingFrom.stable.findInStable(choice);
          if(!stolenCard){
            return;
          }
          stolenCard.ResetEvent(this, backupPlayer);
          stealingFrom.stable.removeFromStable(stolenCard);
          backupPlayer.stable.addCard(stolenCard);
          this.once(Events.RESOLVE_CHAIN, () => this.emit(Events.ENTERED_STABLE, stolenCard, backupPlayer));
          break;
        case 'pick_from_deck':
          if(choice.length !== 0){
            const selectedCard = this.deck.find(card => card.uid === choice);
            if(!selectedCard){
              console.error('Card not found');
              return;
            }
            player.hand.push(selectedCard);
            selectedCard.registerEvents(this, player);
            this.deck = this.deck.filter(card => card !== selectedCard);
            this.playerDeckVisiblityArray = this.playerDeckVisiblityArray.filter(p => p !== player);
          }
          shuffleArray(this.deck);
          break;
        case 'steal_card':
          const foundOwner =this.players.find(p => p.hand.map(c => c.uid).includes(choice));
          if(foundOwner){
            action.data = [foundOwner.uid]
          }
        case "steal":
          if(action.data && action.data[0]){
            const stealFromUid = action.data[0];
            const playerToStealFrom = this.players.find(player => player.uid === stealFromUid);
            if(playerToStealFrom){
              const card = playerToStealFrom.hand.find(card => card.uid === choice);
              if(card){
                this.currentPlayer.hand.push(card);
                playerToStealFrom.removeCardFromHand(card);
                card.ResetEvent(this, player);
              }
            }
          }else{
            console.error('No data to steal');
            return;
          }
      }
      this.emit(Events.REMOVE_EXPECTED_ACTION, action.action, player, action.initiator, choice, action.data);
    });
    this.on(Events.TURN_START, (turnPlayer) => {
      this.expectedActions.push({
        action: "draw",
        player: turnPlayer.uid,
        blocking: false,
        managed: false
      });
    });
    this.on(Events.AFTER_DESTROY, this.afterDestroy);
    this.on(Events.AFTER_SACRIFICE, this.afterSacrifice);
    this.on(Events.FORCE_END_TURN, this.forceEndTurn);
    this.on(Events.CARD_PLAYED, (card, player, area, targetedPlayer) => {
      this.emit(Events.BEFORE_CARD_PLAYED, card, player, area, targetedPlayer);
      this.emit(Events.AFTER_CARD_PLAYED, card, player, area, targetedPlayer);
    });
    this.on(Events.AFTER_CARD_PLAYED, (card, player, area, targetedPlayer) => {
      if(this.expectedActions.length === 0){
        this.emit(Events.RESOLVE_CHAIN);
        if(area === 'discard' && this.expectedActions.length === 0){
          this.emit(Events.DISCARDED, card);
        }
      }
    });
    this.on(Events.REMOVE_FROM_DISCARD, (card) => {
      const index = this.discard.indexOf(card);
      if (index > -1) {
        this.discard.splice(index, 1);
      }
    })
  }

  private removeCard(choice: string, reason: string) {
    const destroyAction = this.expectedActions.find(
      (action) => action.action === reason
    );
    if (destroyAction) {
        switch(reason){
            case 'destroy':
                this.emit(Events.BEFORE_DESTROY, choice, this.currentPlayer, destroyAction.initiator);
                if(this.expectedActions.includes(destroyAction)){
                  this.emit(Events.DESTROYED, choice, destroyAction.initiator);
                }
            break;
            case 'sacrifice': 
                this.emit(Events.SACRIFICE, choice, destroyAction.initiator); 
        }
    }
  }

  private afterDestroy(card: Card, cardOwner: Player, initiatingCard?: Card) {
    if(card.type === "baby"){
        this.nursery.push(card)
     } else if(!cardOwner.hand.includes(card)) {
        !this.discard.includes(card) && this.discard.push(card);
        this.emit(Events.DISCARDED, card);
     }
    this.emit(
      Events.REMOVE_EXPECTED_ACTION,
      "destroy",
      this.currentPlayer,
      initiatingCard
    );
  }

  private afterSacrifice(card: Card, cardOwner: Player, initiatingCard?: Card) {
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
    selectAction.managed = true;
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
    this.emit(Events.CHECK_PRECONDITION, card, this.players.filter(p => p !== this.currentPlayer));
    if(!this.playPreconditionMet){
      this.playPreconditionMet = true;
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

  forceEndTurn(){
    this.expectedActions = this.expectedActions.filter(a => a.action !== 'draw');
    this.pendingActions = this.pendingActions.filter(a => a.action !== 'draw');
    if(this.expectedActions.length === 0){
      this.nextPlayer();
    }
  }

  nextPlayer() {
    this.emit(Events.BEFORE_TURN_END, this.currentPlayer);
    this.expectedActions = [];
    this.currentChain = [];
    const currentPlayerIndex = this.players.indexOf(this.currentPlayer);
    this.currentPlayer =
      currentPlayerIndex === this.players.length - 1
        ? this.players[0]
        : this.players[currentPlayerIndex + 1];
        this.emit(Events.ADD_GAME_ACTION, "draw", this.currentPlayer, true, undefined, 'start')
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
    this.emit(Events.REMOVE_EXPECTED_ACTION, "draw", player, drawAction?.initiator);
    if (drawAction && drawAction.blocking && drawAction.data?.includes('start')) {
      this.emit(Events.TURN_START, player);
    }
    if(this.expectedActions.length === 0){
      this.nextPlayer();
    }
  }

  putCardInPlay(card: Card) {
    this.inPlay.push(card);
  }

  toJson(currentPlayer: Player | null) {
    return {
      deck: currentPlayer && this.playerDeckVisiblityArray.includes(currentPlayer) ?
        this.deck.map((card) => card.toJson()) : null,
      players: this.players.map((player) => player.toJson(currentPlayer)),
      discard: this.discard.map((card) => card.toJson()),
      nursery: this.nursery.map((card) => card.toJson()),
      currentPlayer: this.currentPlayer.uid,
      uid: this.uid,
      pendingAction: this.expectedActions
        .filter((action) => action.player === currentPlayer?.uid && action.managed === false)
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
      managed: false,
      data: ['start']
    });
    res.emit(Events.GAME_LOADED);
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

  private getDestroyableCards(destroyingPlayer: Player, type?: string, includesPlayer?: boolean, initiator?: Card): Array<string> {
    return this.players
      .filter((player) => includesPlayer || player !== destroyingPlayer)
      .map((player) => player.getDestroyable(initiator, type))
      .reduce((arr1, arr2) => arr1.concat(arr2), []);
  }
}
