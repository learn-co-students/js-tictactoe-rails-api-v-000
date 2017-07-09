// Code your JavaScript / jQuery solution here
var turn = 0;

function player() {
  if (turn % 2 == 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(sq) {
  var result = player();
  sq.innerHTML = result;
}

function message(string) {
  $('div#message').append(string);
}

function checkWinner(){


}


function doTurn() {


}

function attachListeners() {


}