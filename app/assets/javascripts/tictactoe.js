// Code your JavaScript / jQuery solution here
var turn = 0;

function player() {
  if (turn % 2 == 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState() {
  var result = player();
  $('td').innerHTML = result;
}



function message() {

}

function checkWinner(){


}


function doTurn() {


}

function attachListeners() {


}