// Code your JavaScript / jQuery solution here

let turn = 0

let board = ["", "", "", "", "", "", "", "", ""]

let winners = [
[0,1,2],
[3,4,5],
[6,7,8],
[0,3,6],
[1,4,7],
[2,5,8],
[0,4,8],
[2,4,6]
]

function turncount() {
    turn += 1
}

function doTurn(thebox) {
  if (checkWinner() !== "true") {
    var xAxis = $(thebox).data("x")
    var yAxis = $(thebox).data("y")
    updateState(xAxis, yAxis)
    checkWinner()
    turncount()
  }
}

function player() {
  if (turn % 2 == 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(x, y) {
  for (const box of $(".box")) {
    if (($(box).data("x") === x) && ($(box).data("y") === y)) {
    $(box).text(player())
    $(box).attr("data-board", player())
    var index = $(box).data("index")
    board[index] = player()
    }
  }
}

function checkWinner() {
  let result = ""
  winners.forEach(function (combo) {
    var one = combo[0]
    var two = combo[1]
    var three = combo[2]
    if ((board[one] === "X") && (board[two] === "X") && (board[three] === "X")) {
      result = "true"
      setMessage("Player X Won!")
    } else if ((board[one] === "O") && (board[two] === "O") && (board[three] === "O")) {
      result = "true"
      setMessage("Player O Won!")
    }
  })
  return result
}

function setMessage(message) {
  $("div#message").text(message)
}

$(function () {
  $(".box").on("click", function (e) {
    doTurn(this)
  })
})
