var turn = 0;
var currentGame = 0;

$().ready(function() {
  attachListeners();
});

function attachListeners() {
  $('td').on('click', (e) => doTurn(e));
  $('#previous').on('click', (e) => getAllGames(e));
  $('#save').on('click', (e) => saveCurrentGame(e));
};

function doTurn(event) {
  updateState(event);

  if (turn === 0) {
    currentGame = 0;
  }

  if (!checkWinner()) {
    turn += 1;
  }
}

function checkWinner() {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
  ]

  const winners = winningCombos.map(function(e) {
    const combo = [this[e[0]], this[e[1]], this[e[2]]].join("");

    if (combo === "XXX" || combo === "OOO") {
      return true;
    } else {
      return false;
    }
  }, board());

  return isDone(winners);
}

function isDone(winners) {
  if (winners.some((e) => e === true)) {
    message(`Player ${player()} Won!`);
    saveCurrentGame();
    reset();
    return true;
  } else if (board().every((e) => e === "X" || e === "O")) {
    message("Tie game");
    saveCurrentGame();
    reset();
    return true;
  } else {
    return false;
  }
}

function board() {
  return $('td').map(function() {
    return $(this).text();
  }).get();
}

function reset() {
  $('td').text("");
  window.turn = 0;
}

function updateState(event) {
  event.target.innerHTML = player();
}

function player() {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function message(message) {
  $("#message").text(message);
}

function getAllGames(event) {
  $.get("/games", function(data) {
    if (data.games.length > 0) {
      let result = data.games.map((e) => {
        return `<div>${e.id}</div>`;
      }).join("");
      $('#games').html(result);
    }
  });
}

function saveCurrentGame(event) {
  let boardArray = board();

  if (currentGame === 0) {
    $.post("/games", { game: { state: boardArray } } ).done(function(data) {
      currentGame = data.game.id;
    });
  } else {
    $.ajax({
      type: "PATCH",
      url:  `/games/${currentGame}`,
      data: { id: currentGame, game: { state: boardArray } },
      success: function(data) {
        currentGame = data.game.id;
      }
    });
  }
}

