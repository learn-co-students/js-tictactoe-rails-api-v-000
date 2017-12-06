let turn = 0
let currentGame = null
let gameOver = false

$(function() {
  attachListeners()
})

function player(){
  return (turn % 2 === 0) ? 'X' : 'O'
}

function updateState(space){
  space.innerText = player()
}

function setMessage(message){
  $('#message').text(message)
}

function checkWinner(){
  const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]
  let winner = false
  let board = $('td')
  WINNING_COMBOS.forEach(function(combo) {
    if (board[combo[0]].innerText !== "" &&
        board[combo[0]].innerText === board[combo[1]].innerText &&
        board[combo[1]].innerText === board[combo[2]].innerText) {
      winner = true
    }
  })
  return winner
}

function checkTie(){
  if (checkWinner() === false  && turn === 9) {
    return true
  } else {
    return false
  }
}

function doTurn(space){
  if (gameOver === false) {
    updateState(space)
    turn += 1
    if ( checkTie() ) {
      setMessage('Tie game.')
      gameOver = true
    } else if ( checkWinner() ) {
      setMessage(`Player ${space.innerText} Won!`)
      gameOver = true
    }
  }
}

function attachListeners(){
  $('td').on('click', function() {
    if (this.innerText) {
      alert('Position already taken')
    } else {
      doTurn(this)
    }
  })

  $('button#save').on('click', function() {
    saveGame()
  })

  $('button#previous').on('click', function() {
    previousGames()
  })

  $('button#clear').on('click', function() {
    $('td').empty()
    setMessage("")
    currentGame = null
    turn = 0
    gameOver = false
  })
}

function saveGame() {
  setMessage("")
  let tokens = []
  let gameState = { state: tokens }

  $('td').text(function(index, token){
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
}

function loadGame(gameID) {
  $(`button#game-id-${gameID}`).on('click', function(){
    currentGame = gameID
    $.get(`/games/${gameID}`, function(gameData) {
      gameState = gameData.data.attributes.state
      gameState.forEach(function(token, index){
        $('td')[index].innerText = token
      })
      turn = gameState.join('').length
      if (checkWinner() || checkTie()) {
        gameOver = true
      }
    })
  })
}

function previousGames() {
  $('#games').empty()
  setMessage("")
  $.get('/games', function(games) {
    games.data.forEach(function(game){
      $('#games').append(`<button id="game-id-${game.id}">${game.id}</button>`)
      loadGame(game.id)
    })
  })
}
