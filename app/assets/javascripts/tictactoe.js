// Code your JavaScript / jQuery solution here

const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0;
var gamesProcessed = []
var recordOfSavedGames = [];
$(document).ready(function() {
  attachListeners();
});

var player = () => turn % 2 ? 'O' : 'X';

function doTurn(square) {
  updateState(square);
  turn++;
  if (checkWinner()) {
    autoSave();
    resetBoard();
  } else if (turn === 9) {
    setMessage("Tie game.");
    autoSave();
    resetBoard();
  }
}

function resetBoard(e=undefined) {
  $('td').empty();
  turn = 0;
  recordOfSavedGames = [] 
}
function getBoard(){
  boardHTMLData = $("td")
  boardHTMLDataLength = boardHTMLData.length
  board = []
  for(var i = 0; i < boardHTMLDataLength; i++){
    board.push( boardHTMLData[i].innerHTML )
   }
   return board 
}

function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $("#previous").on('click', getPreviousGames);
  $("#save").on('click', saveGame);
  $("#clear").on('click', resetBoard); 
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
function autoSave(){
   saveGame(new Event(window))
}
function loadGame(loadedGame){
  recordOfSavedGames = []
  var gameId = loadedGame.id
  $.get("/games/" + gameId)
  .done(function(res){
   
     var loadedGameState = loadedGame.attributes.state
     console.log("Loaded State", loadedGameState) 
     var tdElements = $("td") 
     for(var i = 0; i < tdElements.length; i++){
   	tdElements[i].innerHTML = ( loadedGameState[i] )
     }
  })
  .fail(function(res){

  });
}
function saveGame(e){
   e.preventDefault();
   var currentBoardState = getBoard();
   var gameFound = false; 
   var gameFoundId = undefined; 
   var currentProcessedData = ""
   var currentBoardData = ""
   for(var j = 0; j < recordOfSavedGames.length; j++){
	currentBoardData = JSON.stringify(currentBoardState); 
	currentProcessedData = JSON.stringify( recordOfSavedGames[j].attributes.state);

	gameFound = (currentBoardData == currentProcessedData)
        console.log(currentBoardData, currentProcessedData, gameFound)  
	if(gameFound){ 
		gameFoundId = recordOfSavedGames[j].id;
		break;
	}
   }
   if(!gameFound){
   	$.post("/games", {state: currentBoardState})
	.done(function(res){
	  console.log("Game saved successfully");
	  recordOfSavedGames.push( res.data) 
	})
	.fail(function(res){
	  console.log("Game not saved. An error has occurred.");
	});
   }
   else{
       console.log("Game Found ID:", gameFoundId, " Setting New State To:", currentBoardState); 
	$.ajax({
	  url: "/games/" + gameFoundId,
	  method: "PATCH",
	  data: {id: gameFoundId, state: currentBoardState}  

	})
	.done(function(res){
	  console.log("New game saved successfully."); 
	})
	.fail(function(res){
	  console.log("New game not saved. An error has occured.");
	});
   }
}

function getPreviousGames(e){
    e.preventDefault(); 
    $.ajax({
    url:"/games",
    method: "GET",
    dataType: "json" })
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
	    if( !gameAlreadyProcessed(currentGame) ){
		gamesProcessed.push(currentGame)
	    }
	  }

	  /*
	   *
	   * Render all processed games
	   * */
	
	  for(var l = 0; l < gamesProcessed.length; l++){
		$("#games").append("<button onclick=loadGame("+JSON.stringify(gamesProcessed[i]) +")>Game</button>"); 
	  }
	}
    });
}
function gameAlreadyProcessed(currentGame){
	var gamesProcessedLength = gamesProcessed.length
	for(var i = 0; i < gamesProcessedLength; i++){
		if( JSON.stringify( gamesProcessed[i].attributes.state ) == JSON.stringify( currentGame.attributes.state ) ){
			return true 
		}
	}
	return false 
}
function updateState(square) {
  var token = player();
  $(square).text(token);
}

function setMessage(string) {
  $('#message').text(string);
}
