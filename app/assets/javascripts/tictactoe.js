'use strict'

const  winningCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ];
let turn = 0
let currentGame

$(() => {
  attachListeners()
})

const attachListeners = () => {
  $('td').click(function () {
    doTurn($(this).data('x'), $(this).data('y'));
  })
  $('#previous').click(() => {
    getAllGames()
  })
  $('#save').click(() => {
    saveGame()
  })
}

function doTurn(x,y) {
  updateState(x,y)
  checkWinner()
  turn += 1
}

function updateState (x,y) {
  $(`[data-x=${x}][data-y=${y}]`).html(player())
}

function checkWinner () {
  let winner = false
  let board = checkBoard ()
  winningCombos.forEach(function(position) {
    if (board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && board[position[0]] !== ""){
      winner = true
    }
  })
  if (winner === true) {
    message(`Player ${player()} Won!`)
    resetBoard()
  } else if (turn === 8) {
    message('Tie game')
    resetBoard()
  } else {
    return false
  }
}

function resetBoard () {
  turn = -1
  $('td').html("")
}

function checkBoard () {
  return $('td').map(function() {
    return this.innerHTML
  }).toArray()
}

function player() {
  if (turn % 2 === 0) {
    return 'X'
  } else {
    return 'O'
  }
}

function message (message) {
  $('#message').html(message)
}

// 'Show Previous Games' button fires this.
function getAllGames () {
  $.get('/games')
    .done((response) => {
      if (response.games.length > 0) {
        let games = $()
        response.games.forEach(function(e) {
          games = games.add(`<li id="${e.id}">${e.id}</li>`)
        })
        $('#games').html(games)
      }
    })
}

// 'Save Game' button fires this.
function saveGame () {
  let url
  let method
  // If the game exists in the db already
  if (currentGame) {
    url = `/games/${currentGame}`
    method = 'PATCH'
  // If this is a new game not in the db
  } else {
    url = '/games'
    method = 'POST'
  }
  // I chose .ajax over two jQuery calls in the block above.
  $.ajax({
    url: url,
    method: method,
    dataType: 'json',
    data: {
      game: {
        state: checkBoard()
      }
    },
    success: (data) => {
      // Set the currentGame to the just saved game.
      // This might need to be changed. Not sure just yet.
      currentGame = data.game.id
    }
  })
}