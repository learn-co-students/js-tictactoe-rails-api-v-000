var winningCombos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0;
var board = {};
var gameState = [];
var currentGame = 0;

function player() {
  if (turn % 2 === 0) {
    return 'X';
  } else {
    return 'O';
  }
}

function updateState(td){
  $(td).text(player());
}

function setMessage(message) {
  $('#message').html(message)
}

function checkWinner() {
  var winner = false;

  $('td').text((index, square) => board[index] = square);

  winningCombos.forEach(function(position) {
    if (board[position[0]] != "" && board[position[0]] == board[position[1]] && board[position[1]] == board[position[2]]) {
      setMessage(`Player ${board[position[0]]} Won!`)
      return winner = true;
    }
  })
  return winner
}

function doTurn(square) {
  updateState(square);
  turn++;
  if (checkWinner()) {
    saveGame()
    resetGame() 
  } else if (turn === 9) {
    saveGame()
    setMessage('Tie game.');
    resetGame()
  }
}

$(document).ready(function() {
  attachListeners();
});

function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    };
  });
  
  $('#save').on('click', function() {
    saveGame()
  });

  $('#previous').on('click', function(game) {
    showPreviousGames();
  });

  $('#clear').on('click', function() {
    resetGame()
  });
}

function saveGame() {
  var game = { state: gameState }
    if (currentGame == 0) {
      $.post('/games', game, function(g) {
        currentGame = g.data.id;
        $('#games').append(`<button id="gameid-${g.data.id}">${g.data.id}</button><br>`);
      $("#gameid-" + g.data.id).on('click', () => reloadGame(g.data.id));
      });
    } else {
      $.ajax({
        type: 'PATCH',
        url: `/games/${currentGame}`,
        data: game
      });
    }
  $('td').text((index, square) => {
    gameState.push(square);
  });
}

function showPreviousGames() {
  $('#games').empty();
  $.get('/games', (savedGames) => {
    if (savedGames.data.length) {
      savedGames.data.forEach( function(game) {
        $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
        $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
      });
    }
  });
}
function resetGame() {
  turn = 0;
  $('td').empty();
  currentGame = 0;
}

function reloadGame(gameId) {
  $('#message').html('');

  const xhr = new XMLHttpRequest;
  xhr.overrideMimeType('application/json');
  xhr.open('GET', `/games/${gameId}`, true);
  xhr.onload = () => {
    const data = JSON.parse(xhr.responseText).data;
    const id = data.id;
    const state = data.attributes.state;

    let index = 0;
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
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