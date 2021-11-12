import ExpectedAction from "../src/GameModules/Actions/ExpectedActions";
import { Card } from "../src/GameModules/Card";
import Game from "../src/GameModules/Game";
import { Player } from "../src/GameModules/Player";
import { checkForListenersMemLeak } from "./memLeakHelper";

/**
 * When this card enters your Stable, each player must SACRIFICE a Unicorn.
 */
describe('extremelydestructive', () => {
  test("all need to sacrifice", () => {
    let { game, playerA, playerB } = setupGame(['extremelydestructive'], ['basicred'],['basicred'],['basicred'],3);
    game.DoAction('draw', "y", playerA);
    game.Play(playerA.hand[0].uid, 'stable', playerA.uid);
    let actions = getShortenActions(game.expectedActions);
    expect(actions).toContainEqual({ action: "sacrifice", player: playerA.uid });
    expect(actions).toContainEqual({ action: "sacrifice", player: playerB.uid });
    game.DoAction('sacrifice', playerA.stable.unicorns[0].uid, playerA);
    game.DoAction('sacrifice', playerB.stable.unicorns[0].uid, playerB);
    actions = getShortenActions(game.expectedActions);
    expect(playerA.stable.unicorns.length).toEqual(1);
    expect(playerB.stable.unicorns.length).toEqual(0);
    expect(actions).toContainEqual({ action: "draw", player: playerB.uid });//turn end
    checkForListenersMemLeak([playerA, playerB], game);
  });

  test("not enough to sacrifice, only self sacrifice", () => {
    let { game, playerA, playerB } = setupGame(['extremelydestructive'], ['basicred'],[],[],3);
    game.DoAction('draw', "y", playerA);
    game.Play(playerA.hand[0].uid, 'stable', playerA.uid);
    let actions = getShortenActions(game.expectedActions);
    expect(actions).toContainEqual({ action: "sacrifice", player: playerA.uid });
    expect(actions.length).toBe(1);
    game.DoAction('sacrifice', playerA.stable.unicorns[0].uid, playerA);
    actions = getShortenActions(game.expectedActions);
    expect(playerA.stable.unicorns.length).toEqual(0);
    expect(playerB.stable.unicorns.length).toEqual(0);
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
