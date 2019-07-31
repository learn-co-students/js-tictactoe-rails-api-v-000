// Code your JavaScript / jQuery solution here

const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0;
var currentGame = 0;
var gamesProcessed = []

$(document).ready(function() {
  attachListeners();
});

var player = () => turn % 2 ? 'O' : 'X';

function doTurn(square) {
  updateState(square);
  turn++;
  if (checkWinner()) {
    //saveGame();
    resetBoard();
  } else if (turn === 9) {
    setMessage("Tie game.");
    //saveGame();
    resetBoard();
  }
}

function resetBoard() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
}
function getBoard(){
  boardHTMLData = $("td")
  boardHTMLDataLength = boardHTMLData.length
  board = []
  for(var i = 0; i < boardHTMLDataLength; i++){
    board.push( boardHTMLData[i].innerHTML )
   }
}

function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $("#previous").on('click', getPreviousGames);
  $("#save").on('click', saveGame); 
}

function checkWinner() {
  var board = {};
  var winner = false;

  $('td').text((index, square) => board[index] = square);

  WINNING_COMBOS.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });

  return winner;
}
function saveGame(e){
   e.preventDefault();
   var currentBoardState = getBoard();
   var gameFound = false; 
   for(var j = 0; j < gamesProcessed.length; j++){
	gameFound = JSON.stringify( gamesProcessed[j])  == JSON.stringify(currentBoardState)
	if(gameFound){ break; }
   }
   if(!gameFound){
   	$.post("/games", {state: currentBoardState})
	.done(function(res){
	  console.log("Game saved successfully"); 
	})
	.fail(function(res){
	  console.log("Game not saved. An error has occurred.");
	});
   }
}

function getPreviousGames(e){
    e.preventDefault(); 
    $.get("/games")
    .done(function(res){
	var games = res.data 
	var numOfGames = games.length
	if(numOfGames > 0){
	  var newButton = ""
	  var currentState = ""
	  var currentGame = {}
	  var gameFound = false
	  /* Empty the games container*/
	  $("#games").empty();
	  /*
	   * Find games that haven't been processed.
	   * */
	  for(var i = 0; i < numOfGames; i++){
	    gameFound = false 
	    currentGame = games[i] 
	    currentState = currentGame.attributes.state
	    for(var j = 0; j < gamesProcessed.length; j++){
		gameFound = JSON.stringify( gamesProcessed[j])  == JSON.stringify(currentState)
		if(gameFound){ break; }
	    }
	    if(!gameFound){
		    gamesProcessed.push(currentState)
	    }
	  }

	  /*
	   *
	   * Render all processed games
	   * */

	  for(var l = 0; l < gamesProcessed.length; l++){
		$("#games").append("<button>Game</button>"); 
	  }
	}
    });
}

function updateState(square) {
  var token = player();
  $(square).text(token);
}

function setMessage(string) {
  $('#message').text(string);
}
