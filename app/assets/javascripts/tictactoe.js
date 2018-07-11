// Code your JavaScript / jQuery solution here
var turn = 0
var message = ""
var token = ""
var saveID
function player() {
  var turnco = (turn / 2)
  if(turnco === Math.floor(turnco)) {
    return "X";
  }
  else {
    return "O";
  }
}

function updateState(position) {
  var move = $(position)
  token = player()
  move.text(token)
}

function setMessage(message) {
  $("#message").html(message)

}

function checkWinner() {
  const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],  [1,4,7], [2,5,8], [0,4,8], [2,4,6]]
  var board = []
  var won = false
  $('td').text((index, content) => {
    board.push(content)})

  WINNING_COMBOS.some(function(combo) {
    if(board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
    message = `Player ${board[combo[0]]} Won!`
    setMessage(message)
    won = true
    }
  })
  if(won === true) {
    return true}
  else {
    return false
  }
}

function validMove(position) {
  if(position.innerHTML === '' ) {
    return true
  }
}

function doTurn(position) {
  if(validMove(position)){
    updateState(position)
    turn += 1
    if(checkWinner() === true) {
      saveGame()
      $('td').empty()
      turn = 0
      saveID = 0
    }
    else if(turn === 9){
      saveGame()
      $('td').empty()
      turn = 0
      //saveID = 0
      message = "Tie game."
      setMessage(message)
    }
  }
}

function saveGame() {
  var board = []
  var gamedata = {state: board}
  $('td').text((index, content) => {
    board.push(content)})
  if(!!saveID) {
    $.ajax ({
         type: 'PATCH',
         url: `/games/${saveID}`,
         data: gamedata
       })
  }
  else {
    $.post("/games", gamedata, function(gamedata) {
      $('#games').append(gamedata)
      saveID = gamedata.data.id
    })
  }
}

function loadGame(gameID) {
  $.get(`/games/${gameID}`).done(function(data) {
    $('td').each(function(i, td) {
      td.innerHTML = data.data.attributes.state[i]
    })
    turn = data.data.attributes.state.join('').length
  })
  saveID = gameID
}

function previousGames() {
  $('#games').empty()
  $.get("/games", function(data) {
    data.data.forEach(function(game) {
        var b = `<button onclick="loadGame(${game.id})">${game.id}</button>`
        $('#games').append(b)
      })})
}

function clearGame() {
  $('td').empty()
  turn = 0
  saveID = 0
}

function attachListeners() {
  $('td').on("click", function () {
    if(checkWinner() === false){
      doTurn(this)
    }
  })

  $('#save').on("click", function () {
    saveGame()
  })

  $('#previous').on("click", function () {
    previousGames()
  })

  $('#clear').on("click", function () {
    clearGame()
  })

}

$(document).ready(function(){
  attachListeners()
})
