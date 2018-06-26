window.turn = 0
window.games = {}
window.current_game_id = null

window.WIN_COMBOS = [
  [0, 1, 2], [0, 3, 6], [0, 4, 8], 
  [3, 4, 5], [1, 4, 7], [2, 4, 6],
  [6, 7, 8], [2, 5, 8]
]

$(function() {
  loadGames()
  attachListeners()
})

function attachListeners() {
  $('td').on('click', function(e) {
    doTurn(this)
  })

  $('#save').on('click', function(e) {
    saveGame()
  })

  $('#previous').on('click', function(e) {
    previousGames()
  })

  $('#clear').on('click', function(e) {
    clearGame()
  })
}

function setMessage(msg) {
  $('#message').html(msg)
}

function player() {
  if (window.turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(element) {
  if (element.innerHTML === "") { 
    element.innerHTML = player() 
    window.turn += 1
  }
}

function full() {
  const tiles = $('td').map(function() { return $(this).text() })

  if (!tiles.toArray().includes("")) {
    setMessage("Tie game.")
    return true
  } else {
    return false
  }
}

function reset() {
  window.turn = 0
  $('td').html('')
}

function checkWinner() {
  const winning_player = winner()

  if (winning_player !== undefined) {
    setMessage("Player " + winning_player + " Won!") 
    return true
  } else {
    return false
  }
}

function winner() {
  const tiles = $('td').map(function() { return $(this).text() })

  for (const combo of window.WIN_COMBOS) {
    let streak = tiles[combo[0]] + tiles[combo[1]] + tiles[combo[2]]

    if (streak === "XXX") {
      return "X"
    } else if (streak === "OOO") {
      return "O"
    } 
  }
}

function doTurn(element) {
  if (winner() === undefined) {
    updateState(element) 

    if (checkWinner() || full()) {
      saveGame()
      reset()
    }
  }
}

function gameExists(id) {
  return id in window.games
}

function loadGames() {
  let req = $.get('/games')

  req.done(function(data) {
    window.games = {}

    if (data['data'] !== undefined) {
      for(const game of data['data']) {
        window.games[game['id']] = {
          'state': game['attributes']['state'],
          'updated-at': game['attributes']['updated-at']
        }
      }
    }
  })

  return req
}

function saveGame() {
  const tiles = $('td').map(function() { return $(this).text() })

  const output = { "state": tiles.toArray() }

  if (gameExists(window.current_game_id)) {
    persistGame(output)
  } else {
    updateGame(output)
  }
}

function persistGame(output) {
  let req = $.ajax({
    url: '/games/' + window.current_game_id,
    method: 'PATCH',
    data: output
  })

  req.done(function(data) {
    let game = window.games[window.current_game_id]
    game['state'] = output['state']
    game['updated_at'] = data['data']['attributes']['updated-at']
  })
}

function updateGame(output) {
  let req = $.post('/games', output)

  req.done(function(data) {
    window.current_game_id = parseInt(data['data']['id'])
    window.games[window.current_game_id] = {}

    let game = window.games[window.current_game_id]
    game['state'] = output['state']
    game['updated-at'] = data['data']['attributes']['updated-at']
  })
}

function clearGame() {
  window.current_game_id = null
  reset()
}

function previousGames() {
  let new_buttons = ""

  for (const key in window.games) {
    let game = window.games[key]

    new_buttons += '<button class="game_buttons" data-id="' + key + '">'
    new_buttons += '<b>' + key + '</b>: ' + game['updated-at']
    new_buttons += '</button>'
  }

  $('#games').html(new_buttons)

  $('.game_buttons').on('click', function(e) {
    window.current_game_id = parseInt($(this).data('id'))

    setBoard(window.games[window.current_game_id]['state']) 
  })
}

function setBoard(state) {
  let squares = $('td') 

  window.turn = 0
  for (let i = 0; i < squares.size(); i++) {
    if (state[i] !== "") window.turn += 1
    squares[i].innerHTML = state[i]
  }
}

