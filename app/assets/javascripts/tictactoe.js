var WINNERS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0;
var currentGame = 0;

$(document).ready(function(){
    // attachListeners();
})

function player() {
    let p = oddOrEven(turn);
    return p;
}

function oddOrEven(num){
    if(num % 2 == 0)
        return "X";
    return "O";
}

function updateState(square) {
    let p = player()
    $(square).text(p)
}

function setMessage(winner) {
    $('#message').text(winner)
}

function checkWinner() {
    let board = {};
    let winner = false;
    $('td').text((index, square) => board[index] = square);
    WINNERS.some(function(combo) {
        if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
          setMessage(`Player ${board[combo[0]]} Won!`);
          return winner = true;
        }
      });
    return winner;
}

function doTurn(square) {
    turn++;
    updateState(square);
    checkWinner();
    
}