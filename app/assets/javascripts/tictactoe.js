// Code your JavaScript / jQuery solution here
$(document).ready(function() {
  reset();
  attachListeners();
})

function attachListeners() {
  $("#save")[0].addEventListener("click", function() {
    // alert("Hello");
    const state = {"state": board().map(s => s.innerHTML)};
    if (currentGameId) {
      const patching = $.ajax ({
        url: "/games/" + currentGameId,
        method: "PATCH",
        dataType: "json",
        data: state
      });
      // debugger;
      patching.success(function(game) {
        alert("Game " + currentGameId + " updated.");

      });
    } else {
      const posting = $.post("/games", state);
      posting.success(function(game) {
        currentGameId = game["data"]["id"];
        alert("Game " + currentGameId + " saved.");
      });
    }
    // const posting = $.post("/games", state)
    // posting.done(function(game) {
    // //   const button = document.createElement("button");
    // //   button.innerHTML = "Game" + game["data"]["id"];
    // //   games.innerHTML += button
    // });
  });
  $("#previous")[0].addEventListener("click", function() {
    // alert("Hello");
    $.get("/games", function(games) {
      debugger;
    });
  });
  $("#clear")[0].addEventListener("click", function() {
    reset();
  });
  board().forEach(function(square) {
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
  $('#message')[0].innerHTML = message;
};

function checkWinner() {
  if (!!checkRows()) {
    const winner = board()[checkRows()[0]].innerHTML;
    setMessage("Player " + winner + " Won!")
    return true;
  } else {
    return false;
  }
}

function checkRows() {
  const rows = [[0, 4, 8], [2, 4, 6], [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8]];
  return rows.find(function(row) {
    const symbols = row.map(s => board()[s].innerHTML);
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
  } else if (gameOver()) {
    setMessage("Tie game.");
    reset();
  };
};

function gameOver() {
  return board().map(i => i.innerHTML).filter(s => s === "").length === 0;
}

function reset() {
  turn = 0;
  board().map(i => i.innerHTML = "");
  currentGameId = false;
}

function board() {
  return $.makeArray($("td"))
}
