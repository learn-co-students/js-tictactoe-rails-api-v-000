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

// function gamesBtn() {
    // $('#games').click(function() {
        // Get ID of selected game
            // loadGame(id);
    // });
// };    
};

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

// Game Functions
function player() { // player() = determines if even (X) or odd (O)
    return isEven(turn) ? "X" : "O";
};
    
    // updateState(td) = add current player token to selected td element
    // setMessage() = sets a provided string as the innerHTML of the div#message element
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

