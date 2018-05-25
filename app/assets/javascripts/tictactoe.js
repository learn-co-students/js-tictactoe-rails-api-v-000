// Code your JavaScript / jQuery solution here
var turn = 0
var currentGame = 0

// Add event listeners when (document).ready
$(document).ready(function() {
  attachListeners();
});

function attachListeners() {
  $("td").on("click", function() {
    if (!checkWinner() && this.innerHTML === "") {
      doTurn(this);
    }
  });
  $("#previous").on("click", function() {
    loadGames();
  });
  $("#save").on("click", function() {
    saveGame();
  });
  $("#clear").on("click", function() {
    clearGame();
  });
}

// Return token of current player
function player() {
  return (turn % 2 === 0) ? "X" : "O"
}

// Add token to passed in td element
function updateState(td) {
    $(td).text(player());
}

function setMessage(string) {
  $("#message").text(string);
}

// Check if game as been won (ie winning_combo exists)
function checkWinner() {
  const winning_combos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
  board = {};
  $('td').text((i, token) => board[i] = token);
  for (let combo of winning_combos) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[0]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return true;
    };
  };
  return false;
}

function doTurn(square){
  updateState(square); //pass in element that was clicked
  turn++;
  if (checkWinner() || turn === 9) {
    if (turn === 9) {
      setMessage('Tie game.')
    }
    saveGame();
    clearGame();
  }
}

function clearGame() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
}

function saveGame() {
  var state = [];
  var gameData;

  $('td').text((index, square) => {
    state.push(square);
  });

  gameData = { state: state };

  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    });
  } else {
    $.post('/games', gameData, function(game) {
      currentGame = game.data.id;
    });
  }
}

function loadGames() {
  $.get("/games", function(game_array) {
    if (game_array["data"].length > 0) {
      game_array["data"].forEach(function(game) {
        if ($(`button[id*="gameid-${game.id}"]`).length === 0) {
          $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
          $("#gameid-" + game.id).on('click', () => reloadGame(game.id));
        }
      });
    }
  });
}

function reloadGame(gameId) {
  $.getJSON(`/games/${gameId}`, function(game) {
    const state = game.data.attributes.state
    // Populate board with saved state
    $.map($('td'), function(square, i) {
      square.innerHTML = state[i];
    });
    // Set currentGame and turn
    currentGame = gameId
    turn = state.filter((s) => s !== "").length
  });
}