import { Game } from "../GameModules/Game";
import { Player } from "../GameModules/Player";
import { generateUID } from "../utils";

export class Room{

    private participants: number;
    private creatorSess: string;
    private players: Array<Player> = [];
    private _uuid: string;
    private game : Game | null = null;

    constructor(participants: number, creatorSess: string){
        this.participants = participants;
        this.creatorSess = creatorSess;
        this._uuid = generateUID();
    }

    public isAvailable():  boolean{
        return this.participants > this.players.length;
    }

    public joinRoom(player: Player): boolean{
        if(this.isAvailable()){
            this.players.push(player);
            return true;
        }
        return false;
    }

    public startGame(userSess : string): Game{
        if(userSess !== this.creatorSess){
            throw new Error("You are not allowed to do this");
        } else if(this.players.length < 1){
            throw new Error("Not enough players");
        }
        if(this.game === null){
            this.game = new Game(this.players)
        }
        return this.game;
    }

    public getCreator() : string {
        return this.creatorSess;
    }

    getPlayers(): Array<Player> {
        return this.players;
    }

    getCleanedGame(player: Player): Game | null {
        //here need to return a duplicate game object with hidden data for the cards/hands/deck etc...
        return this.game;
    }
    
    public get uuid(): string {
        return this._uuid;
    }
}