//----------------------------------------------------
// Game Board and Message Handling 
//----------------------------------------------------
function getBoard() {
    return $.find('td');
}
function getState() {
    var squaresDOM = getBoard();
    return $.makeArray(squaresDOM).map ( square => square.innerHTML); 
}
function setMessage (message) {
    $('#message').append(message);
}


//------------------------------------------------------
// Game Logic
//------------------------------------------------------
var turn = 0;
var gameId = 0;

function newGame (id=0, squares=["","","","","","","","",""]) {
    gameId = id;
    turn = 0;

    var squaresDOM = getBoard();

    squares.forEach( function (square,index) {
        squaresDOM[index].innerHTML = square;
        if (square != '') ++turn;        
    });    
}

function player() {
    return turn & 1 ? 'O' : 'X';
} 

function findWinner(state) {
    const winners = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7],  [2,5,8], [0,4,8], [2,4,6]];
    winner = winners.find ( function (combo) {       
        return state[combo[0]]!='' && state[combo[0]]==state[combo[1]] &&
            state[combo[0]]==state[combo[2]]      
    });
    return (winner !== undefined) ? state[winner[0]] : "";
}  

function checkWinner () {
    let winner = findWinner(getState());

    if (winner !== "") {
        setMessage(`Player ${winner} Won!`);
        saveGame();
        newGame();
    }

    return (winner === "") ? false : true;
}

function gameOver() {
    let winner = findWinner (getState());
    return ( (winner!="") || turn>=9) ? true : false;    
}


function updateState (square) {
    if (square.innerHTML === "") {
        square.innerHTML = player();
        ++turn;
        return true;
    }
    return false;
}


//----------------------------------------------------
//  Board Click Event Handling
//----------------------------------------------------
function doTurn (square) {
    if (!gameOver()) {
        if (! updateState(square)) {
            setMessage("Invalid move. Square already taken.  Choose again");
        }
        else {
            if (!checkWinner() && turn>8) {
                setMessage("Tie game.");
                saveGame();
                newGame();
            }
        }
    }
}

//----------------------------------------------------
// Clear Game Button Handling
//----------------------------------------------------
function clearGame() {
    newGame();
}

//----------------------------------------------------
// Previous Game Buttons Handling
//----------------------------------------------------
function getPreviousGames() {
    $.get("/games", function(response) { 
        buildPreviousGameButtons(response.data);
    });
}

function buildPreviousGameButtons(games) {
    $("#games").empty();

    games.forEach ( function (game){
        var button = $('<button/>',
        {
            text: `${game["id"]}`,
            id: `${game["id"]}`,
            click: getGame
        });             
        $("#games").append(button);
    });
}

function getGame(e) {
    $.get(`/games/${this.id}`, function(response) { 
        newGame (response.data.id, response.data.attributes.state);
    });    
}

//----------------------------------------------------
// Save Game Handling
//----------------------------------------------------
function saveGame() {
    var squares = getState();
    if (gameId == 0) {
        $.post("/games", 
                { state: squares}, 
                function(response,status) { 
                    gameId=response.data.id       
                });
    }
    else {
        let data = { state: squares};
        $.ajax({
            url : `/games/${gameId}`,
            data : JSON.stringify(data),
            type : 'PATCH',
            contentType : 'application/json'
        });
    }
}


//-----------------------------------------------------
// App Set Up
//-----------------------------------------------------
function attachListeners() {
    $("td").click(function(e){    
        doTurn( this);
        return false;
    });
    $("#clear").click(function(e){    
        clearGame();
        return false;
    });
    $("#save").click(function(e){    
        saveGame();
        return false;
    });
    $("#previous").click(function(e){    
        getPreviousGames();
        return false;
    });
}

$(function () {
    attachListeners();
    newGame();
});