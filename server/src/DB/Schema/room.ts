import Mongoose, { Schema } from 'mongoose'


export interface IRoom{
    participants: number;
    creator: string,
    players: Array<string>,
    uuid: string,
    game: string | null,
}

export interface ISessionRoom {
    session: string,
    room: IRoom
}

export default Mongoose.model<ISessionRoom>('SessionRoom', new Schema<ISessionRoom>(
{
    session: String,
    room: {
        participants: Number,
        creator: String,
        players: {
            type: Schema.Types.Array,
            of: String
        },
        uuid: String,
        game: String,
    }
}
));