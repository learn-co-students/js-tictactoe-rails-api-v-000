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
    gameId = null;
    turn = 0;
    resetMoveListener();
}


function doTurn(e){
    setMessage('')
    move(e)
}

function player(){
    return (turn % 2 == 0) ? "X" : "O"
}

function updateState(coord){
    state[coord[1]][coord[0]] = player();
}


function translateState(){
    return state.flat();
}

function setMessage(msg){
    document.querySelector('#message').textContent = msg
}

function checkWinnerFor(playerToken){
    var playerMoves = playerSpots(playerToken);
    for(combo of winCombos){
        var containsCombo = true;
        for(place of combo){
            if(!playerMoves.includes(place)){
                containsCombo = false;
                break;
            }
        }
        if(containsCombo){
            return playerToken;
        }
    }
    return false
}

function winner(bothPlayers = false){
    if(bothPlayers){
        return checkWinnerFor("X") || checkWinnerFor("O");
    }else{
        return checkWinnerFor(player());
    }
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
        turn += 1;
    }else{
        invalidMove();
    }
}

function checkGameOver(bothPlayers = false){
    var gameWinner = winner(bothPlayers)
    if(gameWinner || boardFull()) endGame(gameWinner) 
}

function endGame(winner = null){
    clearMoveListener();
    if(!!winner){
        setMessage(winner + " wins the game!")
    }else{
        setMessage("Game is a draw")
    }
}

function clearMoveListener(){
    document.querySelector('table').removeEventListener('click', doTurn)
}

function addMoveListener(){
    document.querySelector('table').addEventListener('click', doTurn)
}

function resetMoveListener(){
    clearMoveListener();
    addMoveListener();
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
        body: JSON.stringify({
            state: translateState(),
            credentials: "same-origin"
        }),
        headers: reqHeaders()
    })
    .then(res => res.json())
    .then(json => gameId = json.data.id)

    // $.post('/games', {state: translateState()}, function(res){
    //     console.log(res)
    // })
}

function saveGame(){
    console.log("SAVING GAME");
    if(!!gameId){
        updateGame();
    }else{
        createGame();
    }
    
}

function updateGame(){
    fetch('/games/' + gameId, {
        method: 'PUT',
        body: JSON.stringify({ 
            state: translateState()
        }),
        headers: reqHeaders()
    })
}


function reqHeaders(){

    return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'X-CSRF-Token': window._token
    }
}

function previousGames(){
    clearButtons();
    games = loadAllGames();
    games
    .then(function(res){
        return res.json();
    })
    .then(function(gamesData){
        for(game of gamesData.data){
            buttonizeGame(game.id)
        }
    })
}

function loadAllGames(){
    return fetch('/games', {
        headers: {
            "Accept": "application/json"
        }
    })
        
}

function buttonizeGame(id){
    var button = document.createElement('button')
    button.innerHTML = id;
    button.dataset.id = id;
    button.addEventListener('click', function(e){
        var id = button.dataset.id;
        clearGame();
        loadGame(id);
    });
    document.querySelector('#games').appendChild(button);

}

function loadGame(id){
    gameId = id;
    setMessage("");
    fetch('/games/' + id, {
        headers: {
            "Accept": "application/json"
        }
    })
        .then(function(res){
            return res.json();
        })
        .then(function(gameData){
            var stateArr = gameData.data.attributes.state;
            console.log(stateArr);
            state = unflattenState(stateArr);
            renderBoard();
            resetMoveListener();
            checkGameOver(true);
        })
}

function renderBoard(){
    turn = 0;
    for(var i = 0; i < 3; i++){
        for(var j = 0; j < 3; j++){
            if(state[i][j] !== ""){
                turn++;
            }
            document.querySelector('[data-y="' + i + '"][data-x="' + j + '"]').innerHTML = state[i][j];
        }
    }
}

function clearButtons(){
    document.querySelector('#games').innerHTML = "";
}

function unflattenState(stateArr){
    var newState = [];
    for(var i = 0; i < 3; i++){
        var start = i * 3;
        var subState = stateArr.slice(start, start + 3);
        newState.push(subState);
    }
    return newState;
}

function clearGame(){
    saveGame();
    clearState();
    clearMoves();
}

function clearMoves(){
    document.querySelectorAll('td').forEach(function(el){
        el.innerHTML = ""
    })
}

