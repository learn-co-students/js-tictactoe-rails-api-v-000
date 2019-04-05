var turn = 0;
var currentGame = 0;
var winningSpaces = [
  [0, 1, 2], [3, 4, 5],
  [6, 7, 8], [0, 3, 6],
  [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

$(document).ready(function () {
  attachListeners();
});

function player() {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(square) {
  var token = player()
  $(square).text(token)
}

function setMessage(newMessage) {
  $('#message').text(newMessage)
}

function checkWinner() {
  var winner = false
  var board = {}
  var winningToken
  board = $('td')
  winningSpaces.forEach(function (winIndex) {
    if (
        board[winIndex[0]].innerHTML === "X" && 
        board[winIndex[1]].innerHTML === "X" && 
        board[winIndex[2]].innerHTML === "X"
      )
      {
        winner = true
        winningToken = "X"
      } 
    else if (
        board[winIndex[0]].innerHTML === "O" &&
        board[winIndex[1]].innerHTML === "O" &&
        board[winIndex[2]].innerHTML === "O"
      ) 
      {
        winner = true
        winningToken = "O"
      }
    }
  );
  if (winner === true) {
    setMessage("Player " + winningToken + " Won!")
  }
  return winner;
}

function doTurn(square) {
  var gameOver = true
  updateState(square)
  var board = {}
  board = $('td')
  turn++
  var winner = checkWinner()
  if (turn === 9 && winner === false) {
    setMessage("Tie game.")
    resetBoard()
    saveGame()
  }
  if (winner === true) {
    resetBoard()
    saveGame()
  }
}

function resetBoard() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
}

function attachListeners() {
  $('td').on('click', function () {
    console.log("click")
    if (!$.text(this) && !checkWinner()) {
      doTurn(this)
    }
  })
  $('#save').on('click', () => saveGame())
  $('#previous').on('click', () => showPreviousGames())
  $('#clear').on('click', () => resetBoard())
}

function saveGame() {
  var state = [];
  var gameData;
  $('td').text((index, square) => {
    state.push(square);
  });
  gameData = {
    state: state
  };
  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    });
  } else {
    $.post('/games', gameData, function (game) {
      currentGame = game.data.id;
      $('#games').append(
          `<button id="gameid-${game.data.id}">${game.data.id}</button><br>`
        );
      $("#gameid-" + game.data.id).on(
          'click', () => reloadGame(game.data.id)
        );
    });
  }
}

function showPreviousGames() {
  $('#games').empty();
  $.get('/games', (savedGames) => {
    if (savedGames.data.length) {
      savedGames.data.forEach(buttonizePreviousGame);
    }
  });
}

function buttonizePreviousGame(game) {
  $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
  $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
}

function reloadGame(gameID) {
  document.getElementById('message').innerHTML = '';
  var xhr = new XMLHttpRequest;
  xhr.overrideMimeType('application/json');
  xhr.open('GET', `/games/${gameID}`, true);
  xhr.onload = () => {
    var data = JSON.parse(xhr.responseText).data;
    var id = data.id;
    const state = data.attributes.state;
    var index = 0;
    for (var y = 0; y < 3; y++) {
      for (var x = 0; x < 3; x++) {
        document.querySelector(
          `[data-x="${x}"][data-y="${y}"]`
          ).innerHTML = state[index];
        index++;
      }
    }
    turn = state.join('').length;
    currentGame = id;
    if (!checkWinner() && turn === 9) {
      setMessage('Tie game.');
    }
  };
  xhr.send(null);
}
