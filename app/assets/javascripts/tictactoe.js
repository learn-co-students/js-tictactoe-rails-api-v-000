// Code your JavaScript / jQuery solution here
var turn = 0
function player(){
  if(turn % 2 === 0){
    return "X"
  } else {
    return "O"
  }
}

function updateState(element){
  element.innerHTML += player();
}

function setMessage(string){
  $('div#message')[0].innerHTML += string
}

function checkWinner(){

}

function doTurn(){
  turn += 1
  checkWinner()
  setMessage('Player X Won!')
}

function attachListeners(){

  doTurn()
  updateState()
  checkWinner()
}

$(document).ready(function(){
  attachListeners()
})
