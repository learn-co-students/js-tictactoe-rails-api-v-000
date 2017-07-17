// Code your JavaScript / jQuery solution here
var winConditions = [[0,1,2],
                      [3,4,5],
                      [6,7,8],
                      [0,3,6],
                      [1,4,7],
                      [2,5,8],
                      [0,4,8],
                      [2,4,6]];

var turn = 0;
var currentGame = 0;

var player = function(){
  return turn % 2 === 0 ? "X" : "O";
}

var updateState = function(e){
  var result = player()
  $(e.target).text(result);
}

var message = function(message){
  $("#message").text(message);
}

var loadBoard = function(){
     board = []
    document.querySelectorAll("[data-y]").forEach(function(cell){
     board.push(cell.innerHTML)
 })
}

var resetBoard = function() {
  turn = 0
  $("td").html('');
}

function checkWinner() {
  //LOAD BOARD TO GET THE BOARD STATE
  loadBoard()
  for (var i = 0; i < winConditions.length; i++) {
    var row = winConditions[i];
    if (board[row[0]] == board[row[1]] && board[row[2]] == board[row[1]] && board[row[0]] != ""){
      message(`Player ${board[row[0]]} Won!`)
      return true;
    }
  }
    return false
}
