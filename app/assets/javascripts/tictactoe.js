var turn = 0;
var board = [];
const board_length = 9;
//var xWon = false;
//var yWon = false;

$(document).ready(function() {
    attachListeners();
});

var player = function() {
  if (turn % 2 === 0) {
   return "X"
  } else {
   return "O"
  }
}

function updateState (event) {
  const token = player();
  $(event.target).text(token);
}

function updateBoard() {
  board[0] = $('td[data-x="0"][data-y="0"]').html();
  board[1] = $('td[data-x="1"][data-y="0"]').html();
  board[2] = $('td[data-x="2"][data-y="0"]').html();
  board[3] = $('td[data-x="0"][data-y="1"]').html();
  board[4] = $('td[data-x="1"][data-y="1"]').html();
  board[5] = $('td[data-x="2"][data-y="1"]').html();
  board[6] = $('td[data-x="0"][data-y="2"]').html();
  board[7] = $('td[data-x="1"][data-y="2"]').html();
  board[8] = $('td[data-x="2"][data-y="2"]').html();
}

function checkBoardForWinner() {
  
}
function evaluateBoard() {
  updateBoard();
  console.log(board)
  //checkBoardForWinner();
}

function checkWinner () {
  evaluateBoard();
//  if (xWon) {
//    message("Player X Won!");
//  } else if (yWon) {
//    message("Player O Won!");
//  }
}

function doTurn(event) {
  turn += 1;
  updateState(event);
  checkWinner();
}

function attachListeners () {
  $('td').on('click', function(event) {
    doTurn(event);
  });
}

//var message = function(message) {
  //$("#message").text("message")
//}
