import ExpectedAction from "../src/GameModules/Actions/ExpectedActions";
import { Card } from "../src/GameModules/Card";
import Game from "../src/GameModules/Game";
import { Player } from "../src/GameModules/Player";
import { checkForListenersMemLeak } from "./memLeakHelper";


/**
 * DRAW three cards, then DISCARD a card..
 * 
 */
describe('Good Deal', () => {
  test("activate effect", () => {
    let { game, playerA, playerB } = setupGame(["gooddeal"], ['basicred'],['basicred'],['basicred'],4);
    game.DoAction('draw', "y", playerA);
    game.Play(playerA.hand[0].uid, 'discard', playerA.uid);
    let actions = getShortenActions(game.expectedActions);
    expect(actions).toContainEqual({ action: "draw", player: playerA.uid });
    game.DoAction('draw', "y", playerA);
    actions = getShortenActions(game.expectedActions);
    expect(actions).toContainEqual({ action: "draw", player: playerA.uid });
    game.DoAction('draw', "y", playerA);
    actions = getShortenActions(game.expectedActions);
    expect(actions).toContainEqual({ action: "draw", player: playerA.uid });
    game.DoAction('draw', "y", playerA);
    actions = getShortenActions(game.expectedActions);
    expect(actions).toContainEqual({ action: "discard", player: playerA.uid });
    game.DoAction("discard", playerA.hand[0].uid, playerA);
    actions = getShortenActions(game.expectedActions);
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
