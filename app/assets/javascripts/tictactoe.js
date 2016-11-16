var turn = 0;
var currentState = false;
WINCOMBO = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6],[1,4,7], [2,5,8],[0,4,8], [6,4,2]];
var board = ["", "", "", "", "", "", "", "", ""];

function attachListeners() {
 $('td').on('click', function(event){
    doTurn(event)
  });
}

function doTurn(event) {
  updateState(event);
 if (checkWinner()){
    save(true);
    resetGame();
  } else {
    turn += 1;
  } }

function player(){
// If the turn number is even, this function should return the string "X", else it should return the string "O"
  return (turn % 2 == 0) ? "X" : "O"
}

function updateState(event){
// This method should call on player() and add the return value of this function to the clicked cell on the table
  var td = event.target;
  if (td.textContent !== "X" && td.textContent !== "O") {
    $(td).text(player());
  }
}

function checkWinner() {
// This function should evaluate the board to see if anyone has won
// If there is a winner, this function should make one of two strings: "Player X Won!" or "Player O Won!". It should then pass this string to message().
  WINCOMBO.forEach(function(value, index){
    if(board[value[0]] == board[value[1]] && board[value[1]] == board[value[2]] && board[value[0]] !== ""){
      currentState = board[value[0]];
    }
  });
  return currentState;
}

function message(data) {
// This function should accept a string and add the string to the div with an id of "message"
$("#message").text(data);
}

function resetGame() {
  turn = 0;
  currentState = false;
  $('td').each(function(){
    $(this).html("");
  });
}

function getAllGames() {}

function saveGame() {
  $('#save').click(function() {
    requestGameSave()
  });
}

$(function() {
  attachListeners()
})