// Code your JavaScript / jQuery solution here
$(document).ready(function() {
  games = 0;
  reset();
  attachListeners();
})

function attachListeners() {
  saveButton.addEventListener("click", function() {
    const state = $.makeArray(squares).map(s => s.innerHTML);
    const posting = $.post("/games", JSON.stringify({"state": state}));
    // posting.done(function(game) {
    //   debugger;
    //   const button = document.createElement("button");
    //   button.innerHTML = "Game" + game["data"]["id"];
    //   games.innerHTML += button
    // });
  });
  previousButton.addEventListener("click", function() {
    $.get("/games", function(resp) {
    });
  });
  clearButton.addEventListener("click", function() {
    reset();
  });
  $.makeArray($("td")).forEach(function(square) {
    square.addEventListener("click", function() {
      if (square.innerHTML == "" && !checkWinner() && !gameOver()) {
        doTurn(square);
      };
    });
  });
}

function player() {
  return (turn % 2 == 1) ? "O" : "X"
};

function updateState(square) {
  square.innerHTML = player();
};

function setMessage(message) {
  messageDiv.innerHTML = message;
};

function checkWinner() {
  if (!!checkRows()) {
    const winner = squares[checkRows()[0]].innerHTML;
    setMessage("Player " + winner + " Won!")
    return true;
  } else {
    return false;
  }
}

function checkRows() {
  const rows = [[0, 4, 8], [2, 4, 6], [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8]];
  return rows.find(function(row) {
    const symbols = row.map(s => squares[s].innerHTML);
    return threeInRow(symbols) && noneEmpty(symbols);
  });
  // return [0, 1, 2].some(function(row_index) {
  //   const row = $("td[data-" + axis + "=" + row_index + "]");
  //   const symbols = $.makeArray(row).map(square => square.innerHTML);
  //   return threeInRow(symbols) && noneEmpty(symbols)
  // });
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
    reset();
    ++games
  } else if (gameOver()) {
    setMessage("Tie game.");
    reset();
    ++games;
  };
};

function gameOver() {
  return $.makeArray(squares).map(i => i.innerHTML).filter(s => s === "").length === 0;
}

function reset() {
  turn = 0;
  $.makeArray(squares).map(i => i.innerHTML = "");
}
