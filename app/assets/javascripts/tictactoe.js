// Code your JavaScript / jQuery solution here

var turn = 0;
var gameId = 0;

$(document).ready(function() {
  attachListeners();
});

function player() {
  return turn % 2 ? "O" : "X";
}

function doTurn(move) {
  updateState(move);
  turn++;
  if (checkWinner()) {
    saveGame();
    resetGame();
  } else if (turn === 9) {
    console.log(gameId);
    setMessage("Tie game.");
    saveGame();
    resetGame();
  }
}

function resetGame() {
  $("td").empty();
  turn = 0;
  gameId = 0;
}

function attachListeners() {
  $("td").on("click", function() {
    if (!checkWinner() && !$.text(this)) {
      doTurn(this);
    }
  });

  $("#save").on("click", () => saveGame());
  $("#previous").on("click", () => previousGames()); //!!previous loads the menu of previous games
  $("#clear").on("click", () => resetGame());
}

function checkWinner() {
  const WINNING_COMBOS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  var board = {};
  var winner = false;

  $("td").text((index, move) => (board[index] = move));

  WINNING_COMBOS.some(function(combo) {
    if (
      board[combo[0]] !== "" &&
      board[combo[0]] === board[combo[1]] &&
      board[combo[1]] === board[combo[2]]
    ) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return (winner = true);
    }
  });

  return winner;
}

function updateState(move) {
  var token = player();
  $(move).text(token);
}

function setMessage(msg) {
  $("#message").text(msg);
}

function saveGame() {
  var state = [];
  $("td").each(function() {
    state.push(this.textContent);
  });
  if (gameId > 0) {
    $.ajax({
      method: "PATCH",
      url: `/games/${gameId}`
    });
  } else {
    var gameObject = $.post("/games", { state: state });
    gameObject.done(function(response) {
      gameId = response["data"]["id"];
    });
  }
}

function previousGames() {
  $("#games").empty();
  $.get("/games").done(function(response) {
    // let games = [];
    // debugger;
    games = response.data;
    if (games.length > 0) {
      games.forEach(function(game) {
        if (game.id > $(games.length).text()) {
          $("#games").append(
            `<button onclick="restoreGame.call(this);"
            data-id="${game.id}">${game.id}</button>`
          );
        }
      });
    }
  });
}

function restoreGame() {
  let oldGame = this.textContent;
  debugger;

  $.get(`/games/${oldGame}`, function(response) {
    let restoredState = response.data.attributes.state;
    let currentState = document.querySelectorAll("td");
    for (let i = 0; i < 9; i++) {
      currentState[i].innerHTML = restoredState[i];
      if (restoredState[i] !== "") {
        turn++;
      }
    }
    gameId = response.data.id;
  });
}
