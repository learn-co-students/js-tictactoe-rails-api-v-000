// Code your JavaScript / jQuery solution here
var turn = 0
function player(){
  if(this.turn % 2 === 0){
    return "X"
  } else {
    return "O"
  }
}

function updateState(){

}

function setMessage(){

}

function checkWinner(){

}

function doTurn(){
  turn += 1
}

function attachListeners(){

  doTurn()
}

$(document).ready(attachListeners())
