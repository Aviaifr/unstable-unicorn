import { Card } from "./Card";

export class Stable {
    unicorns: Array<Card>;
    upgrades: Array<Card>;
    downgrade: Array<Card>;
    
    constructor(){
        this.unicorns = [];
        this.upgrades = [];
        this.downgrade = [];
    }
}
