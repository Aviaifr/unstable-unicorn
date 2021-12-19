import ExpectedAction from "../src/GameModules/Actions/ExpectedActions";
import { Card } from "../src/GameModules/Card";
import Game from "../src/GameModules/Game";
import { Player } from "../src/GameModules/Player";
import { checkForListenersMemLeak } from "./memLeakHelper";

/**
 * When this card enters your Stable, you may search the deck for a Downgrade card. Add it to your hand, then shuffle the deck.
 * */
describe('shabby', () => {
  test('search Downgrade', () => {
    let { game, playerA, playerB } = setupGame(['shabby'], ['basicred'],[],['basicred'],3);
    game.DoAction('draw', "y", playerA);
    game.Play(playerA.hand[0].uid, 'stable', playerA.uid);
    let actions = getShortenActions(game.expectedActions);
    expect(actions).toContainEqual({ action: playerA.stable.unicorns[0].uid, player: playerA.uid });
    game.DoAction(playerA.stable.unicorns[0].uid, 'y', playerA);
    actions = getShortenActions(game.expectedActions);
    expect(actions).toContainEqual({ action: 'pick_from_deck', player: playerA.uid });
    game.DoAction('pick_from_deck', game.expectedActions[0].data?.length ? game.expectedActions[0].data[0] : '1', playerA);
    actions = getShortenActions(game.expectedActions);
    expect(actions).toContainEqual({ action: "draw", player: playerB.uid });//turn end
    expect(playerA.hand.length).toBe(2);
    expect(playerA.hand[1].type).toBe('downgrade');
    checkForListenersMemLeak([playerA, playerB], game);
  });

  test('no Downgrade in deck', () => {
    let { game, playerA, playerB } = setupGame(['shabby'], ['basicred'],[],['basicred'],3);
    game.deck = game.deck.filter(card => card.type !== 'downgrade')
    game.DoAction('draw', "y", playerA);
    game.Play(playerA.hand[0].uid, 'stable', playerA.uid);
    let actions = getShortenActions(game.expectedActions);
    expect(actions).toContainEqual({ action: playerA.stable.unicorns[0].uid, player: playerA.uid });
    game.DoAction(playerA.stable.unicorns[0].uid, 'y', playerA);
    actions = getShortenActions(game.expectedActions);
    expect(actions).toContainEqual({ action: 'pick_from_deck', player: playerA.uid });
    game.DoAction('pick_from_deck', '', playerA);
    actions = getShortenActions(game.expectedActions);
    expect(actions).toContainEqual({ action: "draw", player: playerB.uid });//turn end
    expect(playerA.hand.length).toBe(1);
    checkForListenersMemLeak([playerA, playerB], game);
  });

  test('skip effect', () => {
    let { game, playerA, playerB } = setupGame(['shabby'], ['basicred'],[],['basicred'],3);
    game.DoAction('draw', "y", playerA);
    game.Play(playerA.hand[0].uid, 'stable', playerA.uid);
    let actions = getShortenActions(game.expectedActions);
    expect(actions).toContainEqual({ action: playerA.stable.unicorns[0].uid, player: playerA.uid });
    game.DoAction(playerA.stable.unicorns[0].uid, 'n', playerA);
    actions = getShortenActions(game.expectedActions);
    expect(actions).toContainEqual({ action: "draw", player: playerB.uid });//turn end
    expect(playerA.hand.length).toBe(1);
    checkForListenersMemLeak([playerA, playerB], game);
  });

});

function setupGame(AHandcards: string[], BHandcards: string[], AStablecards: string[], BStablecards: string[], turns: number) {
  const playerA = new Player("Player A");
  playerA.hand = AHandcards.map(name => new Card(name));
   const playerB = new Player("Player B");
  playerB.hand = BHandcards.map(slug => new Card(slug));
  playerB.stable.unicorns = BStablecards.map(slug => new Card(slug));
  playerA.stable.unicorns = AStablecards.map(slug => new Card(slug));
  const deck = ['basicred','basicred','basicred','slowdown','basicred','barbedwire', 'barbedwire', 'basicred'];

  const game = Game.fromDB(
    {
      currentPlayer: playerA.uid,
      deck: deck,
      discard: [],
      hasStarted: true,
      inPlay: [],
      nursery: ['babywhite','babywhite','babywhite'],
      players: [],
      uid: "testtt",
    },
    [playerA, playerB]
  );
  return { game, playerA, playerB };
}

function getShortenActions(expectedActions: Array<ExpectedAction>) {
  return expectedActions.map((action) => {
    return { action: action.action, player: action.player };
  });
}
