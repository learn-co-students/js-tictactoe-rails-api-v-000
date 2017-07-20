var current = 0
var turn = 0;

$(function() {
  attachListeners();
});

function attachListeners() {
  $('td').on('click', function(elem) {
    if (!$(this).text() && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#clear').on('click', function() {
    emptyBoard();
  });
}

function player() {
  if (turn % 2 !== 0) {
    return 'O';
  }
  return 'X';
}

function updateState(td) {
  var token = player();
  $(td).text(token);
}

var message = (string) => {
  $("#message").text(string);
}

function checkWinner() {
  const winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]

  var isWinner = false;
  var board = {};

  $('td').text((index, td) => {
    board[index] = td;
  });

  winCombos.some(function(comboArr) {
    if (board[comboArr[0]] !== '' && board[comboArr[0]] === board[comboArr[1]] && board[comboArr[1]] === board[comboArr[2]]) {
      isWinner = true;
      message(`Player ${board[comboArr[0]]} Won!`);
    }
  });

  return isWinner;
}

function doTurn(td) {
  updateState(td);
  turn++;
  checkWinner();
  if (turn == 9) {
    message('Tie game.');
    emptyBoard();
  }
}

function emptyBoard() {
  $('td').empty();
  turn = 0;
}
