// Code your JavaScript / jQuery solution here
var turn = 0


function isEven(turn) {
  return turn % 2 === 0;
}

function player(){
  return isEven(turn) ? 'X' : 'O';
}

function updateState(position){
  position.innerHTML = player();
}

function setMessage(string){
  $('div#message')
}

function checkWinner(){

}

function doTurn(position){


}

function attachListeners(){

}
