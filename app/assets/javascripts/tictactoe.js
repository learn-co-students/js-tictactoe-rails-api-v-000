$(document).ready(function() {
  attachListeners();
});

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
var games = {};
var turn = 0;
var currentGame = 0;

function attachListeners() {
  $("#save").on("click", saveGame);
  $("#previous").on("click", showPreviousGames);
  $("#clear").on("click", resetBoard);
  $("td").on("click", function() {
    if (!checkWinner() && !$.text(this)) {
      doTurn(this);
    }
  });
}

function player() {
  return turn % 2 === 0 ? "X" : "O";
}

function updateState(square) {
  $(square).text(player());
}

function setMessage(string) {
  $("#message").html(string);
}

function doTurn(square) {
  $("#message").text("");
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

function checkWinner() {
  let winner = false;
  let board = {};
  $("td").text((index, square) => (board[index] = square));
  winningCombinations.some(function(winningCombination) {
    if (
      board[winningCombination[0]] !== "" &&
      board[winningCombination[0]] === board[winningCombination[1]] &&
      board[winningCombination[1]] === board[winningCombination[2]]
    ) {
      setMessage(`Player ${board[winningCombination[0]]} Won!`);
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

function getState() {
  let state = [];
  $("td").text((index, square) => {
    state.push(square);
  });
  return state;
}

function saveGame() {
  let gameData;
  gameData = {
    state: getState()
  };
  if (currentGame) {
    $.ajax({
      type: "PATCH",
      url: `/games/${currentGame}`,
      data: gameData
    });
  } else {
    $.post("/games", gameData, function(game) {
      currentGame = game.data.id;
      $("#games").append(
        `<button id="gameid-${game.data.id}>${game.data.id}</button><br>`
      );
      $("#gameid-" + game.data.id).on("click", () => reloadGame(game.data.id));
    });
  }
}

function showPreviousGames() {
  $("#games").empty();
  $.get("/games", savedGames => {
    if (savedGames.data.length) {
      savedGames.data.forEach(appendButtons);
    }
  });
}

function appendButtons(game) {
  $("#games").append(
    `<button id="gameid-${game.id}">${game.id} - ${fixDate(
      game.attributes["updated-at"]
    )}</button><br>`
  );
  $(`#gameid-${game.id}`).on("click", () => reloadGame(game.id));
}

function fixDate(date) {
  //2019-02-09T05:33:43.206Z
  let d = new Date(date);
  console.log("d=", d);
  var year = d.getFullYear();
  var month = addLeadingZero(d.getMonth());
  var day = addLeadingZero(d.getDay());
  var hours = d.getHours();
  var minutes = d.getMinutes();
  var seconds = d.getSeconds();
  var newDate =
    year +
    "-" +
    (parseInt(month, 10)+1) +
    "-" +
    day +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds;
  console.log("newDate=", newDate);
  return newDate;
}

function addLeadingZero(n) {
  return n < 10 ? "0" + n : "" + n;
}

function reloadGame(gameID) {
  $("#message").html("");
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `/games/${gameID}`, true);
  xhr.onload = () => {
    const data = JSON.parse(xhr.responseText).data;
    const id = data.id;
    const state = data.attributes.state;

    let index = 0;
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        $(`[data-x="${x}"][data-y="${y}"]`).html(state[index]);
        index++;
      }
    }

    turn = state.join("").length;
    currentGame = id;

    if (!checkWinner() && turn === 9) {
      setMessage("Tie game.");
    }
  };

  xhr.send(null);
}
