// Code your JavaScript / jQuery solution here
// var WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

var turn = 0;
var currentGame = 0;

$(document).ready(function() {
  attachListeners();
});

function player() {
  if (turn % 2 === 0) {
    return 'X'
  } else {
    return 'O'
  }
}

function updateState(square) {
  var playerToken = player()
  $(square).text(playerToken)
}

function setMessage(message) {
  $('#message').text(message)
}

 function checkWinner() {
  var board = {};
  const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
  var winner = false;

   $('td').text((index, square) => board[index] = square);

   WINNING_COMBOS.some(function(position) {
    if (board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && board[position[0]] !== "") {
      setMessage(`Player ${board[position[0]]} Won!`);

      return winner = true;
    }
  });
  return winner;
}

function doTurn(square) {
  updateState(square);
  turn += 1;
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    setMessage("Tie game.")
    saveGame();
    resetBoard();
  }
}

function resetBoard() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
}

function saveGame() {
  var state = [];
  var data = { state: state };
   $('td').text((index, square) => {
    state.push(square);
  });

   if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: data
    });
  } else {
    $.post('/games', data, function(game) {
      currentGame = game.data.id;
      $('#games').append(`<button id="gameid-${currentGame}">${currentGame}</button><br>`);
      $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
    });
  }
}

function attachListeners() {
  $('td').click(function() {
    // checks if square is not taken and game is not won or tied.
    if (!$.text(this) && !checkWinner())
    doTurn(this)
  })
   $('#save').click(function() {
    saveGame()
  })
   $('#previous').click(function() {
    showPreviousGames()
  })
   $('#clear').click(function() {
    resetBoard()
  })
}
// Clicking the button#previous element sends a GET request to the "/games
function showPreviousGames() {
  $('#games').empty();
  $.get('/games', (savedGames) => {
    if (savedGames.data.length) {
      savedGames.data.forEach(listPreviousGame);
    }
  });
}
 function listPreviousGame(game) {
  $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
  $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
}

function reloadGame(gameID) {
  document.getElementById('message').innerHTML = '';
   const xhr = new XMLHttpRequest;
  xhr.overrideMimeType('application/json');
  xhr.open('GET', `/games/${gameID}`, true);
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