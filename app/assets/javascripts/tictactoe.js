// Code your JavaScript / jQuery solution here
var turn = 0;

function player() {
    if (turn % 2 ===0) {
        return 'X';
    } else {
        return 'O';
    }
}

function updateState(square) {
    var currentPlayer = player();
    $(square).text(currentPlayer);
}