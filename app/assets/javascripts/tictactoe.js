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
    // gamesBtn()
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
// function gamesBtn() {
    // $('#games').click(function() {
        // Get ID of selected game
            // loadGame(id);
    // });
// };    

///////////////////////////////
// Game Variables
///////////////////////////////
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

