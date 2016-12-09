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

var attachListeners = function() {
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

var switchGame = function(response) {
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

var saveGame = function(resetCurrentGame) {
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
    getAllGames();
}

var getAllGames = function() {
  $.getJSON("/games").done(function(response) {
    if (response.length != 0) {
      showGames(response);
    }
  })
}

var showGames = function(games) {
  var dom = $()
  games.forEach(function(game) {
   dom = dom.add($('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id}));
   dom = dom.add($(`<a href="#" data-id="${game.id}">Delete Game</a>`))
  });
  $("#games").html(dom);
  $("#games a").click(function(response){ deleteGame(response)})
}

var deleteGame = function(response) {
  var id = $(response.target).data('id')

  $.ajax({
    url: '/games/' + id,
    method: 'DELETE'
  })

  getAllGames();
}

var doTurn = function(event) {
  updateState(event);
  var win = checkWinner()

  if (win === true) {
    reset();
  } else {
    turn += 1;
  }
}

var reset = function() {
  $("td").html('')
  turn = 0
  currentGame = 0
}

var checkWinner = function() {
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

var updateState = function(event) {
  $(event.target).html(player());
}

var player = function() {
  if(turn % 2 === 0) {
    return "X";
  }
  else {
    return "O";
  }
}

var message = function(string) {
  $('#message').html(string);
  $('#message').fadeIn(1000);
  $('#message').fadeOut(3000);
}
