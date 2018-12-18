var turn = 0;
var gameNum = 0;

const WIN_COMBINATIONS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

$(function() {
  attachListeners();
})

function attachListeners() {
//attach listeners to board and 3 buttons
//if board is clicked call doTurn(), else call button specific function
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this)
    }
  })

  $('#previous').on('click', previousGames)
  $('#save').on('click', saveGame)
  $('#clear').on('click', setNewBoard)
}

function checkWinner() {
  getBoard()
  var winner = false
//compare board to winning combinations, return true or false
  WIN_COMBINATIONS.some(combo => {
    if (board[combo[0]] !== '' && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  })
  return winner
}

function getBoard() {
  board = {}
  $('td').text((index, el) => board[index] = el)
  return board
}

function setMessage(string) {
  $('#message').text(string)
}

function doTurn(el) {
  updateState(el)
  turn ++
  if (turn === 9) {
    setMessage("Tie game.")
    saveGame()
    setNewBoard()
  }
  else if (checkWinner()) {
    checkWinner()
    saveGame()
    setNewBoard()
  }
}

function updateState(el) {
  //el is the clicked element, so query for that and update text of element
  $(el).text(player())
}

var player = () => (turn % 2) ? 'O' : 'X'

function setNewBoard() {
  $('td').empty();
  turn = 0;
  gameNum = 0;
}

function previousGames() {
  $('#games').empty()
  $.get('/games', games => {
    if (games.data.length) {
      games.data.forEach(gameButton)
    }
  })
}

function gameButton(game) {
  $('#games').append(`<button id="game-id-${game.id}">Game #${game.id}</button><br>`)
  $(`#game-id-${game.id}`).on('click', () => loadPreviousGame(game.id))
}

function saveGame() {
  var state = []
  var gameState

  $('td').text((index, el) => {state.push(el)})

  gameState = {state: state}

  if(gameNum) {
    $.ajax({
      method: 'PATCH',
      url: `/games/${gameNum}`,
      data: gameState
    })
  } else {
    $.post('/games', gameState, function(game) {
      gameNum = game.data.id;
      $('#games').append(`<button id="game-id-${game.data.id}">Game #${game.data.id}</button>`)
      $(`#game-id-${game.data.id}`).on('click', () => loadPreviousGame(game.data.id))
    })
  }
}

function loadPreviousGame(game_id) {
  $('#message').text("")
  el_num = 0
  $.get(`/games/${game_id}`, function(data) {
    const board = data.data.attributes.state

    board.forEach( square => {
      $('td')[el_num].innerHTML = square
      el_num ++
  })
  turn = board.join('').length
  gameNum = game_id
})
}
