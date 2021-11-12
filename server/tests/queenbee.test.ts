import ExpectedAction from "../src/GameModules/Actions/ExpectedActions";
import { Card } from "../src/GameModules/Card";
import Game from "../src/GameModules/Game";
import { Player } from "../src/GameModules/Player";
import { checkForListenersMemLeak } from "./memLeakHelper";


/**
 * As long as this card is in your Stable, no other player can play Basic Unicorns
 */
describe('queenbee', () => {
  test("queen in stable, player can't play basic", () => {
    let { game, playerA, playerB } = setupGame(['basicred'], ['basicred'],[],['queenbee'],3);
    game.DoAction('draw', "y", playerA);
    game.Play(playerA.hand[0].uid, 'stable', playerA.uid);
    let actions = getShortenActions(game.expectedActions);
    expect(actions).toContainEqual({ action: "draw", player: playerA.uid });//still player a turn
    game.DoAction('draw', "y", playerA);
    game.DoAction('draw', "y", playerB);
    game.Play(playerB.hand[0].uid, 'stable', playerB.uid);
    actions = getShortenActions(game.expectedActions);
    expect(playerA.stable.unicorns.length).toEqual(0);
    expect(playerB.stable.unicorns.length).toEqual(2);
    expect(actions).toContainEqual({ action: "draw", player: playerA.uid });//turn end
    checkForListenersMemLeak([playerA, playerB], game);
  });

  test("queen destroyed, player can play basic", () => {
    let { game, playerA, playerB } = setupGame(['basicred'], ['basicred'],['rhinocorn'],['queenbee'],4);
    game.DoAction(playerA.stable.unicorns[0].uid, 'yes', playerA);
    game.DoAction('destroy', playerB.stable.unicorns[0].uid, playerA);
    game.DoAction('draw', "y", playerB);
    game.Play(playerB.hand[0].uid, 'stable', playerB.uid);
    game.DoAction('draw', "y", playerA);
    game.Play(playerA.hand[0].uid, 'stable', playerA.uid);
    let actions = getShortenActions(game.expectedActions);
    expect(playerA.stable.unicorns.length).toEqual(2);
    expect(playerB.stable.unicorns.length).toEqual(1);
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
