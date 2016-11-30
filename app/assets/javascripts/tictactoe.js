// Main Tic Tac Toe functions

var turn = 0;

function attachListeners() {
  // Head of program, sets eventListeners for click events
  $('td').on('click', function(event) {
    var x = $(this).attr("data-x");
    var y = $(this).attr("data-y");
    doTurn(event);
  });
}

function doTurn(event) {
  // Game loop, responds to event and checks for game end
  updateState(event);
  if (!checkForGameOver()) {
    turn += 1;
  } else {
    resetBoard();
  }
}

function checkForGameOver() {
  // Checks for game ending event, directly called by game loop

  if (checkWinner() || checkForTie(getBoardState())) {
    return true;
  }
  return false;
}

function checkWinner() {
  // Checks board state against winning combinations,
  // returns true or false

  var winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
  var board = getBoardState();
  for (var combo in winningCombos) {
    var position0 = winningCombos[combo][0];
    var position1 = winningCombos[combo][1];
    var position2 = winningCombos[combo][2];

    if (board[position0] === board[position1] && board[position1] === board[position2] && board[position0] !== "") {
      message("Player " + board[position0] + " Won!");
      return true;
    }
  }
  return false;
}

function checkForTie(board) {
  // Checks for a tie game, returns true or false
  // called by checkForGameOver()

  for (var element in board) {
    if (board[element] === "") {
      message("Tie game");
      return false;
    }
  }
  return true;
}

function resetBoard() {
  // Resets board and turn variable

  turn = 0;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      $('[data-x="' + j + '"][data-y="' + i + '"]').text("");
    }
  }
}

function updateState(event) {
  // Writes player token to cell clicked, accepts event from
  // eventListener on board.

  $(event.currentTarget).text(player());
}

function player() {
  // updates player token based on turn. X goes first.

  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}

function message(message) {
  // writes whether game is a tie, or which player won (by token).
  $("#message").text(message);
}

function getBoardState() {
  // function grabs board state and returns that state, used
  // to check for win conditions.

  var state = [];
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      state.push($('[data-x="' + j + '"][data-y="' + i + '"]').text());
    }
  }
  return state;
}


/////////////////////////////
// Start game on page load //
/////////////////////////////
$(function() {
  attachListeners();
});
