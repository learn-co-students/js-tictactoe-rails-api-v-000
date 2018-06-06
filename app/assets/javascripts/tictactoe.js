// Code your JavaScript / jQuery solution here
const winningCombos = [["0","1","2"],["3","4","5"],["6","7","8"],["0","3","6"],["1","4","7"],["2","5","8"],["0","4","8"],["2","4","6"]];
const memo = {};
let currentGameId = null;
const spaces = $("td");
window.turn = 0;

$(function () {
  attachListeners();
});

function attachListeners() {
  spaces.on("click", function() {
    if (this.innerHTML === "" && !checkWinner()) {
      doTurn(this);
    }
  });
  $("#save").on("click",saveGame);
  $("#previous").on("click", previousGames);
  $("#clear").on("click", function () {
    clearBoard();
    currentGameId = null;
  });
}

function saveGame() {
  if (currentGameId === null) {
    $.post("/games", {"state": getBoardState()}).done((savedGame) => {
      memo[savedGame.data.id] = savedGame.data.attributes.state;
      currentGameId = savedGame.data.id;
    });
  } else {
    $.ajax(`/games/${currentGameId}`, {method: "PATCH", data: {"state": getBoardState()}}).done((savedGame) => {
      memo[savedGame.data.id] = savedGame.data.attributes.state;
    });
  }
  clearBoard();
}

function previousGames() {
  const gamesDiv = $("#games");
  gamesDiv.html("");
  $.get("/games").done((gamesList) => {
    for (const game of gamesList.data) {
      const gameButton = $("<button></button>").html(`Game ${game.id}`).attr("data-id", game.id).on("click", function () {
        loadPreviousGame(this.dataset.id);
      });
      gamesDiv.append(gameButton);
    }
  });
}

function loadPreviousGame(gameId) {
  $.get(`/games/${gameId}`).done((game) => {
    clearBoard();
    loadBoardState(game.data.attributes.state);
    currentGameId = game.data.id;
  });
}

function clearBoard() {
  spaces.html("");
  window.turn = 0;
}

function loadBoardState(state) {
  let counter = 0;
  window.turn = 0;
  for (const space of spaces) {
    space.innerHTML = state[counter];
    if (state[counter] !== "") {
      window.turn++;
    }
    counter++;
  }
}

function player() {
  if (window.turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}

function updateState(space) {
  space.innerHTML = player();
  window.turn++;
}

function setMessage(msg) {
  $("#message").html(msg);
}

function getBoardState() {
  const boardState = [];
  for (const space of spaces) {
    boardState.push(space.innerHTML);
  }
  return boardState;
}

function checkWinner() {
  const currentBoard = getBoardState();
  const winningIndex = winningCombos.find((winningCombo) => {
    return currentBoard[winningCombo[2]] !== "" && currentBoard[winningCombo[1]] !== "" && currentBoard[winningCombo[0]] !== "" && currentBoard[winningCombo[0]] === currentBoard[winningCombo[1]] && currentBoard[winningCombo[2]] === currentBoard[winningCombo[1]];
  });

  if (winningIndex !== undefined) {
    setMessage(`Player ${currentBoard[winningIndex[0]]} Won!`);
    return true;
  } else {
    return false;
  }
}

function doTurn(space) {
  updateState(space);
  const won = checkWinner();
  if (won) {
    saveGame();
  }
  else if (!won && window.turn > 8) {
    setMessage("Tie game.");
    saveGame();
  }
}
