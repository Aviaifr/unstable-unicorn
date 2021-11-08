import ExpectedAction from "../src/GameModules/Actions/ExpectedActions";
import { Card } from "../src/GameModules/Card";
import Game from "../src/GameModules/Game";
import { Player } from "../src/GameModules/Player";
import { checkForListenersMemLeak } from "./memLeakHelper";

/**
 * You must have a Basic Unicorn in your Stable in order to play this card.
 * If this card in your Stable at the beginning of your turn, you may DRAW an extra card.
 *
 */
describe("extratail", () => {
  xtest("no basic - no play", () => {
    let { game, playerA, playerB } = setupGame(
      ["extratail"],
      ['annoying'],
      [],
      [],
      1
    );
    game.DoAction("draw", "y", playerA);
    game.Play(playerA.hand[0].uid, "stable", playerA.uid);

    let actions = getShortenActions(game.expectedActions);
    expect(playerA.stable.unicorns.length).toEqual(0);
    expect(actions).toContainEqual({ action: "draw", player: playerA.uid }); //same turn
    checkForListenersMemLeak([playerA, playerB], game);
  });

  test("basic in stable + extra draw next turn", () => {
    let { game, playerA, playerB } = setupGame(
      ["extratail"],
      [],
      [{type: "unicorns", slugs: ['basicred']}],
      [],
      4
    );
    game.DoAction("draw", "y", playerA); // 1
    game.Play(playerA.hand[0].uid, "stable", playerA.uid); //play extra
    game.DoAction("draw", "y", playerB);//b turn
    game.DoAction("draw", "y", playerB);//b end turn
    game.DoAction("draw", "y", playerA);//a turn start 2
    game.DoAction("draw", "y", playerA);//extra draw 3
    game.DoAction("draw", "y", playerA);//turn end 4
    let actions = getShortenActions(game.expectedActions);
    expect(playerB.stable.unicorns.length).toEqual(0);
    expect(playerA.stable.unicorns.length).toEqual(2);
    expect(playerA.hand.length).toEqual(4);
    expect(actions).toContainEqual({ action: "draw", player: playerB.uid }); //should be b turn
    checkForListenersMemLeak([playerA, playerB], game);
  });

  xtest("playing card end turn with double draw", () => {
    let { game, playerA, playerB } = setupGame(
      ["basicblue"],
      [],
      [{type: "unicorns", slugs: ['extratail']}],
      [],
      4
    );
    game.DoAction("draw", "y", playerA);
    game.Play(playerA.hand[0].uid, "stable", playerA.uid); //play to stable - no more draw
    let actions = getShortenActions(game.expectedActions);
    expect(playerB.stable.unicorns.length).toEqual(0);
    expect(playerA.stable.unicorns.length).toEqual(2);
    expect(playerA.hand.length).toEqual(1);
    expect(actions).toContainEqual({ action: "draw", player: playerB.uid }); //should be b turn
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
