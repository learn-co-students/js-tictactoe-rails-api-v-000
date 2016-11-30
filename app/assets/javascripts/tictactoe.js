var turn = 0;

function attachListeners() {
  $('td').on('click', function(event) {
    var x = $(this).attr("data-x");
    var y = $(this).attr("data-y");
    doTurn(event);
  });
}

function doTurn(event) {
  updateState(event);
  if (!checkForGameOver()) {
    turn += 1;
  }
}

function checkWinner() {
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
      resetBoard();
      return true;
    } else if (checkForTie(board)) {
      message("Tie game");
      resetBoard();
    }
  }
  return false;
}

function checkForTie(board) {
  for (var element in board) {
    if (board[element] === "") {
      return false;
    }
  }
  return true;
}

function checkForGameOver() {
  if (checkWinner() || checkForTie(getBoardState())) {
    return true;
  }
  return false;
}

function resetBoard() {
  turn = 0;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      $('[data-x="' + j + '"][data-y="' + i + '"]').text("");
    }
  }
}

function updateState(event) {
  $(event.currentTarget).text(player());
}

function player() {
  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}

function message(message) {
  $("#message").text(message);
}

function getBoardState() {
  var state = [];
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      state.push($('[data-x="' + j + '"][data-y="' + i + '"]').text());
    }
  }
  return state;
}


$(function() {
  attachListeners();
});
