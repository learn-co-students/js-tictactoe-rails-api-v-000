// Code your JavaScript / jQuery solution here

var turn = 0
var board = []
const winCombos = [
[0,1,2],
[3,4,5],
[6,7,8],
[0,3,6],
[1,4,7],
[2,5,8],
[0,4,8],
[2,4,6]
]

let currentGame = 0

$(document).ready(function() {
  attachListeners()
})


function player() {
  let token = ''
  if (turn % 2 === 0) {
    ++turn
     token = 'X'

  } else {
   ++turn
   token = 'O'
  }
  return token
}

function updateState(element) {
  let token = player()
  if (element.innerHTML === "") {
  element.innerHTML = token
} else {
  turn -= 1
}
}

function setMessage(string) {
  document.getElementById("message").innerHTML = string
}

function checkWinner() {
  let tds = document.querySelectorAll("td")
  for(i = 0; i < tds.length; i++) {
    board[i] = tds[i].innerHTML
  }
  for(let combo of winCombos) {
    if (board[combo[0]] !== '' && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`)
      return true
    }
  }
return false
}

function doTurn(element) {

  if (updateState(element)) {
    turn+= 1
  }
  if (checkWinner()) {
    resetBoard()
    saveGame()
  } else if (turn === 9){
    setMessage("Tie game.")
    resetBoard()
    saveGame()
  }
}

function resetBoard() {
  turn = 0
  let tds = document.querySelectorAll("td")
  for(i = 0; i < tds.length; i++) {
    tds[i].innerHTML = ""
  }
  currentGame = 0
}

function attachListeners() {
  clickedSquare()
  clearGameButton()
  saveGameButton()
  previousGamesButton()
  fetchGameButton()
}

function clickedSquare() {
  $('table').on('click', 'td', function(e) {
    if (!checkWinner()) {
      doTurn(e.target)
    }
  })
}

function clearGameButton() {
  $('#clear').on('click', resetBoard)
}

function saveGameButton() {
  $('#save').on('click', saveGame)
}

function previousGamesButton() {
  $('#previous').on('click', previousGames)
}

function fetchGameButton() {
  $('#games').on('click', 'button', function(e) {
    let id = $(e.target).attr('id')
    fetchGame(id)
  })
}

function saveGame() {
  let state = []
  let data = {state: state}
  $('td').text((index, square) => {
    state.push(square)
  })

  if (currentGame > 0) {
    $.ajax({
      type: 'PATCH',
      url: '/games/' + currentGame,
      // dataType: 'json',
      data: data
    }).done(function(game) {
      let gameData = game.data
      currentGame = gameData.id
    })
  } else {
    $.post('/games', data, function(game){
      let id = game.data.id
      currentGame = id
      $('#games').append(`<button id="${id}">Game ${id}</button>`)
    })
  }
}

function previousGames() {
    $('#games').empty();
    $.get('/games').done(function(data) {
      let games = data.data
      let uniqueGames = games.filter(function(game, index, self) {
        return self.indexOf(game) === index
      })
      for(let game of uniqueGames) {
        $('#games').append(`<button id="${game.id}">Game ${game.id}</button>`)
      }
    })
}

function fetchGame(id) {
  $.get('/games/' + id).done(function(data) {
    let gameData = data.data
    let gameState = gameData.attributes.state
    turn = gameState.filter((index) => index !== "").length
    currentGame = gameData.id
    let tds = document.querySelectorAll("td")
    for(i = 0; i < gameState.length; i++) {
      $(tds[i]).html(gameState[i])
    }
  })
}
