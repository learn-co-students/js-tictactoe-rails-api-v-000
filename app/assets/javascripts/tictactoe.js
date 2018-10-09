// Code your JavaScript / jQuery solution here
const WIN_COMBINATIONS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                    [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

var turn = 0;

$(document).ready(function() {
    attachListeners();
});

var player = () => turn % 2 ? 'O' : 'X'


function updateState(squares){
  var token = player();
  $(squares).text(token);
}

function setMessage(msg){
  $('#message').text(msg);
}

function checkWinner(){
  // how to check if player wins horizontally, vertically, diagonally
  // define win combinations'
  // check for winner and set message and return true if won
  console.log("check winner");

  var board = {};
  var winner = false;

  var input = (index, square) => (
        board[index] = square
      );

  $('td').text(input);

    WIN_COMBINATIONS.some(
      function(array) {
         if (board[array[0]] !== "" &&
             board[array[0]] === board[array[1]] &&
             board[array[1]] === board[array[2]])
         {
           setMessage(`Player ${board[array[0]]} Won!`);
           return winner = true;
         }
   });
    return winner;
}

function doTurn(){
  // player plays his turn, updateState for him and increase count by 1
  // check if winner then save game and reset board
  // else check if turn is 9 set message, save the game and  reset the board

}

function resetBoard(){
  console.log("In resetBoard");
  $('td').empty;
  turn = 0;
}

function saveGame(){
  console.log("In saveGame");
// how to save data , change each box ie td with X or O
}

function showPreviousGames(){
  console.log("In showPreviousGames");
// how to show previous games?
}

function attachListeners(){
// also need to update the td box with
 $('td').on('click', function() {
    // check if winner else turn the board
      doTurn(this);
 });

    $('#save').on('click', () => saveGame());
   $('#previous').on('click', () => showPreviousGames());
   $('#clear').on('click', () => resetBoard());
}
