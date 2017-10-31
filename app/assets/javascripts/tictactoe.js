var turn = 0;
var id;
const WINNING_COMBOS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]

$(() => attachListeners());

function attachListeners() {
  $("td").click(function() {
    if (validMove(this)) {
      doTurn(this);
    }
  });
  $("#save").click(save);
  $("#previous").click(previous);
  $("#clear").click(clear);
}


function player() {
  return turn % 2 === 0 ? "X" : "O";
}

function updateState(cell) {
  $(cell).text(player());
}

function setMessage(message) {
  $("#message").text(message);
}

function checkWinner() {
  var result = gameWon();
  if (!!result) {
    setMessage(result);
    save();
    clear();
  }
  return !!result;
}

function boardFull() {
  var state = $.map($("td"), function(cell) {return $(cell).text()});
  return state.every(function(i) {
    return $(this).text() == "X" || $(this).text() == "O";
  });
}

function gameWon() {
  var state = $.map($("td"), function(cell) {return $(cell).text()});
  for (let i = 0; i < WINNING_COMBOS.length; i++) {
    var combo = WINNING_COMBOS[i];
    if (combo.every(function(i) {return state[i] === "X"})) {
      return "Player X Won!";
    } else if (combo.every(function(i) {return state[i] === "O"})) {
      return "Player O Won!";
    }
  };
  return false;
}

function doTurn(cell) {
  if (!boardFull() && !gameWon()) {
    $("#message").empty();
    $("#saveStatus").empty();
    updateState(cell);
    turn++;
    if (!checkWinner(cell) && turn === 9) {
      setMessage("Tie game.");
      save();
      clear();
    }
  }
}

function loadGame(gameId) {
  $.get("/games/" + gameId, function(data) {
    var game = data["data"];
    $("td").each(function(i) {
      $(this).text(game["attributes"]["state"][i]);
    })
    id = game["id"];
    turn = game["attributes"]["state"].reduce(function(count, cell) {
      return cell === "X" || cell === "O" ? count + 1 : count;
    }, 0);
  });
}

function validMove(cell) {
  return !gameWon() && !boardFull() && !$(cell).text() && turn < 9;
}

function save() {
  var state = $.map($("td"), function(cell) {return $(cell).text()});
  if (id) {
    patchData = {"state": state, "id": id};
    $.ajax({
      method: "PATCH",
      url: "/games/" + id,
      data: patchData
    });
  } else {
    $.post("/games", {"state": state}, function(data) {
      id = data["data"]["id"];
    });
  }
}

function previous() {
  $("#games").empty();
  $.get("/games", function(data) {
    var allGames = data["data"]
    allGames.forEach(function(game) {
      $("#games").append(`<button data-id="${game["id"]}">Game - ${game["id"]}</button>`);
    });

    $("#games button").click(function() {
      loadGame($(this).data("id"));
    });
  });
}

function clear() {
  $("td").empty();
  turn = 0;
  id = null;
}
