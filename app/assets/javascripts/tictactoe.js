var turn = 0;
var currentGame;
var winCombos = [
  [[0,0], [1,0], [2,0]],
  [[0,1], [1,1], [2,1]],
  [[0,2], [1,2], [2,2]],
  [[0,0], [1,1], [2,2]],
  [[2,0], [1,1], [0,2]],
  [[0,0], [0,1], [0,2]],
  [[1,0], [1,1], [1,2]],
  [[2,0], [2,1], [2,2]]
];

var attachListeners = function() {
  $("tbody").on("click", function(event) {
    doTurn(event);
  });

  $("#previous").on("click", function() {
    getPreviousGames();
  });

  $("#save").on("click", function() {
    saveGame();
  });

  $("#games").on("click", function(event) {
    var state = parseState(event);
    swapGame(state, getGameId(event));
  });
};

var parseState = function(event) {
  return $(event.target).data("state").split(",");
};

var getGameId = function(event) {
  return $(event.target).data("gameid");
};

var swapGame = function(state, id) {
  setBoard(state);
  currentGame = id;
  turn = findTurn(state);
};

var findTurn = function(state) {
  var turn = 0;
  state.forEach(function(item) {
      if(item !== "") {
            turn ++;
          }
    });
  return turn;
};

var setBoard = function(marks) {
  $("td").each(function(i) {
      $(this).text(marks[i]);
    });
};

var getPreviousGames = function() {
  $.getJSON("/games").done(function(response) {
      showGames(response.games);
    });
};

var showGames = function(games) {
  var board = $();
  games.forEach(function(game) {
      board = board.add(addCell(game));
    });
  $("#games").html(board);
};

var addCell = function(game) {
  return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id});
};

var saveGame = function(resetCurrentGame) {
  var state = getBoardState();
  var url, method;
  if(currentGame) {
    url = "/games/" + currentGame;
    method = "PATCH";
  } else {
    url = "/games";
    method = "POST";
  }

  $.ajax({
    url: url,
    method: method,
    dataType: "json",
    data: {
      game: {
        state: state
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
};

var getBoardState = function() {
  var boardState = [];
  $("td").each(function() {
    boardState.push($(this).html());
  });
};

var resetBoard = function() {
  $("td").each(function() {
    $(this).html("");
  });
  turn = 0;
  currentGame = 0;
};

var tie = function() {
  var tieExists = true;
  $("td").each(function() {
    if ($(this).html().length <= 0) {
      tieExists = false;
    }
  });
  if (tieExists) message("Tie game");
  return tieExists;
};

var doTurn = function(event) {
  updateState(event);
  if(checkWinner() || tie() ) {
    saveGame(true);
    resetBoard();
  } else {
    turn++;
  }
};

var player = function() {
  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
};

var updateState = function(event) {
  var playerToken = player();
  var cell = event.target;
  $(cell).html(playerToken);
};

var message = function(str) {
  $("#message").html(str);
};

var won = function(arr) {
    for (var j = 0; j < arr.length; j++) {
      var winIndexOne = arr[j][0];
      var winIndexTwo = arr[j][1];
      var winCell = $('[data-x="' + winIndexOne + '"][data-y="' + winIndexTwo + '"]');
      if(winCell.html() != player()) {
        return false;
      }
    }
      return true;
};

var checkWinner = function() {
  for(var i = 0; i < winCombos.length; i++) {
      if(won(winCombos[i])) {
        message("Player " + player() + " Won!");
        return true;
      }
  }
  return false;
};

$(function() {
  attachListeners();
});
