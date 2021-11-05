import ExpectedAction from "../src/GameModules/Actions/ExpectedActions";
import { Card } from "../src/GameModules/Card";
import Game from "../src/GameModules/Game";
import { Player } from "../src/GameModules/Player";
import { checkForListenersMemLeak } from "./memLeakHelper";


/**
 * Look at any player's hand. Take a card of your choice and add it to your hand
 */
test("BLATANT THIEVERY", () => {
  const { game, playerA, playerB } = setupGame();
  game.DoAction('draw', "y", playerA);
  game.Play(playerA.hand[0].uid, 'discard', playerA.uid);
  game.DoAction('neigh', 'no', playerB);
  game.DoAction('hand_select', playerB.uid, playerA);
  game.DoAction('steal', playerB.hand[0].uid, playerA);
  let actions = getShortenActions(game.expectedActions);
  expect(playerB.hand.length).toEqual(1);//cards stolen
  expect(playerA.hand.length).toEqual(4);//started with 2 draw + stolen - usage of card
  expect(actions).toContainEqual({ action: "draw", player: playerB.uid });//turn end
  checkForListenersMemLeak([playerA, playerB], game);
});

test("BLATANT THIEVERY, with double neigh", () => {
  const { game, playerA, playerB } = setupGame();
  game.DoAction('draw', "y", playerA);
  game.Play(playerA.hand[0].uid, 'discard', playerA.uid);
  game.DoAction('neigh', 'yes', playerB);
  game.DoAction('neigh', 'yes', playerA);
  game.DoAction('hand_select', playerB.uid, playerA);
  game.DoAction('steal', playerB.hand[0].uid, playerA);
  let actions = getShortenActions(game.expectedActions);
  expect(playerB.hand.length).toEqual(0);//cards stolen
  expect(playerA.hand.length).toEqual(3);//started with 2 draw + stolen - usage of card
  expect(actions).toContainEqual({ action: "draw", player: playerB.uid });//turn end
  checkForListenersMemLeak([playerA, playerB], game);
});

function setupGame(noCards?: boolean) {
  const playerA = new Player("Player A");
  playerA.hand = [new Card("blatantthievery"), new Card("basicred"), new Card("neigh")];
  playerA.stable.unicorns = noCards ? [] : [new Card("basicred")];
  const playerB = new Player("Player B");
  playerB.hand = [new Card("blatantthievery"), new Card("neigh")];
  playerB.stable.unicorns = [];
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
