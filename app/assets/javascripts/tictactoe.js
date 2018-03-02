let turn = 0; //even = X, odd = O
let currntGameID = 0; //set gameID to pull previous games
let board = document.getElementsByTagName('td');  //creates board positions

const winningCombo = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]; //all possible winning combos


//event listeners
$(document).ready(function() {
 attachListeners();
});

function attachListeners(){
 //attach event listeners for each sqauare on board
 //when square is clicked doTurn() should be invoked

  //event listeners for buttons
  $('#save').on('click', function() { saveGame();});
  $('#previous').on('click', function() {previousGames();});
  $('#clear').on('click', function() {clearGame();});
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
  //pass square that was clicked
  //increase turn by 1
  //updateState()
  //checkWinner()

};

function updateState(){
  //player()
  //adds returned value from player() to clicked on square
};

function checkWinner(){
  //returns true if winning combo exists
  //if winner invoke setMessage(), passing string Player _ Won!
};

function setMessage(msg){
  $('#message').append(msg); //accepts string and adds it to the div#message
};


//buttons
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
  };
