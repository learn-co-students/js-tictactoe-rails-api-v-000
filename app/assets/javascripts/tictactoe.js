var turn = 0;
var currentGame;

var winCombos = [
  [0,1,2],  // Top row
  [3,4,5],  // Middle row
  [6,7,8],  // Bottom row
  [0,3,6],  // Vertical row
  [1,4,7],  // Vertical Middle row
  [2,5,8],  // Vertical row
  [0,4,8],  // Diagonal Row
  [6,4,2]   // Diagonal Row
  ]

$(function() {
  attachListeners();
});

function attachListeners(){
  $('td').on("click", function(){
    var x = $(this).data("x");
    var y = $(this).data("y");
    doTurn(x, y);
  });
  $('#save').on('click', function(){
    saveGame();
  });
}

function doTurn(x, y){
  updateState(x, y);
  turn += 1;
  checkWinner();
}

function checkTie(board){
 for(var i=0; i< board.length; i++) {
    if(board[i] === "") return false;
  }
  return true;
}

function checkWinner(){
  var board = $('td').map(function(index, item){return item.innerHTML;});
  for (var i = 0; i < winCombos.length; i++){
    combo = winCombos[i];
    if (board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] && board[combo[0]] != ""){
      var winner = board[combo[0]];
      var string = "Player " + winner + " Won!"
      message(string);
      break
    } else {
      var result = false;
    }
  }
  if (checkTie(board) === true ){
    message("Tie game")
  } else {
  return result;
  }
}

function updateState(x, y){
  var token = player();
  $('td[data-x="' + x + '"][data-y="' + y + '"]').text(token);
}

function player(){
  if (turn % 2 === 0){
    return "X";
  } else {
    return "O";
  }
}

function message(string){
  $('#message').html(string);
  saveGame(true);
  resetBoard();
}

function resetBoard(){
  turn = 0;
  $('td').each(function(){
    $(this).text("");
  })
}

function boardState(){
  var board = []
  $('td').each(function(){
    board.push($(this).text());
  });
  return board;
}

function saveGame(resetCurrentGame){
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
    data: { 
      game: {
        state: boardState()
        }
      },
      success: function(data) {
      if(resetCurrentGame) {
        currentGame = undefined;
      } else {
        currentGame = data.id;
      }
    }
  });
}

 


