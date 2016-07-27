var turn = 0;

var currentGame = 0;

var winningCombos = [
[[0,0],[1,0],[2,0]], 
[[0,1],[1,1],[2,1]], 
[[0,2],[1,2],[2,2]], 
[[0,0],[1,1],[2,2]], 
[[0,0],[0,1],[0,2]], 
[[2,0],[2,1],[2,2]], 
[[1,0],[1,1],[1,2]], 
[[2,0],[1,1],[0,2]]];

$(document).ready(function() {
  attachListeners();
});

var message = function(str) {
  $("#message").html(str);
}

var attachListeners = function() {
  $("td").on('click', function(){
    doTurn(this);
  });
  $("#previous").on('click', function(event){
    event.preventDefault();
    getAllGames();
  });
  $("#save").on('click', function(event){
    event.preventDefault();
    saveGame();
  });
  $("#games").on('click', function(event){
    var id = $(event.target).data("gameid");
    var state = $(event.target).data("state").split(",");
    loadGame(id, state);
  });
}

var doTurn = function(e){
  updateState(e);
  if(checkWinner() || checkTie()) {
    save(true);
    resetGame();
  } else {
    turn += 1;
  }
};

var updateState = function(e) {
  $(e.target).text(player());
};

var player = function() {
  return (turn % 2) == 0 ? "X" : "O";
}

var checkWinner = function() {
  for (var i = 0; i < winningCombos.length; i++) {
    tokens = [];
    for (var j = 0; j < winningCombos[i].length; j++) {
      var x = winningCombos[i][j][0];
      var y = winningCombos[i][j][1];
      var selector = $('[data-x="' + x + '"][data-y="' + y + '"]');
      tokens.push(selector.text());
    };
    if (tokens.every(function(e){return (e === player())})){
      return message( "Player " + player() + " Won!");
    };
  };
  return false
};


var checkTie = function() {
  var tie = true;
  $("td").each(function() {
    if ($(this).html().length <= 0) {
      tie = false;
    }
  });
  if (tie) message("Tie game");
  return tie;
};

var resetGame = function() {
  $("td").html("");
  turn = 0;
  currentGame = 0;
}

var parseState = function(e) {
  return $(e.target).data("state").split(",");
}

var getGameId = function(e) {
  return $(e.target).data("gameid")
};

function getAllGames() {
  $.get("/games", function(data) {
    var games = data["games"];
    var gameInfo = "";
    $.each(games, function(i, game){
      gameInfo += '<li data-gameid="' + game["id"] + '" data-state="' + game["state"] + '">' + game["id"] + '</li>'
    });
    $("#games").html(gameInfo);
  });
}