import ExpectedAction from "../src/GameModules/Actions/ExpectedActions";
import { Card } from "../src/GameModules/Card";
import Game from "../src/GameModules/Game";
import { Player } from "../src/GameModules/Player";
import { checkForListenersMemLeak } from "./memLeakHelper";


/**
 * SACRIFICE a card, then DESTROY two cards.
 */
test("Two-For-One Effect", () => {
  const { game, playerA, playerB } = setupGame();
  game.DoAction('draw', "y", playerA);
  game.Play(playerA.hand[0].uid, 'discard', playerA.uid);
  game.DoAction('sacrifice', playerA.stable.unicorns[0].uid, playerA);
  game.DoAction('destroy', playerB.stable.unicorns[0].uid, playerA);
  game.DoAction('destroy', playerB.stable.unicorns[0].uid, playerA);
  let actions = getShortenActions(game.expectedActions);
  expect(playerB.stable.unicorns.length).toEqual(0);//cards destroyed
  expect(playerA.stable.unicorns.length).toEqual(0);//cards sacrificed
  expect(actions).toContainEqual({ action: "draw", player: playerB.uid });//turn end
  checkForListenersMemLeak([playerA, playerB], game);
});

test("Two-For-One Nothing to sacrifice", () => {
  const { game, playerA, playerB } = setupGame(true);
  game.DoAction('draw', "y", playerA);
  game.Play(playerA.hand[0].uid, 'discard', playerA.uid);
  let actions = getShortenActions(game.expectedActions);
  expect(playerB.stable.unicorns.length).toEqual(2);//cards destroyed
  expect(actions).toContainEqual({ action: "draw", player: playerB.uid });//turn end
  checkForListenersMemLeak([playerA, playerB], game);
});


function setupGame(noCards?: boolean) {
  const playerA = new Player("Player A");
  playerA.hand = [new Card("twoforone")];
  playerA.stable.unicorns = noCards ? [] : [new Card("basicred")];
  const playerB = new Player("Player B");
  playerB.stable.unicorns = [new Card("rhinocorn"), new Card("annoying")];
  const game = Game.fromDB(
    {
      currentPlayer: playerA.uid,
      deck: ["basicred"],
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
