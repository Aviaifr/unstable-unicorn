import ExpectedAction from "../src/GameModules/Actions/ExpectedActions";
import { Card } from "../src/GameModules/Card";
import Game from "../src/GameModules/Game";
import { Player } from "../src/GameModules/Player";
import { checkForListenersMemLeak } from "./memLeakHelper";

/**
 * When this card enters your Stable, DRAW two cards then DISCARD a card.
 * */
describe('unicornonthecob', () => {
  test('get baby into stabel', () => {
    //expect('not implamented').toBe('implemented');
    let { game, playerA, playerB } = setupGame(['unicornonthecob'], ['basicred'],[],['basicred'],3);
    expect(playerA.hand.length).toEqual(1);
    game.DoAction('draw', 'y', playerA); //+ 1
    expect(playerA.hand.length).toEqual(2);
    game.Play(playerA.hand[0].uid, 'stable', playerA.uid); //-1 + 2 = +
    game.DoAction('draw', 'y', playerA); //+ 1
    game.DoAction('draw', 'y', playerA); //+ 1
    expect(playerA.hand.length).toEqual(3);
    game.DoAction('discard', playerA.hand[0].uid, playerA); // - 1
    expect(playerA.hand.length).toEqual(2);
    let actions = getShortenActions(game.expectedActions);
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
