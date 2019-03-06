// Code your JavaScript / jQuery solution here
const WIN_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
    ]

var turn = 0;
var currentGame = 0;

$(document).ready(function() {
  attachListeners();
});

function player() {
  if (turn == 0 || turn % 2 == 0) {
    return "X";
  } else {
    return "O";
  }}

function updateState(square) {
  square.innerHTML = player();
}

function setMessage(message) {
  $('#message').html(message);
}

function checkWinner() {
  let grid = $('td').toArray();
  let win = false;

  WIN_COMBINATIONS.some(function(array) {
    if (grid[array[0]].innerHTML != "" && grid[array[0]].innerHTML == grid[array[1]].innerHTML && grid[array[0]].innerHTML == grid[array[2]].innerHTML) {
      setMessage(`Player ${grid[array[0]].innerHTML} Won!`);
      return win = true;
    }
  });

  return win;
}

function doTurn(square) {
  updateState(square)
  turn += 1;
  if (checkWinner()) {
    saveGame();
    resetGame();
  } else if (turn == 9) {
    saveGame();
    setMessage("Tie game.");
    resetGame();
  }
}

function attachListeners() {
  $('td').on('click', function() {
    if (this.innerHTML == "" && !checkWinner()) {
      doTurn(this);
    }
  });
  $('#save').on('click', function() {
    saveGame();
  });
  $('#clear').on('click', function() {
    resetGame();
  });
  $('#previous').on('click', function() {
    previousGames();
  });
}

function saveGame() {
  let squares = $('td');
  let data =  $.map( squares, function(square) {
      return square.innerHTML;
  });
  let state = { state: data };
  if (currentGame) {
    $.ajax({
      type: "PATCH",
      url: `/games/${currentGame}`,
      data: state
    });
  } else {
  $.ajax({
    type: "POST",
    url: "/games",
    data: state,
    success: function(resp) {
      currentGame = resp.data.id;
    }
  })
}
}

function resetGame() {
  currentGame = 0;
  $('td').html("");
  turn = 0;
}

function previousGames() {
  $('#games').empty();
  $.ajax({
    url: "/games",
    success: function(games) {
      console.log(games.data);
      games.data.forEach(function(game) {
        $('#games').append(`<button id="gameid-${game.id}">Game ${game.id}</button>`);
        $(`#gameid-${game.id}`).on('click', function() {
          $.ajax({
            url: `/games/${game.id}`,
            success: loadGame(game)
          });
        });
      });
    }
  });
}

function loadGame(game) {
  turn = 0;
  $('td').each( function(i, obj) {
    obj.innerHTML = game.attributes.state[i];
    if (game.attributes.state[i] != "") {
      turn ++;
    }
  });
  currentGame = game.id;
}
