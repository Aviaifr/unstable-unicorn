import ExpectedAction from "../src/GameModules/Actions/ExpectedActions";
import { Card } from "../src/GameModules/Card";
import Game from "../src/GameModules/Game";
import { Player } from "../src/GameModules/Player";
import { checkForListenersMemLeak } from "./memLeakHelper";

/**
 * SACRIFICE or DESTROY an Upgrade or Downgrade card.
 */
describe("targeteddestruction", () => {
  test("destroy own upgrade", () => {
    let { game, playerA, playerB } = setupGame(
      ["targeteddestruction"],
      ["basicred"],
      [{type: "upgrades", slugs: ['yay']}],
      [{type: "upgrades", slugs: ['yay']}],
      1
    );
    game.DoAction("draw", "y", playerA);
    game.Play(playerA.hand[0].uid, "discard", playerA.uid);
    game.DoAction('destroy', playerA.stable.upgrades[0].uid, playerA);
    let actions = getShortenActions(game.expectedActions);
    expect(playerA.stable.upgrades.length).toEqual(0);
    expect(actions).toContainEqual({ action: "draw", player: playerB.uid }); //turn end
    checkForListenersMemLeak([playerA, playerB], game);
  });
});

function setupGame(
  AHandcards: string[],
  BHandcards: string[],
  AStablecards: { type: "unicorns" | "upgrades" | "downgrades"; slugs: string[] }[],
  BStablecards: { type: "unicorns" | "upgrades" | "downgrades"; slugs: string[] }[],
  turns: number
) {
  const playerA = new Player("Player A");
  playerA.hand = AHandcards.map((name) => new Card(name));
  const playerB = new Player("Player B");
  playerB.hand = BHandcards.map((slug) => new Card(slug));
  BStablecards.forEach(c => c.slugs.forEach(s => playerB.stable[c.type].push(new Card(s))));
  AStablecards.forEach(c => c.slugs.forEach(s => playerA.stable[c.type].push(new Card(s))));
  const game = Game.fromDB(
    {
      currentPlayer: playerA.uid,
      deck: new Array(10).fill("basicred"),
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
