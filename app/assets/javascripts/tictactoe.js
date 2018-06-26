// Code your JavaScript / jQuery solution here
var turn = 0
var gameId = 0
var winningCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]

function player() {
  return turn % 2 === 0 ? "X" : "O"
}

function updateState(square) {
  $(square).text(player())
}

function setMessage(message) {
  $("#message").text(message)
}

// returns true when a player has won
function checkWinner() {
  // get the current board
  let curr_board = []
  for(let i = 0; i < 9; i++){
    let square = $("td")[i].innerHTML
    curr_board.push(square)
  }
  // loop through the winningCombos and check if the board matches a combination and if the space isnt an empty space
  for (var i = 0; i < winningCombos.length; i++) {
    if(curr_board[winningCombos[i][0]] === curr_board[winningCombos[i][1]] && curr_board[winningCombos[i][1]] === curr_board[winningCombos[i][2]] && curr_board[winningCombos[i][0]] !== "" ){
      setMessage(`Player ${curr_board[winningCombos[i][0]]} Won!`)
      return true
    }
  }
  return false
}

function doTurn(square) {
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


function attachListeners() {
  $('td').on('click', function() {  
    if (!checkWinner() && !$.text(this)) {
      doTurn(this)
    };
  })

  $('#clear').on('click', function() {
    resetBoard()
  })

  $('#save').on('click', function() {
    saveGame()
  })

  $('#previous').on('click', function() {
    previousGames()
  })
}

function saveGame(){
  let curr_board = []
  for(let i = 0; i < 9; i++){
    let square = $("td")[i].innerHTML
    curr_board.push(square)
  }
  
  if (gameId === 0) {
      $.post("/games", { state: curr_board }, function(game) {
        gameId = game.data.id
        $('#games').append(`<button id="game-id-${gameId}" data-id="${gameId}>Game ${gameId}</button><br>`);
        $(`#game-id-${gameId}`).on('click', loadGame);
      })
    } else {
      $.ajax({
        url: `/games/${gameId}`,
        type: 'PATCH',
        data: curr_board
      })
    }
}

function resetBoard() {
  $('td').empty()
  turn = 0
  gameId = 0
}

function previousGames() {
  $('#games').empty()
  $.get('/games', function(games) {
    games.data.forEach(function(game) {
      $('#games').append(`<button id="game-id-${game.id}" data-id="${game.id}">Game ${game.id}</button><br>`)
      $(`#game-id-${game.id}`).on('click', loadGame)
    })
  })
}

function loadGame(event) {
  var id = event.target.dataset.id
  $.get(`/games/${id}`, function(game) {
    var gameState = game.data.attributes.state
    let index = 0
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = gameState[index];
        index++;
      }
    }
    //turn counter && gameId
    turn = 0;
    for(let i = 0; i < gameState.length; i++){
      if(gameState[i] === "O" || gameState[i] === "X")
          turn++
    }
    gameId = id
  })
}

$(document).ready(function(){
  attachListeners()
})