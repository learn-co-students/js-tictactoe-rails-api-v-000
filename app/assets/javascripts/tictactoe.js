// Code your JavaScript / jQuery solution here
var turn = 0

function doTurn(square){
  updateState(square)
  turn++
}

var player = () => turn % 2 ? "O": "X";

function updateState(){
  player()
}

function checkWinner() {
  
}

function attachListeners() {
  
}