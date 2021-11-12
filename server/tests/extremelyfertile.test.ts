import ExpectedAction from "../src/GameModules/Actions/ExpectedActions";
import { Card } from "../src/GameModules/Card";
import Game from "../src/GameModules/Game";
import { Player } from "../src/GameModules/Player";
import { checkForListenersMemLeak } from "./memLeakHelper";

/**
 * If this card is in your Stable at the beginning of your turn, 
 * you may DISCARD a card.
 * If you do, bring a Baby Unicorn directly into your Stable from the Nursery.
 * */
describe('extremelyfertile', () => {
  test('get baby into stabel', () => {
    let { game, playerA, playerB } = setupGame(['americorn'], ['basicred'],['extremelyfertile'],['basicred'],3);
    let actions = getShortenActions(game.expectedActions);
    expect(actions).toContainEqual({ action: playerA.stable.unicorns[0].uid, player: playerA.uid });
    game.DoAction(playerA.stable.unicorns[0].uid, 'yes', playerA);
    game.DoAction('discard', playerA.hand[0].uid, playerA);
    game.Draw(playerA);
    game.Draw(playerA);

    actions = getShortenActions(game.expectedActions);
    expect(actions).toContainEqual({ action: "draw", player: playerB.uid });//turn end
    expect(playerA.stable.unicorns.length).toEqual(2);
    expect(playerA.hand.length).toEqual(2);
    checkForListenersMemLeak([playerA, playerB], game);
  });

  test('start turn no effect', () => {
    let { game, playerA, playerB } = setupGame(['americorn'], ['basicred'],['extremelyfertile'],['basicred'],3);
    let actions = getShortenActions(game.expectedActions);
    expect(actions).toContainEqual({ action: playerA.stable.unicorns[0].uid, player: playerA.uid });
    game.Draw(playerA);
    actions = getShortenActions(game.expectedActions);
    expect(actions).toContainEqual({ action: "draw", player: playerA.uid });//turn end
    expect(actions.length).toEqual(1);
    game.Draw(playerA);
    actions = getShortenActions(game.expectedActions);
    expect(actions).toContainEqual({ action: "draw", player: playerB.uid });//turn end
    checkForListenersMemLeak([playerA, playerB], game);
  });


  test('two beggining of turn effect', () => {
    let { game, playerA, playerB } = setupGame(['americorn'], ['basicred'],['extremelyfertile', 'rhinocorn'],['basicred'],3);
    let actions = getShortenActions(game.expectedActions);
    expect(actions).toContainEqual({ action: playerA.stable.unicorns[0].uid, player: playerA.uid });
    game.DoAction(playerA.stable.unicorns[1].uid, 'yes', playerA);
    game.DoAction('destroy', playerB.stable.unicorns[0].uid, playerA);
    game.DoAction(playerA.stable.unicorns[0].uid, 'yes', playerA);
    game.DoAction('discard', playerA.hand[0].uid, playerA);
    actions = getShortenActions(game.expectedActions);
    expect(actions).toContainEqual({ action: "draw", player: playerB.uid });//turn end
    expect(playerA.hand.length).toBe(0);//turn end
    expect(playerB.stable.unicorns.length).toBe(0);//unicorn destroyed
    expect(playerA.stable.unicorns.length).toBe(3);//rhino+ fertile+baby
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
      nursery: ['babywhite','babywhite','babywhite'],
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
