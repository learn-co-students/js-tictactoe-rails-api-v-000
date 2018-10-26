// Code your JavaScript / jQuery solution here
var WINNING_COMBINATIONS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

var turn = 0;
var gameCount = 0;
// let turn = 0;
// let gameCount = 0;

$(document).ready(function(){
  attachListeners();
});

function player(){
  return turn % 2 === 0 ? 'X' : 'O'
}

function updateState(square){
  (square).append(player())
}

function doTurn(square){
  updateState(square)
  turn++
  checkWinner()
}

function setMessage(str){
  $('#message').append(str)
}
