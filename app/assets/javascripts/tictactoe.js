// Code your JavaScript / jQuery solution here
$(document).ready(() => {
  attachListeners()
})

var turn = 0
var currentGame = null

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
]

function player() {
  return turn % 2 === 0 ? 'X' : 'O'
}

function updateState(square) {
  const currentPlayer = player()
  square.innerHTML = currentPlayer
}

function setMessage(msg) {
  $("#message").html(msg)
}

function checkWinner() {
  const winner = winningCombinations.find(combo => {
    return combo.every(position => gameState()[position] === 'X') || combo.every(position => gameState()[position] === 'O')
  })
  if (winner) setMessage(`Player ${gameState()[winner[0]]} Won!`)

  return !!winner
}

function gameState() {
  return [...document.querySelectorAll("td")].map(elem => elem.innerHTML)
}

function resetGame() {
  currentGame = null
  turn = 0
  return [...document.querySelectorAll("td")].forEach(elem => elem.innerHTML = "")
}

function doTurn(square) {
  updateState(square)
  turn++
  if (checkWinner()) {
    saveGame()
    resetGame()
  } else {
    if (fullGame()) {
      setMessage("Tie game.")
      saveGame()
      resetGame()
    }
  }
}

function fullGame() {
  return gameState().every(position => position === "O" || position === "X")
}

function attachListeners() {
  $("td").on("click", function (event) {
    if (event.currentTarget.innerHTML === "" && !fullGame() && !checkWinner()) doTurn(event.currentTarget)
  })
  $("#previous").on("click", renderGames)
  $("#save").on("click", saveGame)
  $("#clear").on("click", resetGame)
  $("#games").on("click", ".load", loadGame)
}

function renderGames() {
  $.getJSON("/games", (responseData) => {
    $("#games").html("")
    responseData.data.forEach((game, index) => {
      $("#games").append(`<button class="load" data-id="${game.id}">Load Game ${index}</button>`)
    })
  })
}

function saveGame() {
  if (currentGame) {
    $.ajax({
      url: `/games/${currentGame}`,
      data: {
        state: gameState()
      },
      type: "PATCH",
      dataType: "json"
    })
  } else {
    $.post("/games", {
      state: gameState()
    }, function (resp) {
      currentGame = resp.data.id
    });
  }
}

function loadGame() {
  const gameId = $(this).data().id
  $.get(`/games/${gameId}`, function (resp) {
    [...document.querySelectorAll("td")].forEach((elem, i) => elem.innerHTML = resp.data.attributes.state[i])
    currentGame = resp.data.id
    turn = resp.data.attributes.state.filter(position => position !== "").length
  })
}