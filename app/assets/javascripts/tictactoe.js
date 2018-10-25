// Code your JavaScript / jQuery solution here

var turn = 0

var gameId = null

function board() {
  var theBoard = []
  for (const box of $(".box")) {
    theBoard.push(box.innerHTML)
  }
  return theBoard
}

var WINNERS = [
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
  if (!checkWinner()) {
    updateState(thebox)
  }
}

function player() {
  if (turn % 2 == 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(box) {
  var thePlayer = player()
  $(box).text(thePlayer)
  var index = $(box).data("index")
  board()[index] = thePlayer
  turncount()
  checkWinner()
}

function checkWinner() {
  var result = false
  WINNERS.forEach(function (combo) {
    var one = combo[0]
    var two = combo[1]
    var three = combo[2]
    if ((board()[one] === "X") && (board()[two] === "X") && (board()[three] === "X")) {
      result = true
      setMessage("Player X Won!")
      saveGame()
      resetBoard()
    } else if ((board()[one] === "O") && (board()[two] === "O") && (board()[three] === "O")) {
      result = true
      setMessage("Player O Won!")
      saveGame()
      resetBoard()
    } else {
      tiedGame()
    }
  })
  return result
}

function resetBoard() {
  $(".box").empty()
  turn = 0
  updateBoard(board())
}

function updateBoard(array) {
  for (const box of $(".box")) {
    var index = $(box).data("index")
    $(box).text(array[index])
  }
}

function resetMessage() {
  $("div#message").text("")
}

function setMessage(message) {
  $("div#message").text(message)
}

function tiedGame() {
  var count = 0
  board().forEach(function (spot) {
    if ((spot == "X") || (spot == "O")) {
      count += 1
    }
  })
  if (count === 9) {
    setMessage("Tie Game.")
    saveGame()
    resetBoard()
  }
}

function saveGame() {
  if (!gameId) {
    // debugger
    var info = {state: board()}
    var saved = $.post('/games', info)
    saved.done(function (e) {
      console.log("Game saved: #" + e.data.id)
      gameId = e.data.id
    })
  } else {
    // debugger
    var id = gameId
    var info = {id: id, state: board()}
    var update = $.post('/game/' + id, info)
    update.done(function (e) {
      console.log("Game updated: #" + id)
    })
  }
}

function showPrevious() {
  $("div#games").text("")
  $.get('/games', function (e) {
    e.data.forEach(function (spot) {
      $("div#games").append(`<li><a onclick="openPreviousGame(${spot.id})" href="#">${spot.id}</a></li>`)
    })
  })
}

function openPreviousGame(id) {
  $.get('/games/' + id, function (game) {
    var theboard = game.data.attributes.state
    updateBoard(theboard)
    turn = countPlayers(theboard)
    gameId = id
  })
  resetMessage()
}

function countPlayers(board) {
  var count = 0
  board.forEach(function (spot) {
    if ((spot === "X") || (spot === "O")) {
      count += 1
    }
  })
  return count
}

function clearGame() {
  resetBoard()
  resetMessage()
  gameId = null
}

function attachListeners() {
  $(".box").on("click", function (e) {
    doTurn(this)
  })
  $("#save").on("click", function (e) {
    saveGame()
  })
  $("#previous").on("click", function (e) {
    showPrevious()
  })
  $("#clear").on("click", function (e) {
    clearGame()
  })
}

$(function () {
  attachListeners()
})
