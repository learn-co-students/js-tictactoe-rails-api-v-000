// Code your JavaScript / jQuery solution here
//
// let turn ?? can't define turn or player() won't pass
// turn = 0

var turn = 0
const winCombinations = [[0,4,8], [6,4,2], [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8]]

function player() {
  // debugger
  if (isNaN(turn) || turn % 2 === 0) {
    return "X"
  }
  else {
    return "O"
  }
}

function updateState(element) {
  // debugger
  let token
  token = player()
  $(element).append(token)
}

function setMessage(string) {
  $("#message").text(string)
}

function checkWinner() {
  // let boxes = $("td")
  let board
  board = []

  $("td").each( function() {
    board.push(this.innerText)
    })

  return winCombinations.some(function (subArray) {
    return (board[subArray[0]] !== "") &&
      (board[subArray[0]] === board[subArray[1]]) &&
      (board[subArray[0]] === board[subArray[2]])
  /// change this to an "each" iterator and add if statements
  })
}

function doTurn() {

}
