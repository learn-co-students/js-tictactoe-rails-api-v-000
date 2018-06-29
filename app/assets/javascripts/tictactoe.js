var turn = 0
var WIN_COMBINATIONS = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
                        [0, 3, 6], [1, 4, 7], [2, 5, 8],
                        [0, 4, 8], [2, 4, 6]]
var gameID = 0

$(document).ready(() => attachListeners())

function player() {
  return turn % 2 == 0 ? 'X' : 'O'
}

function updateState(square) {
  $(square).text(player())
}

function setMessage(message) {
  $('#message').text(message)
}

function checkWinner() {
  let board = {}
  $('td').text((index, square) => board[index] = square)

  return WIN_COMBINATIONS.some(function(combination) {
    if (board[combination[0]] !== '' && board[combination[1]] === board[combination[0]] && board[combination[2]] === board[combination[0]]) {
      setMessage('Player ' + board[combination[0]] + ' Won!')
      return true
    } else {
      return false
    }
  })
}

function resetGame() {
  $('td').empty()
  turn = 0
  gameID = 0
}

function doTurn(square) {
  updateState(square)
  turn++
  if (checkWinner()) {
    saveGame()
    resetGame()
  } else if (turn > 8) {
    setMessage('Tie game.')
    saveGame()
    resetGame()
  }
}

function attachListeners() {
  $('td').on('click', function() {
    if ($.text(this) === '' && !checkWinner()) {
      doTurn(this)
    }
  })
  $('#save').on('click', () => saveGame())
  $('#previous').on('click', () => loadPreviousGame())
  $('#clear').on('click', () => resetGame())
}

function loadPreviousGame() {
  $.getJSON('/games', data => {
    $('#games').html('')
    data.data.forEach(game => {
      let button = `<button onclick="loadGame(${game.id})" id="game-${game.id}">${game.id}</button>`
      $('#games').append(button)
    })
  })
}

function loadGame(id) {
  $.getJSON('/games/' + id, function(data) {
    let loadedBoard = data.data.attributes.state
    gameID = data.data.id
    turn = loadedBoard.filter(cell => cell !== "").length
    let i = -1
    for(let y = 0; y < 3; y++) {
      for(let x = 0; x < 3; x++) {
        i++
        let selector = '[data-x="' + x + '"][data-y="' + y + '"]'
        $(selector)[0].innerHTML = loadedBoard[i]
      }
    }
  })
}

function saveGame() {
  const state = [...$('td')].map(cell => cell.innerHTML)
  if (gameID === 0) {
    $.ajax({
      headers: { 'Accept': 'application/json' },
      url: '/games',
      type: 'POST',
      async: false,
      data: {state: state},
      success: function(resp) {
        gameID = resp.data.id
      }
    })
  } else {
    $.ajax({
      headers : { 'Accept': 'application/json' },
      url : '/games/' + gameID,
      type : 'PATCH',
      async: false,
      data: {state: state},
      success: function() {
        resolve('success')
      }
    })
  }
}
