// Code your JavaScript / jQuery solution here

var turn = 0;
var board = [];

function player () {
    return ((turn%2 === 0) ? 'X' : 'O');
};

function updateState (square) {
    return $(square).text(player());
};

function setMessage (something) {
    return $('div#message').append(something);
};

const winCombinations= [
    [0,1,2], /*top row*/ [3,4,5], /* middle row*/ [6,7,8], /*bottom row*/
    [0,3,6], /*1st col*/ [1,4,7], /*2nd col*/ [2,5,8], /*3rd col*/
    [0,4,8], /*neg diag*/ [2,4,6] /*pos diag*/
];

function resetBoard () {
    turn = 0;
    $("td").empty();
};

function checkWinner () {
    var winner = false;
    
    $("td").text((index, square) => board[index] = square) 
    // populating an imaginary board by index (see http://api.jquery.com/text/#text2)
    
    winCombinations.forEach(function(combo) {
        var spot0 = combo[0];
        var spot1 = combo[1];
        var spot2 = combo[2];

        if ((board[spot0] === "X" && board[spot1] === "X" && board[spot2] === "X") || (board[spot0] === "O" && board[spot1] === "O" && board[spot2] === "O")) {
            var message = `Player ${board[spot0]} Won!`;
            setMessage(message);
            resetBoard();
            return winner = true;
        } 
    });
    return winner;
};

function doTurn (square) {
    updateState(square);
    turn++;
    if (!checkWinner() && turn === 9) {
        setMessage("Tie game.");
        resetBoard();
    }
};

function attachListeners (square) {

};

$(document).ready(() => {
// needs to invoke attachListeners()
});