import ExpectedAction from "../src/GameModules/Actions/ExpectedActions";
import { Card } from "../src/GameModules/Card";
import Game from "../src/GameModules/Game";
import { Player } from "../src/GameModules/Player";
import { checkForListenersMemLeak } from "./memLeakHelper";

/**
 * When this card enters your Stable, you may take a card at random from any player’s hand and add it to your hand.
 */
describe('americorn', () => {
  test("entered stable - steal card", () => {
    let { game, playerA, playerB } = setupGame(['americorn'], ['basicred'],['basicred'],['basicred'],3);
    game.DoAction('draw', "y", playerA);
    game.Play(playerA.hand[0].uid, 'stable', playerA.uid);
    let actions = getShortenActions(game.expectedActions);
    expect(actions).toContainEqual({ action: "steal_card", player: playerA.uid });
    game.DoAction('steal_card', playerB.hand[0].uid, playerA);
    actions = getShortenActions(game.expectedActions);
    expect(playerA.stable.unicorns.length).toEqual(2);
    expect(playerB.hand.length).toEqual(0);
    expect(playerA.hand.length).toEqual(2); // draw + steal
    expect(actions).toContainEqual({ action: "draw", player: playerB.uid });//turn end
    checkForListenersMemLeak([playerA, playerB], game);
  });

  test("kill ameicorn", () => {
    let { game, playerA, playerB } = setupGame(['unicornpoison'], ['basicred'],['basicred'],['americorn'],3);
    game.DoAction('draw', "y", playerA);
    game.Play(playerA.hand[0].uid, 'discard', playerA.uid);
    game.DoAction('destroy', playerB.stable.unicorns[0].uid, playerA);
    let actions = getShortenActions(game.expectedActions);
    expect(playerB.stable.unicorns.length).toEqual(0);
    expect(playerB.hand.length).toEqual(1);
    expect(playerA.hand.length).toEqual(1); // draw + steal
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
      discard: [],
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
