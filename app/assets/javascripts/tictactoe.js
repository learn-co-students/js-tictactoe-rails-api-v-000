// Code your JavaScript / jQuery solution here
let turn = 0
let game = 0

const winCombinations = [[0,1,2], [3,4,5], [6,7,8], [0,4,8], [2,4,6], [0,3,6], [2,5,8], [1,4,7]]

$(document).ready(function() {
  attachListeners();
});

function attachListeners() {
  $("td").on('click', function() {
    if (!$.text(this) && !checkWinner()) {
     doTurn(this);
   }
  })

  $("#save").on('click', function() {saveGame()})
  $("#previous").on('click', function() {previousGames()})
  $("#clear").on('click', function() {resetBoard()})
}


function player() {
  if (turn % 2) {
    return "X"
  } else {
    return "O"
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

function doTurn(box) {
  turn ++
  updateState(box)
  if (checkWinner()) {
    saveGame()
    resetBoard()
  } else {
    setMessage("Tie game.")
    saveGame()
    resetBoard()
  }
}

function resetBoard() {
  turn = 0
  game = 0
  $('td').empty();
}

function saveGame() {

}

function previousGames() {

}
