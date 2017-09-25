// Code your JavaScript / jQuery solution here

const winCombinations = [

 [0,1,2],
 [3,4,5],
 [6,7,8],
 [0,3,6],
 [1,4,7],
 [2,5,8],
 [0,4,8],
 [2,4,6]
]

var board = ["", "", "", "", "", "", "", "", "" ]
var turn = 0


function turncount() {
  var counter = 0
  board.forEach(function (element) {
    if ((element === "X") || (element === "O")) {
      counter += 1
    }
  })
  return counter
}

function player() {
  if (turn % 2 === 0) {
    return "X"
  }
  else {
    return "O"
  }
}


function updateState(board) {
  $(board).text(player())
}

function setMessage(string) {
  $( "div#message" ).html(string)
}

function checkWinner() {
  (winCombinations).any? do |win_combination|
 if ((@board[win_combination[0]] == "X" && @board[win_combination[1]] == "X" && @board[win_combination[2]] == "X") ||
     (@board[win_combination[0]] == "O" && @board[win_combination[1]] == "O" && @board[win_combination[2]] == "O"))
     return true
 else {
   false
 }
}

function doTurn() {

}
