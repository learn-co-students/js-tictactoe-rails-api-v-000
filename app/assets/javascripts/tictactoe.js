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
}

var taken = function(turnEvent) {
  return !!$(turnEvent).html();
}

var doTurn = function(turnEvent) {
      if (turn == 1) {
      $('#message').text(" ");
    }
    if(taken(turnEvent)){
      message("That square is taken. Please select another.");
    } else if(!over()) {
    updateState(turnEvent);
    turn++;
    checkWinner();
  } else if (over()) {
    checkWinner();
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
  if (turn > 4) {
    var boardHash = stateHash();
    var saveCombo = [];
    winCombinations.forEach(function(combo) {
      var ohWins = boardHash[combo[0]] == "O" && boardHash[combo[1]] == "O" && boardHash[combo[2]] == "O";
      var exWins = boardHash[combo[0]] == "X" && boardHash[combo[1]] == "X" && boardHash[combo[2]] == "X";
      if (ohWins || exWins) {
        saveCombo.push(true);
      } else {
        saveCombo.push(false);
      }
    });
    var index = saveCombo.indexOf(true);
    if (index >= 0) {
      setWinner(boardHash[winCombinations[index][0]]);
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
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
    save();
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


var save = function() {
  var board = current();
  if (currentGame == 0){
  $.ajax({
    type: "POST",
    url: "/games",
    data: {game: {state: board}},
  });
} else {
  $.ajax({
    type: "PATCH",
    url: "/games" + currentGame,
    data: {game: {state: board}},
  });
}
  resetGame();
}

var getAllGames = function() {
  $.getJSON("/games").done(function(response) {
    var games = response["games"];
    var gameList = "";
    if (games.length == 0) {
      $("#message").text("No games saved.")
    } else {
      $("#message").text("Click on the number to restore any of the following games.")
      gameList += "<ul>";
      games.forEach(function(game){
        gameList += '<li class="game" data-id="' + game["id"] + '">' + game["id"] + '</li>';
      });
      gameList += "</ul>";
      $("#games").html(gameList);
    }
  });
}

$(function() {
  attachListeners();

  $("#previous").on("click", function() {
    getAllGames();
  });
  $("#save").on("click", function() {
    save();
  });

  $("li").on("click", function(event) {
    console.log("test");
  });
});
