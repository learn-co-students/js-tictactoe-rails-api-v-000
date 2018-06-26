// Code your JavaScript / jQuery solution here
var winCombos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0
var currentGame = 0

$(document).ready( () => {
  attachListeners()
})

function player(){
  return turn % 2 ? 'O' : 'X';
}

function updateState(square) {
  square.innerHTML = player()
}

function setMessage(string) {
  $("div#message").append(string)
}

function checkWinner() {
  var winner = false
  var board = {}

  $('td').text((index, square) => {
    board[index] = square
  })
  winCombos.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`)
      return winner = true
    }
  })
  return winner
}

function full() {
  return $.makeArray($("td")).every(function(cell) {
    return !(cell.innerHTML === "")
  })
}

function clearBoard() {
  $('td').empty()
  turn = 0
}

function positionTaken(clickedPostition) {
  return clickedPostition.innerText != ""
}

function validMove(square) {
  return !positionTaken(square)
}

function doTurn(square) {
  updateState(square);
  turn++;
  if (checkWinner()) {
    saveGame();
    clearBoard();
  } else if (full()) {
    setMessage('Tie game.');
    saveGame();
    clearBoard();
  }
}

function saveGame() {
  var state = []
  var gameData = {}
  var url = '/games'

  $('td').text((index, square) => {
    state.push(square)
  })

  if (currentGame) {
    gameData = { 'game': {'state': state, 'id': currentGame} }
    $.ajax({
      url: `${url}/${gameData.game.id}`,
      data: gameData,
      type: 'PATCH',
    })
  } else {
    gameData = { 'game': {'state': state} }
    $.post(url, gameData, function (game) {
      currentGame = parseInt(game.data.id)
    })
  }
}

function clearGame() {
 if (currentGame) {
   clearBoard()
   currentGame = 0
 } else {
   clearBoard()
 }
}

function previousGames() {
  var url = '/games'
  var gamesButtons = $('#games button')

  $.get(url, function (games) {
    $('#games').empty()
    games.data.forEach(function(game){
      $('#games').append(`<button data-id='${game.id}'>${game.id}</button>`)
    })
  })
}

function getGame() {
  var id  = event.path[0].dataset.id
  var url = `/games/${id}`

  $.get(url, function (game) {
    currentGame = parseInt(game.data.id)
    var gameState = game.data.attributes.state
    var counter = 0

    gameState.forEach(function(token, index) {
      if (token === 'X' || token === 'O') {
        counter++
      }
      $('td')[index].innerHTML = token
    })
    turn = counter
  })
}

function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
     doTurn(this);
   }
  })
  $('#save').on('click', () => saveGame())
  $('#clear').on('click', () => clearGame())
  $('#previous').on('click', () => previousGames())
  $('#games').on('click', 'button', () => getGame())
}
