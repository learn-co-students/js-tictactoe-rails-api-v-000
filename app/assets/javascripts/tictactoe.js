var turn = 0
var currentGame = 0
var winCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
$(document).ready(() => attachListeners())

function attachListeners() {
  $("td").click(function() {
    if (!checkWinner()) {
      doTurn(this)
    }
  })
  $('#save').click(() => saveGame())
  $('#previous').click(() => previousGame())
  $('#clear').click(() => resetBoard())
}

function player() {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(square) {
  let token = player()
  $(square).text(token)
}

function setMessage(msg) {
  $("#message").text(msg)
}

function checkWinner() {
  const squares = $("td")
  var winner = false
  let board = Array.from(squares).map(square => square.innerHTML)
  winCombos.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`)
      return winner = true
    }
  })
  return winner
}

function doTurn(square) {
  if ($(square).html() === "") {
     updateState(square)
     turn++
     if(checkWinner()) {
       saveGame()
       resetBoard()
     } else if (turn === 9) {
       setMessage("Tie game.")
       saveGame()
       resetBoard()
     }
   }
 }

function resetBoard(){
  $("td").empty()
  turn = 0
  currentGame = 0
}

function previousGame() {
  $("#games").empty()
  $.get('/games', function(games){
    games.data.forEach(function(game) {
      $('#games').append(`<button id="game-data-${game.id}">Game ${game.id}</button><br>`)
      $('#game-data-' + game.id).on('click', () => loadGame(game.id))
    })
  })
}

function saveGame() {
  var state = []
   $('td').text((index, square) => {
     state.push(square)
   })
   var data = { state: state }
   if (currentGame) {
     $.ajax({
       type: 'PATCH',
       url: `/games/${currentGame}`,
       data: data
     })
   } else {
     $.post('/games', data, function(game) {
       currentGame = game.data.id
       $('#games').append(`<button id="${game.data.id}">${game.data.id}</button><br>`)
       $(`#${game.data.id}`).click(() => loadGame(game.data.id))
     })
   }
 }

function loadGame(id) {
  const xhr = new XMLHttpRequest
  xhr.overrideMimeType('application/json')
  xhr.open('GET', `/games/${id}`, true)
  xhr.onload = () => {
    const data = JSON.parse(xhr.responseText).data
    const state = data.attributes.state
    for (let i = 0; i < $('td').length; i++) {
         $('td')[i].innerHTML = state[i]
      }
    turn = state.join('').length
    currentGame = data.id
  }
  xhr.send(null)
}
