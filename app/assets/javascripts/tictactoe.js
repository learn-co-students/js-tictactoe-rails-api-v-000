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

var save = function() {
  $.ajax({
    url: '/games',
    method: 'post',
    dataType: 'json',
    data: {state: JSON.stringify(boardCells)},
    success: function(data){
      game = {id: data.id ,state: data.state};
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

var getTable = function() {
  $('table td').each(function() {
    boardCells.push($(this).text());
  })
}

var resetGame = function() {
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
  var resultCombo = [];
  // this will make sure that the array gets updated and not added onto by clearing it
  boardCells = []; 
  // retrieving table values and adding generating boardCells
  getTable();  

  for (var i = 0; i < win_combos.length; i++) {
    for (var x = 0; x < win_combos[i].length; x++) {
      resultCombo.push(boardCells[win_combos[i][x]]); // pushing values at win combo indeces into a resultCombo array
      if (resultCombo.length == 3) {                  // once resultCombo has 3 elements
        if (resultCombo[0] !== ""){                   // test for empty combos
          if (sameValues(resultCombo)) {              // if combos  are not empty check if they actually have the same values
            save();
            message('Player '+token+' Won!');
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
  // debugger
  if (turn === 9) {
    save();
    message('Tie game');
    resetGame();
  } else {
    return false;
  }
}

var attachListeners = function() {
  var count = 0;
  var game;

  $('#save').click(function(event) {
    // incrementing count on click
    count ++;

    if (count == 2) {
      debugger
      $.ajax({
        url: '/games/'+game.id,
        type: "PATCH",
        contentType: "application/json"
      }).done(function(response){
        console.log(response)
      });
      count = 0;
    } else {
      save();
    }

  })

  $('#previous').click(function(event) {
    // debugger
    $.get('/games'), function(data) {
      // get previous games here and then append id to html by 
      console.log(data)
    }
  })

  $('tr td').click(function(event) {
    doTurn($(this));
  })
}
