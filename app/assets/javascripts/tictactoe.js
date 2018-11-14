// using var instead of let/const because tests might not be updated for ES6

// button#save
// button#previous
// button#clear

var turn = 0;
var winner;
var possibles = [];
var wins = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]

function player() {
  return turn % 2 === 0 ? "X" : "O";
}


function updateState(square) {
  $(square).text(player())
}


function setMessage(message) {
  $("#message").text(message)
}

function checkWinner() {
  var board = [];
  var winner = false;

  $("td").each(function() {
    board.push(this.textContent);
  });

  wins.some(function(combo) {
    if (
      board[combo[0]] !== "" &&
      board[combo[0]] === board[combo[1]] &&
      board[combo[1]] === board[combo[2]]
    ) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return (winner = true);
    }
  });

  return winner;
}


function doTurn(space) {
  updateState(space);
  turn++;
  if (checkWinner()) {
    $('td').empty();
    turn = 0;
  } else if (turn === 9) {
    setMessage("Tie game.");
  }

}


function attachListeners() {
  $(document).ready()
}
