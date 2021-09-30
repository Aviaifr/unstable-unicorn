const socket = io();
const handleInit = (msg) => console.log(msg);
socket.on('init', handleInit);

const newgameButton = document.getElementById("newGame");
const gameIdTex = document.getElementById("gameID");
const joingameButton = document.getElementById("joinGame");

const startGameButton = document.getElementById("startGame");




newgameButton.addEventListener('click', newGame);
joingameButton.addEventListener('click', joinGame);
startGameButton.addEventListener('click', () => {
    console.log('startGame');
    socket.emit('startGame');
});

socket.on('room_created', data => {
    document.getElementById("roomId").innerHTML = data.roomID;
});

function newGame(){
    socket.emit("newGame");
}

function joinGame(){
    const code = gameIdTex.value;
    socket.emit('joinGame', code);
}

socket.on('joinedRoom', data => {
    console.log(data);
    if(data.status === 200){
        loadPlayersData(data.players);
        socket.on('playersList', pdata => { loadPlayersData(pdata.players)});
    }
});

function loadPlayersData(playersArray){
    const playerList = document.getElementById("playerList")
    playerList.innerHTML = '';
    playersArray.forEach(player => {
        const li = document.createElement('li');
        li.innerHTML = player.name;
        playerList.appendChild(li);
    });
}

socket.on('gameStarted', data => {
    showNursery(data.game.nursery);
   //updateField(data.players);
});
function showNursery(babies){
    nursery = document.getElementById('nursery');
    babies.forEach(card => generateCard(card, nursery, (uid) => {
        socket.emit('baby-selected', uid);
        nursery.style.display = 'none';
    }));
    nursery.style.display = 'block';
}

function updateField(players){
    let player = players[0];
    const hand = document.getElementById('hand');
    console.log(player.hand);
    player.hand.forEach(card => generateCard(card, hand));
}

function generateCard(card, container, callable = null){
    const carddiv = document.createElement('div');
    const title = document.createElement('p');
    const type = document.createElement('p');
    const text = document.createElement('p');
    const img = document.createElement('img');
    const icon = document.createElement('img');
    icon.src = `./resources/cards/typeIcons/${card.type}.gif`
    icon.className = 'icon'
    title.innerHTML = card.name;
    title.classList = `title ${card.name.length > 16 ? 'smaller' : '' }`;
    type.innerHTML = cardTypeToText(card.type);
    type.classList = `${card.type} type`;
    text.innerHTML = card.text;
    img.src = `./resources/cards/images/${card.slug}.jpg`
    carddiv.appendChild(icon);
    carddiv.appendChild(title);
    carddiv.appendChild(img);
    carddiv.appendChild(type);
    carddiv.appendChild(text);
    if(callable){
        carddiv.addEventListener("click", () => callable(card.uid));
    }
    container.appendChild(carddiv);
}

function cardTypeToText(name){
    let res = name[0].toUpperCase() + name.substring(1);
    switch(res){
        case 'Basic':
        case 'Baby':
        case 'Ultimate':
        case 'Magical':
            res = `Unicorn (${res})`;
    }
    return `Card Type: ${res}`;
}