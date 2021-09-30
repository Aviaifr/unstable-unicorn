import { Card } from "./Card";
import { Stable } from "./Stable";
import { generateUID } from "../utils"

export class Player {
    clearSensitiveData(): Player {
        return new Player(this.name, 'irrelevant!', this.stable, this.hand);
    }
    name: string;
    hand: Array<Card>;
    stable: Stable;
    uid: string
    
    constructor(name: string, uid: string | null = null, stable : Stable | null = null, hand: Array<Card> | null = null){
        this.name = name;
        this.stable = stable ?? new Stable();
        this.uid = uid ?? generateUID();
        this.hand = hand ?? [];
    }

    Draw(deck: Array<Card>) : void{
        let card: Card | null = deck.pop() ??  null;
        if(card){
            this.hand.push(card);
        }
    }
}

module.exports.Player = Player;