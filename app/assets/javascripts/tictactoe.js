var turn = 0
var WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

$(function () {
  attachListeners()
})

function player() {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(square) {
  square.innerHTML = player()
  return square
}

function message(string) {
  $("#message").html(string)
}

function checkWinner() {
  var board = {}
  var winner = false

  $("td").text(function (i, square) {
    board[i] = square
  })

  WINNING_COMBINATIONS.some(function (combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      message(`Player ${board[combo[0]]} Won!`)
      return winner = true
    }
  })
  return winner
}

function emptyBoard() {
  $("td").empty()
  turn = 0
}

function doTurn(move) {
  updateState(move)
  turn++
  if (checkWinner()) {
    emptyBoard()
  } else if (turn === 9) {
    message("Tie game.")
    emptyBoard()
  }
}

function attachListeners() {
  $("td").click(function() {
    if (!this.innerHTML && !checkWinner()) {
      doTurn(this)
    }
  })
}
