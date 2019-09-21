// Code your JavaScript / jQuery solution here

$(document).ready(function() {
  attachListeners();
});

const WINNING_COMBINATIONS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

var turn = 0;
var currentGame = 0;


function player() {
  if (turn % 2) {
    return 'O';
  } else {
    return 'X';
  }
}

function updateState(position) {
  var token = player();
  $(position).text(token);
}

function setMessage(string) {
  $('#message').text(`${string}`);
}

function checkWinner() {
  var winner = false;
  var board  = {};

  $('td').text((index, position) => board[index] = position);

  WINNING_COMBINATIONS.forEach(function(combination) {
    if (board[combination[0]] === board[combination[1]] &&
        board[combination[1]] === board[combination[2]] &&
        board[combination[0]] !== "") {
          setMessage(`Player ${board[combination[0]]} Won!`);
          return winner = true;
        }
    });

    return winner;
}

function doTurn(position) {
  updateState(position);
  turn++;
  if (checkWinner()) {
    saveGame();
    clearGame();
  } else if (turn === 9) {
    setMessage('Tie game.');
    saveGame();
    clearGame();
  }
}

function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });
  $('#previous').on('click', function() {
    previousGames();
  });
  $('#save').on('click', function() {
    saveGame();
  });
  $("#clear").on("click", function() {
    clearGame();
  });
}

function previousGames() {
  $('#games').empty();
  $.get('/games', games => {
    games.data.forEach(function(game) {
      var id = game['id'];
      var button = '<button id="game-' + id + '">' + id + "</button>";
      $('#games').append(button);
      $(`#game-${id}`).on('click', function() {
        getGame(id);
      });
    });
  });
}

function saveGame() {
  var state = [];

  $('td').text((index, position) => {
    state.push(position);
  });

  if (currentGame > 0) {
    $.ajax({
      url: `/games/${currentGame}`,
      method: 'PATCH',
      data: { state: state },
    });
  } else {
    $.post('/games', { state: state }, function(game) {
      currentGame = game.data.id;
    });
  }
}

function getGame(id) {
  $.get(`/games/${id}`, function(game) {
    state = game.data.attributes.state;
    positions = document.querySelectorAll('td');
    currentGame = id;
    turn = state.join('').length;
    var i = 0;
    positions.forEach(function(position) {
      position.innerHTML = state[i];
      i++;
    });
  });
}

function clearGame() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
}
