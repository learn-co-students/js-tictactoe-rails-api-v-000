// Code your JavaScript / jQuery solution here
var turn = 0
var currentGame
const winCombo = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                  [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

$(function() {
  attachListeners()
})

function player() {
  return turn % 2 === 0 ? 'X' : 'O'
}

function updateState(square) {
  square.innerHTML = player()
}

function setMessage(msg) {
  $('div#message').html(msg)
}

function checkWinner() {
  let board = $('td').map(function(){
    return $(this).text()
  }).get()
  return winCombo.some((combo) => {
    let winner  = board[combo[0]]!=="" && board[combo[0]]!==undefined && board[combo[0]]===board[combo[1]] && board[combo[1]]===board[combo[2]]

    if (winner === true) {
      setMessage(`Player ${board[combo[0]]} Won!`)
    }
    return winner
  })
}

function doTurn(square){
  updateState(square)
  turn++
  if (checkWinner()) {
    saveGame()
    resetBoard()
  } else if (turn === 9) {
    setMessage("Tie game.")
    saveGame()
    resetBoard()
  }
}

function resetBoard(){
  turn = 0
  currentGame = undefined
  $('td').each(function() {
    $(this).text('')
  })
}

function attachListeners() {
  $('td').on('click', function(){
    if ($(this).text() === '' && !checkWinner()) {
      doTurn(this)
    }
  })
  $('#previous').on('click', () => showPreviousGames())
  $('#save').on('click', () => saveGame())
  $('#clear').on('click', () => resetBoard())
}

function showPreviousGames() {
  $('#games').empty()
  $.get('/games', function(games){
    if (games['data'].length > 0) {
      games['data'].forEach(previousGamesButton)
    }
  })
}

function previousGamesButton(game) {
  $('#games').append(`<button id='gameid-${game.id}'>${game.id}</button>`)
  $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id))
}

function saveGame() {
  let state = $('td').map(function(){
    return $(this).text()
  }).get()
  data = {state: state}
  if (currentGame) {
    $.ajax({
      url:`/games/${currentGame}`,
      type: 'PATCH',
      data: data
    })
  } else {
    $.post('/games', data, function(game){
      currentGame = game.data.id
      $('#games').append(`<button id='gameid-${game.data.id}'>${game.data.id}</button>`)
      $(`#gameid-${game.data.id}`).on('click', () => reloadGame(game.data.id))
    })
  }
}

function reloadGame(gameId){
  // console.log('clicked')
  $.get(`/games/${gameId}`, function(game){
    currentGame = game.data.id
    const state = game.data.attributes.state
    turn  = state.filter((e) => e!=='').length
    let index = 0
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++){
        
        $(`td[data-x='${x}'][data-y='${y}']`).html(state[index])
        index++
      }
    }
  })
}
