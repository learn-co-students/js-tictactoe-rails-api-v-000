// Code your JavaScript / jQuery solution here

var turn = 0;

var combos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

function player() {
  if ((turn % 2) === 0 ) {
    return 'X';
  } else {
    return 'O';
  }
}

function updateState(square) {
  $(square).text(player());
}

function setMessage(message) {
  $("#message").text(message);
}


function doTurn(square) {
  updateState(square);
  turn ++
  if (checkWinner()) {
      resetBoard();
  } else if (turn === 9) {
      setMessage("Tie game.")
      resetBoard();
  }
}

function resetBoard() {
  $("td").empty();
  turn = 0;
  currentGame = 0;
}