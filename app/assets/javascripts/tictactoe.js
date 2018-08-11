// Code your JavaScript / jQuery solution here

var turn = 0;
var board = [];
var previousGame = false;
let currentGameId = 0;

var WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

$(function() {
  attachListeners();
});

function player() {
  return turn % 2 ? "O" : "X";
}

function updateState(clicked) {
  return $(clicked).text(player());
}

function setMessage(string) {
  $("#message").text(string);
}

function checkWinner() {
  var winner = false;
  getBoard();

  WINNING_COMBOS.forEach(function(combo) {
    let player;
    let startingSpot = combo[0];
    if (board[startingSpot] !== "") {
      player = board[startingSpot];
      if (player === board[combo[1]] && player === board[combo[2]]) {
        setMessage(`Player ${player} Won!`);
        saveGame();
        return (winner = true);
      }
    }
  });
  return winner;
}

function doTurn(clicked) {
  updateState(clicked);
  getBoard();
  turn += 1;
  if (checkWinner()) {
    checkWinner();
    updateGame();
    newGame();
  } else if (turn === 9 && !checkWinner()) {
    saveGame();
    setMessage("Tie game.");
    newGame();
  }
}

function attachListeners() {
  // need to set currentGameId here for it to
  $("td").click(function() {
    if ($(this).text() === "" && !checkWinner()) {
      doTurn(this);
    }
  });
  $("button#clear").click(function() {
    newGame();
  });
  $("button#save").click(function() {
    if (previousGame !== true) {
      saveGame();
    } else {
      updateGame();
    }
  });
  $("button#previous").click(function() {
    previousGames();
  });
}

function getBoard() {
  $("td").text(function(index, square) {
    board[index] = square;
  });
  return board;
}

function newGame() {
  turn = 0;
  $("td").text("");
  currentGameId = 0;
  previousGame = false;
}

function saveGame() {
  let gameData = {};
  $("td").map(function() {
    let board = $(this).text();
    return board;
  });

  gameData = { state: board };
  var posting = $.post("/games", gameData);
  posting.done(function(data) {
    $("#games").append(
      `<button class="game" id="game-${data.data.id}">${
        data.data.id
      }</button><br>`
    );
    currentGameId = parseInt(data.data.id);
  });
  previousGame = true;
}

function updateGame() {
  let gameData = {};
  $("td").map(function() {
    let board = $(this).text();
    return board;
  });

  gameData = { state: board };
  $.ajax({
    url: `/games/${currentGameId}`,
    data: gameData,
    type: "patch"
  });
}

function oldUpdateGame() {
  let gameData = {};
  $("td").map(function() {
    let board = $(this).text();
    return board;
  });

  gameData = { state: board };
  var patching = $.post(`/games/${currentGameId}`, gameData);
  patching.done(function(data) {
    $("#games").append(
      `<button class="game" id="game-${data.data.id}">${
        data.data.id
      }</button><br>`
    );
  });
}

function previousGames() {
  $("#games").html("");
  $.get("/games", function(game) {
    game.data.forEach(function(game) {
      $("#games").append(
        `<button class="game" id="game-${game.id}">${game.id}</button><br>`
      );
    });
    $(".game").click(function() {
      loadGame(this);
    });
  });
}

function loadGame(clicked) {
  const gameId = $(clicked).text();
  $.get(`/games/${gameId}`, function(game) {
    $("td").each(function(index, cell) {
      $(cell).text(game.data.attributes.state[index]);
    });
  });
  currentGameId = parseInt(gameId);
  previousGame = true;
}
