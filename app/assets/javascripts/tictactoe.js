// Code your JavaScript / jQuery solution here
$(document).ready(function() {
  reset();
  attachListeners();
})

function attachListeners() {
  addSaveListener();
  addPreviousListeners();
  addClearListener();
  resetBoard();
}

function addClearListener() {
  $("#clear")[0].addEventListener("click", function() {
    reset();
  });
}

function addSaveListener() {
  $("#save")[0].addEventListener("click", function() {
    save();
  });
};

function addPreviousListeners() {
  $("#previous")[0].addEventListener("click", function() {
    $.get("/games", function(games) {
      showGames(games);
    });
  });
}

function resetBoard() {
  board().forEach(function(square) {
    square.addEventListener("click", function() {
      if (blankSquare(square) && !checkWinner() && !gameOver()) {
        doTurn(square);
      };
    });
  });
}

function blankSquare(square) {
  return square.innerHTML == "";
}

function showGames(games){
  $.makeArray(games["data"]).forEach(function(game) {
    addButton(game);
  });
}

function addButton(game){
  const id = game["id"];
  if (buttonExists(id)) {
    const button = document.createElement("button");
    buildButton(button, id)
    addLoadListener(button, id);
  };
};

function buildButton(button, id){
  button.innerHTML = "Show Game " + id;
  $(button).attr("id", id);
  return $("div#games").append(button);
}

function addLoadListener(button, id) {
  button.addEventListener("click", function(){
    $.get("/games/" + id, function(game) {
      currentGameId = id;
      const state = game["data"]["attributes"]["state"];
      turn = state.filter(s => s !== "").length;
      board().forEach(function(square, index) {
        board()[index].innerHTML = state[index];
      });
    })
  });
}

function buttonExists(id) {
  return $("#" + id).length == 0;
}

function save() {
  const state = {"state": board().map(s => s.innerHTML)};
  if (gameNotSaved()) {
    postGame(state);
  } else {
    patchGame(state)
  };
}

function postGame(state) {
  $.post("/games", state, function(game) {
    currentGameId = game["data"]["id"];
  });
}

function patchGame(state) {
  $.ajax ({
    url: "/games/" + currentGameId,
    method: "PATCH",
    dataType: "json",
    data: state
  });
}

function gameNotSaved() {
  return currentGameId === 0;
}

function player() {
  return (turn % 2 == 1) ? "O" : "X"
};

function updateState(square) {
  square.innerHTML = player();
};

function setMessage(message) {
  $('#message')[0].innerHTML = message;
};

function checkWinner() {
  if (!!checkRows()) {
    const winner = getWinner();
    setMessage("Player " + winner + " Won!")
    return true;
  } else {
    return false;
  }
}

function getWinner() {
  return board()[checkRows()[0]].innerHTML;
}

function checkRows() {
  const rows = [[0, 4, 8], [2, 4, 6], [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8]];
  return rows.find(function(row) {
    const symbols = getSymbols(row);
    return threeInRow(symbols) && noneEmpty(symbols);
  });
}

function getSymbols(row) {
  return row.map(s => board()[s].innerHTML);
}

function threeInRow(symbols) {
  return [...new Set(symbols)].length == 1
}

function noneEmpty(symbols) {
  return !symbols.includes("");
}

function doTurn(square) {
  updateState(square);
  ++turn;
  if (checkWinner()) {
    save();
    reset();
  } else if (gameOver()) {
    setMessage("Tie game.");
    save();
    reset();
  };
};

function gameOver() {
  return board().map(i => i.innerHTML).filter(s => s === "").length === 0;
}

function reset() {
  turn = 0;
  board().map(i => i.innerHTML = "");
  currentGameId = 0;
}

function board() {
  return $.makeArray($("td"))
}
