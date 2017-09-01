$(document).ready(function() {
  attachListeners();
});
const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0;
var currentGame = 0;

function player() {
  if (turn % 2 == 0) {
    return "X"
  }
  else {
    return "O"
  }
}

function updateState(square) {
  var token = player();
  $(square).text(token);
}

function message(string) {
  $('#message').text(string);
}

function checkWinner() {
  var board = {};
  var winner = false;

  $('td').text((index, square) => board[index] = square);

  WINNING_COMBOS.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      message(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });

  return winner;
}

function doTurn() {
  console.log("Increments the turn variable by 1. Invokes the updateState function, passing it the element that was clicked. Invokes checkWinner f to determine whether the move results in a winning play.")
}

function attachListeners() {
  console.log("Attaches the appropriate event listeners to the squares of the game board as well as for the button save, button previous, and button clear elements.  When a user clicks on a square on the game board, the event listener should invoke doTurn f  and pass it the element that was clicked.")
}
