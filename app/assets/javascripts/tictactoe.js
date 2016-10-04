var currentGame = 0;
var turn = 0;
var winningCombos = [
  [[0,0], [1,0], [2,0]],
  [[0,1], [1,1], [2,1]],
  [[0,2], [1,2], [2,2]],
  [[0,0], [0,1], [0,2]],
  [[1,0], [1,1], [1,2]],
  [[2,0], [2,1], [2,2]],
  [[0,0], [1,1], [2,2]],
  [[2,0], [1,1], [0,2]]
]

function attachListeners() {
  $('td').click(function(event) {
    doTurn(event);
  });

  $('#previous').click(function(games) {
    getAllGames(games);
  });

  $('#save').click(function() {
    saveGame();
  });

  $('#games').click(function(response) {
    switchGame(response);
  })

  $('#reset').click(function(){ 
    reset();
  })
}

function switchGame(response) {
  var state = $(response.target).data("state").split(",");
  var id = $(response.target).data("gameid")
  turn = state.filter(function(token) {return token == "X" || token == "O"}).length
  currentGame = id;

  for (i = 0; i < state.length; i++) {
    var cell = state[i];
    var query = 'td:eq(' + i + ')'
    $(query).html(cell)
  }
}

function saveGame(resetCurrentGame) {
    var url, method;

    if (currentGame === 0) {
      url = "/games";
      method = "POST";
    } else {
      url = "/games/" + currentGame;
      method = "PATCH";
    }

    var stateArray = []

    $('td').each(function(index) {
      stateArray.push($(this).text())
    })

    $.ajax({
      url: url,
      method: method,
      dataType: "json",
      data: {game: {state: stateArray}},
      success: function(data) {
        if(resetCurrentGame) {
          currentGame = 0;
        } else {
          currentGame = data.id;
        }
      }
    });
}

function getAllGames() {
  $.getJSON("/games").done(function(response) {
    if (response.length != 0) {
      showGames(response);
    }
  })
}

function showGames(games) {
  var dom = $()
  games.forEach(function(game) {
   dom = dom.add($('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id}));
  });
  $("#games").html(dom);
}

function doTurn(event) {
  updateState(event);
  var win = checkWinner()

  if (win === true) {
    saveGame(win);
  } else {
    turn += 1;
  }
}

function reset() {
  $("td").html('')
  turn = 0
  currentGame = 0
}

function checkWinner() {
  var returnValue = false;
  winningCombos.forEach(function(combo) {
    var xValue1 = combo[0][0];
    var yValue1 = combo[0][1];
    var xValue2 = combo[1][0];
    var yValue2 = combo[1][1];
    var xValue3 = combo[2][0];
    var yValue3 = combo[2][1];

    var firstCombo = $('[data-x="' + xValue1 + '"][data-y="' + yValue1 + '"]').html();
    var secondCombo = $('[data-x="' + xValue2 + '"][data-y="' + yValue2 + '"]').html();
    var thirdCombo = $('[data-x="' + xValue3 + '"][data-y="' + yValue3 + '"]').html();

    if(firstCombo === secondCombo && secondCombo === thirdCombo && thirdCombo === "X") {
      message("Player X Won!");
      returnValue = true;
    } else if(firstCombo === secondCombo && secondCombo === thirdCombo && thirdCombo === "O") {
      message("Player O Won!");
      returnValue = true;
    } else if(turn === 8) {
      message("Tie game");
      returnValue = true;
    }
  });
  return returnValue;
}

function updateState(event) {
  $(event.target).html(player());
}

function player() {
  if(turn % 2 === 0) {
    return "X";
  }
  else {
    return "O";
  }
}

function message(string) {
  $('#message').html(string)
}
