import { Player } from "./GameModules/Player";
export function generateUID() : string {
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    return ("000" + firstPart.toString(36)).slice(-3) + ("000" + secondPart.toString(36)).slice(-3);
}

export function cleanPlayersDataForAll(currentPlayer: Player, allPlayers: Array<Player>): any {
    const cleanPlayersData : Array<Player> = [];
    allPlayers.forEach(player => {
        if(player.uid === currentPlayer.uid){
            cleanPlayersData.push(player);
        }else{
            cleanPlayersData.push(player.clearSensitiveData());
        }
    });
    return cleanPlayersData;
}

export function shuffleArray(array: Array<any>) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}