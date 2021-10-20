import Mongoose, { Schema } from 'mongoose'


export interface IRoom{
    participants: number;
    creator: string,
    players: string[],
    uuid: string,
    game: string | null,
}

export default Mongoose.model<IRoom>('Rooms', new Schema<IRoom>(
    {
        participants: Number,
        creator: String,
        players: Array,
        uuid: String,
        game: String,
    }
));