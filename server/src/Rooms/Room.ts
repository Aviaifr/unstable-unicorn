import { Game } from "../GameModules/Game";
import { Player } from "../GameModules/Player";
import { generateUID } from "../utils";

export class Room{

    private participants: number;
    private creator: Player;
    private players: Array<Player> = [];
    private _uuid: string;
    private _game: Game | undefined = undefined;

    constructor(participants: number, creator: Player){
        this.participants = participants;
        this.creator = creator;
        this._uuid = generateUID();
        this.joinRoom(creator);
    }

    public isAvailable():  boolean{
        return this.participants > this.players.length;
    }

    public joinRoom(player: Player): boolean{
        if(this.isAvailable() && !this.players.some(listPlayer => listPlayer == player)){
            this.players.push(player);
            return true;
        }
        return false;
    }

    public startGame(player : Player): Game | undefined{
        if(player.uid !== this.creator.uid){
            throw new Error("You are not allowed to do this");
        } else if(this.players.length < 1){
            throw new Error("Not enough players");
        }
        if(!this._game){
            this._game = new Game(this.players)
        }
        return this._game;
    }

    public getCreator() : Player {
        return this.creator;
    }

    getPlayers(): Array<Player> {
        return this.players;
    }
    
    public get uuid(): string {
        return this._uuid;
    }

    public get game(): Game | undefined{
        return this._game
    }

    toJSON(user: Player | undefined){
        return {
            uuid: this._uuid,
            players: this.players.map((player: Player) => player.toJson(user)),
            maxPlayers: this.participants,
            creator: this.creator.uid
        }
    }
}