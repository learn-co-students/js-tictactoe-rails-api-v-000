// Code your JavaScript / jQuery solution here
var turn = 0
var currentGame = 0
var winningNumbers = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

$(document).ready(function () {
  attachListeners()
})

function player () {
  if (turn % 2 === 1) {
    return 'O'
  } else {
    return 'X'
  }
}

function updateState (square) {

  $(square).text(player())
}

function setMessage (string) {
  $('#message').text(string)
}

function checkWinner () {
  var board = {}
  var winner = false
  $("td").text(function (index, square) { board[index] = square })

  winningNumbers.some(function (numbers) {
    if (board[numbers[0]] !== '' && board[numbers[1]] === board[numbers[0]] && board[numbers[1]] === board[numbers[2]]) {
      setMessage(`Player ${board[numbers[0]]} Won!`)
      winner = true
      return winner
    }
  })
  return winner
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

function saveGame() {
  var state = [];

  $('td').text((index, square) => {
    state.push(square);
  });

  var data = { state: state }

  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: data
    });
  } else {
    $.post('/games', data, function(game) {
      currentGame = game.data.id;
    });
  }
}


function resetBoard () {
  $('td').empty()
  turn = 0;
  currentGame = 0
}

function attachListeners () {
  $('td').on('click', function () {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this)
    }
  });
  $('#save').on('click', function () { saveGame() })
  $('#previous').on('click', function () { showPreviouseGames() })
  $('#clear').on('click', function () { resetBoard() })
}

function showPreviouseGames () {
  $('#games').empty()
  $.get('/games', function (savedGames) {
    if (savedGames.data.length) {
      savedGames.data.forEach(previousGameButton)
    }
  })
}

function previousGameButton (game) {
  $('#games').append(`<button id="gameid-${game.id}">${(game.id)}</button><br>`)
  $(`#gameid-${game.id}`).on('click', function () {
    reloadGame(game.id)
  })
}

function reloadGame (gameId) {
  $('#message').html('')
  const xhr = new XMLHttpRequest
  xhr.overrideMimeType('application/json')
  xhr.open('GET', `/games/${gameId}`, true)
  xhr.onload = function () {
    const data = JSON.parse(xhr.responseText).data
    const id = data.id
    const state = data.attributes.state

    var index = 0

    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index]
        index++
      }
    }
    turn = state.join('').length
    currentGame = id
    if (!checkWinner() && turn === 9) {
      setMessage('Tie game.')
    }
  }
  xhr.send(null)
}
