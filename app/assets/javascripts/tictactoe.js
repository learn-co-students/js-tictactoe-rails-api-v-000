$(document).ready(function() {
    console.log("ready!");
    attachListeners();
});

var turn = 0;
var currentGame;
var gameLayout = []

var winningCombos = [
[ [0,0], [1,0], [2,0] ], 
[ [0,1], [1,1], [2,1] ],
[ [0,2], [1,2], [2,2] ],
[ [0,0], [1,1], [2,2] ],
[ [0,0], [0,1], [0,2] ],
[ [2,0], [2,1], [2,2] ],
[ [1,0], [1,1], [1,2] ],
[ [2,0], [1,1], [0,2] ]
]

var attachListeners = function(){
  $('td').on('click', function(event){
    if($(event.target).html().length == 0) {
      doTurn(event);
    } 
  });
  $('#previous').on('click', function() {loadPreviousGames()});
  $('#games').on('click', function(event){
    var layout = $(event.target).data()['state'].split(",")
    var id = $(event.target).data()['id']
    loadGame(layout, id);
  });
  $('#save').on('click', function(){
    saveLayout();
    saveGame();
  });
};

var loadPreviousGames = function(){
  $.get('/games', function(json){
    showGames(json.games);
  });
}

var showGames = function(data){
  var games = $();
  $.each(data, (function(i, game) {
      games = games.add(showGame(game));
  }));
  $("#games").html(games);
}

var showGame = function(game) {
  return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id});
}


var saveLayout = function(){
  gameLayout = $.map($('td'), function(d, i){
    return $(d).text();
  });
};

var saveGame = function(gameReset=false){
  var url;
  if(currentGame){
    url = "/games/" + currentGame;
    method = "PATCH";
} else {
    url = "/games";
    var method = "POST";
    
  }
  $.ajax({
    url: url,
    method: method,
    dataType: "json",
    data: {
      game: {
        state: gameLayout
      }
    },
    success: function(data) {
      if(gameReset) {
        currentGame = undefined;
      } else {
        currentGame = data.game.id;
      }
    }
  })

}

var doTurn = function(event){
  updateState(event);
  turn += 1;
  checkWinner();
};

var player = function() {
  if(turn % 2 === 0){
    return "X";
} else {
    return "O";
  }
}

var updateState = function(event){
  $(event.target).html(player());
} 

var message = function(message) {
  $('#message').text(message)
};


var checkWinner = function(){
  $.each(winningCombos, function(i, combo){
    var winner = checkBoard(combo)
    if(winner){
      message("Player " + winner + " Won!")
      resetGame()
    } else if(turn == 9 && winner == false){
      message("Tie game")
      resetGame()
    }
  })
  return false
}

var checkBoard = function(combo){
  var board = combo.map(function(arr){
    return $('[data-x=' + arr[0] + '][data-y=' + arr[1] + ']').text();
  });
  var xWin = board.every(function(token){
    return token == "X";
  });
  var oWin = board.every(function(token){
    return token == "O";
  });
  if(xWin){
    return "X"
  } else if(oWin){
    return "O"
  } else {
    return false
  }
}

var resetGame = function(){
  saveGame(true)
  turn = 0
  currentGame = 0
  $('td').each(function(i, td){
    $(this).html('')
  })
}

var loadGame = function(layout, id) {
  currentGame = id;
  $.each(layout, function(i, cell){
    $($('td')[i]).text(cell)
  })
}