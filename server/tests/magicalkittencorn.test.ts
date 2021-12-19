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
describe("magicalkittencorn", () => {
  test("cannot be destroyed by magic", () => {
    let { game, playerA, playerB } = setupGame(
      ["unicornpoison"],
      [],
      [{type: "unicorns", slugs: ['basicred']}],
      [{type: "unicorns", slugs: ['magicalkittencorn', 'basicred']}],
      1
    );
    game.DoAction('draw', 'y', playerA);
    game.Play(playerA.hand[0].uid, 'discard', playerA.uid);    
    expect(game.expectedActions[0].data).not.toContain(playerB.stable.unicorns[0].uid);
    let actions = getShortenActions(game.expectedActions);
    expect(actions).toContainEqual({ action: "destroy", player: playerA.uid }); //turn end
    checkForListenersMemLeak([playerA, playerB], game);
  });

  test("can be destroyed by unicorn effect ", () => {
    let { game, playerA, playerB } = setupGame(
      ["unicornpoison"],
      [],
      [{type: "unicorns", slugs: ['rhinocorn']}],
      [{type: "unicorns", slugs: ['magicalkittencorn', 'basicred']}],
      1
    );
    game.DoAction(playerA.stable.unicorns[0].uid, 'y', playerA);
    let actions = getShortenActions(game.expectedActions);
    expect(actions).toContainEqual({ action: "destroy", player: playerA.uid }); 
    expect(game.expectedActions[0].data).toContain(playerB.stable.unicorns[0].uid);
    game.DoAction('destroy', playerB.stable.unicorns[0].uid, playerA);
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
