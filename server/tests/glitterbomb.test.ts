import ExpectedAction from "../src/GameModules/Actions/ExpectedActions";
import { Card } from "../src/GameModules/Card";
import Game from "../src/GameModules/Game";
import { Player } from "../src/GameModules/Player";
import { checkForListenersMemLeak } from "./memLeakHelper";

/**
 * If this card is in your Stable at the beginning of your turn,
 * you may SACRIFICE a card, then DESTROY a card.
 *
 */
describe("glitterbomb", () => {
  test("Activate Effect", () => {
    let { game, playerA, playerB } = setupGame(
      ["basicred"],
      ["neigh"],
      [{type: "upgrades", slugs: ['glitterbomb']},
      {type: "unicorns", slugs: ['basicred']}],
      [{type: "unicorns", slugs: ['basicred']}
      ,{type: "downgrades", slugs: ['slowdown']}],
      1
    );
    game.DoAction(playerA.stable.upgrades[0].uid, 'yes', playerA);
    game.DoAction('sacrifice', playerA.stable.unicorns[0].uid, playerA);
    game.DoAction('destroy', playerB.stable.unicorns[0].uid, playerA);
    game.DoAction('draw', 'y', playerA);
    game.Play(playerA.hand[0].uid, 'stable', playerA.uid);    
    let actions = getShortenActions(game.expectedActions);
    expect(playerB.stable.unicorns.length).toEqual(0);
    expect(actions).toContainEqual({ action: "draw", player: playerB.uid }); //turn end
    checkForListenersMemLeak([playerA, playerB], game);
  });

  test("Skip Effect", () => {
    let { game, playerA, playerB } = setupGame(
      ["basicred"],
      ["neigh"],
      [{type: "upgrades", slugs: ['glitterbomb']},
      {type: "unicorns", slugs: ['basicred']}],
      [{type: "unicorns", slugs: ['basicred']}
      ,{type: "downgrades", slugs: ['slowdown']}],
      1
    );
    game.DoAction('draw', 'y', playerA);
    let actions = getShortenActions(game.expectedActions);
    expect(actions).toContainEqual({ action: "draw", player: playerA.uid }); //turn end
    expect(actions.length).toBe(1);
    game.DoAction('draw', 'y', playerA);
    actions = getShortenActions(game.expectedActions);
    expect(actions).toContainEqual({ action: "draw", player: playerB.uid }); //turn end
    checkForListenersMemLeak([playerA, playerB], game);
  });

  test("activate fertile first cannot sacrifice baby", () => {
    let { game, playerA, playerB } = setupGame(
      ["basicred"],
      ["neigh"],
      [{type: "upgrades", slugs: ['glitterbomb']},
      {type: "unicorns", slugs: ['extremelyfertile']}],
      [{type: "unicorns", slugs: ['basicred']}
      ,{type: "downgrades", slugs: ['slowdown']}],
      1
    );
    game.DoAction(playerA.stable.unicorns[0].uid, 'yes', playerA); //activate fertile
    game.DoAction('discard', playerA.hand[0].uid, playerA);//discard to get baby
    expect(playerA.stable.unicorns.length).toBe(2); //verify count in stable
    game.DoAction(playerA.stable.upgrades[0].uid, 'yes', playerA); //activate glitterbomb
    expect(playerA.stable.unicorns.length).toBe(2); //verify count in stable
    expect(game.expectedActions[0].data?.length).toBe(2); //verify baby not in sascrifice list
    game.DoAction('sacrifice', playerA.stable.unicorns[0].uid, playerA); //sacrifice
    game.DoAction('destroy', playerB.stable.unicorns[0].uid, playerA); //destroy
    game.DoAction('draw', 'y', playerA);
    game.DoAction('draw', 'y', playerA);
    expect(playerA.hand.length).toBe(2); // 1discard + 2 draw
    let actions = getShortenActions(game.expectedActions);
    actions = getShortenActions(game.expectedActions);
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
      nursery: ['babywhite'],
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
