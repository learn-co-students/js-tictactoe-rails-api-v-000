// Code your JavaScript / jQuery solution here

// const winCombos = [
//   [0, 1, 2],
//   [3, 4, 5],
//   [6, 7, 8],
//   [0, 3, 6],
//   [1, 4, 7],
//   [2, 5, 8],
//   [0, 4, 8],
//   [2, 4, 6]
// ]

var turn = 0;
var currentGame = 0;

$(document).ready(function () {
  attachListeners();
});

function attachListeners() {
  // What is `!$.` being called on?
  $('td').on('click', function () {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPreviousGames());
  $('#clear').on('click', () => resetBoard());
}

function player() {
  return (turn % 2 ? "O" : "X");
}

function updateState(td) {
  let token = player();
  $(td).text(token);
}

function setMessage(msg) {
  $('#message').text(msg);
}

function checkWinner() {
  var board = {};
  var winner = false;

  $('td').text((index, square) => board[index] = square);

  const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  winCombos.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      winner = true;
    }
  });
  return winner;
}

function doTurn(tdElement) {
  updateState(tdElement);
  turn ++;
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  }
}

function resetBoard() {
  $('td').text("");
  turn = 0;
  currentGame = 0;
}

function saveGame() {
  let state = [];

  $('td').text((index, square) => {
    state.push(square);
  });
  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: { state: state }
    });
  } else {
    $.post('/games', { state: state }, function(game) {
      currentGame = game.data.id;
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`)
      $(`#gameid-${game.id}`).on('click', () => loadGame(game.data.id));
    });
  };
}

function showPreviousGames() {
  let post = $.get('/games', {}, function (response) {
    response["data"].forEach(function (game) {
      if (!$(`button#gameid-${game.id}`).length){
        $("#games").append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
        $(`#gameid-${game.id}`).on('click', () => loadGame(game.id));
      };
    });
  });
}

function loadGame(gameId) {
  $.get(`/games/${gameId}`, {}, function (resp) {
    let state = resp["data"]["attributes"]["state"];
    window.turn = 9 - (state.filter(el => el === "").length);
    currentGame = parseInt(resp["data"]["id"]);
    let gameCells = $('td');

    for (let i = 0; i < 9; i++) {
      gameCells[i].innerHTML = state[i];
    }

    if (!checkWinner() && turn === 9) {
      setMessage('Tie game.');
    }
  });
}
