function resetGame() {
  turn = 0;
  $('td').html('');
  winningPiece = undefined
  currentGame = 0;
};

function getCurrentState() {
  var board = [];
  $("td").each(function() {
    board.push($(this).text())
  })
  return board
}

function saveGame(resetCurrentGame) {
  var url, method, data;
  var state = getCurrentState();
  if(currentGame) {
    url = "/games/" + currentGame;
    method = "PATCH"
    data = { game: { id: currentGame, state: state } }
  } else {
    url = "/games"
    method = "POST"
    data = { game: { state: state } }
  }

  $.ajax({
    url: url,
    method: method,
    dataType: "json",
    data: data,
    success: function(data) {
      if(resetCurrentGame) {
        currentGame = undefined;
      } else {
        currentGame = data.game.id;
      }
    }
  })
}; 

function getGames() {
  $.get("/games").done(function(response) {
    var games = response["games"];
    var gameList = "";
    if(games.length == 0) {
      $("#message").text("No games saved.");
    } else {
      $("#message").text("Select a game save to restore the game");

      games.forEach(function(game) {
        gameList += "<li data-gameid=" + game["id"] + " data-state=" + game["state"] + ">" + game["id"] + "</li>";
      });

      $("#games").html(gameList);
    };
  });
};

function loadPreviousGame() {
  var state = $(event.target).data("state").split(",");
  $('td').each(function(i) {
    $(this).text(state[i]);
  });
  turn = 0;
  state.forEach(function(space) {
    if(space != "") {
      turn++;
    }
  });
};