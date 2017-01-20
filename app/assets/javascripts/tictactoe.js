var turn = 0;

function attachListeners() {
  // will be called in $(document).ready to attach click handlers
  // click handlers pass params of clicked cell to doTurn()
}

function doTurn() {
  // turn + 1
  // calls updateState() and checkWinner()
}

function updateState() {
  // calls player(), adds return (x or o) to the clicked cell
}

function checkWinner() {
  // checks to see if anyone has won
  // if winner, calls on player to see who won
  // and passes "Player X/O Won" to message()
}

function player() {
  // returns x or o depending on whether turn is odd or even
  if (turn % 2 == 0) {
    return "o";
  } else {
    return "x";
  }
}

function message() {
  // adds the given string to div#message
}

$(document).ready(function () {

});
