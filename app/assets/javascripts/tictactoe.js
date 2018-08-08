// Code your JavaScript / jQuery solution here
function player (turn) {
  let playerToken = (turn % 2 === 0) ? "X" : "O";
  return playerToken;
}
