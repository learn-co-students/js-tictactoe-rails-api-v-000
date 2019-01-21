var turn = 0
var gameCount = 0

function player() {
  var player = "O"
  if (turn % 2 === 0) {
    player = "X"
  }
  return player
}

function updateState(square) {
  // if(square.innerHTML = "") {
    square.innerHTML = player()
  // }
}

function setMessage(message) {
  $('div#message').text(message)
}

function checkWinner() {
  var winSwitch = false
  var winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2],
  ]
  var squares = document.querySelectorAll('td')
  winCombinations.forEach(function(combination) {
    var squareOne = squares[combination[0]].textContent
    var squareTwo = squares[combination[1]].textContent
    var squareThree = squares[combination[2]].textContent
    if (squareOne + squareTwo + squareThree === "XXX") {
      setMessage("Player X Won!")
      winSwitch = true
    } else if (squareOne + squareTwo + squareThree === "OOO") {
      debugger
      setMessage("Player O Won!")
      winSwitch = true
    }
  })
  return winSwitch
}

function doTurn(square) {
  // var squares = document.querySelectorAll('td')
  updateState(square)
  turn = turn + 1
  if(checkWinner()) {
    saveGame()
    resetBoard()
  } else if(turn === 9) {
    debugger
    setMessage("Tie game.")
    saveGame()
    resetBoard()
  }
}

function resetBoard() {
  var squares = document.querySelectorAll('td')
  turn = 0
  gameCount = 0
  squares.forEach(function(square) {
    square.textContent = ""
  })
}

// function attachListeners() {
//   $('td').on('click', function() {
//     if(!checkWinner()) {
//       doTurn(this)
//     }
//   })
// }

function saveGame() {
  var state = []
  var gameData

  $('td').text(function(index, square) {
    state.push(square)
  })

  gameData = {state: state}

  if (gameCount != 0) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${gameCount}`,
      data: gameData
    })
  } else {
    $.post('/games', gameData, function(game) {
      gameCount = game.data.id
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`)
      $('#gameid-' + game.data.id).on('click', function(button) {
        reloadGame(game.data.id)
      })
    })
  }
}

function showPreviousGames() {
  $('#games').empty()
  $.get('/games', function(savedGames) {
    if (savedGames.data.length) {
      savedGames.data.forEach(function(savedGame) {
        $('#games').append(`<button id="gameid-${savedGame.id}">${savedGame.id}</button><br>`)
        $('#gameid-' + savedGame.id).on('click', function(button) {
          reloadGame(savedGame.id)
        })
      })
    }
  })
}

function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#save').on('click', () => saveGame())
  $('#previous').on('click', () => showPreviousGames())
  $('#clear').on('click', () => resetBoard())
}

$(document).ready(function() {
  attachListeners()
})
