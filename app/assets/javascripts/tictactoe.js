// Code your JavaScript / jQuery solution here

var turn = 0
const win_combos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
var gameId = 0

function player() {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(element) {
  element.innerHTML += player();
}

function setMessage(string) {
  $('div#message')[0].innerHTML += string
}

function checkWinner() {
  let board = getBoard()

  for (c of win_combos) {
    if (board[c[0]] === "X" && board[c[1]] === "X" && board[c[2]] === "X") {
      setMessage('Player X Won!')
      saveGame()
      return true
    } else if (board[c[0]] === "O" && board[c[1]] === "O" && board[c[2]] === "O") {
      setMessage('Player O Won!')
      saveGame()
      return true
    }
  } return false
}

function updateState(element) {
  element.innerHTML += player();
}

function setMessage(string) {
  $('div#message')[0].innerHTML += string
}

function checkWinner() {
  let board = getBoard()

  for (c of win_combos) {
    if (board[c[0]] === "X" && board[c[1]] === "X" && board[c[2]] === "X") {
      setMessage('Player X Won!')
      saveGame()
      return true
    } else if (board[c[0]] === "O" && board[c[1]] === "O" && board[c[2]] === "O") {
      setMessage('Player O Won!')
      saveGame()
      return true
    }
  } return false
}

function doTurn(square) {
  var board = getBoard()
  updateState(square)
  turn++
  if (checkWinner()) {
    resetBoard()
  } else if (turn === 9) {
    setMessage("Tie game.")
    resetBoard()
  } saveGame()
}

function getBoard() {
  return $("td").toArray().map((e) => { return e.innerHTML })
}

function resetBoard() {
  turn = 0;
  gameId = 0;
  return $("td").empty();
}

function attachListeners() {
  $("td").on("click", function () {
    if (!$.text(this) && !checkWinner()) { //if the text of the td element clicked doesn't exist and checkWinner is false
      doTurn(this) //do turn. this is passed in because updateState requires an argument
    }
  })

  $("#clear").on("click", function () {
    resetBoard()
  })

  $("#previous").on("click", function () {
    previousGames()
  })

  $("#save").on("click", function () {
    saveGame()
  })
}