$(function() {
  // call function attachListeners after DOM loaded
  attachListeners();
});

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
[[2,0],[1,1],[0,2]]
];

var attachListeners = function() {
  // call function doTurn and pass param of the event
  $('td').on('click', function(e) {
    doTurn(e);
  });
  $('#save').click(function() {
    save();
  });
  $('#previous').click(function() {
    getAllGames();
  });
  $('#games').click(function(e) {
    var state = parseState(e)
    changeGame(state, getGameId(e))
  });
};

// parse the state attribute data-state into X and O tokens
var parseState = function(e) {
  return $(e.target).data("state").split(",")
};

// parse the state attribute data-gameid
var getGameId = function(e) {
  return $(e.target).data("gameid")
};

// set markets, id, turn
var changeGame = function(state, id) {
  placeMarks(state);
  currentGame = id;
  turn = findTurn(state);
};

// iterate over set of td elements and place each token
var placeMarks = function(marks) {
  $('td').each(function(i) {
    $(this).text(marks[i]);
  });
};

// iterate over set of tokens and count X and O for turn count
var findTurn = function(state) {
  var turn = 0;
  state.forEach(function(item) {
    if(item != "") {
      turn += 1;
    }
  });
  return turn;
};

var doTurn = function(e) {
  // call function updateState and pass param of the event
  updateState(e);
  // call function checkWinner
  if(checkWinner() || checkTie() ) {
    save(true);
    resetGame();
  } else {
    // increment variable turn by one
    turn += 1;
  }
};

var player = function() {
  // if turn is even, return X as string, else return O as string
  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
};

var updateState = function(e) {
  // call function player, which provides return value, add return value to clicked cell
  var token = player();
  $(e.target).html(token);
};

var noCellMatch = function(cell) {
  return (cell.html() != player())
};

var checkCells = function(winningCombos) {
  // return false if winningCombo does not match current player token
  for(var i = 0; i < winningCombos.length; i++) {
    var winningCombo = winningCombos[i];
    var x = winningCombo[0];
    var y = winningCombo[1];
    var selector = $('[data-x="' + x + '"][data-y="' + y + '"]')
    debugger;
    if( noCellMatch(selector)) {
      return false;
    }
  }
  // else return true
  return true;
};

var checkWinner = function() {
  // check array of winningCombos
  for(var i = 0; i < winningCombos.length; i++) {
    // if current player token matches winningCombo return string
    if(checkCells(winningCombos[i]) == true) {
      message("Player " + player() + " Won!");
      return true;
    }
  }
  return false;
};

var checkTie = function() {
  var tie = true;
  $('td').each(function() {
    if($(this).html().length <= 0) {
      tie = false;
    }
  });
  if(tie) message("Tie game");
  return tie;
};

var resetGame = function() {
  $('td').html('');
  turn = 0;
  currentGame = 0;
};

var message = function(string) {
  // add string to div with id of message
  $('#message').html(string);
};

var getMarks = function() {
  var marks = []
  $('td').each(function(i) {
    marks.push($(this).text())
  })
  return marks;
};

// it should send a get request to /games
var getAllGames = function() {
  $.getJSON("/games").done(function(response) {
    showGames(response.games);
  });
};

var showGames = function(games) {
  var dom = $();
  games.forEach(function(game) {
    dom = dom.add(showGame(game));
  });
  $('#games').html(dom);
};

var showGame = function(game) {
  return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id});
};

var save = function(resetCurrentGame) {
// save posts to /games with a patch to /games/:id
  var url, method;
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

