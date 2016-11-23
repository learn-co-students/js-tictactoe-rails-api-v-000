var turn = 0;
var currentGame;
var winningCombos = [
  [[0,0], [1,0], [2,0]],
  [[0,1], [1,1], [2,1]],
  [[0,2], [1,2], [2,2]],
  [[0,0], [1,1], [2,2]],
  [[2,0], [1,1], [0,2]],
  [[0,0], [0,1], [0,2]],
  [[1,0], [1,1], [1,2]],
  [[2,0], [2,1], [2,2]]
  ];

function board(winningCombos) {
  for(var i = 0; i < winningCombos.length; i++) {
    var winningCombo = winningCombos[i];
    var x = winningCombo[0];
    var y = winningCombo[1];
    var selector = $('[data-x="' + x + '"][data-y="' + y + '"]')
    if (noMatches(selector)) {
      return false;
    }
  }
  return true;
};

function noMatches(selector) {
  return (selector.html() != player())
}

function attachListeners() {
  $("td").click(function(event) {
    var square = ($(this).text());
    if (square != "O" && square != "X") {
    doTurn(event);
  }
  })
  $("#previous").click(function() {
    getAllGames();
  })
  $("#save").click(function() {
    save();
  })
  $("#games").click(function(event) {
    var state = parseState(event);
    changeGame(state, getGameId(event));
  })
}

function doTurn(event) {
  updateState(event);
  if (checkTie() || checkWinner()) {
    save(true);
    reset();
  } else {
    turn += 1
    console.log(`Turn ${turn} completed.`)
  }
}

function checkWinner() {
  for(var i = 0; i < winningCombos.length; i++) {
    if (board(winningCombos[i]) == true) {
      message("Player " + player() + " Won!");
      return true;
    }
  }
  return false;
}

function checkTie() {
  if (!checkWinner() && turn == 8) {
    message("Tie game");
    console.log("it's a tie");
    return true;
  }
}

function updateState(event) {
  $(event.target).html(player());
}

function player() {
  if (turn % 2 == 0){
    return "X";
  } else {
    return "O"
  }
}

function message(string) {
  $('#message').html(string);
}

function reset() {
  $('td').html("")
  turn = 0
}

function parseState(event) {
  return $(event.target).data("state").split(",")
};

function getGameId(event) {
  return $(event.target).data("gameid")
};

function getAllGames() {
  $.getJSON("/games").done(function(response) {
    showGames(response.games);
  });
};

function showGames(games) {
  var dom = $();
  games.forEach(function(game) {
    dom = dom.add(showGame(game));
  });
  $("#games").html(dom);
};

function showGame(game) {
  return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id});
};

function changeGame(state, id) {
  placeMarks(state);
  currentGame = id;
  turn = findTurn(state);
};

function findTurn(state) {
  var turn = 0;
  state.forEach(function(item) {
    if(item != "") {
      turn += 1;
    }
  })
  return turn;
};

function placeMarks(marks) {
  $("td").each(function(i) {
    $(this).text(marks[i]);
  })
};

function getMarks() {
  var marks = []
  $("td").each(function(i) {
    marks.push($(this).text())
  })
  return marks;
};

function save(resetCurrentGame) {
  if(currentGame) {
    var url = "/games/" + currentGame;
    var method = "PATCH";
  } else {
    var url = "/games";
    var method = "POST";
  }

  $.ajax({
    url: url,
    method: method,
    dataType: "json",
    data: {
      game: {
        state: getMarks()
      }
    },
    success: function(data) {
      if(resetCurrentGame) {
        currentGame = 0;
      } else {
        currentGame = data.game.id;
      }
    }
  })
};

$(document).ready(function(){
  attachListeners();
});
