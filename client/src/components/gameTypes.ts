export interface IPlayingCard {
  type: string;
  name?: string; // use can use ?: for undefined types, keep the required above.
  uid?: string;
  text?: string;
  slug?: string;
}

export const emptyCard = {
  name: undefined,
  uid: undefined,
  type: "",
  text: undefined,
  slug: undefined,
};

export interface IPlayer {
  currentPlayer: boolean;
  name: string;
  uid: string;
  hand: Array<IPlayingCard>;
  stable: {
    unicorns: Array<IPlayingCard>;
    upgrades: Array<IPlayingCard>;
    downgrades: Array<IPlayingCard>;
  };
}

export const emptyPlayer: IPlayer = {
  currentPlayer: false,
  name: "",
  uid: "",
  hand: [],
  stable: {
    unicorns: [],
    upgrades: [],
    downgrades: [],
  },
};

export interface ExpectedAction {
  action: string;
  player: string;
  data?: Array<string>;
}
export interface IGame {
  players: Array<IPlayer>;
  discard: Array<IPlayingCard>;
  nursery: Array<IPlayingCard>;
  currentPlayer: string;
  uid: string;
  pendingAction: Array<ExpectedAction>;
}
