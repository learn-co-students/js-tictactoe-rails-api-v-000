$(document).ready(() => {
  attachListeners();
});

const WIN_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

var turn = 0;
let currentGame = 0;

function player() {
  return turn % 2 === 0 ? "X" : "O";
}

function attachListeners() {
  square = document.querySelector("td");
  $("td").click(function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $("#save").click(() => {
    saveGame();
  });

  $("#previous").click(() => {
    previousGames();
  });

  $("#clear").click(() => {
    resetBoard();
  });
}

function doTurn(square) {
  updateState(square);
  turn += 1;

  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  }
}

function updateState(square) {
  let token = player();
  $(square).text(token);
}

function setMessage(string) {
  $("#message").text(string);
}

function checkWinner() {
  let winner = false;
  let board = {};

  // generate board object
  $("td").text((index, square) => (board[index] = square));

  WIN_COMBINATIONS.forEach(position => {
    if (
      board[position[0]] === board[position[1]] &&
      board[position[1]] === board[position[2]] &&
      board[position[0]] !== ""
    ) {
      setMessage(`Player ${board[position[0]]} Won!`);
      return (winner = true);
    }
  });

  return winner;
}

function resetBoard() {
  $("td").empty();
  turn = 0;
  currentGame = 0;
}

function previousGames() {
  $("#games").text("");
  $("#message").text("");
  $.get("/games", gamesAll => {
    gamesAll.data.forEach(game => {
      $("#games").append(
        `<button id="gameid-${game.id}">${game.id}</button><br>`
      );
      $(`#gameid-${game.id}`).on("click", () => loadGame(game.id));
    });
  });
}

function loadGame(gameId) {
  $("#message").text("");
  $.get(`/games/${gameId}`).done(response => {
    currentGame = response.data.id;
    let state = response.data.attributes.state;
    turn = state.join("").length;
    let i = 0;
    state.forEach(e => {
      $("td")[i].innerHTML = e;
      i++;
    });
  });
}

function currentBoard() {
  let state = [];
  // generate board object
  $("td").text((index, square) => {
    state.push(square);
  });
  return state;
}

function saveGame() {
  let gameData = { state: currentBoard() };
  if (currentGame === 0) {
    $.post("/games", gameData, game => {
      currentGame = game.data.id;
    });
  } else {
    $.ajax({
      type: "PATCH",
      url: `/games/${currentGame}`,
      data: "gameData"
    });
  }
}
