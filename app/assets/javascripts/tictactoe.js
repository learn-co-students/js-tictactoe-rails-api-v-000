// Code your JavaScript / jQuery solution here
var turn = 0;

//Possible Winning Outcomes (This is a constant)
const WIN_COMBINATIONS = [[0,1,2], [3,4,5], [6,7,8,], //Horizontal Wins
[0,3,6], [1,4,7], [2,5,8], //Vertical Wins
[0,4,8], [6,4,2]] //Diagonal Wins

function player(){
  if(turn % 2 === 0){
    return 'X';
  }
  else{
    return 'O';
  }
}

function updateState(square){
  //square ==> <td data-x="0" data-y="1"></td>
  //Setting a currentPlayer varaiable that will call the player function
  var currentPlayer = player();
  //Search for square and put the innerHTML or text as currentPlayer
  $(square).text(currentPlayer);
}

function setMessage(message){
  $('#message').text(message);
}

function checkWinner(){
  var winner = false;
  //Board will start as an empty object
  var board = {};
  //Goal is to populate the board object with the index and the square
  //square ==> <td data-x="0" data-y="1"></td>
  $('td').text((index, square)=> board[index]= square);
}

function doTurn(){}

function attachListeners(){}


function isEven(value){

}
