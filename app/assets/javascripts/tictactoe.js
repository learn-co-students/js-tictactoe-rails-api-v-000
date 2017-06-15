var turn = 0;
var winCombos = [
  [[0, 0],[1, 0],[2, 0]], // Top row
  [[0, 1],[1, 1],[2, 1]], // Middle row
  [[0, 2],[1, 2],[2, 2]], // Bottom row
  [[0, 0],[0, 1],[0, 2]], // Left column
  [[1, 0],[1, 1],[1, 2]], // Middle column
  [[2, 0],[2, 1],[2, 2]], // Right column
  [[0, 0],[1, 1],[2, 2]], // \
  [[2, 0],[1, 1],[0, 2]]  // /
];
var currentGame = 0;

function attachListeners() {
  $('td').click(function(event) {
    currentToken = $(this).text()
    if (currentToken !== 'X' && currentToken !== 'O') {
      doTurn(event);
    }
  });

  $('#previous').click(function() {
    $.get('/games', function(data) {
      $('#games').empty();
      $.each(data.games, function(i, game) {
        $('#games').append($('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id}))
      });
    });
  });

  $('#save').click(function() {
    saveBoard();
  });

  $('#games').click(function(event) {
    turn = 0;
    var state = $(event.target).data('state').split(',');
    $('td').each(function(i, tableCell) {
      $(tableCell).text(state[i])
      if (state[i] === "X" || state[i] === "O") {
        turn++;
      }
    });
    currentGame = $(event.target).data('gameid');
  });
}

function getState() {
  var state = [];
  $('td').each(function(i, tableCell) {
    state.push($(tableCell).text())
  });
  return {
    game: {
      state: state
    }
  }
}

function saveBoard() {
  if (currentGame) {
    var url = `/games/${currentGame}`
    var method = 'PATCH'
  } else {
    var url = '/games'
    var method = 'POST'
  }
  $.ajax({
    method: method,
    url: url,
    data: getState(),
    success: function(result) {
      if ($('#message').text() === '') {
        currentGame = result.game.id;
      }
    },
    dataType: 'json'
  });
}

function doTurn(event) {
  position = $(event.target);
  updateState(position);
  checkWinner();
  checkTie();
  turn++;
}

function checkWinner() {
  $.each(winCombos, function(index, combo) {
    first = $(`[data-x="${combo[0][0]}"][data-y="${combo[0][1]}"]`).text();
    second = $(`[data-x="${combo[1][0]}"][data-y="${combo[1][1]}"]`).text();
    third = $(`[data-x="${combo[2][0]}"][data-y="${combo[2][1]}"]`).text();
    if ((first === 'O' || first === 'X') && (first === second && second == third)) {
      message(`Player ${first} Won!`)
      resetBoard();
      return;
    }
  })
  return false;
}

function checkTie() {
  if (turn === 8 && $('#message').text() === "") {
    message('Tie game');
    resetBoard();
  }
}

function resetBoard() {
  saveBoard();
  turn = -1;
  $('td').text('');
  currentGame = 0;
}

function updateState(position) {
  position.text(player());
}

function player() {
  if (turn % 2 == 0) {
    return 'X';
  } else {
    return 'O';
  }
}

function message(string) {
  $("#message").text(string)
}

$(function() {
  attachListeners();
});
