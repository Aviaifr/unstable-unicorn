import ExpectedAction from "../src/GameModules/Actions/ExpectedActions";
import { Card } from "../src/GameModules/Card";
import Game from "../src/GameModules/Game";
import { Player } from "../src/GameModules/Player";
import { checkForListenersMemLeak } from "./memLeakHelper";

/**
 * Trade hands with any player.
 */
describe("unfairbargain", () => {
  test("trade hands and validate reregister", () => {
    let { game, playerA, playerB } = setupGame(
      ["unfairbargain"],
      ["basicred", 'basicblue', 'neigh'],
      [{type: "upgrades", slugs: ['yay']}],
      [{type: "unicorns", slugs: ['basicred']}],
      4
    );
    game.DoAction("draw", "y", playerA);
    game.Play(playerA.hand[0].uid, "discard", playerA.uid);
    game.DoAction('hand_select', playerB.uid, playerA);
    game.DoAction("draw", "y", playerB);
    game.Play(playerB.hand[0].uid, "stable", playerB.uid);
    game.DoAction("neigh", "yes", playerA);    
    let actions = getShortenActions(game.expectedActions);
    expect(playerB.hand.length).toEqual(1);
    expect(playerB.stable.unicorns.length).toEqual(1);//card played neighed so unicorn not added
    expect(playerA.hand.length).toEqual(2);//b hand had 3 cards, stolen by A and used neigh
    expect(actions).toContainEqual({ action: "draw", player: playerA.uid }); //turn end
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
