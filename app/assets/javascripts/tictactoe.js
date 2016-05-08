"use strict";

var turn = 0;

function attachListeners(){
  
}

function doTurn(){
  turn++;
}

function player(){
  if (turn % 2 === 0){
    return "X";
  } else {
    return "O";
  }
}

function updateState(){

}

function checkWinner(){

}

function message(string){

}
