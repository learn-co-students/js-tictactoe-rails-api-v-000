// Code your JavaScript / jQuery solution here
$(document).ready(attachListeners());
  $(window).on('load', function() {
    window.square = $('td');
});

var gameStatus = false;

const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
]


var turn = 0;

function player() {
  return turn % 2 === 0 ? "X" : "O";
}

function updateState(square) {
  var currentPlayer = player();
  $(square).text(currentPlayer);
}

function setMessage(message) {
  $('#message').text(message);
}

function checkWinner() {
  const WINNING_COMBOS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
  ]
  var winner = false;
  var board = {}

  $('td').text((index, square) => board[index] = square);

  WINNING_COMBOS.forEach(function(position) {
    if (board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && board[position[0]] !== "") {
      setMessage(`Player ${board[position[0]]} Won!`)
      return winner = true;
    }
  })
  return winner;
}

function doTurn(square) {
  if (!spaceTaken(square) && !gameStatus) {
    updateState(square);
    turn++;
    if (checkWinner()) {
      $('td').empty()
      turn = 0;
    } else if (turn === 9) {
      setMessage("Tie game.")
    }
  }
}

function attachListeners() {
  $('td').on('click', function() {
    doTurn(this)
  });
  $("#save").click(function(event) {
    saveGame();
  });
  $("#previous").click(function(event) {
    previousGame();
  });
  $("#clear").click(function(event) {
    clearBoard();
  })
}

function saveGame() {

}

function previousGame() {

}

function clearBoard() {
  turn = 0;
  $('td').empty()
}

function spaceTaken(square) {
  return $(square).text() !== ''
}
