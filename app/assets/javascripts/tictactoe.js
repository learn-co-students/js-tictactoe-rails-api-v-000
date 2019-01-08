// Code your JavaScript / jQuery solution here

var turn;

function player() {
  return turn % 2 ? "O" : "X";
}

function updateState(clickedSquare) {
  let token = player();
  $(clickedSquare).text(token);
}