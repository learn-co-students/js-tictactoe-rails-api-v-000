var turn = 0;
var board = new Array(9);
var xWon = false;
var oWon = false;
var tie = false;
let gameOver = false;
var msg;

const win_combos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

var player = function() {
  if (turn % 2 === 0) {
   return "X"
  } else {
   return "O"
  }
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

function updateState(event) {
  const token = player();
  $(event.target).text(token);
  updateBoard();
}

function checkForTie() {
  for (var i=0; i < board.length; i++) {
    if (board[i] === "") {
      return;
    }
  }
  tie = true;
  msg = "Tie game"
}

function evaluateBoard() {
  const token = player();
  for (let i=0; i < win_combos.length; i++) {
    pos_1 = win_combos[i][0];
    pos_2 = win_combos[i][1];
    pos_3 = win_combos[i][2];
    if (board[pos_1] === token && board[pos_2] === token && board[pos_3] === token) {
      if (token === "X") {
        xWon = true;
        msg = "Player X Won!";
        return
      } else {
        oWon = true;
        msg = "Player O Won!";
        return
      }
    }
  }
  checkForTie();
}

function message(msg) {
  $("#message").text(msg);
}

function checkWinner() {
  evaluateBoard();
  if (xWon === true || oWon === true || tie === true) {
    message(msg);
  } else {
    return false;
  }
}

function doTurn(event) {
  updateState(event);
  checkWinner();
  turn += 1;
}

var attachListeners = function() {
    $('td').on('click', function(event) {
      if ($(event.target).html() === "") {
        doTurn(event);
      }
  });
}

$(document).ready(function() {
    attachListeners();
});
