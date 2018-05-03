var turn = 0;
var currentGame = 0;
var WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
]

$(document).ready(function() {
  attachListeners();
});

function attachListeners() {
  $('td').click(function() {
    if (!$.text(this) && !checkWinner() && !tieGame()) {
      doTurn(this)
    }
  })

  $('#clear').click(resetBoard)
  $('#save').click(saveGame)
  $('#previous').click(previousGame)
}



function player() {
  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}

function updateState(square) {
  var currentPlayer = player();
  $(square).text(currentPlayer);
}

function setMessage(message) {
  $(`#message`).text(message);
}

function checkWinner() {
  var board = []
  $("td").text(function(index, square) {
    board[index] = square;
  });

  for(var combo of WINNING_COMBINATIONS) {
    if (board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] && board[combo[0]] !== "") {
      setMessage("Player " + board[combo[0]] + " Won!");
      return true;
    }
  }
  return false;
}

function resetBoard() {
  $('td').empty()
  turn = 0
  currentGame = 0
}

function tieGame() {
  return turn === 9
}

function doTurn(element) {
  updateState(element)
  turn++
  if (checkWinner()) {
    saveGame()
    resetBoard()
  } else if (tieGame()) {
    setMessage("Tie game.")
    saveGame()
    resetBoard()
  }
}

function reloadGame(gameId){
  $.get(`/games/${gameId}`).done(function(game){
    currentGame = game.data.id
    const state = game.data.attributes.state
    turn = 0
    var space = $('td')

    for (var i = 0; i < 9; i++) {
      space[i].innerHTML = state[i]
      if (state[i] !== "") {turn++}
    }
  })
}

function createButton(game) {
  $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
  $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
}

function saveGame() {
  var board = []
  var gameData

  $('td').text((index, square) => {
    board[index] = square
  })

  gameData = { state: board }

  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    })
  } else {
    $.post('/games', gameData, function(game) {
      currentGame = game.data.id
      createButton(game.data)
    })
  }
}

function previousGame() {
  $('#games').empty()
  $.get('/games', function(savedGames) {
    if (savedGames.data.length) {
      savedGames.data.forEach(game => {
        createButton(game)
      })
    }
  })
}
