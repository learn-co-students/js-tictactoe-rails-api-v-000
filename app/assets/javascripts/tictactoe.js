// Code your JavaScript / jQuery solution here

let turn = 0

let board = ["", "", "", "", "", "", "", "", ""]

const WINNERS = [
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
    // var xAxis = $(thebox).data("x")
    // var yAxis = $(thebox).data("y")
    updateState(thebox)
    checkWinner()
  }
}

function player() {
  if (turn % 2 == 0) {
    return 'X'
  } else {
    return 'O'
  }
}

function updateState(box) {
  $(box).text(player())
  var index = $(box).data("index")
  board[index] = player()
  turncount()
  // for (const box of $(".box")) {
  //   if (($(box).data("x") === x) && ($(box).data("y") === y)) {
  //     if ($(box).context.innerHTML === '<span class="hideMe">X</span>') {
  //       $(box).text(player())
  //       $(box).attr("data-board", player())
  //       var index = $(box).data("index")
  //       board[index] = player()
  //       turncount()
  //     }
  //   }
  // }
}

function checkWinner() {
  let result = "false"
  WINNERS.forEach(function (combo) {
    var one = combo[0]
    var two = combo[1]
    var three = combo[2]
    if ((board[one] === "X") && (board[two] === "X") && (board[three] === "X")) {
      result = "true"
      setMessage("Player X Won!")
    } else if ((board[one] === "O") && (board[two] === "O") && (board[three] === "O")) {
      result = "true"
      setMessage("Player O Won!")
    } else {
      tiedGame()
    }
  })
  return result
}

function setMessage(message) {
  $("div#message").text(message)
}

function tiedGame() {
  let count = 0
  board.forEach(function (spot) {
    if ((spot == "X") || (spot == "O")) {
      count += 1
    }
  })
  if (count === 9) {
    setMessage("Tie Game.")
  }
}

$(function () {
  $(".box").on("click", function (e) {
    doTurn(this)
  })
  $("#save").on("click", function (e) {
    alert("save")
  })
  $("#previous").on("click", function (e) {
    alert("previous")
  })
  $("#clear").on("click", function (e) {
    alert("clear")
  })

})
