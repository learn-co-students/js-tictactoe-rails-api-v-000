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
var bool        = false;
var token;
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
      // local app is not getting data.game.id
      game = {id: data.game.id ,state: data.game.state};
    }
  });
}

var player = function() {
  bool  = !bool;
  token = (bool === true) ? 'X' : 'O';
  return token;
}

var message = function(text) {
  $('#message').text(text);
}

var updateState = function(obj) {
  // $(this) is being passed in through doTurn() as obj, woot woot!
  obj.append(player());
}

var doTurn = function(obj) {
  turn++;
  updateState(obj);
  checkWinner();
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
      if (winning_combo.length == 3) {                  // once winning_combo has 3 elements
        if (winning_combo[0] !== ""){                   // test for empty combos
          if (sameValues(winning_combo)) {              // if combos  are not empty check if they actually have the same values
            save();
            message('Player '+token+' Won!');
            clearGame();
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
  // debugger
  if (turn === 9) {
    save();
    message('Tie game');
    clearGame();
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
      // Ajax below works, I think?
      $.ajax({
        url: '/games/'+game.id,
        method: "PATCH",
        data: {game: {state: JSON.stringify(boardCells)}},
        success: function(data){
          clearGame();
        }
      })
      count = 0;
    } else {
      save();
    }

  })

  $('#previous').click(function(event) {
    // debugger
    $.ajax({
      // get previous games here and then append id to html by 
      url: '/games',
      method: 'GET',
      success: function(data) {
        $('#games li').remove();
        var games = data.games;
        // append to div
        $.each( games, function( index, key ) {
          $('#games').append('<li data-gameid='+games[index].id+'>'+games[index].id+'</li>');
        });
        
      }
    });
  })


  $('#games').delegate('li','click',function() {
    // debugger
    var gameId = $(this).text();
    // Grabbing table elements below to later append
    var table  = getTable();

    $.ajax({
      url: '/games/'+gameId,
      method: 'GET',
      success: function(data) {
        // debugger
        var game = JSON.parse(data.state);
        // showing game requested on board
        clearGame();
        $.each(table, function( index, key ) {
          // debugger
          $(this).append(game[index]);
        });
        
      }
    })
  })

  // playing per table element click
  $('tr td').click(function(event) {
    doTurn($(this));
  })
}
