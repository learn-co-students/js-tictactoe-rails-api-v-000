// Code your JavaScript / jQuery solution here
var winCombination = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0;
var currentGame = 0;

$(document).ready(function() {
  attachListeners();
});

function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });
  $('#previous').on('click', function() {
    previousGames();
  })
  $('#save').on('click', function() {
    saveGame();
  })
  $('#clear').on('click', function() {
    clearGame();
  })
}

function player() {
  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}

function doTurn(square) {
  updateState(square);
  turn++;
  if (checkWinner()) {
    $('td').empty();
    turn = 0;
  } else if (turn === 9) {
    turn = 0;
    $('td').empty();
    saveGame();
    setMessage("Tie game.")
  }
}
function updateState(square) {
  $(square).text(player());
}

function setMessage(string) {
  $("#message").text(string);
}

function checkWinner() {
  var board = {};
  var winner = false;

  $('td').map(function(index, square) {
    board[index] = square.innerHTML;
  })

  for (combo of winCombination) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`)
      saveGame();
      return winner = true;

    }
  }
  return winner;
}

function emptyCheck(array) {
  return array.some(function(el) {
    return el !== undefined;
  })
}

function turnChecker(array) {
  array.forEach((el) => {
    if (el !== "") {
      ++turn;
    }
  })
  return turn;
}

function loadGame(id) {
  $.ajax({
    type: 'GET',
    url: `/games/${id}`,
    dataType: "json",
    success: function(game) {
      currentGame = game.data.id
      var state = game.data.attributes.state
      turnChecker(state);

      if (emptyCheck(state)) {
        for (let i = 0; i < $('td').length; i++) {
          $('td')[i].innerHTML = state[i];
        }
      }
    }
  })
}
function previousGames() {
  $('#games').empty();
  $.get('/games', function(games) {
    games.data.forEach(function(game) {
      $('#games').append(`<button id="game-data-${game.id}">Game ${game.id}</button><br>`)
      $('#game-data-' + game.id).on('click', () => loadGame(game.id));
    })
  })
}


function saveGame() {
  var state = [];

  $('td').text((index, square) => {
    state.push(square);
  });

  var data = { state: state }

  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: data
    });
  } else {
    $.post('/games', data, function(game) {
      currentGame = game.data.id;
    });
  }
}

function clearGame() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
}