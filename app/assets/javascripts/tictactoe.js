var turn = 0; //even = X, odd = O
var currntGameID = 0;
var board = document.getElementsByTagName('td');  //creates board positions

const winningCombo = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];


//event listeners
$(document).ready(function() {
 attachListeners();
});

function attachListeners(){


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

function doTurn(square){
  turn += 1

  updateState(square) //pass element that was clicked

  if (checkWinner()) {
    saveGame()
    clearGame()
  } else if (turn === 9) {
    setMessage("Tie Game.")
    saveGame()
    clearGame()
    }
};

function updateState(square){
  $(square).text(player())
};

function checkWinner(){
  var winner = false;
  var squares = $('td')
    squares.text(function(index, square) {
      board[index] = square;
    })

 winningCombo.some(function(combo) {
   if (board[combo[0]] == board[combo[1]] && board[combo[1]] == board[combo[2]] && board[combo[0]] != "") {
     winner = true;
     setMessage("Player " + board[combo[0]] + " Won!");
   };
 });

 return winner;
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
  $('td').empty();
   turn = 0;
   currentGameId = 0;
};
