import ExpectedAction from "../src/GameModules/Actions/ExpectedActions";
import { Card } from "../src/GameModules/Card";
import Game from "../src/GameModules/Game";
import { Player } from "../src/GameModules/Player";
import { checkForListenersMemLeak } from "./memLeakHelper";


/**
 * If one of your Unicorns would be destroyed, you may SACRIFICE this card instead.
 */
describe('blackknight', () => {
  test("Activate effect", () => {
    let { game, playerA, playerB } = setupGame(['unicornpoison'], [],[],['blackknight', 'basicred'],1);
    game.DoAction('draw', "y", playerA);
    game.Play(playerA.hand[0].uid, 'discard', playerA.uid);
    game.DoAction('destroy', playerB.stable.unicorns[1].uid, playerA);
    game.DoAction(playerB.stable.unicorns[0].uid, 'yes', playerB);
    let actions = getShortenActions(game.expectedActions);
    expect(playerB.stable.unicorns.length).toEqual(1);//sacrificed blackknight
    expect(playerB.stable.unicorns[0].slug).toEqual('basicred');//cards stolen
    expect(playerA.hand.length).toEqual(1);
    expect(actions).toContainEqual({ action: "draw", player: playerB.uid });//turn end
    checkForListenersMemLeak([playerA, playerB], game);
  });

  test("Skip effect", () => {
    let { game, playerA, playerB } = setupGame(['unicornpoison'], [],[],['blackknight', 'basicred'],1);
    game.DoAction('draw', "y", playerA);
    game.Play(playerA.hand[0].uid, 'discard', playerA.uid);
    game.DoAction('destroy', playerB.stable.unicorns[1].uid, playerA);
    game.DoAction(playerB.stable.unicorns[0].uid, 'no', playerB);
    let actions = getShortenActions(game.expectedActions);
    expect(playerB.stable.unicorns.length).toEqual(1);//did not sacrificed blackknight
    expect(playerB.stable.unicorns[0].slug).toEqual('blackknight');//cards stolen
    expect(playerA.hand.length).toEqual(1);
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
