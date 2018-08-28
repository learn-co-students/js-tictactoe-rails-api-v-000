$(function() {
  attachListeners();
});

var turn = 0;
var WINNING_COMBOS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]


function player(){
  //returns X when turn count is even and O when odd
  if (turn % 2 === 0){
    return "X";
  } else {
    return "O";
  }
}

function updateState(square){
  //invokes the player() function
  //adds the current player's token to the passed in <td> element
  var token = player();
  square.innerHTML = token;
}

function setMessage(message){
  // sets a provided string as the innerHTML of the div#message element
  $('#message').html(message);
}

function checkWinner(){
  // returns true when a player wins horizontally, diagonally or vertically
  // returns false if no winning combination is present on the board
  // invokes the setMessage() function with the argument "Player X Won!" when player X wins
  // invokes the setMessage() function witht he argument "Player O Won!" when player O wins
  let board = [];
  let winner = false;

  $('td').text(function(index, td){
    board[index] = td;
  })

  WINNING_COMBOS.forEach(function(combo){
    if (board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] && board[combo[0]] !== ''){
      winner = true;
      if (winner){
        setMessage(`Player ${board[combo[0]]} Won!`);
      }
    }
  })
  return winner;
}

function doTurn(square){
  // increments the value of the "turn variable"
  // invokes the checkWinner() function
  // invokes the updateState() function
  // invokes the setMessage() function with the argument "Tie game" when the game is tied
  // resets the board and the "turn" counter when a game is won
  updateState(square);
  turn ++;
  if (checkWinner()){
    turn = 0;
    $('td').empty();
  } else if (turn === 9 ){
    setMessage("Tie game.");
    turn = 0;
    $('td').empty();
  }
}


  
function attachListeners(){
  // attaches event listeners that invoke doTurn() when a square is clicked on
  // passes the clicked on <td> element to doTurn()
  $('td').on('click', function(){
    if (!this.innerHTML && !checkWinner()){
    doTurn(this);
    }
  });

  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => previousGames());
  $('#clear').on('click', () => clearGame());
}

function saveGame(){
  // if the game has not be saved yet, it sends a POST request to the "/games" route
  // when the game already exists in the database, it sends a PATCH request to '/games/id' route
}

function previousGames(){
  //clicking the button#previous sends a GET request to the "/games" route
  // does not add any children to the div#games elment when no previously-saved games exist in the db
  // adds previous games as buttons in the DOM's div#games element when previously saved games exist in the db
  // AND does not re-add saved games already present in div#gmes when the 'previous' button is clicked a second time
  console.log('in previous games')
}


function clearGame(){
  // clears the gameboard
  // does not save the cleared game
  // when the in-progress game has already been saved it fully resets the gameboard so that the next press
  // of the save button results in a new game being saved.
}

// Completing a GAME
// [] autosaves tie games
// [] autosaves won games

// Clicking a saved game button (in the div#games element)
// [] gets a GET request to the '/games/id' route
// [] loads the saved game's state into the board
// [] marks the newly-loaded game state such taht clicking the 'save' button hafter loading a game sends a PATCH request


