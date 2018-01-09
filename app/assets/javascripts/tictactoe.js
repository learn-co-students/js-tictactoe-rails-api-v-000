// Code your JavaScript / jQuery solution here

$(document).ready(function() {
    attachListeners();
});

// Listeners
function attachListeners() {
    saveBtn();
    previousBtn();
    clearBtn();
    tableBtn();
    // gamesBtn()
};

// Listener Functions
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
// function gamesBtn() {
    // $('#games').click(function() {
        // Get ID of selected game
            // loadGame(id);
    // });
// };    


// Game Variables
var turn = 0;
var gameID = 0;
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

// Helper Functions
function isEven(num) {
    return num % 2 === 0;
};

function boardToArr() {
    let currentBoard = $('td').map(function(e) {
        return e.innerHTML
    });
    return currentBoard;
};

// Game Functions
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
    var status = false;
    const table = boardToArr();
    let win = winningCombo.forEach(function(combo) {
        var winId0 = combo[0];
        var winId1 = combo[1];
        var winId2 = combo[2];

        var pos0 = table[winId0];
        var pos1 = table[winId1];
        var pos2 = table[winId2];

        if (pos0 != "" && pos0 === pos1 && pos1 === pos2) {
            setMessage(`Player ${pos0} Won!`);
            status = true;
        };
    });
    return status;
};    
    // checkWinner() = returns true if thers 3 in a row, false if no winning combination is present
        // if winner
        // set message to "Player [winning player] Won!"
    // doTurn() = increment turnCounter
        // invoke checkWinner()
        // invoke updateState
        // invoke setMessage
            // with "Tie Game" if game ends in tie
        //  reset board and turnCounter when a game is won
    // resetBoard


// AJAX Functions
    // saveGame
    // previousGames
    // loadGame(id) from gamesBtn()

