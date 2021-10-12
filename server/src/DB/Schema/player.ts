import Mongoose, { Schema } from 'mongoose'

export interface IDBPlayer {
    name: string,
    hand: Array<string>
    stable: {
        downgrades: Array<string>,
        upgrades: Array<string>,
        unicorns: Array<string>,
    }
    uid: string
};

export interface ISessionUser {
    session: string,
    player: IDBPlayer
}

export default Mongoose.model<ISessionUser>('SessionPlayer', new Schema<ISessionUser>(
{
    session: String,
    player: {
        name: String,
        hand: {
            type: Schema.Types.Array,
            of: String
        },
        stable: {
            downgrades:  {
                type: Schema.Types.Array,
                of: String
            },
            upgrades:  {
                type: Schema.Types.Array,
                of: String
            },
            unicorns: {
                type: Schema.Types.Array,
                of: String
            },
        },
        uid: String
    }
}
));