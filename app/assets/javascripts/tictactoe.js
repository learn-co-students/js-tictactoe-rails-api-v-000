var turn = 0; //even = X, odd = O
var currntGameID = 0;
var board = document.getElementsByTagName('td');  //creates board positions

const WINNING_COMBINATOINS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];


//event listeners
$(document).ready(function() {
 attachListeners();
});

function attachListeners(){

  $('#save').on('click', function() {
    saveGame();
  });

  $('#previous').on('click', function() {
    previousGames();
  });

  $('#clear').on('click', function() {
    clearGame();
  });
}

//returns token of the player whose turn it is
function player(){
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
};

function doTurn(){
  turn += 1

  return updateState() //pass element that was clicked

  return checkWinner() //checks to see if there is a winner after turn
};

function updateState(){
  //invokes player()
  return player()
  //adds X or O to clicked square 
};

function checkWinner(){
  //returns true if current board contains a winner
  //invokes setMessage with "Player _ Won!"
};

function setMessage(string){
  $('#message').append(string);
};

function saveGame(){
  //should save current game's state
  //update if game already exists
  //doesn't already exists, persist to database
};


function previousGames(){
  //grab all previous games
  //create a button for each that can be clicked
  //when clicked should show saved game's state
};
function clearGame(){
  //clear board
  //start a completly new game
};
