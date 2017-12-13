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
  turn++;

  updateState(square);

  if (checkWinner()) {
    resetGame();
  } else if (turn === 9) {
    setMessage('Tie game.');
    resetGame();
  }
}

function resetGame() {
  $('td').each(function () {
    $(this).text('');
  });

  turn = 0;
}

function attachListeners() {
  $('td').on('click', function () {
    if ($(this).text() === '' && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#previous').on('click', function () {
    clickedPrevious();
  });

  $('#save').on('click', function () {
    clickedSave();
  });

  $('#clear').on('click', function () {
    clickedClear();
  });
}

function clickedPrevious() {
  $.get('/games', function (games) {
    if (games['data'].length > 0 ) {
      gameList = '';

      games.data.forEach(function (game) {
        gameList += '<button id=data-id="' + game.id + '">' +
          game.attributes.state + '</button>';
      $('#games').html(gameList);
    }
  });
}

function clickedSave() {
  const $board = $('td').map(function (el) { return el.textContent; });

  const gameData = { state: $board };
  // debugger
  // if (currentGame) {
  //   $.ajax({
  //     type: 'PATCH',
  //     url: `/games/${currentGame}`,
  //     data: gameData,
  //   });
  // } else {
  debugger
  $.post('/games', gameData, function (game) {
    console.log(game)
    currentGame = game.data.id;
  });
  // $.ajax({
  //   type: 'POST',
  //   url: '/games',
  //   data: gameData,
  // }).done(function (r) {
  //   console.log(r);
  // });
  // }
}

function clickedClear() {
  // debugger;
  // alert('clear was clicked');
}
