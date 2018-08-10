// Code your JavaScript / jQuery solution here
function player (turn) {
  let playerToken = (turn % 2 === 0) ? "X" : "O";
  return playerToken;
}

// let turn = 0;
// turnCounter will be increased each time doTurn() gets called.
// function doTurn() {
//   return turn +=
// }

  // increase the turnCounter, then use it as the argument for player(). that output is then used to getElementById="x-0, y-1" as an example for the middle left square and set that element's innerHTML to the playerToken?
  function updateState(square) {
    $()
}

function setMessage(string) {
  $("#message").html(string);
}

// create the win conditions array and then set horizontalWin to be true if any of the horizontal combos is true using something like include. do the same for vertical and diagonal.


function checkWinner() {
  let horizontalWin
  let verticalWin
  let diagonalWin
  if (horizontalWin || verticalWin || diagonalWin) {
    setMessage(`Player ${player(turn)} Won!`);
    return true;
  } else {
    return false;
  }
}
