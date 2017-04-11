var turn = 0;
var state = ["", "", "", "", "", "", "", "", ""];
var currentGame;
var endGame = false;

var winStates = [
  [0, 1, 2], 
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

$(document).ready( function() {
   attachListeners();
});

var attachListeners = function() {
  $("table").click(function(event) {
    xCoord = parseInt(event.target.attributes['data-x']['nodeValue']);
    yCoord = parseInt(event.target.attributes['data-y']['nodeValue']);
    doTurn(event);
  });
  $("#games").click(function(event) {
    var state = parseState(event);
    swapGame(state, getGameId(event))
  });
  $("#save").click(function() {
    save();
  });
  $("#previous").click(function() {
    getAllGames();
  });
}

var cellIsAvailable = function(event) {
  if ($(event.target).html() === "") {
    return true;
  } else {
    return false;
  }
}

var player = function() {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

var doTurn = function(event) {
  if(cellIsAvailable(event)) {
      updateState(event);
      message("");
    } else {
      message("This cell is taken. Please choose another.");
    }
  if(checkWinner() || checkTie(turn)) {
    save(true);
    resetGame();
  } else {
    turn ++;
  }
}

var updateState = function(event) {
  $(event.target).html(player());
  var i = yCoord * 3 + xCoord;
  state[i] = player();
}

//////////////////////////////consolidate into one checkWinner method and one tie method//////////
/*var checkWinner(state) {
   if (state === undefined || state === ["", "", "", "", "", "", "", "", ""]) {
    return false; 
  }
 for (var i = 0; i < winStates.length; i++) {
    if (state[winStates[i][0]] !== "" && state[winStates[i][0]] === state[winStates[i][1]] && state[winStates[i][1]] === state[winStates[i][2]]) {
        message("Player " + player() + " Won!");
        return true;
    }
  }
  return false;
}
*/
function checkWinner(state){
  if(state === undefined){
    return false;
  }
 for (var i = 0; i < winStates.length; i++) {
    if (state[winStates[i][0]] !== "" && state[winStates[i][0]] === state[winStates[i][1]] && state[winStates[i][1]] === state[winStates[i][2]]) {
        message("Player " + player() + " Won!");
        return true;
    }
  }
  return false;

  if(endGame === true){
    saveGame(endGame);
    reset();
  }
}

function checkTie(turn){
    if(turn === 9){
    message("Tie game");
    endGame = true;
    saveGame(endGame);
    reset();
  }
}

//////////////////////////////

var resetGame = function() {
  $("td").html("");
  turn = 0;
  currentGame = 0;
}

var message = function(message) {
  $("#message").html(message);
}

var parseState = function(event) {
  return $(event.target).data("state").split(",");
}

var getGameId = function(event) {
  return $(event.target).data("gameid");
}

var getAllGames = function() {
  $.getJSON("/games").done(function(response) {
    showGames(response.games);
  });
}

var showGames = function(games) {
  var dom = $()
  games.forEach(function(game) {
    dom = dom.add(showGame(game));
  });
  $("#games").html(dom);
}

var showGame = function(game) {
  return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id});
}

var swapGame = function(state, id) {
  placeMarks(state);
  currentGame = id;
  turn = findTurn(state);
}

var findTurn = function(state) {
  var turn = 0;
  state.forEach(function(item) {
    if(item != "") {
      turn += 1;
    }
  })
  return turn;
}

var placeMarks = function(marks) {
  $("td").each(function(i) {
    $(this).text(marks[i]);
  })
}
var getMarks = function() {
  var marks = []
  $("td").each(function(i) {
    marks.push($(this).text())
  })
  return marks;
}

var save = function(resetCurrentGame) {
  var url, method;
  if(currentGame) {
    url = "/games/" + currentGame
    method = "PATCH"
  } else {
    url = "/games"
    method = "POST"
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
        currentGame = undefined;
      } else {
        currentGame = data.game.id;
      }
    }
  });
}

