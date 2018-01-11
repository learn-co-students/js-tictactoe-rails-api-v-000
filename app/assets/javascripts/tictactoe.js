let currentGame = undefined
var turn = 0
var winner = ""
var board = ["", "", "", "", "", "", "", "", ""]

$(document).ready(function() {
  attachListeners()
})

function attachListeners(){
  $('#save').on('click', function(event){
    event.preventDefault()
    saveGame()
  })

  $('#previous').on('click', function(event){
    event.preventDefault()
    previousGames()
  })

  $('#clear').on('click', function(event){
    event.preventDefault()
    clearGame()
  })

  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this)
    }
  })
}

function doTurn(square){
  updateState(square)
  turn++
  if(checkWinner()) {
    saveGame()
    clearGame()
  } else if(turn === 9) {
    setMessage('Tie game.')
    saveGame()
    clearGame()
  }
};

function player(){
  if(turn % 2){
    return 'O'
  }else {
    return 'X'
  }
}

function currentState() {
  var board = []
   $("td").each(function(){
     board.push($(this).text())
   })
  return board
}

function updateState(square){
  if ($(square).text() === '') {
    $(square).text(player())
  } else {
    $(square).click(false)
    setMessage("That space is taken. Please choose another.")
  }
}

function setMessage(string){
    $('#message').text(string)
}

function checkState(combo, board){
  if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
    winner = board[combo[1]]
    return true
  }
}

function checkWinner() {
  const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

  for(i = 0; i < WINNING_COMBOS.length; i++){
    if (checkState(WINNING_COMBOS[i], currentState())){
      setMessage(`Player ${winner} Won!`)
      return true
    }
  }
  return false
}

function saveGame() {
  gameData = { state: currentState() }

  if (currentGame) {
    $.get({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    });
  } else {
    $.post('/games', gameData, function(game){
      currentGame = game.data.id
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`)
    })
   }
}

function previousGames() {
  $('#games').empty()
  $.get('/games', function(savedGames){
    if (savedGames.data.length) {
      savedGames.data.forEach(function(game){
        $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`)
        $(`#gameid-${game.id}`).on('click', function(){getGame(game.id)})
      })
    }
  })
}

function getGame(gameID) {
  setMessage('')

  $.get(`/games/${gameID}`, function(game){
    let state = game.data.attributes.state
    let id = game.data.id

    let index = 0
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index]
        index++
      }
    }

    turn = state.join('').length
    currentGame = id
  })
}

function clearGame(){
  setMessage('')

  turn = 0
  currentGame = 0
  $('td').empty()
}
