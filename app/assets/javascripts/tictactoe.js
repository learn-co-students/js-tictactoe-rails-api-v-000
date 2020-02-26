const winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

var turn = 0
var currentGame

window.onload = () => {
  attachListeners()
}

function attachListeners () {
  $('td').on('click', function () {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this)
    }
  })

  $('#save').on('click', () => saveGame())
  $('#previous').on('click', () => getGames())
  $('#clear').on('click', () => resetBoard())
}

function saveGame () {
  var state = []
  $('td').text((index, square) => {
    state.push(square)
  })

  var gameData = { state: state }

  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    })
  } else {
    $.post('/games', gameData, (game) => {
      currentGame = game.data.id
    })
  }
}

function getGames () {
  $('#games').empty()
  $.get('/games', (games) => {
    games.data.map((game) => {
      $('#games').append(`<button id="game-${game.id}" onclick="showGame(${game.id})">${game.id}</button>`)
    })
  })
}

function showGame (id) {
  currentGame = id
  $.get(`/games/${id}`, (game) => {
    var state = game.data.attributes.state
    $('td').each((index, square) => {
      turn = state.join('').length
      square.innerHTML = state[index]
    })
  })
}

function player () {
  return (turn % 2 === 0) ? 'X' : 'O'
}

function updateState (square) {
  $(square).html(player())
}

function setMessage (message) {
  $('#message').text(message)
}

function checkWinner () {
  var winner = false
  var board = {}
  $('td').text((index, square) => { board[index] = square })

  winningCombos.map((position) => {
    if (board[position[0]] !== '' && board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]]) {
      setMessage(`Player ${board[position[0]]} Won!`)
      winner = true
    }
  })
  return winner
}

function resetBoard () {
  $('td').empty()
  turn = 0
  currentGame = 0
}

function doTurn (square) {
  updateState(square)
  turn++
  if (checkWinner()) {
    saveGame()
    resetBoard()
  } else if (turn === 9) {
    setMessage('Tie game.')
    saveGame()
    resetBoard()
  }
}
