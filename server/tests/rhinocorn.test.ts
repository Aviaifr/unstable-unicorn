import ExpectedAction from "../src/GameModules/Actions/ExpectedActions";
import { Card } from "../src/GameModules/Card";
import Game from "../src/GameModules/Game";
import { Player } from "../src/GameModules/Player";
import { checkForListenersMemLeak } from "./memLeakHelper";

test("Activated Rhino Effect", () => {
  const { game, playerA, playerB } = setupGame();
  game.DoAction(playerA.stable.unicorns[0].uid, "y", playerA);
  game.DoAction("destroy", playerB.stable.unicorns[0].uid, playerA);
  let actions = getShortenActions(game.expectedActions);
  expect(playerB.stable.unicorns.length).toEqual(0);//card destroyed
  expect(actions).toContainEqual({ action: "draw", player: playerB.uid });//turn end
  checkForListenersMemLeak([playerA, playerB], game);
});

test("Skip Rhino Effect", () => {
  const { game, playerA, playerB } = setupGame();
  let actions = getShortenActions(game.expectedActions);
  expect(actions.length).toEqual(2);//Should be able to activate
  game.DoAction('draw', "y", playerA);//should disable effetc
  actions = getShortenActions(game.expectedActions);
  expect(actions.length).toEqual(1);//activating no longer an option
  game.DoAction('draw', "y", playerA);
  actions = getShortenActions(game.expectedActions);
  expect(playerB.stable.unicorns.length).toEqual(1);//card NO destroyed
  expect(actions).toContainEqual({ action: "draw", player: playerB.uid });//turn end
  checkForListenersMemLeak([playerA, playerB], game);
});

function setupGame(noCards?: boolean) {
  const playerA = new Player("Player A");
  playerA.stable.unicorns = [new Card("rhinocorn")];
  const playerB = new Player("Player B");
  playerB.stable.unicorns = [new Card("basicred")];
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
