// Code your JavaScript / jQuery solution here
let turn1=0

function turn(){
  return turn1
}

function player(){
  if (turn1%2==0) { return 'X'} else {return 'O'}
}

function updateState(){
 return player()
}

function doTurn(){
  checkWinner()
  return turn1++
}

function checkWinner(){

}

function updateState(){

}

function attachListeners(){

}
