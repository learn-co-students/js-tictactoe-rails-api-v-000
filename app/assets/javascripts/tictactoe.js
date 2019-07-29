// Code your JavaScript / jQuery solution here
/*
  REMINDER: DO NOT USE ES5+ Sprokects cannot read it and it will result in odd, confusing errors!!
*/
var turn = 0;
var player = function(){
   ticTacToePiece = turn % 2 == 0 ? "X" : "O"
   return ticTacToePiece
}

function updateState(board_cell){
    board_cell.innerHTML = player()
}
