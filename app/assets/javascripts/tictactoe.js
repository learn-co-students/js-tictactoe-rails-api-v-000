$(document).ready(function () {
  attachListeners();
});

var turn = 0;
var currentGame;
var winningCombos = [
  [[0,0],[1,0],[2,0]],
  [[0,1],[1,1],[2,1]],
  [[0,2],[1,2],[2,2]],
  [[0,0],[1,1],[2,2]],
  [[0,0],[0,1],[0,2]],
  [[2,0],[2,1],[2,2]],
  [[1,0],[1,1],[1,2]],
  [[2,0],[1,1],[0,2]]
  ];

function attachListeners() {
  $('td').on('click', function(event) {
    doTurn(event);
  });
  $('#save').click(function() {
    save();
  });
  $('#previous').click(function() {
    getGames();
  });
  $('#games').click(function(event) {
    var state = getState(event)
    changeGame(state, getGameId(event))
  });
};

function doTurn(event) {
  updateState(event);
  if (checkWinner() || checkTie()) {
    save(true);
    resetGame();
  } else {
    turn += 1;
  };
};

function checkWinner() {
  for(var i = 0; i < winningCombos.length; i++) {
    if(current(winningCombos[i]) == true) {
      message("Player " + player() + " Won!");
      return true;
    }
  }
  return false;
};

 function checkTie() {
   var tie = true;
   $('td').each(function() {
     if ($(this).html().length <= 0) {
       tie = false;
     }
   });
   if (tie) message("Tie game");
   return tie;
 };

 function updateState(event) {
   $(event.target).html(player());
 };

 function cellTaken() {
   var currentCell = $(event.target).html()
   return (currentCell == "" ? false : true)
 }

 function player() {
   return (turn % 2 === 0 ? "X" : "O");
 };

 function current(winningCombos) {
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

 function noMatches(cell) {
   return (cell.html() != player())
 };

function message(string) {
  $('#message').html(string);
};

function resetGame() {
  $('td').html('');
  turn = 0;
};

function save(resetCurrentGame) {
  var url, method;
  if(currentGame) {
    url = '/games/' + currentGame
    method = 'PATCH'
  }
  else {
    url = '/games'
    method = 'POST'
  }

  $.ajax({
    url: url,
    method: method,
    dataType: 'json',
    data: {
      game: {
        state: getCharacters()
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
};

function getState(event) {
  return $(event.target).data("state").split(",")
};

function getGameId(event) {
  return $(event.target).data("gameid")
};

function getGames() {
  $.getJSON("/games").done(function(response) {
    showGames(response.games);
  });
};

function showGames(games) {
  var dom = $()
  games.forEach(function(game) {
    dom = dom.add(displayGame(game));
  })
  $("#games").html(dom);
};

function displayGame(game) {
  return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id});
};

function changeGame(state, id) {
  placeCharacters(state);
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
}

function placeCharacters(characters) {
  $("td").each(function(mark){
    $(this).text(characters[mark]);
  })
}

function getCharacters() {
  var characters = []
  $('td').each(function(i){
    characters.push($(this).text())
  })
  return characters;
}
