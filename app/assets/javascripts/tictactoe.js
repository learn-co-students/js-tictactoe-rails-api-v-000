$(function() {
    attachListeners();
});

var turn = 0;
var winning = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

function attachListeners() {
  $('tbody').click(function(event){
    doTurn(event);
  });

  $('#previous').click(function(event){
    getAllGames();
  });

  $('#save').click(function(event){
    save();
  });

  $('#previous').click(function(event){
    getAllGames();
  });
}

function doTurn() {

  updateState(event);
  checkWinner();
    turn++;
}

function player() {
  return (turn % 2 === 0) ? "X" : "O";
}

function updateState(event) {
  $(event.target).html(player());
}

function checkWinner() {
  var board = selections();

  for (var i = 0; i < winning.length; i++) {
    if( (board[winning[i][0]] === "X") && (board[winning[i][1]] ===  "X") && (board[winning[i][2]] === "X")){
      console.log("Player 1 wins");
    }else if ((board[winning[i][0]] === "O") && (board[winning[i][1]] ===  "O") && (board[winning[i][2]] === "O")) {
      console.log("Player 2 wins");
    }
  }//for end
}//checkwinner end

//get all the inputs
function selections() {
  var board = [];
  $('td').each(function() {
    board.push($(this).text());
  });
  return board;
}
