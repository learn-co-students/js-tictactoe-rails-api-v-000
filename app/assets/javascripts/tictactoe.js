$(document).ready(function(){
  attachListeners();
})

var win_combos = [
      [0,1,2], // Top Row
      [3,4,5], // Middle Row
      [6,7,8], // Bottom Row
      [0,4,8], // Diagonal Row # 1
      [6,4,2], // Diagonal Row # 2
      [0,3,6], // Vertical Column 1
      [1,4,7], // Vertical Column 2
      [2,5,8]  // Vertical Column 3
  ];

var turn        = 0;
var currentGame = 0;
var boardCells  = [];
var game;

var getTable = function() {
  var table = $('tr td').get();
  return table;
}

var save = function() {
  $.ajax({
    url: '/games',
    method: 'post',
    dataType: 'json',
    data: {game: {state: JSON.stringify(boardCells)}},
    success: function(data){
      game = {id: data.game.id ,state: data.game.state};
    }
  });
}

var update = function() {
  $.ajax({
    url: '/games/'+game.id,
    method: "PATCH",
    data: {game: {state: JSON.stringify(boardCells)}},
    success: function(data){
      clearGame();
    }
  })
}

var showGames = function() {
  $.ajax({
    url: '/games',
    method: 'GET',
    success: function(data) {
      // clearing other listed game to refresh list
      $('#games li').remove();
      var games = data.games;
      // append to div
      $.each( games, function( index, key ) {
        $('#games').append('<li data-gameid='+games[index].id+' data-gamestate='+games[index].state+'>'+games[index].id+'</li>');
      });
    }
  });
}

var player = function() {
  if ((turn % 2) == 0) {
    return 'X';
  } else {
    return 'O';
  }
}

var message = function(text) {
  $('#message').text(text);
}

var updateState = function(obj) {
  // $(this) is being passed in through doTurn() as obj, woot woot!
  obj.append(player());
}

var doTurn = function(obj) {
  updateState(obj);
  // if no winner increment turn
  (checkWinner()) ? clearGame() : turn++;
}

var getCurrentBoard = function() {
  $('table td').each(function() {
    boardCells.push($(this).text());
  })
}

var clearGame = function() {
  $('table td').empty();
  boardCells = [];
  turn       = 0;
  // setting bool to false to reset token to 'X'
  bool       = false; 
}


var oldGame = function(id, aGame) {
  if (aGame[0][0] == '['){
    aGame = {id: id, state: JSON.parse(aGame)}
  } else {
    aGame = {id: id, state: aGame};
  }
  // after clearing board showing game requested on board
  clearGame();
  
  $.each(getTable(), function( index, key ) {
    $(this).append(aGame.state[index]);
  });
}

var cellsTaken = function(value, index, array) {
  if ((value == 'X') || (value == 'O')) {
    return true;
  } else {
    return false;
  }
}

var sameValues = function(boardCombo) {
  for (var i = 1; i < boardCombo.length; i++){
    if (boardCombo[i] !== boardCombo[0])
      return false;
   }
   return true
}

var checkWinner = function() {
  var winning_combo = [];
  // this will make sure that the array gets upddated and not added onto by clearing it
  boardCells = []; 
  // retrieving table values and generating boardCells
  getCurrentBoard();  

  for (var i = 0; i < win_combos.length; i++) {
    for (var x = 0; x < win_combos[i].length; x++) {
      winning_combo.push(boardCells[win_combos[i][x]]); // pushing values at win combo indeces into a winning_combo array
      if (winning_combo.length == 3) {  
                         // once winning_combo has 3 elements
        if (winning_combo[0] !== ""){                   // test for empty combos
          if (sameValues(winning_combo)) {              // if combos  are not empty check if they actually have the same values
            save();
            message('Player '+player()+' Won!');
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

  if (boardCells.every(cellsTaken)) {
    save();
    message('Tie game');
    return true;
  } else {
    return false;
  }
}

var attachListeners = function() {
  var count = 0;

  $('#save').click(function(event) {
    // incrementing count on click
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


  $('#games').delegate('li','click',function() {
    var gameId = $(this).text();
    // Grabbing table elements below to later append
    game = $(this).attr('data-gamestate').split(',');
    // below work around tests whether the game state needs to be parsed
    oldGame(gameId, game);
  })

        
  // playing per table element click
  $('tr td').click(function(event) {
    doTurn($(this));
  })
}
