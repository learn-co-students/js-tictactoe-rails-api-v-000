var turn = 0;
var winningCombinations = [[[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]], [[0,0],[1,1],[2,2]], [[0,0],[0,1],[0,2]], [[2,0],[2,1],[2,2]], [[1,0],[1,1],[1,2]], [[2,0],[1,1],[0,2]]]
var currentGame;

var attachListeners = function() {
  $("tbody").click(function(event){
    doTurn(event)
  });
  $("#games").click(function(event){
    var state = parser(event)
    switchGame(state, currentId(event))
  });
  $("#save").click(function(){
    save();
  });
  $("#previous").click(function(){
    getAllGames();
  });
}

var doTurn = function(event) {
  updateState(event);
  if ( checkWinner() || checkTie() ) {
    save(true);
    resetGame();
  } else {
    turn++;
  }
}

var updateState = function(event) {
  $(event.target).html(player());
}


var player = function() {
  if(turn % 2 == 0) {
    return "X";
  } else {
    return "O";
  }
}

var checkWinner = function() {
  for(var i = 0; i < winningCombinations.length; i++){
    if (checkCells(winningCombinations[i])) {
      message("Player " + player() + " Won!");
      return true;
    }
  }
  return false;
}

var message = function(message) {
  $("#message").html(message);
}

var checkCells = function(array){
  for(var i = 0; i < array.length; i++){
    var winningCombo = array[i];
    var element = $('[data-x="' + winningCombo[0] + '"][data-y="' + winningCombo[1] + '"]');
    if (element.html() != player()){
      return false;
    }
  }
  return true;
}

var checkTie = function() {
  var tieGame = true;
  $("td").each(function(){
    if ($(this).html().length <= 0) {
      tieGame = false;
    }
  });
  if (tieGame) message("Tie game")
  return tieGame;
}

var resetGame = function() {
  $("td").html("");
  turn = 0;
  currentGame = 0;
}

var parser = function(event) {
  return $(event.target).data("state").split(",")
}

var currentId = function(event) {
  return $(event.target).data("gameid")
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
  })
  $("#games").html(dom);
}

var showGame = function(game) {
  return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id});
}

var switchGame = function(state, id) {
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
  var marks = [];
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
  })
}


$(function() {
  attachListeners()
});
