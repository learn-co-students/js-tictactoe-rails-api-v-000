// Code your JavaScript / jQuery solution here
$( document ).ready(function() {
  attachListeners();
});//end document.ready

/// SET Variables
let boardFull = false;
let message = "";
let winner = "";
let gameSaved = false;
let gameId = 0;
var turn = 0;

const WIN_COMBINATIONS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [6,4,2]
];
////// End set variables

////////////////////////////////////////////////////////////////

function attachListeners(){
  //// Adds click listener to call doTurn if square is clicked
  $( "td" ).click(function() {
    if ((this.innerHTML.trim() === '') && checkWinner() === false) {
      doTurn(this);
    };
  });

  //// Click function to previous button that loads all the previous games as buttons into the DOM
  $("#previous").click(function() {
    loadPreviousGames();
  });

/// Click function that saves or updates the game
  $("#save").click(function() {
    gameSaved ? updateGame():saveGame(); // if the game has been saved update, otherwise save the game
  });


  /// Clears the game board if clear button is clicked
  $("#clear").click(function() {
    gameSaved ? (resetBoard(), gameSaved = false): resetBoard(); // If the game has been saved, clear the board and reset the gameSaved state to false, if the game has not been saved, just reset the board
  });

/// loads the previous games if the saved games buttons are clicked
  /// has to be able to grab the buttons that were added after the DOM was loaded
  $(document).on('click', '#games :button', function(){
      $.get(`/games/${this.id}`, function(response) {
        let savedBoard = response.data.attributes.state; //get the saved board array
        fillSquares(savedBoard);
        turnCount(savedBoard);
        gameSaved = true;
      });
  });

};
/////////////////////// end listeners

///// HELPER METHODS

function loadPreviousGames(){
  $("#games").empty(); // clear the div so that only new games are loaded
  $.get("/games", function(response) {
      let gamesString = ``;
      let gamesArray = response.data;
      $.each(gamesArray, function(i, item) {
          gamesString += `<button id="${item.id}">${item.id}</button>`;
      });
      $("#games").append(gamesString);
    });
}

function fillSquares(savedBoard){// adds the saved boards values to the current board
  let boardArray = getSquares();
  $.each(boardArray, function( index, value ) {
    value.innerHTML= savedBoard[index];
  });
};

function turnCount(savedBoard){
  let turnCount = 0;
  $.each(savedBoard, function( index, value ){
    if (value === 'X' || value === 'O'){
      turnCount ++;
    }
  });
  turn = turnCount;
};


function saveGame() { /// Saves the game to the database
  $.post('/games', {"state": getBoard()}).done(function(data) {
    let game = data;
    gameId = game.data.id;
    gameSaved = true;
  });

  if ($("#games").html().length > 0) {
    loadPreviousGames();
  }
};

function updateGame(){
  $.ajax({
    url: `/games/${gameId}`,
    type: 'PATCH',
    data: {"state": getBoard()}
  });
}

function getSquares(){
  return $("td").get();
}

function setMessage(string) {
  $( "#message" ).html(string);
}

function checkForX(element){
  return ( (element === "X"));
}
function checkForO(element){
  return ( (element === "O"));
}

function checkforEmpty(element){
  return (element === ' ')//trim()
}

function getBoard(){ //returns an array of the values of the squares in the board
  let board = getSquares();
  return board.map(square => square.innerHTML);
}

function fullBoard(){  //if the board has any empty squares then it is not full
  let boardArray = getBoard();
  ( boardArray.includes('') || boardArray.includes(' ') ) ? boardFull = false:boardFull = true
 return boardFull;
}

function resetBoard(){
  let boardArray = getSquares();
  boardArray.forEach(function(element){
    element.innerHTML = '';
  });
  turn = 0;
}



function checkWinner() {
  let answer = false;
  let testArray = [];
  message = "";

  WIN_COMBINATIONS.forEach(function(combo){ //returns array of winning combinations, ex. [0,1,2]
    combo.forEach(function(index){
      testArray.push(getBoard()[index]) //push in the value at that index either "X","Y", or ""
    });
    if (testArray.every(checkForX) === true) {
     answer = true;
     winner = "X"
   } else if (testArray.every(checkForO) === true) {
      answer = true;
      winner = "O"
    };
    testArray = [];
  });


  if (answer === true ){
    message = `Player ${winner} Won!`
    setMessage(message);
  };

  return answer;
}//end checkWinner


function isEven(num) {
  return num % 2 === 0;
}

function player() {
  let player = "O";
  if ( isEven(turn) ) { //if the turn is an even number, player is X
    player = "X"
  };
  return player;
};

function updateState(square) {
  let token = player();
  square.innerHTML = token;
}

function doTurn(square) {
  updateState(square); // add X or O to the board
  turn += 1;

  if ( checkWinner() === true ) { // check to see if there is a winner
    saveGame({"state": getBoard()});
    resetBoard();
  };

  if ( (fullBoard() === true) && (checkWinner() === false)) { // check to see if the board is full
    setMessage('Tie game.');
    saveGame({"state": getBoard()});
    resetBoard();
  };



};
