var turn = 0;
var currentGame = 0;

$(document).ready(() => attachListeners());

function player() {
  (turn % 2 === 0) ? "X" : "O"
}

function updateState(square) {
  var token = player();
  $(square).text(token);
}

function setMessage(message) {
  $("div#message").text(message)
}

function checkWinner() {
  const WIN_COMBOS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  var winner = false;
  const squares = document.querySelectorAll('td');
  var board = Array.from(squares).map(s => s.innerHTML);
  WIN_COMBOS.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });
  return winner;
}

function doTurn(square) {
  updateState(square);
  turn += 1;
  if (checkWinner()) {
    turn = 0;
    saveGame();
    $('td').empty();
  } else if (turn === 9) {
    setMessage("Tie game.");
    turn = 0;
    saveGame();
    $('td').empty();
  }
}

function attachListeners() {
  $('td').click(function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#clear').click(function() {
    turn = 0;
    $('td').empty();
    $('#message').empty();
    currentGame = 0;
  });
  $('#save').click(() => saveGame());
  $('#previous').click(() => previousGame());
}

function previousGame() {
  $('#games').empty();
  $.get('/games', (savedGames) => {
    if (savedGames.data.length) {
      savedGames.data.forEach(buttonizePreviousGame);
    }
  });
}

function buttonizePreviousGame(game) {
  $('#games').append(`<button id="${game.id}">${game.id}</button><br>`);
  $(`#${game.id}`).click(() => reloadGame(game.id));
}

function saveGame() {
  const squares = document.querySelectorAll('td');
  var board = Array.from(squares).map(s => s.innerHTML);
  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: { state: board }
    });
  } else {
    $.post('/games', { state: board }, function(game) {
      currentGame = game.data.id;
      $('#games').append(`<button id="${game.data.id}">${game.data.id}</button><br>`);
      $(`#${game.data.id}`).click(() => reloadGame(game.data.id));
    });
  }
}

function reloadGame(id) {
  document.getElementById('message').innerHTML = '';
  const xhr = new XMLHttpRequest;
  xhr.overrideMimeType('application/json');
  xhr.open('GET', `/games/${id}`, true);
  xhr.onload = () => {
    const data = JSON.parse(xhr.responseText).data;
    const state = data.attributes.state;

    let index = 0;
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
        index++;
      }
    }

    turn = state.join('').length;
    currentGame = data.id;

    if (!checkWinner() && turn === 9) {
      setMessage('Tie game.');
    }
  };

  xhr.send(null);
}
