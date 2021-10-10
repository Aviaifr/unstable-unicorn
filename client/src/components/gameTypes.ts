
export interface IPlayingCard{
    name: string | undefined;
    uid: string;
    type: string;
    text: string;
    slug: string | undefined;
}

export interface IPlayer{
    currentPlayer: boolean;
    name: string;
    uid: string;
    hand: Array<IPlayingCard>;
}


export interface IGame{
    players: Array<IPlayer>;
    discard: Array<IPlayingCard>;
    nursery: Array<IPlayingCard>;
    currentPlayer: string;
    uid: string;
    pendingAction:Map<string, string>;
}