// Code your JavaScript / jQuery solution here
function player (turn) {
  let playerToken = (turn % 2 === 0) ? "X" : "O";
  return playerToken;
}

function updateState(square) {
  // increase the turnCounter, then use it as the argument for player(). that output is then used to getElementById="x-0, y-1" as an example for the middle left square and set that element's innerHTML to the playerToken?
}

function setMessage (string) {
  $("#message").html(string);
}
