import ExpectedAction from "../src/GameModules/Actions/ExpectedActions";
import { Card } from "../src/GameModules/Card";
import Game from "../src/GameModules/Game";
import { Player } from "../src/GameModules/Player";
import { checkForListenersMemLeak } from "./memLeakHelper";

/**
 * As long as this card is in your Stable, you cannot play instant cards.
 *
 */
describe("slowdown", () => {
  test("slowdown in stable - no neigh", () => {
    let { game, playerA, playerB } = setupGame(
      ["unicornpoison"],
      ["neigh"],
      [],
      [{type: "unicorns", slugs: ['basicred']}
      ,{type: "downgrades", slugs: ['slowdown']}],
      1
    );
    game.DoAction("draw", "y", playerA);
    game.Play(playerA.hand[0].uid, "discard", playerA.uid);
    game.DoAction("destroy", playerB.stable.unicorns[0].uid, playerA);
    let actions = getShortenActions(game.expectedActions);
    expect(playerB.stable.unicorns.length).toEqual(0);
    expect(actions).toContainEqual({ action: "draw", player: playerB.uid }); //turn end
    checkForListenersMemLeak([playerA, playerB], game);
  });

  test("slowdown removed - can neigh", () => {
    let { game, playerA, playerB } = setupGame(
      ["targeteddestruction"],
      ["neigh", "neigh"],
      [],
      [{type: "downgrades", slugs: ['slowdown']}],
      4
    );
    game.DoAction("draw", "y", playerA);
    game.Play(playerA.hand[0].uid, "discard", playerA.uid); //play destroy
    game.DoAction('destroy', playerB.stable.downgrades[0].uid, playerA);//destroy slowdown
    game.DoAction("draw", "y", playerB);//b turn
    game.DoAction("draw", "y", playerB);//b end turn
    game.DoAction("draw", "y", playerA);//a turn
    game.Play(playerA.hand[0].uid, "stable", playerA.uid); //a play card
    game.DoAction('neigh', 'yes', playerB);//neigh
    let actions = getShortenActions(game.expectedActions);
    expect(playerB.stable.getCardsByType('all').length).toEqual(0);
    expect(playerA.stable.getCardsByType('all').length).toEqual(0);
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
