var turn = 0;
let gameId = 0;
const winCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// player token X or O
function player() {
  return turn % 2 === 0 ? "X" : "O";
}

// update square on game board
function updateState(square) {
  if ($(square).text() === "") {
    return $(square).text(player());
  }
}

// add winner message 'Player X Won!' or 'Player O Won!'
function setMessage(something) {
  return $("div#message").append(something + "<br>");
}

// use winCombinations to check for winners
function checkWinner() {
  let winner = false;
  let board = [];
  $("td").text((index, square) => (board[index] = square));

  winCombinations.map(winCombo => {
    let [spot0, spot1, spot2] = winCombo;
    if (
      (board[spot0] === "X" && board[spot1] === "X" && board[spot2] === "X") ||
      (board[spot0] === "O" && board[spot1] === "O" && board[spot2] === "O")
    ) {
      var message = `Player ${board[spot0]} Won!`;
      setMessage(message);
      return (winner = true);
    }
  });
  return winner;
}

// game turn
function doTurn(square) {
  updateState(square);
  turn++;

  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  }
}

function resetBoard() {
  turn = 0;
  $("td").empty();
}

function saveGame() {
  let state = Array.from($("td"), e => e.innerText);
  if (gameId) {
    $.ajax({
      type: "PATCH",
      url: `/games/${gameId}`,
      dataType: "json",
      data: { state: state }
    });
  } else {
    $.post(`/games`, { state: state }, function(game) {
      gameId = parseInt(game.data.id);
    });
  }
}
function loadGame(gameid) {
  $.get(`/games/${gameid}`, function(game) {
    let state = game.data.attributes.state;
    $("td").text((index, token) => state[index]);
    gameId = gameid;
    turn = state.join("").length;
    checkWinner();
  });
}

function previousGames() {
  $("div#games").empty();
  $.get("/games", function(games) {
    if (games.data.length) {
      games.data.map(function(game) {
        $("div#games").append(
          `<button id="gameid-${game.id}">Retrieve Game: #${
            game.id
          }</button><br>`
        );
        $("#gameid-" + game.id).on("click", () => loadGame(game.id));
      });
    }
  });
}

function attachListeners() {
  $("td").on("click", function() {
    if (!checkWinner() && !$.text(this)) {
      doTurn(this);
    }
  });
  $("#save").on("click", () => saveGame());
  $("#previous").on("click", () => previousGames());
  $("#clear").on("click", () => {
    resetBoard();
    gameId = 0;
    setMessage("");
  });
}
$(document).ready(() => {
  attachListeners();
});
