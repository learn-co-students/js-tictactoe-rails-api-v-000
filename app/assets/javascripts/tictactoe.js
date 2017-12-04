const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

let turn = 0
let currentGame = null

$(function() {
  attachListeners()
})

function player(){
  return (turn % 2) ? 'O' : 'X'
}

function updateState(space){
  space.innerText = player()
}

function setMessage(message){
  $('#message').append(message)
}

function checkWinner(){
  let winner = false
  let board = $('table td')
  WINNING_COMBOS.forEach(function(combo) {
    if (board[combo[0]].innerText !== "" &&
        board[combo[0]].innerText === board[combo[1]].innerText &&
        board[combo[1]].innerText === board[combo[2]].innerText)
      setMessage(`Player ${board[combo[0]].innerText} Won!`)
      winner = true
  })
  return winner
}

function doTurn(space){
  updateState(space)
  checkWinner()
  turn += 1
}

function attachListeners(){
  $('table td').on('click', function() {
    if (this.innerText) {
      alert('Position already taken')
    } else {
      doTurn(this)
    }
  })

  $('button#save').on('click', function() {
    let tokens = []
    let gameState = { state: tokens }

    $('table td').text(function(index, token){
      tokens.push(token)
    })

    if (currentGame) {
      $.ajax({
        method: 'PATCH',
        url: `/games/${currentGame}`,
        data: gameState
      })
      .done(function() {
        alert( 'Game Saved!' );
      });
    } else {
      $.post('/games', gameState, function(game) {
        currentGame = game.data.id
        $('#games').append(`<button id="game-id-${game.data.id}">${game.data.id}</button>`)
        loadGame(game.data.id)
      })
    }
  })

  $('button#previous').on('click', function() {
    $('#games').empty()
    $.get('/games', function(games) {
      games.data.forEach(function(game){
        $('#games').append(`<button id="game-id-${game.id}">${game.id}</button>`)
        loadGame(game.id)
      })
    })
  })

  $('button#clear').on('click', function() {
    $('table td').empty()
    currentGame = null
  })
}

function loadGame(gameID) {
  $(`button#game-id-${gameID}`).on('click', function(){
    currentGame = gameID
    $.get(`/games/${gameID}`, function(gameData) {
      gameData.data.attributes.state.forEach(function(token, index){
        $('table td')[index].innerText = token
      })
    })
  })
}
