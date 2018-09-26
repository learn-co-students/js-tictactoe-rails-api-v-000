//----------------------------------------------------
// Game Board and Message Handling 
//----------------------------------------------------
function getState() {
    var squaresDOM = $.find('td');
    return $.makeArray(squaresDOM).map ( square => square.innerText); 
}

function updateBoard(row, col, mark) {
    $(`tr:nth-of-type(${row}) td:nth-of-type(${col})`).text(mark);
}

function setMessage (message) {
    $('#message').append(message);
}

function currentSquare(row, col) {
    return $(`tr:nth-of-type(${row}) td:nth-of-type(${col})`).text();
}

//------------------------------------------------------
// Game Logic
//------------------------------------------------------
var turn = 0;
var gameId = 0;

function newGame (id=0, squares=["","","","","","","","",""]) {
    gameId = id;
    turn = 0;

    squares.forEach( function (square,index) {
        let row = (Math.floor(index/3)) + 1;
        let col = (index % 3) + 1; 
        updateBoard(row,col,square);   
        if (square != '') ++turn;
    });
}

function player() {
    return turn & 1 ? 'O' : 'X';
} 

function findWinner(state) {
    const winners = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7],  [2,5,8], [0,4,8], [2,4,6]];
    let winnerMark="";

    winner = winners.find ( function (combo) {       
        return state[combo[0]]!='' && state[combo[0]]==state[combo[1]] &&
            state[combo[0]]==state[combo[2]]      
    });
    if (winner !== undefined) {
        winnerMark = state[winner[0]];
    }

    return winnerMark;
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
 
    let col = parseInt(square.dataset.x) + 1;
    let row = parseInt(square.dataset.y) + 1;
    if (currentSquare(row,col) === '') {
        updateBoard(row,col,player());
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