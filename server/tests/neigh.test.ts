import ExpectedAction from "../src/GameModules/Actions/ExpectedActions";
import { Card } from "../src/GameModules/Card";
import Game from "../src/GameModules/Game";
import { Player } from "../src/GameModules/Player";
import { checkForListenersMemLeak } from "./memLeakHelper";

test("Neigh activated", () => {
  const { game, playerA, playerB } = setupGame();
  game.DoAction("draw", "y", playerA);
  game.Play(playerA.hand[0].uid, "stable", playerA.uid);
  game.DoAction("neigh", "yes", playerB);
  game.DoAction("neigh", "no", playerA);
  let actions = getShortenActions(game.expectedActions);
  expect(actions).toContainEqual({ action: "draw", player: playerB.uid });
  expect(playerA.stable.unicorns.length).toEqual(0);
  checkForListenersMemLeak([playerA, playerB], game);
});

test("Neigh not Activated", () => {
    const {game, playerA, playerB} = setupGame();
    game.DoAction("draw", "y", playerA);
    game.Play(playerA.hand[0].uid, "stable", playerA.uid);
    game.DoAction("neigh", "no", playerB);
    let actions = getShortenActions(game.expectedActions);
    expect(actions).toContainEqual({ action: "draw", player: playerB.uid });
    expect(playerA.stable.unicorns.length).toEqual(1);
    //console.log(game.listeners(Events.AFTER_CARD_RESOLVED).map(l=>l.toString()))
    checkForListenersMemLeak([playerA, playerB], game);
  });

  test("Neigh to the Neigh", () => {
    const {game, playerA, playerB} = setupGame();
    game.DoAction("draw", "y", playerA);
    game.Play(playerA.hand[0].uid, "stable", playerA.uid);
    game.DoAction("neigh", "yes", playerB);
    game.DoAction("neigh", "yes", playerA);
    let actions = getShortenActions(game.expectedActions);
    expect(actions).toContainEqual({ action: "draw", player: playerB.uid });
    expect(playerA.stable.unicorns.length).toEqual(1);
    checkForListenersMemLeak([playerA, playerB], game);
  });

function setupGame(noCards?: boolean) {
  const neigh = new Card("neigh"),
    neigh2 = new Card("neigh"),
    card = new Card("basicred");
  const playerA = new Player("Player A");
  playerA.hand = noCards ? [] : [card, neigh2];
  const playerB = new Player("Player B");
  playerB.hand = noCards ? [] : [neigh];
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