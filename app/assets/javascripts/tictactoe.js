var turn = 0;
var winCombinations = [["00","10","20"], ["01","11","21"], ["02","12","22"],
    ["00","01","02"], ["10","11","12"], ["20","21","22"],
    ["00","11","22"], ["02","11","20"]
   ];
var winner = "";
var currentGame = 0;

var attachListeners = function() {
  $('td').on('click', function(event) {
    doTurn(event.target);
  });
  $('#reset').on('click', function(event) {
    resetGame();
  });
  $("#previous").on("click", function() {
    getGames();
  });
  $("#save").on("click", function() {
    save();
  });

  $("#games").on("click", "li", function(event) {
    currentGame = $(this).text();
    loadGame(event);
  });
}

var taken = function(turnEvent) {
  return !!$(turnEvent).html();
}

var doTurn = function(turnEvent) {
  updateState(turnEvent);
  var won = checkWinner();
  if(won || cat()) {
    save(true);
    resetGame();
  } else {
  turn++;
}
}

var updateState = function(turnEvent) {
  var currentPlayer = player();
  $(turnEvent).html(currentPlayer);
}

var player = function() {
  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}

var full = function() {
  return $('td').text().length > 8;
}

var cat = function() {
  if (won()) {
    return false;
  } else if (!full()) {
    return false;
  } else {
    return true;
  }

}

var stateHash = function() {
  var boardHash = {};
  $("td").each(function() {
    var $td = $(this)
    var position = $td.data("x").toString() + $td.data("y").toString();
    boardHash[position] = $td.text();
  });
  return boardHash;
}

var current = function() {
  var board = [];
  $("td").each(function() {
    var $td = $(this)
    board.push($td.text());
  });
  return board;
}

var won = function() {
    var boardHash = stateHash();
    var saveWin = false;
    winCombinations.forEach(function(combo) {
      var ohWins = boardHash[combo[0]] == "O" && boardHash[combo[1]] == "O" && boardHash[combo[2]] == "O";
      var exWins = boardHash[combo[0]] == "X" && boardHash[combo[1]] == "X" && boardHash[combo[2]] == "X";
      if (ohWins || exWins) {
        saveWin = true;
        if (ohWins) {
          setWinner("O");
        } else {
          setWinner("X");
        }
      }
    });
    return saveWin;
  }

var setWinner = function(player) {
  winner = player;
}

var over = function() {
  if (cat() || !!won()){
    return true;
  }
  else {
    return false;
  }
}


var checkWinner = function() {
  if (over()) {
    if (won()) {
      message("Player " + winner + " Won!");
    } else {
      message("Tie game");
    }
    $('#games').text('');
    return true;
  } else {
    return false;
  }
}


var message = function(string) {
  $('#message').text(string);
}

var resetGame = function() {
  turn = 0;
  $("td").html("");
  currentGame = 0;
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
        state: current()
      }
    },
    success: function(data) {
      if(resetCurrentGame) {
        currentGame = undefined;
      } else {
        currentGame = data.game.id;
      }
    }
  })
}

var getGames = function() {
  $.get("/games").done(function(response) {
    var games = response["games"];
    var gameList = "";
    if (games.length == 0) {
      $("#message").text("No games saved.")
    } else {
      $("#message").text("Click on the number to restore any of the following games.")
      gameList += "<ul>";
      console.log(response)
      console.log(games)
      games.forEach(function(game){
        gameList += "<li data-gameid=" + game["id"] + " data-state=" + game["state"] + ">" + game["id"] + "</li>";
      });
      gameList += "</ul>";
      $("#games").html(gameList);
    }
  });
}

var loadGame = function(event) {
    var state = $(event.target).data("state").split(",");
    $("td").each(function(i) {
       $(this).text(state[i]);
     })
    turn = 0;
   state.forEach(function(item) {
     if(item != "") {
       turn += 1;
     }
   })
}

$(function() {
  attachListeners();
});
