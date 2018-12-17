// Code your JavaScript / jQuery solution here
var turn = 0;
var gameNum = 0;

const WIN_COMBINATIONS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

$(function() {
  attachListeners();
})

function player() {
  if (!!(turn % 2)) {
    return 'O'
  } else {
    return 'X'
  }
}

function getBoard() {
  board = {}
  $('td').text((index, el) => board[index] = el)
  return board
}

function setNewGame() {
  $('td').empty();
  turn = 0;
  gameNum = 0;
}

function setMessage(string) {
  $('#message').text(string)
}

function updateState(el) {
  //el is the clicked element, so query for that and update text of element
  $(el).text(player())
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

function doTurn(el) {
  updateState(el)
  turn ++
  if (turn === 9) {
    setMessage("Tie game.")
    setNewGame()
  }
  else if (checkWinner()) {
    checkWinner()
    setNewGame()
  }
}

function isTaken(el) {
  !(el.text === '')
}
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
  // $('#clear').on('click', setNewGame)
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
  $('#games').append(`<button id="game-id-${game.id}">${game.id}</button>`)
}

function saveGame() {
  $('td').submit(function(event) {
    event.preventDefault();
    var values = $(this).serialize();
    var posting = $.post('/games', values)

  })
}
