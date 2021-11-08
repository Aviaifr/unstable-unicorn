import ExpectedAction from "../src/GameModules/Actions/ExpectedActions";
import { Card } from "../src/GameModules/Card";
import Game from "../src/GameModules/Game";
import { Player } from "../src/GameModules/Player";
import { checkForListenersMemLeak } from "./memLeakHelper";

/**
 * As ong as this card is in your Stable, cards you play cannot be Neigh’d.
 *
 */
describe("yay", () => {
  test("yay in stable no neigh", () => {
    let { game, playerA, playerB } = setupGame(
      ["unicornpoison"],
      ["neigh"],
      [{type: "upgrades", slugs: ['yay']}],
      [{type: "unicorns", slugs: ['basicred']}],
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

  test("yay activation neighed + neigh", () => {
    let { game, playerA, playerB } = setupGame(
      ["unicornpoison", 'yay'],
      ["neigh", "neigh"],
      [],
      [{type: "unicorns", slugs: ['basicred']}],
      4
    );
    game.DoAction("draw", "y", playerA);
    game.Play(playerA.hand[1].uid, "upgrade", playerA.uid); //play yay
    game.DoAction('neigh', 'yes', playerB);//neigh activation
    game.DoAction("draw", "y", playerB);//b turn
    game.DoAction("draw", "y", playerB);//b end turn
    game.DoAction("draw", "y", playerA);//a turn
    game.Play(playerA.hand[0].uid, "discard", playerA.uid); //a play poison
    game.DoAction('neigh', 'yes', playerB);//neigh
    let actions = getShortenActions(game.expectedActions);
    expect(playerB.stable.unicorns.length).toEqual(1); //nothing destroyed
    expect(playerA.stable.upgrades.length).toEqual(0); //nothing destroyed
    expect(actions).toContainEqual({ action: "draw", player: playerB.uid }); //should be b turn
    checkForListenersMemLeak([playerA, playerB], game);
  });

  test("destroy yay + neigh", () => {
    let { game, playerA, playerB } = setupGame(
      ["twoforone", 'neigh'],
      ['basicred'],
      [{type: "upgrades", slugs: ['yay']}],
      [{type: "unicorns", slugs: ['basicred']},
      {type: "upgrades", slugs: ['yay']}],
      1
    );
    game.DoAction("draw", "y", playerA);
    game.Play(playerA.hand[0].uid, "discard", playerA.uid); //play twoforone
    game.DoAction("sacrifice", playerA.stable.upgrades[0].uid, playerA);//sacrifice yay - still should be no neigh
    game.DoAction("destroy", playerB.stable.upgrades[0].uid, playerA);//destroy 2 cards
    game.DoAction("destroy", playerB.stable.unicorns[0].uid, playerA);
    expect(playerB.neighBlockedBy.length + playerA.neighBlockedBy.length).toEqual(0); //Both should be neigable
    game.DoAction("draw", "y", playerB);//b turn
    game.Play(playerB.hand[0].uid, "stable", playerB.uid); //a play card
    game.DoAction('neigh', 'yes', playerA);//player a uses neigh 
    let actions = getShortenActions(game.expectedActions);
    expect(playerB.stable.unicorns.length).toEqual(0); 
    expect(playerB.stable.upgrades.length).toEqual(0); 
    expect(playerA.stable.unicorns.length).toEqual(0); 
    expect(playerA.stable.upgrades.length).toEqual(0); 
    expect(actions).toContainEqual({ action: "draw", player: playerA.uid }); //should be A turn
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
