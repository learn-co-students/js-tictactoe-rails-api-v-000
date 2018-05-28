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
	return turn % 2 !== 0 ? 'O' : 'X'
}

function updateState(square) {
  let token = player()
  // debugger
  if (square.innerHTML === "") {
  square.innerHTML = token
  turn++
  return true
  }
}

function setMessage(string) {
  $('#message').text(string)
}

function checkWinner() {

  var board = {}
  $('td').text((i, sq) => board[i] = sq)
  // debugger

  for(let combo of winCombos) {
    if (board[combo[0]] !== '' && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`)
      return true
    }
  }
return false
}

function doTurn(element) {

  updateState(element)

  if (checkWinner()) {
    saveGame()
    resetBoard()
    
  } else if (turn === 9){
    setMessage("Tie game.")
    saveGame()
    resetBoard()
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
  squareClick()
  showGameButton()

  $('#clear').on('click', resetBoard)
  $('#save').on('click', saveGame)
  $('#previous').on('click', previousGames)
}

function squareClick() {
  $('td').on('click', function() {
    if (!checkWinner()) {
      doTurn(this);
    }
  })
}

function showGameButton() {
  $('#games').on('click', 'button', function(e) {
    let id = $(e.target).attr('id')
    showGame(id)
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
      data: data
    })
  } else {
    $.post('/games', data, function(game){
      currentGame = game.data.id
      $('#games').append(`<button id="${game.data.id}">Game ${game.data.id}</button>`)
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

function showGame(id) {
  $.get('/games/' + id).done(function(data) {
    let gameData = data.data
    
    let gameState = gameData.attributes.state
    turn = gameState.filter(Boolean).length
    // debugger
    currentGame = gameData.id
    let tds = $('td')
    // debugger
    for(i = 0; i < gameState.length; i++) {
      tds[i].innerHTML = gameState[i]
    }
  })
}