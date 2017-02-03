var winCombinations = [
  [[0,0], [1,0], [2,0]],
  [[0,1], [1,1], [2,1]],
  [[0,2], [1,2], [2,2]],
  [[0,0], [0,1], [0,2]],
  [[1,0], [1,1], [1,2]],
  [[2,0], [2,1], [2,2]],
  [[0,0], [1,1], [2,2]],
  [[2,0], [1,1], [0,2]]
]

var turn = 0
var currentGame = 0

$(document).ready(function() {
  attachListeners();
 });

var attachListeners = function () {
  $('td').click(function(event) {
    doTurn(event)
  });

}

function doTurn(event){
  turn++;
  updateState(event);
  checkWinner();
}

function player() {
  if( turn % 2 == 0){
    return "X";
  } else{
    return "O";
  }
}

function updateState(event){
  $(event.target).html(message);
}

function checkWinner() {

}
