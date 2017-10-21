var turn = 0;
var currentGame = 0;
var board = {};
var winningCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];


$(document).ready(function() {
attachListeners()
})

function attachListeners () {
  $('td').on('click', function () {
    if (!$.text(this) && !checkWinner ()) {
      doTurn (this)
    }
  })
  $('#save').on('click', () => saveGame ())
  $('#previous').on('click', () => previousGames ())
  $('#clear').on('click', () => resetBoard ())
}

function player () {
  if (turn % 2 === 0) {
    return 'X'
  } else {
    return 'O'
  }
}

function updateState (token) {
  if (player() === 'X') {
    $(token).html('X')
  } else {
    $(token).html('O')
  }
}

function setMessage (message) {
  $('#message').text(message)
}

function checkWinner () {
  var winner = false
  $('td').text((index, td) => board[index] = td)

  winningCombos.some ((combo) => {
    if (board[combo[0]] !== '' && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      winner = true
      setMessage (`Player ${board[combo[0]]} Won!`)
    }
  })
  return winner
}

function doTurn (token) {
  updateState (token)
  turn++
  if (checkWinner ()) {
    saveGame ()
    resetBoard ()
  } else if (turn === 9 && checkWinner() === false) {
    setMessage("Tie game.")
    saveGame ()
    resetBoard ()
  }
}

function saveGame () {
  var state = []
  var gameData

  $('td').text((index, td) => {
    state.push(td)
  })
  gameData = {state: state}
  if (currentGame !== 0) {
    $.ajax ({
      url: `/games/${currentGame}`,
      data: {
        state: state,
        id: currentGame
      },
      type: 'PATCH'
    })
  } else {
    $.post('/games', {state: state}).done((data) => {
      currentGame = data["data"]["id"]
    })
  }
}

function resetBoard () {
  $('td').empty ()
  turn = 0
  currentGame = 0
}

function loadGame (event) {
  var id = $(event.target).data('id')
  $.get(`/games/${id}`, (game) => {
    currentGame = game["data"]["id"]
    var $td = $('td')
    game["data"]["attributes"]["state"].forEach((data, i) => {
      if (data) {
        $td[i].innerHTML = data
        turn++
      } else {
        $td[i].innerHTML = ''
      }
    })
  })
}

function previousGames () {
  $.get('/games', (data) => {
    var games = data["data"]
    if (games.length > 0) {
      var gamesHtml = ""
      $(games).each((i, game) => {
        gamesHtml += '<button data-id="' + game["id"] + '" class="game-button">' + game.id + '</button><br>'
      })
      $('#games').html(gamesHtml)
      $('.game-button').on('click', (event) => {
        loadGame (event)
      })
    }
  })
}
