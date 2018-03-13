// Code your JavaScript / jQuery solution here
var turn = 0

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
  return [...document.querySelectorAll("td")].forEach(elem => elem.innerHTML = "")
}

function doTurn(square) {
  updateState(square)
  turn++
  if (checkWinner()) {
    turn = 0
    resetGame()
  } else {
    if (fullGame()) {
      setMessage("Tie game.")
    }
  }
}

function fullGame() {
  return gameState().every(position => position === "O" || position === "X")
}

function attachListeners() {
  $("td").on("click", function (event) {
    doTurn(event.currentTarget)
  })
}

$(document).ready(() => {
  attachListeners()
})