const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0;
var currentGame = 0;

$(document).ready(function() {
  attachListeners();
});

function player(){
//Returns the token of the player whose turn it is, 'X' when the turn variable is even and 'O' when it is odd.
	if(turn % 2 === 0){
		return 'X'
	} else {
		return 'O'
	}
}

function updateState(coordinates){
//Invokes player() and adds the returned string ('X' or 'O') to the clicked square on the game board.
	var playerToken = player()
	coordinates.innerText = playerToken
}

function message(text){
//Accepts a string and adds it to the div#message element in the DOM.
	$('#message').text(text)
}

function checkWinner(){
//Returns true if the current board contains any winning combinations (three X or O tokens in a row, vertically, horizontally, or diagonally). Otherwise, returns false.
//If there is a winning combination on the board, checkWinner() should invoke message(), passing in the appropriate string based on who won: 'Player X Won!' or 'Player O Won!'
	var board = {}
	var winner = false;
	$('td').text((index, square) => board[index] = square);

  WINNING_COMBOS.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      message(`Player ${board[combo[0]]} Won!`);
      saveGame();
     	winner = true;
    }
  })
  return winner;
}

function saveGame(){
	var state = [];
  var gameData;

  $('td').text((index, square) => {
    state.push(square);
  });

  gameData = {state: state}

	if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    });
  } else {
  	$.post('/games',gameData,function responce(game){
  		currentGame = game.data.id
  		$('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
      $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
  	})
  }
}

function showPreviousGames() {
  $('#games').empty();
  $.get('/games', (savedGames) => {
    if (savedGames.data.length) {
      savedGames.data.forEach(buttonizePreviousGame);
    }
  });
}

function buttonizePreviousGame(game) {
  $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
  $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
}

function reloadGame(gameID){
	$.get('/games/'+gameID, function(gameData){
		currentGame = parseInt(gameData.data.id, 10)
    $("#gameid-" + gameData.data.id).on('click', () => reloadGame(gameData.data.id));

    var gameBoard = gameData.data.attributes.state
    currentGame = gameData.data.id
    let index = 0;
    
    for (let y = 0; y < 3; y++) {
   		for (let x = 0; x < 3; x++) {
   				let jquerySelector = "td[data-x="+x+"]"+"[data-y="+y+"]"
   				$(jquerySelector).html(gameBoard[index])
	        index++;
	    }
    }

    turn = gameBoard.join('').length;

    if (!checkWinner() && turn === 9) {
      message('Tie game.');
    }
	})
}

function doTurn(coordinates) {
	updateState(coordinates);
  turn ++
	if (checkWinner()){
    saveGame();
    resetBoard();
  } else if(turn === 9) {
    message('Tie game.');
    saveGame();
    resetBoard();
  }
}

function resetBoard() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
}

function attachListeners(){
	$('td').on("click",function(){
    if (this.innerHTML === "" && !checkWinner()){
      doTurn(this)
    }
	})
  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPreviousGames());
  $('#clear').on('click', () => resetBoard());
}
