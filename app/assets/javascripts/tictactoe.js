// Code your JavaScript / jQuery solution here
var turn = 0;
var winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function player() {
  if (turn % 2 === 0) {
    return 'X';
  } else {
    return 'O';
  }
}

function updateState(grid) {
  $(grid).html(player());
}

function setMessage(message) {
  $('#message').text(message);
}

function checkWinner() {
  let winner = false;
  const board = {};

  $('td').text((index, square) => board[index] = square);

  winningCombos.forEach(function(mark) {
    if (board[mark[0]] === board[mark[1]] && board[mark[1]] === board[mark[2]] && board[mark[0]] !== '') {
      setMessage(`Player ${board[mark[0]]} Won!`);
      winner = true;
    }
  })
  return winner;
}

function doTurn(clickedElement) {
  updateState(clickedElement);
  turn++;
  if (checkWinner()) {
    resetBoard();
  } else if (turn === 9) {
    setMessage('Tie game.');
    resetBoard();
  }
}

function resetBoard() {
  $('td').html('');
  turn = 0;
}

$(document).ready(function() {
  attachListeners();
})

function attachListeners() {
  $('td').click (function() {
    if (!checkWinner() && !$.text(this)) {
      doTurn(this);
    }

  })
}
