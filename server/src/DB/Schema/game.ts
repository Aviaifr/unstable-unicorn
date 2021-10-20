import Mongoose, { Schema } from 'mongoose'


export interface IGame{
    players: Array<string>,
    deck: Array<string>,
    discard: Array<string>,
    nursery: Array<string>,
    inPlay: Array<string>,
    currentPlayer: string,
    uid: string,
    hasStarted: boolean,
}

export default Mongoose.model<IGame>('Games', new Schema<IGame>(
{
    players: [String],
    deck: [String],
    discard: [String],
    nursery: [String],
    currentPlayer: String,
    uid: String,
    hasStarted: Boolean
}
));
