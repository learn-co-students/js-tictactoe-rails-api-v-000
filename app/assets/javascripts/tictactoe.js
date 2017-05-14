$(function() {
  attachListeners();
})

var turn = 0
// const winningCombos = [ //these combos are for x, y coordinates in the readme - there may be a better way
//   [[0,0],[1,0],[2,0]], //this is the combo for the top row - 0, 0 = top left; 1, 0 = top center; 2, 0 = top right
//   [[0,1],[1,1],[2,1]],
//   [[0,2],[1,2],[2,2]],
//   [[0,0],[1,1],[2,2]],
//   [[0,0],[0,1],[0,2]],
//   [[2,0],[2,1],[2,2]],
//   [[1,0],[1,1],[1,2]],
//   [[2,0],[1,1],[0,2]]
//   ]

const winningCombos = [   [0, 1, 2], [3, 4, 5],[6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6] ]


//GAME FUNCTIONALITY

function attachListeners() {

  $('td').on('click', function(e) {
    e.preventDefault();
    doTurn(e)
  })
}

function player() {
  return (turn % 2 === 0) ? "O" : "X"; //if no remainder then x
}

function doTurn(e) {
  turn += 1
  updateState(e)
  checkWinner()
}

var updateState = function(e) {
  $(e.currentTarget).html(player());
}

function checkWinner() {

}

// function checkWinner() { //I started building this - not sure it's on the right track yet
//   var board = getBoard();
//   winningCombos.forEach(function(combo) { //iterates over Combos array
//     if ((board[combo[0]] == "X" && board[combo[1]] == "X" && board[combo[2]] == "X") || (board[combo[0]] == "O" && board[combo[1]] == "O" && board[combo[2]] == "O")) {
//       message("Player " + player() + " Won!"); //calls message() based on current player
//       clearBoard();
//     } else if (boardFull(board)){
//       message("Tie game")
//     }
//   })
// }
//
// function getBoard() {
//   var board = [];
//   $td = $("td");
//   for (var i=0; i < 9; i++) {
//     var cell = $td[i];
//     board.push(cell.innerHTML);
//     }
//   return board;
// }
//
// function boardFull(board) {
//   if (board.includes("")) {
//     return false
//   } else {
//     return true
//   }
// }
//
// function clearBoard() {
//   $("td").html("");
//   turn = 0; //restarts games
// }
//
function message(string) {
  $("div#message").text(string) //edited to replace text instead of append
}
//
// var winner = function() {
//   //this method can be used to check against checkWinner
// }
