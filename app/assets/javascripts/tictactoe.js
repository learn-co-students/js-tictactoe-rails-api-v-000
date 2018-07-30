// Code your JavaScript / jQuery solution here
var turn=0



function player(){
  if (turn%2==0) { return 'X'} else {return 'O'}
}

function updateState(){
  let x=1
 if state[x]=="" {
   state[x]=player()
   return true
 }
 else {
 return false
 }
}

function doTurn(){
  checkWinner()
  return turn++
}

function checkWinner(){

}

function updateState(){

}

function attachListeners(){

}
