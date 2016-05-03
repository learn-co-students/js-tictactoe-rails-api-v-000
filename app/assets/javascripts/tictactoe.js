var turn = 0, board = ["","","","","","","","","","",""], currentGame = 0
var winCombinations = [ [0,1,2],[3,4,5],
                        [6,7,8],[2,5,8],
                        [0,3,6],[1,4,7],
                        [0,4,8],[6,4,2] ];

$(function() {
  attachListeners();
})



function attachListeners() {
  $('td').click(function() {
    var selector = this;
    var x = $(this).data('x');
    var y = $(this).data('y');
    doTurn(selector);
  });

  $('#previous').click(function() {
    getAllGames();
  });

  $('#save').click(function() {
    saveGame(false);
  });
}

function doTurn(selector) {
  updateState(selector);
  board = $.makeArray($('td').map(function(n) { return $('td:eq('+n+')').html() }));
  
  if (checkWinner()) {
    saveGame(true);
    resetGame();
  } else {
  turn += 1;
  }
}


function checkWinner() {
  var won = [];
  winCombinations.forEach(function(win) {
    if ((board[win[0]] === board[win[1]]) &&
        (board[win[1]] === board[win[2]]) && 
        (board[win[2]] === board[win[0]]) && 
         board[win[0]] !== "") {
      won.push(win);
    }
  });
  if ((won.length !== 0) && !isFull()) {
    message("Player " + player() + " Won!");
    return true; 
  } else if (isFull()) {
    message("Tie game");
    return true;
  } else {
    return false;
  };
}

function updateState(selector) {
  $(selector).text(player);
}

function player() {
  return turn & 1 ? "O" : "X";
}

function message(sentence) {
  $('#message').html(sentence);
}

function isFull() {
  return board.indexOf("") === -1 ? true : false;
}

function resetGame() {
  $('td').each(function(n) { $('td:eq('+n+')').html("") });
  turn = 0;
}

function getAllGames() {
  $.get('/games', function(data) {
    var games = ""
      data.games.forEach(function(game){
        games += "<li data-gameid=" + game.id + " data-state=" + game.state + ">" + game.id + "</li>"
      })
     
    $('#games').html(games);
    loadGame(data);
  });
}

function loadGame(data) {
  $('li').on('click', function() {
    currentGame = $(this).data('gameid');
    board = $(this).data('state').split(",");
    for (var i = 0; i < board.length; i++) {
      $('td:eq('+i+')').html(board[i])
    }
  })
}


function saveGame(isOver) {
  var gameState = { game: { state: board } };
  var url, method;
  if (currentGame !== 0) {
    url = '/games/' + currentGame;
    method = 'PATCH';
  } else {
    url = '/games';
    method = 'POST';
  };

  $.ajax({
    method: method,
    url: url, 
    data: gameState
  })
  .done(function(data){
    console.log(data);
    if (isOver) {
      currentGame = 0
    } else {
      currentGame = data["game"]["id"]
    }
  });
}












