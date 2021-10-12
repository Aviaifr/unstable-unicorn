import { Card } from "./Card";

export class Stable {
    static fromDB(stable: { downgrades: string[]; upgrades: string[]; unicorns: string[]; }) : Stable {
        const val = new this();
        val.downgrade = stable.downgrades?.map(slug => new Card(slug));
        val.upgrades = stable.upgrades?.map(slug => new Card(slug));
        val.unicorns = stable.unicorns?.map(slug => new Card(slug));
        return val;
    }

    unicorns: Array<Card>;
    upgrades: Array<Card>;
    downgrade: Array<Card>;
    
    constructor(){
        this.unicorns = [];
        this.upgrades = [];
        this.downgrade = [];
    }
}
