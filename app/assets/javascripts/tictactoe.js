// Code your JavaScript / jQuery solution here
var turn = 0
var currentGame = 0

const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];


function player() {
  return (turn % 2 === 0) ? "X" : "O"
}

function updateState(square) {
  let token = player()
  $(square).text(token)
}

function setMessage(string) {
  $("#message").html(string)
}

function checkWinner() {
  let winner = false
  var board = Array.from(document.querySelectorAll("td")).map(square => square.innerHTML)
  WINNING_COMBOS.forEach(function(combo) {
    if ((board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) && board[combo[0]] !== '') {
      setMessage(`Player ${board[combo[0]]} Won!`)
      return winner = true
    }
  })
  return winner
}

function doTurn(square) {
  updateState(square)
  turn++
  if (checkWinner()) {
    saveGame()
    reset()
  } else if (turn === 9) {
    setMessage("Tie game.")
    saveGame()
    reset()
  }
}

function reset() {
  turn = 0
  currentGame = 0
  $('td').empty()
}

$(document).ready(function() {
  attachListeners()
})

function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this)
    }
  })
  $('#save').on('click', () => saveGame())
  $('#previous').on('click', () => listPreviousGames())
  $('#clear').on('click', () => reset())
}

function saveGame() {
  var gameStatus = []
  $("td").text((index, square) => gameStatus.push(square))
  var gameData = { state: gameStatus }
  if (currentGame) {
    $.ajax({
      method: "PATCH",
      url: `/games/${currentGame}`,
      data: gameData
    });
  } else {
    $.post("/games", gameData, function(game) {
        currentGame = game.data.id;
        $("#games").append(`<button id="button-${game.data.id}">${game.data.id}</button>`)
        $(`#button-${game.data.id}`).on('click', () => reloadGame(game.data.id))
      })
    }
  }

function listPreviousGames() {
  $('#games').empty();
  $.get('/games', (allGames) => {
     if (allGames.data.length > 0) {
       allGames.data.forEach(function(game) {
         $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`)
         $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id))
       });
     }
   });
}

function reloadGame(gameId) {
  $.get(`/games/${gameId}`, function(response){
    currentGame = response.data.id
    gameArray = response.data.attributes.state
    turn = gameArray.join("").length
    var index = 0
    for (var y = 0; y < 3; y ++) {
      for (var x = 0; x < 3; x ++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = gameArray[index];
        index += 1;
      }
    }
  })
}
