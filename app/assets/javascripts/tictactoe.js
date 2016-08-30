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

var player = function() {
  bool  = !bool;
  token = (bool === true) ? 'X' : 'O';
  return token;
}

var message = function(player) {
  $('#message').append(player);
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

var getTable = function() {
  // body...
  $('table td').each(function() {
    boardCells.push($(this).text());
  })
}

var resetGame = function() {
  $('table tr').remove();
  turn = 0;
}

var checkWinner = function() {
  // this function will be used to test that combos have the same elements
  Array.prototype.sameValues = function() {
   for (var i = 1; i < this.length; i++){
    if (this[i] !== this[0])
      return false;
   }
   return true
  }; 
  
  var resultCombo = [];
  
  // populating boardCells using table values
  getTable();    

  for (var i = 0; i < win_combos.length; i++) {
    for (var x = 0; x < win_combos[i].length; x++) {
      resultCombo.push(boardCells[win_combos[i][x]]); // pushing values at win combo indeces into a resultCombo array
      if (resultCombo.length == 3) {                        // once resultCombo has 3 elements
        if (resultCombo[0] !== ""){                         // test for empty combos
          if (resultCombo.sameValues()) {                   // if combos  are not empty check if they actually have the same values
            message('Player '+resultCombo[0]+' Won!');
            resetGame();
            return true;
          } else {
            resultCombo = [];
          }          
        } else {
          resultCombo = [];
        }
      }
    }
  }

  if (turn === 8 || turn === 7) {
    message('Tie game');
    resetGame();
  } else {
    return false;
  }
}

var attachListeners = function() {
  $('tr td').click(function(event) {
    // maybe need to pass event to function() and then to doTurn
    doTurn($(this));
  })

  $('#previous').click(function(event) {
    $.get('/games'), function(data) {
      // get previous games here
    }
  })
}
