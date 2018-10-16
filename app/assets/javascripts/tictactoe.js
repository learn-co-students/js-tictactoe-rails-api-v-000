// Code your JavaScript / jQuery solution here
var turn = 0

const winCombinations = [[0,1,2], [3,4,5], [6,7,8], [0,4,8], [2,4,6], [0,3,6], [2,5,8], [1,4,7]]

function player() {
  if (turn % 2) {
    return "O"
  } else {
    return "X"
  }
}

function updateState(box) {
  var t = player()
  $(box).text(t);
}

function setMessage(string) {
  $("#message").text(string);
}

function checkWinner() {
  var board = {}
  var winner = false

  $('td').text(function(index, box) { board[index] = box});

  winCombinations.some(function (winArray) {
    if (board[winArray[0]] !== "" && board[winArray[0]] === board[winArray[1]] && board[winArray[1]] === board[winArray[2]]) {
      setMessage(`Player ${board[winArray[0]]} Won!`)
      winner = true
    }
  })
  return winner
}
