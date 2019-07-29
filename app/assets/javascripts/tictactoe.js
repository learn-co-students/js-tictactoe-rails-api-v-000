// Code your JavaScript / jQuery solution here
/*
  REMINDER: DO NOT USE ES5+ Sprokects cannot read it and it will result in odd, confusing errors!!
*/
var board = ["","","","","","","",""]
var turn = 0;
var player = function(){
   ticTacToePiece = turn % 2 == 0 ? "X" : "O"
   return ticTacToePiece
}

function updateState(board_cell){
    board_cell.innerHTML = player()
}

function setMessage(message){
  document.getElementById("message").innerHTML = message
}

function checkWinner(){
  var WINNING_COMBINATIONS = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,4,8],
      [6,4,2],
      [0,3,6],
      [2,5,8]
  ];
  var WINNING_COMBINATIONS_LENGTH = WINNING_COMBINATIONS.length
  var currentCombination = []
  var currentPlayer = player() ;
  for(var i = 0; i < WINNING_COMBINATIONS_LENGTH; i++){
     currentCombination = WINNING_COMBINATIONS[i]

      if( board[[currentCombination][0]] == currentPlayer
          && board[[currentCombination][1]] == currentPlayer
          && board[[currentCombination][2]] ==  currentPlayer ){
            setMessage("Player X Won!")
            return true
    }
   }
   setMessage("Player O Won!")
   return false
}
