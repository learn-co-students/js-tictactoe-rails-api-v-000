// Code your JavaScript / jQuery solution here

$(document).ready(function() {
    attachListeners();
});

///////////////////////////////
// Listeners
///////////////////////////////
function attachListeners() {
    saveBtn();
    previousBtn();
    clearBtn();
    tableBtn();
    // gamesBtn();
};

///////////////////////////////
// Listener Functions
///////////////////////////////
function saveBtn() {
    $('#save').click(saveGame);
};

function previousBtn() {
    $('#previous').click(previousGames);
};

function clearBtn() {
    $('#clear').click(clearGame);
};

function tableBtn() {
    $('td').click(function() {
        if (!checkWinner()) {
            doTurn(this);
        };
    });
};

//function gamesBtn() {

//};

///////////////////////////////
// Game Variables
///////////////////////////////
var turn = 0;
var gameId = 0;
var winningCombo = [  
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6] 
];

///////////////////////////////
// Helper Functions
///////////////////////////////
function isEven(num) {
    return num % 2 === 0;
};

///////////////////////////////
// Game Functions
///////////////////////////////
function player() { 
    return isEven(turn) ? "X" : "O";
};

function updateState(position) {
    if (position !== "") {
        position.innerHTML = player();
    };
};

function setMessage(string) {
    $('#message').html(string);
};

function checkWinner() {
    let currentBoard = $('td');

    return winningCombo.some(function(pos) {
        if (currentBoard[pos[0]].innerHTML === currentBoard[pos[1]].innerHTML && currentBoard[pos[1]].innerHTML === currentBoard[pos[2]].innerHTML && currentBoard[pos[0]].innerHTML !== "") {
            setMessage(`Player ${currentBoard[pos[0]].innerHTML} Won!`);
            return true;
        };
    });
};

function doTurn(position) {
    if (position.innerHTML === "") {
        updateState(position);
        turn++;

        if (checkWinner()) {
            saveGame();
            clearGame();
        } else if (turn === 9) {
            setMessage('Tie game.');
            saveGame();
            clearGame();
        };
    };
};

function clearGame() {
    $('td').html("")
    turn = 0;
    gameId = 0
};

///////////////////////////////
// AJAX Functions
///////////////////////////////

function saveGame() {
    var saveState = []
    $('td').each(function() {
        saveState.push(this.innerHTML)
    });
    if (gameId === 0) {
        $.ajax({
            method: 'POST',
            url: '/games',
            data: {state: saveState}
        }).done(function(data) {
            gameId = data.data.id;
        });
    } else {
        $.ajax({
            method: 'PATCH',
            url: `/games/${gameId}`,
            data: {state: saveState}
        });
    };
};

function previousGames() {
    $('#games').empty();
    $.get('/games', function(resp) {
        resp.data.forEach(function(game) {
            $('#games').append(`<button data-id="${game.id} onclick="loadGame(${game.id})">${game.id}</button>`);
        });
    });
};


// loadGame(id) from gamesBtn()
    // (in the div#games element) sends a GET request to the "/games/:id" route
    // loads the saved game's state into the board
    // marks the newly-loaded game state such that clicking the "save" button after loading a game sends a PATCH request