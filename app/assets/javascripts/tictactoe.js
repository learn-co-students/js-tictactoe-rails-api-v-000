// Code your JavaScript / jQuery solution here
$(document).ready(function() {
  reset();
  attachListeners();
})

function attachListeners() {
  $("#save")[0].addEventListener("click", function() {
    save();
    // debugger;
  });
  $("#previous")[0].addEventListener("click", function() {
    $.get("/games", function(games) {
      showGames(games);
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

function showGames(games){
  $.makeArray(games["data"]).forEach(function(game) {
    addButton(game);
  });
}

function addButton(game){
  const buttonSelector = "#" + game["id"]
  const button = document.createElement("button");
  button.innerHTML = "Show Game " + game["id"];
  $(button).attr("id", game["id"]);
  debugger;
  const gamesDiv = $("#games")[0];
  button.addEventListener("click", function(){
    $(gamesDiv).prepend(JSON.stringify(game["attributes"]["state"]));
  });
  if ($(buttonSelector).length == 0) {
    $(gamesDiv).append(button);
  }; 
};

function save() {
  const state = {"state": board().map(s => s.innerHTML)};
  // debugger;
  if (currentGameId === 0) {
    $.post("/games", state, function(game) {
      currentGameId = game["data"]["id"];
    });
  } else {
    const patching = $.ajax ({
      url: "/games/" + currentGameId,
      method: "PATCH",
      dataType: "json",
      data: state
    }, function(game) {
      alert("Game " + currentGameId + " updated.");
    });
  };
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
