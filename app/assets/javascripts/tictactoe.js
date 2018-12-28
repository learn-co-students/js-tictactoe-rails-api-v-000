// Code your JavaScript / jQuery solution here
const WINNING_COMBOS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

var turn = 0;

function player () {
  if (turn % 2 === 0 ){
    return `X`;
  } else {
    return `O`;
  }
}

function updateState(square) {
  var currentPlayer = player();
  $(square).text(currentPlayer);
}

function setMessage(message) {
  $(`#message`).text(message);
}

function checkWinner(){
  var winner = false;
  
}
