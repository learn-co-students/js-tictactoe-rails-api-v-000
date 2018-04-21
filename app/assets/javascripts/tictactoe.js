// Code your JavaScript / jQuery solution here
var winCombos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0
var currentGame = 0

$(document).ready( () => {
  attachListeners()
})

function player(){
  return turn % 2 ? 'O' : 'X';
}

function updateState(square) {
  square.innerHTML = player()
}

function setMessage(string) {
  $("div#message").append(string)
}

function checkWinner() {
  let winner = false
  let board = {}

  $('td').text((index, square) => {
    board[index] = square
  })
  winCombos.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`)
      return winner = true
    }
  })
  return winner
}

function full() {
  return $.makeArray($("td")).every(function(cell) {
    return !(cell.innerHTML === "")
  })
}

function clearBoard() {
  $('td').empty()
  turn = 0

}

function positionTaken(clickedPostition) {
  return clickedPostition.innerText != ""
}

function validMove(square) {
  return !positionTaken(square)
}

function doTurn(square) {
  if (validMove(square) && !checkWinner()) {
    updateState(square)
    turn++
    if (checkWinner()) {
      clearBoard()
    } else if (full()) {
      setMessage('Tie game.')
      clearBoard()
    }
  }
}

function saveGame() {
  let state = []
  let gameData = {}
  let url = '/games'

  $('td').text((index, square) => {
    state.push(square)
  })
  gameData = { 'state': state }

  $.post(url, gameData, () => {
    debugger
  })
}

function attachListeners() {
  $('td').on('click', () => {
    doTurn(this)
  })
  $('#save').on('click', () => saveGame())
}
