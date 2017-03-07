var turn = 0;
var winCombos = [[[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]], [[0,0],[1,1],[2,2]], [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0],[2,1],[2,2]], [[2,0],[1,1],[0,2]]];
var currentGame;

function attachListeners() {
  $("table td").on('click', function (event) {
    doTurn(event);
  });

  $("#games div").on("click", function (event) {
    debugger
    var state = event.target.data("state")
  })

  $("button#previous").on("click", showPrevious);

  $("button#save").on("click", saveGame);
}

function doTurn(event) {
  updateState(event);
  if (checkWinner() || checkTie()) {
    saveGame();
  } else {
    turn += 1;
  }
}

function player() {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(event) {
  if (event.target.textContent === "") {
    event.target.textContent = player();
  }
}

function checkSingleCombo(positions) {
  var value = true
  $.each(positions, function (i, coordinates) {
    var xPos = coordinates[0];
    var yPos = coordinates[1];
    var attrString = '[data-x="' + xPos + '"][data-y="' + yPos + '"]';
    if ($(attrString).text() != player()) {
      value = false
    }
  })
  return value
}

function checkWinner() {
  var value = false;
  $.each(winCombos, function (i, combo) {
    if (checkSingleCombo(combo) === true) {
      message("Player " + player() + " Won!");
      value = true;
    }
  })
  return value;
}

function checkTie() {
  if (turn === 8) {
    message('Tie game');
    return true;
  } else {
    return false;
  }
}

function message(string) {
  $("#message").text(string);
}

function showPrevious() {
  $.getJSON("/games").done(function (response) {
    debugger
    response.games.forEach(function (game) {
      $("#games").appendChild(`<div data-state="#{game.state}" data-id="#{game.id}">#{game.id}</div>`)
    })
  })
}

function fillBoard(marks) {
  $("td").each(function(i) {
    $(this).text(marks[i]);
  })
}

function parseBoard() {
  var inputs = []
  $("td").each(function(i) {
    inputs.push($(this).text())
  })
  return inputs;
}

function getTurn(state) {
  var turn = 0;
  state.forEach(function (position) {
    if (item != "") {
      turn += 1;
    }
  })
  return turn;
}

function saveGame() {
  debugger
  var url = "/games";
  var method;

  if (currentGame) {
    url += "/" + currentGame
    method = "PATCH";
  } else {
    method = "POST";
  }

  $.ajax({
    url: url,
    method: method,
    dataType: "json",
    data: {
      game: { state: parseBoard() }
    },
    success: function (data) {
      if (checkWinner() || tie()) {
        currentGame = undefined
      } else {
        currentGame = data.game.id;
      }

    }
  });
}

function loadGame(id, state) {
  currentGame = id;
  turn = getTurn();
  fillBoard(state);
}

function resetBoard() {
  $("td").html("");
  turn = 0;
  currentGame = 0;
}
