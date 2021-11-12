import ExpectedAction from "../src/GameModules/Actions/ExpectedActions";
import { Card } from "../src/GameModules/Card";
import Game from "../src/GameModules/Game";
import { Player } from "../src/GameModules/Player";
import { checkForListenersMemLeak } from "./memLeakHelper";


/**
 * When this card enters your Stable, you may choose a Unicorn from the discard pile and add it to your hand.
 * If this card is sacrificed or destroyed, return it to your hand.
 */
describe('majesticflying', () => {
  test("Enter stable, activate effect", () => {
    let { game, playerA, playerB } = setupGame(['majesticflying'], [],[],[],1);
    game.DoAction('draw', "y", playerA);
    game.Play(playerA.hand[0].uid, 'stable', playerA.uid); //play majestic
    game.DoAction(playerA.stable.unicorns[0].uid, 'yes', playerA); //activate majestic effect
    let choice = game.expectedActions[0].data?.pop() ?? '';
    expect(game.expectedActions[0].action).toEqual('choose_discard');
    game.DoAction('choose_discard', choice, playerA); //choose card from discard
    let actions = getShortenActions(game.expectedActions);
    expect(playerA.stable.unicorns.length).toEqual(1);
    expect(playerA.hand.length).toEqual(2);
    expect(actions).toContainEqual({ action: "draw", player: playerB.uid });//turn end
    checkForListenersMemLeak([playerA, playerB], game);
  });

  test("Enter stable, do not activate effect", () => {
    let { game, playerA, playerB } = setupGame(['majesticflying'], [],[],[],1);
    game.DoAction('draw', "y", playerA);
    game.Play(playerA.hand[0].uid, 'stable', playerA.uid); //play majestic
    game.DoAction(playerA.stable.unicorns[0].uid, 'no', playerA); //activate majestic effect
    let actions = getShortenActions(game.expectedActions);
    expect(playerA.stable.unicorns.length).toEqual(1);
    expect(playerA.hand.length).toEqual(1);
    expect(actions).toContainEqual({ action: "draw", player: playerB.uid });//turn end
    checkForListenersMemLeak([playerA, playerB], game);
  });

  test("destroyed back to hand", () => {
    let { game, playerA, playerB } = setupGame(['unicornpoison'], [],[],['majesticflying'],1);
    game.DoAction('draw', "y", playerA);
    game.Play(playerA.hand[0].uid, 'discard', playerA.uid); //play poison
    game.DoAction('destroy', playerB.stable.unicorns[0].uid, playerA); //activate majestic effect
    let actions = getShortenActions(game.expectedActions);
    expect(playerB.stable.unicorns.length).toEqual(0);
    expect(playerB.hand.length).toEqual(1);
    expect(actions).toContainEqual({ action: "draw", player: playerB.uid });//turn end
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
  const game = Game.fromDB(
    {
      currentPlayer: playerA.uid,
      deck: new Array(10).fill('basicred'),
      discard: ['basicred', 'barbwire', 'neigh', 'annoying'],
      hasStarted: true,
      inPlay: [],
      nursery: [],
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
