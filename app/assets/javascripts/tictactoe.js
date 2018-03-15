// Code your JavaScript / jQuery solution here
var turn = 0;
var currentGame = undefined;
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2],
  ];

$(function () {
  attachListeners();
});

function player() {
  return (turn % 2 === 0) ? 'X' : 'O';
}

function updateState(square) {
  const token = player();

  $(square).text(token);
}

function setMessage(str) {
  $('#message').html(str);
}

function checkWinner() {
  const winCombo = findWinngCombo();

  const board = $('td').map(function () { return this.innerHTML; });

  if (winCombo) {
    const msg = `Player ${board[winCombo[0]]} Won!`;
    setMessage(msg);
  }

  return winCombo ? true : false;
}

function findWinngCombo() {
  const board = $('td').map(function () { return this.innerHTML; });

  for (var i = 0; i < winCombos.length; i++) {
    pos1 = board[winCombos[i][0]];
    pos2 = board[winCombos[i][1]];
    pos3 = board[winCombos[i][2]];

    if (pos1 == 'X' && pos2 == 'X' && pos3 == 'X' ||
      pos1 == 'O' && pos2 == 'O' && pos3 == 'O') {
      return winCombos[i];
    } else {
      false;
    }
  }
}

function doTurn(square) {
  updateState(square);
  turn++;

  if (checkWinner()) {
    saveGame();
    resetGame();
  } else if (turn === 9) {
    setMessage('Tie game.');
    saveGame();
    resetGame();
  }
}

function resetGame() {
  $('td').each(function () { $(this).text(''); });

  turn = 0;
}

function attachListeners() {
  $('td').on('click', function () {
    if ($(this).text() === '' && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#previous').on('click', () => gameIndex());
  $('#save').on('click', () => saveGame());
  $('#clear').on('click', () => clearGame());
}

function gameIndex() {
  $('#games').empty();

  $.get('/games', function (games) {
    if (games.data.length > 0) {
      games.data.forEach(function (game) {
        $('#games').append('<button id = gameId-' + game.id + '>' +
          'Game: ' + game.id + '</button>' + ' ' + ' Updated at: ' +
          moment(game.attributes['updated-at']).format('MM/DD/YYYY h:mm a') +
          '<br /><br />');

        $('#gameId-' + game.id).on('click', () => displaySavedGame(game));
      });
    }
  });
}

function saveGame() {
  const $board = $('td').map(function () { return $(this).text(); }).get();

  const gameData = { state: $board };
  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData,
    });
  } else {
    const posting = $.post('/games', gameData);
    posting.done(function (game) {
      currentGame = game.data.id;
    });
  }
}

function clearGame() {
  resetGame();
  currentGame = undefined;
}

function displaySavedGame(game) {
  $.get('/games/' + game.id, function (game) {
    const board = game.data.attributes.state;
    $('td').each(function (index) { $(this).text(board[index]); });

    turn = board.filter((e) => e !== '').length;
    currentGame = game.data.id;
  });
}
