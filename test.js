var turn = 0;
var currentGame = 0;

const WIN_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

$(function() {
  attachListeners();
});

function attachListeners() {
  $("td").click(function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPreviousGames());
  $('#clear').on('click', () => resetBoard());
}

function saveGame() {
  var state = [];

  $('td').text(function(index, player) {
    state.push(player);
  });

  var data = { state: state };

  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: data
    });
  } else {
    $.post('/games', data, function(game) {
      currentGame = game.data.id;
      $('#games').append(`<button id="game-${game.data.id}">Game #${game.data.id}</button><br>`);
      $(`#game-${game.data.id}`).on('click', () => reloadGame(game.data.id));
    });
  }
};

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
};

function previousGames() {
  $('#games').empty();

  $.get("/games").done(function(games) {
    if (games.data.length) {
      games.data.forEach(function(game) {
        $('#games').append(`<button id="game-${game.id}">Game #${game.id}</button><br>`);
        $("#game-" + game.id).click('click', () => reloadGame(game.id));
      });
    }
  });
};

function player() {
  return turn % 2 === 0 ? "X" : "O";
};

function updateState(td) {
  $(td).text(player());
};

function setMessage(msg) {
  $("div#message").html(msg);
};

function checkWinner() {
  var board = {};
  var winner = false;

  $('td').text(function(index, player) {
    board[index] = player;
  });

  WIN_COMBOS.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });
  return winner;
};

function updateState(td) {
  $(td).text(player());
};

function resetBoard() {
  $("td").empty();
  turn = 0;
  currentGame = 0;
};

function doTurn(td) {
  updateState(td);
  turn++;

  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    resetBoard()
  }
};
