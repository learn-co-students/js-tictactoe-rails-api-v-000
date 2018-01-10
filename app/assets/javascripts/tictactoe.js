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
    gamesBtn();
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
        if (!checkWinner() && !checkTie()) {
            doTurn(this);
        };
    });
};
//function gamesBtn() {
    //$('#games').click(function() {
        // Get ID of selected game
            // loadGame(id);
    // });
// };    

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

function checkTie() {
    return turn === 9;
};

function currentBoard() {
    return $('td')
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
    let board = currentBoard();

    return winningCombo.some(function(position) {
        if (board[position[0]].innerHTML === board[position[1]].innerHTML && board[position[1]].innerHTML === board[position[2]].innerHTML && board[position[0]].innerHTML !== "") {
            setMessage(`Player ${board[position[0]].innerHTML} Won!`);
            return true;
        };
    });
};

function doTurn(position) {
    if (position.innerHTML === "") {
        updateState(position);
        turn++;

        if (checkWinner()) {
            //saveGame();
            resetBoard();
        } else if (checkTie()) {
            setMessage('Tie game.');
            //saveGame();
            resetBoard();
        };
    };
};

function resetBoard() {
    let board = currentBoard();
    board = Array.prototype.map.call(board, function(e) {
        e.innerHTML = "";
    });
    turn = 0
    gameId = 0
};

function savedBoard() {
    let board = currentBoard();
    board = Array.prototype.map.call(board, function(e) {
        return e.innerHTML;
    });
    return board;
};

///////////////////////////////
// AJAX Functions
///////////////////////////////

// saveGame -
    // when the current game has not been saved, send a POST request to "/games"
    // when the current game already exists in the database, send a PATCH request to the "/games/:id"
// previousGames -
    // sends a GET request to the "/games" route
    // when no previously-saved games exist in the database does not add any children to the div#games element in the DOM
    // when previously-saved games exist in the database adds those previous games as buttons in the DOM's div#games element
    // when previously-saved games exist in the database does not re-add saved games already present in the div#games element when the "previous" button is clicked a second time
// loadGame(id) from gamesBtn()
    // (in the div#games element) sends a GET request to the "/games/:id" route
    // loads the saved game's state into the board
    // marks the newly-loaded game state such that clicking the "save" button after loading a game sends a PATCH request
// clearGame -
    // when an unsaved game is in progress clears the game board
    // when the in-progress game has already been saved fully resets the game board so that the next press of the "save" button results in a new game being saved
