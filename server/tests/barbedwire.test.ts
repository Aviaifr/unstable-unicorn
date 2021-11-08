import ExpectedAction from "../src/GameModules/Actions/ExpectedActions";
import { Card } from "../src/GameModules/Card";
import Game from "../src/GameModules/Game";
import { Player } from "../src/GameModules/Player";
import { checkForListenersMemLeak } from "./memLeakHelper";

/**
 * As long as this card is in your Stable, you must DISCARD a card each time a Unicorn enters or leaves your Stable.
 *
 */
describe("barbedwire", () => {
  test("destroy + discard", () => {
    let { game, playerA, playerB } = setupGame(
      ["unicornpoison"],
      ["basicred"],
      [],
      [{type: "unicorns", slugs: ['basicred']},
      {type: "downgrades", slugs: ['barbedwire']}],
      4
    );
    game.DoAction("draw", "y", playerA);
    game.Play(playerA.hand[0].uid, "discard", playerA.uid);
    game.DoAction("destroy", playerB.stable.unicorns[0].uid, playerA);
    game.DoAction("discard", playerB.hand[0].uid, playerB);
    let actions = getShortenActions(game.expectedActions);
    expect(playerB.hand.length).toEqual(0);
    expect(actions).toContainEqual({ action: "draw", player: playerB.uid }); //turn end
    checkForListenersMemLeak([playerA, playerB], game);
  });

  test("sacrifice + discard + doubledestroy to double discard", () => {
    let { game, playerA, playerB } = setupGame(
      ["twoforone"],
      ["basicred","basicred"],
      [{type: "unicorns", slugs: ['basicred']},
      {type: "downgrades", slugs: ['barbedwire']}],
      [{type: "unicorns", slugs: ['basicred','basicred']},
      {type: "downgrades", slugs: ['barbedwire']}],
      4
    );
    game.DoAction("draw", "y", playerA);
    game.Play(playerA.hand[0].uid, "discard", playerA.uid);
    game.DoAction("sacrifice", playerA.stable.unicorns[0].uid, playerA);
    game.DoAction("destroy", playerB.stable.unicorns[0].uid, playerA);
    game.DoAction("destroy", playerB.stable.unicorns[0].uid, playerA);
    game.DoAction("discard", playerB.hand[0].uid, playerB);
    game.DoAction("discard", playerA.hand[0].uid, playerA);
    game.DoAction("discard", playerB.hand[0].uid, playerB);
    let actions = getShortenActions(game.expectedActions);
    expect(actions).toContainEqual({ action: "draw", player: playerB.uid }); //turn end
    expect(playerA.hand.length).toEqual(0);
    expect(playerB.hand.length).toEqual(0);
    expect(playerA.stable.getCardsByType('all').length).toEqual(1); //only barbedwire remains
    expect(playerB.stable.getCardsByType('all').length).toEqual(1); //only barbedwire remains
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
