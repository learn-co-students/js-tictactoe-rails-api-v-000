// Code your JavaScript / jQuery solution here

var turn = 0

const xsquares = window.document.querySelectorAll('td')
const xmessageDiv = window.document.getElementById('message')
const xgamesDiv = window.document.getElementById('games')
const xsaveButton = window.document.getElementById('save')
const xpreviousButton = window.document.getElementById('previous')
const xclearButton = window.document.getElementById('clear')

const WIN_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

function player () {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState (square) {
  let token = player()
  $(square).text(token)
}

function setMessage(message) {
  xmessageDiv.innerText = message
}

function checkWinner() {
  let winner = WIN_COMBINATIONS.some(function(combo){
    let checkCombo = combo.map(function(i){
      return xsquares[i].textContent
    })
    return (checkCombo[0] === checkCombo[1] &&
            checkCombo[0] === checkCombo[2] &&
            checkCombo[0] !== "") 
  })
  if (winner) {
    setMessage(`Player ${player()} Won!`)
  }
  return winner
}

function doTurn(move) {
  if (checkWinner() !== true) {
    updateState(move)
    move.removeEventListener('click', placeToken, false)
    if (checkWinner() === true) {
      boardReset()
    } else if (turn === 8){
      setMessage("Tie game.")
      boardReset()
    } else {
      turn += 1
    }
  }
}

function boardReset() {
  for (let i = 0; i < 9; i++) {
    xsquares[i].innerHTML = ''
  }
  turn *= 0
  attachListeners()
  // xmessageDiv.innerHTML = ''
  // xgamesDiv.innerHTML = ''
}

var placeToken = () => { doTurn(event.target) }

function attachListeners() {

  for (let i=0; i < 9; i++) {
    xsquares[i].addEventListener('click', placeToken, false)
  }
}

window.onload = () => {
  attachListeners()
}

$("#previous").click(function() {
  $.get('/games', function(data) {
    let gameData = data["data"]
    if (gameData.length > 0) {
      gameData.forEach(function(game) {
        let element = $("<button/>", {
          text: "Game " + game["id"],
          id: 'btn_' + game["id"],
          click: function () {alert('hi')}
        })
      $("#games").append(element)

      }, this);
    }
  })
})