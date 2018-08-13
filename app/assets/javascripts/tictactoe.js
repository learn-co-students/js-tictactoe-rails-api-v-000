// Code your JavaScript / jQuery solution here
$(document).ready(function() {
  attachListeners()
})

var turn = 0
const WIN_COMBINATIONS = [
 [0, 1, 2], [3, 4, 5], [6, 7, 8],
 [0, 3, 6], [1, 4, 7], [2, 5, 8],
 [0, 4, 8], [2, 4, 6]
]
var board = []


function player() {
  if (turn % 2 == 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(square) {
  $(square).text(player())
}

function setMessage(string) {
  $("div#message").text(string)
}

function positionTaken() {

}

function boardState() {
  $("td").text((index, square) => board[index] = square)
  return board
}


function checkWinner() {
  let winner = false
  boardState()

  var winCombo = WIN_COMBINATIONS.find(function(combo) {
    return board[combo[0]] != "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]
  })

  if (winCombo) {
    winner = true
    setMessage(`Player ${board[winCombo[0]]} Won!`)
  }
  return winner
}

function resetBoard() {
  $("td").empty()
  turn = 0
}

function doTurn(square) {
  updateState(square)
  turn++

  var fullBoard = boardState().every(e => e != "")

  if (checkWinner()) {
    resetBoard()
  } else if (turn === 9) {
      setMessage("Tie game.")
      resetBoard()
  }
}

function saveGame() {

  $("#games").html("<button data-id="<%= game.id %>">Game</button>")
}

function attachListeners() {
  $("td").click(function() {
    if ($(this).text() == "" && checkWinner() == false  && turn != 9)  {
      doTurn(this)
    }

    if (checkWinner()) {
      $.post("/games" + "id", function(data) {

      })
    }
  })

  $("#previous").click(function() {
    $.get("/games", function(data) {

    })
  })

  $("#save").click(function() {
    $.post("/games", function(data) {

    })
  })

  $("#clear").click(function() {
    resetBoard()
  })
}
