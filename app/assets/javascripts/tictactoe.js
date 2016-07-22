'use strict';


$(document).ready(function () {
  attachListeners();
});

var turn = 2;
var board = [];
var status = 'false'
const WIN_COMBINATIONS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [6,4,2]
 ]

function player() {
  if(turn % 2 === 0){
    return "X";
  }else {
    return "O";
  };
}

function attachListeners() {
  $("td").on('click', function(event) {
    doTurn(event);
  });
}

function updateState(event) {
  $(event.currentTarget).text(player())
}

function doTurn(event) {
  updateState(event);
  turn += 1;
  checkWinner();
}

function checkWinner() {
  board = setBoard();
  if(turn > 6) {
    WIN_COMBINATIONS.map(function(pattern){
      if(board[pattern[0]]){
        if(board[pattern[0]] === board[pattern[1]] && board[pattern[1]] === board[pattern[2]]){
          if(board[pattern[0]] === "X"){
            message('Player X Won!');
          }else {
            message('Player O Won!');
          };
        };
      };
    });
  }
}

function message(winner) {
  $("#message").html(winner)
}

function setBoard() {
  return $("td").map(function(token){
    return $(this).text()
  })
}
