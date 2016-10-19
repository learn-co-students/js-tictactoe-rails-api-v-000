$(document).ready(function(){
  attachListeners();
})

var win_combos = [
  [0,1,2], 
  [3,4,5], 
  [6,7,8], 
  [0,4,8], 
  [6,4,2], 
  [0,3,6], 
  [1,4,7], 
  [2,5,8]  
];
var turn = 0;
var currentGame = 0;
var gameBoard = [];
var game;

function getTable() {
  var table = $('tr td').get();
  return table;
}

function save() {
  $.ajax({
    url: '/games',
    method: 'post',
    dataType: 'json',
    data: {
      game: {
        state: gameBoard
      }
    },
    success: function(data){
      game = {
        id: data.game.id, 
        state: data.game.state
      };
    }
  });
}

function update() {
  $.ajax({
    url: '/games/' + game.id,
    method: "PATCH",
    data: {
      game: {
        state: gameBoard
      }
    },
    success: function(data){
      clearGame();
    }
  });
}

function showGames() {
  $.ajax({
    url: '/games',
    method: 'GET',
    success: function(data) {
      $('#games p').remove();
      var games = data.games;
      $.each( games, function(i, key) {
        $('#games').append('<p data-gameid=' + games[i].id + ' data-gamestate=' + games[i].state + '>' + games[i].id + '</p>');
      });
    }
  });
}

function player() {
  if ((turn % 2) == 0) {
    return 'X';
  } else {
    return 'O';
  }
}

function message(text) {
  $('#message').text(text);
}

function updateState(cell) {
  cell.append(player());
}

function doTurn(cell) {
  updateState(cell);
  if (checkWinner()) {
    clearGame();
  } else {
    turn++;
  }
}

function getCurrentBoard() {
  $('table td').each(function() {
    gameBoard.push($(this).text());
  })
}

function clearGame() {
  $('table td').empty();
  gameBoard = [];
  turn = 0;
  bool = false; 
}


function oldGame(id, game) {

  if (game[0][0] == '['){
    game = {id: id, state: JSON.parse(game)}
  } else {
    game = {id: id, state: game};
  }
  clearGame();
  
  $.each(getTable(), function(i, key) {
    $(this).append(game.state[i]);
  });
}

function cellsTaken(value, index, array) {
  if ((value == 'X') || (value == 'O')) {
    return true;
  } else {
    return false;
  }
}

function sameValues(combo) {
  for (var i = 1; i < combo.length; i++){
    if (combo[i] !== combo[0])
      return false;
   }
   return true
}

function checkWinner() {
  var winning_combo = [];
  gameBoard = []; 
  getCurrentBoard();  

  for (var i = 0; i < win_combos.length; i++) {
    for (var x = 0; x < win_combos[i].length; x++) {
      winning_combo.push(gameBoard[win_combos[i][x]]);
      if (winning_combo.length == 3) {  
        if (winning_combo[0] !== ""){ 
          if (sameValues(winning_combo)) { 
            save();
            message('Player ' + player() + ' Won!');
            return true;
          } else {
            winning_combo = [];
          }          
        } else {
          winning_combo = [];
        }
      }
    }
  }

  if (gameBoard.every(cellsTaken)) {
    save();
    message('Tie game');
    return true;
  } else {
    return false;
  }
}

function attachListeners() {
  var count = 0;

  $('#save').click(function(event) {
    count ++;

    if (count == 2) {
      update();
      count = 0;
    } else {
      save();
    }
  })

  $('#previous').click(function(event) {
    showGames();
  })


  $('#games').delegate('p','click',function() {
    var gameId = $(this).text();
    game = $(this).attr('data-gamestate').split(',');
    oldGame(gameId, game);
  })

  $('tr td').click(function(event) {
    doTurn($(this));
  })
}
