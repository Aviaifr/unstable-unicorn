import ExpectedAction from "../src/GameModules/Actions/ExpectedActions";
import { Card } from "../src/GameModules/Card";
import Game from "../src/GameModules/Game";
import { Player } from "../src/GameModules/Player";
import { checkForListenersMemLeak } from "./memLeakHelper";


/**
 * Look at any player's hand. Take a card of your choice and add it to your hand
 * 
 * This test also includes unicornswap test
 */
describe('ANNOYING FLYING UNICORN Enters', () => {
  test("Played into stable", () => {
    let { game, playerA, playerB } = setupGame(["annoying"], ['basicred'],[],[],1);
    game.DoAction('draw', "y", playerA);
    game.Play(playerA.hand[0].uid, 'stable', playerA.uid);
    game.DoAction('hand_select', playerB.uid, playerA);
    game.DoAction('discard', playerB.hand[0].uid, playerB);
    let actions = getShortenActions(game.expectedActions);
    expect(playerB.hand.length).toEqual(0);//cards stolen
    expect(playerA.hand.length).toEqual(1);//started with 2 draw + stolen - usage of card
    expect(actions).toContainEqual({ action: "draw", player: playerB.uid });//turn end
    checkForListenersMemLeak([playerA, playerB], game);

  });

  test("Snatched", () => {
    let { game, playerA, playerB } = setupGame(["unicornswap"], ['basicred'],['basicred'],["annoying"],1);
    game.DoAction('draw', "y", playerA);
    game.Play(playerA.hand[0].uid, 'discard', playerA.uid);
    game.DoAction('hand_select', playerB.uid, playerA);
    game.DoAction('snatch', playerB.stable.unicorns[0].uid, playerA);
    game.DoAction('give', playerA.stable.unicorns[0].uid, playerA);
    game.DoAction('hand_select', playerB.uid, playerA);
    game.DoAction('discard', playerB.hand[0].uid, playerB);
    let actions = getShortenActions(game.expectedActions);
    expect(playerB.hand.length).toEqual(0);//discarded
    expect(playerA.stable.unicorns.length).toEqual(1);//started with 2 draw + stolen - usage of card
    expect(playerB.stable.unicorns.length).toEqual(1);//started with 2 draw + stolen - usage of card
    expect(actions).toContainEqual({ action: "draw", player: playerB.uid });//turn end
    checkForListenersMemLeak([playerA, playerB], game);
  });
});

describe('ANNOYING FLYING UNICORN back to hand', () => {
  test("Destroyed", () => {
    let { game, playerA, playerB } = setupGame(["twoforone"], ['basicred'],['basicred'],["annoying"],1);
    game.DoAction('draw', "y", playerA);
    game.Play(playerA.hand[0].uid, 'discard', playerA.uid);
    game.DoAction('sacrifice', playerA.stable.unicorns[0].uid, playerA);
    game.DoAction('destroy', playerB.stable.unicorns[0].uid, playerA);
    let actions = getShortenActions(game.expectedActions);
    expect(playerB.hand.length).toEqual(2);//annoying back to hand
    expect(playerA.stable.unicorns.length).toEqual(0);
    expect(playerB.stable.unicorns.length).toEqual(0);
    expect(playerB.hand.map(c => c.slug)).toContain('annoying');//annoying back to hand
    expect(actions).toContainEqual({ action: "draw", player: playerB.uid });//turn end
    checkForListenersMemLeak([playerA, playerB], game);
  });

  test("Sacrificed", () => {
    let { game, playerA, playerB } = setupGame(['twoforone'], ['basicred'],['annoying'],['basicred', 'basicred'],1);
    game.DoAction('draw', "y", playerA);
    game.Play(playerA.hand[0].uid, 'discard', playerA.uid);
    game.DoAction('sacrifice', playerA.stable.unicorns[0].uid, playerA);
    game.DoAction('destroy', playerB.stable.unicorns[0].uid, playerA);
    game.DoAction('destroy', playerB.stable.unicorns[0].uid, playerA);
    let actions = getShortenActions(game.expectedActions);
    expect(playerA.hand.length).toEqual(2);//draw + annoying back to hand
    expect(playerA.stable.unicorns.length).toEqual(0);
    expect(playerB.stable.unicorns.length).toEqual(0);
    expect(playerA.hand.map(c => c.slug)).toContain('annoying');//annoying back to hand
    expect(actions).toContainEqual({ action: "draw", player: playerB.uid });//turn end
    checkForListenersMemLeak([playerA, playerB], game);
  });
});

function setupGame(AHandcards: string[], BHandcards: string[], AStablecards: string[], BStablecards: string[], turns: number) {
  const playerA = new Player("Player A");
  playerA.hand = AHandcards.map(name => new Card(name));
   const playerB = new Player("Player B");
  playerB.hand = BHandcards.map(slug => new Card(slug));
  playerB.stable.unicorns = BStablecards.map(slug => new Card(slug));
  playerA.stable.unicorns = AStablecards.map(slug => new Card(slug));
  const game = Game.fromDB(
    {
      currentPlayer: playerA.uid,
      deck: new Array(10).fill('basicred'),
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
