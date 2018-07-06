// Code your JavaScript / jQuery solution here
var currentGame = 0
var turn = 0

$(function() {
  attachListeners()
})

function attachListeners() {
  $("td").on("click", function() {
    if ($(this).text() === "" && !checkWinner()) {
      doTurn(this)
    }
  })

  $("#save").on("click", function() { saveGame() })
  $("#previous").on("click", function() { previousGames() })
  $("#clear").on("click", function() { resetGameBoard() })
}

function player() {
  return turn % 2 ? "O" : "X"
}

function checkWinner() {
  var board = {};
  const WIN_COMBINATIONS = [
      [0,1,2], [3,4,5], [6,7,8], [0,3,6],
      [1,4,7], [2,5,8], [0,4,8], [2,4,6]
    ]
  var winner = false;

  $("td").text((index, square) => board[index] = square)

  WIN_COMBINATIONS.some(function(combination) {
    if (board[combination[0]] === board[combination[1]] && board[combination[1]] === board[combination[2]] && board[combination[0]] !== "") {
      setMessage(`Player ${board[combination[0]]} Won!`)
      return winner = true
    }
  })
  return winner
}

function doTurn(square) {
  updateState(square)
  turn ++
  if (checkWinner()) {
    saveGame()
    resetGameBoard()
  } else if (turn === 9) {
    setMessage("Tie game.")
    saveGame()
    resetGameBoard()
  }
}

function updateState(square){
  $(square).text(player())
}

function setMessage(message) {
  $("#message").text(message)
}

function resetGameBoard() {
  $("td").text("")
  turn = 0
  currentGame = 0
}

// AJAX Logic
function saveGame() {
  var state = []
  var gameStatus

  $("td").text((index, square) => {
    state.push(square)
  })
  gameStatus = { state: state }

  if(currentGame) {
    $.ajax(`/games/${currentGame}`, {
      type: 'PATCH',
      data: gameStatus
    })
  } else {
    $.post('/games', gameStatus, function(game) {
      gameData = game.data
      currentGame = gameData.id
      createButton(gameData)
    })
  }
}

function previousGames() {
  $("#games").html("")
  $.get("/games", function(resp) {
    if (resp.data.length) {
      resp.data.forEach(createButton)
    }
  })
}

function createButton(game) {
  $("#games").append(`<button id="game-${game.id}">Game #${game.id}</button><br>`)
  $(`#game-${game.id}`).on("click", function() {
    loadGame(game.id)
  })
}

function loadGame(id) {
  setMessage("")

  $.get("/games/" + id, function(resp) {
    const gameData = resp.data
    const gameId = gameData.id
    const gameState = gameData.attributes.state

    let i = 0
    for (let y = 0; y <3; y++) {
      for (let x = 0; x <3; x++) {
        $(`[data-x="${x}"][data-y="${y}"]`).text(gameState[i])
        i++
      }
    }

    turn = gameState.join('').length
    currentGame = id
  })
}
