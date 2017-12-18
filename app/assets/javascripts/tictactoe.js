// Code your JavaScript / jQuery solution here
var turn = 0

$( function(){

});

function player() {
  if (turn == 0 || turn % 2 == 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(square) {
  $(square).text(player())
}
