// Code your JavaScript / jQuery solution here
var turn = 0

function player() {
  //let turns = 0
  //game.state.forEach(function(space) {
  //  if (space.includes("X") || space.includes("O")) {
  //    turns += 1
  //  }
  //})
  return (turn % 2 === 0) ? "X" : "O"
}
