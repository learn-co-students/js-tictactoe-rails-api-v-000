// Code your JavaScript / jQuery solution here
$(function() {
  attachListeners();
})

var WIN_COMBOS = [
                  [0,1,2],
                  [3,4,5],
                  [6,7,8],
                  [0,3,6],
                  [1,4,7],
                  [2,5,8],
                  [0,4,8],
                  [6,4,2]
                ];

var turn = 0;
var gameId = 0;

function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && checkWinner() !== true) {
      doTurn(this);
    }
  });

  $('#save').click(() => saveGame());
  $('#previous').click(() => previousGame());
  $('#clear').click(() => clearGame());
}

function player() {
  return turn % 2 === 0 ? "X" : "O";
}

function updateState(td) {
  $(td).text(player());
}

function setMessage(message) {
  $('div#message').text(message);
}

function checkWinner() {
  var board = {};
  var winner = false;

  $('td').text(function(index, square) {
    board[index] = square
  });

  WIN_COMBOS.forEach(function(combo) {
    if (
      board[combo[0]] == board[combo[1]] && board[combo[1]] == board[combo[2]] && board[combo[1]] !== ""
    ) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      winner = true;
    }
  })
  return winner;
}

function doTurn(td) {
  updateState(td);
  turn++;
  if (checkWinner()) {
    saveGame();
    clearGame();
  } else if (turn == 9) {
    setMessage("Tie game.");
    saveGame();
    clearGame();
  }
}

function clearGame() {
  $('td').empty();
  turn = 0;
  gameId = 0;
}

function saveGame() {
  var state = [];

  $('td').text((index, square) => {
    state.push(square);
  })

  var gameData = {state: state};

  if (gameId === 0) {
    $.post('/games', gameData, function(game) {
      gameId = game.data.id;
      $('#games').append(`<p>${gameId}</p>`);
    })
  } else {
    $.ajax({
      type: 'PATCH',
      url: `/games/${gameId}`,
      data: gameData
    })
  }
}

function previousGame() {
  $('#games').empty();
  $.get('/games', function(games) {
    if (games.data.length > 0) {
      games.data.forEach(function(game) {
        $('#games').append(`<button id="gameid-${game.id}">${game.id}</button>`);
        $(`#gameid-${game.id}`).click(() => findGame(game.id));
      });
    }
  });
}

function findGame(id) {
  $('#message').text = '';
  $.get(`/games/${id}`, function(response) {
    gameId = response.data.id;
    let board = response.data.attributes.state;
    turn = board.join('').length;
    i = 0;
    board.forEach((e) => {$('td')[i].innerHTML = e, i++})
  });
}
