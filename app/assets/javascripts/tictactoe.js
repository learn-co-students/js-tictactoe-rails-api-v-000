var turn = 0;
var gameId;
var winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

var state = [
    new Array(3).fill(""), new Array(3).fill(""), new Array(3).fill("")
]

window.onload = () => {
    attachListeners();
    if(!gameId) createGame();
}

function attachListeners(){
    var saveButton = document.querySelector('#save')
    var prevGamesButton = document.querySelector('#previous')
    var clearButton = document.querySelector('#clear')
    var table = document.querySelector("table")
    saveButton.addEventListener('click', saveGame)
    prevGamesButton.addEventListener('click', previousGames)
    clearButton.addEventListener('click', clearGame)
    table.addEventListener('click', doTurn)
}

function clearState(){
    state = [
        new Array(3).fill(""), new Array(3).fill(""), new Array(3).fill("")
    ]
}


function doTurn(e){
    setMessage('')
    move(e)
    turn += 1;
}

function player(){
    return (turn % 2 == 0) ? "X" : "O"
}

function updateState(coord){
    state[coord[0]][coord[1]] = player();
}


function retrieveState(){
    
}

function translateState(){
    return state.flat();
}

function setMessage(msg){
    document.querySelector('#message').textContent = msg
}


function winner(){
    var playerMoves = playerSpots(player());
    for(combo of winCombos){
        var containsCombo = true;
        for(place of combo){
            if(!playerMoves.includes(place)){
                containsCombo = false;
                break;
            }
        }
        if(containsCombo){
            return player();
        }
    }
    return false
}

function playerSpots(player){
    moveLocations = [];
    var flatState = translateState();
    var i;
    while((i = flatState.indexOf(player, i)) >= 0){
        moveLocations.push(i++);
    }
    return moveLocations;
}

function move(e){   
    var coord = findSource(e)
    if(validCoord(coord)){
        updateState(coord);
        displayMove(coord);
        checkGameOver();
    }else{
        invalidMove();
    }
}

function checkGameOver(){
    var gameWinner = winner()
    if(gameWinner || boardFull()) endGame(gameWinner) 
}

function endGame(winner = null){
    document.querySelector('table').removeEventListener('click', doTurn)
    if(!!winner){
        setMessage(winner + "wins the game!")
    }else{
        setMessage("Game is a draw")
    }
}

function boardFull(){
    return !state.flat().includes("")
}

function displayMove(coord){
    document.querySelector('[data-x="' + coord[0] +  '"][data-y="' + coord[1] + '"]').innerHTML = player();
}

function validCoord(coord){
    return ["0", "1", "2"].includes(coord[0]) && ["0", "1", "2"].includes(coord[1]) && (document.querySelector('[data-x="' + coord[0] +  '"][data-y="' + coord[1] + '"]').innerHTML === "")
}

function invalidMove(){
    setMessage("Invalid move. Try again.")
}

function findSource(e){
    var src = e.target
    return [src.dataset.x, src.dataset.y]
}

function createGame(){
    fetch('/games', {
        method: "POST",
        body: JSON.stringify({state: translateState()}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.text())
    .then(json => console.log(json))
}

function saveGame(){

    fetch('/games/' + gameId, {
        method: 'PATCH',
        body: JSON.stringify({ state: translateState()})
    })
}

function previousGames(){
    alert('prev games')
}

function clearGame(){
    alert('clear')
}

