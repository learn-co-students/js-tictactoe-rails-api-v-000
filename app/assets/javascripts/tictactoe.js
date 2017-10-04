var winCombos = [[0,1,2],
                  [3,4,5],
                  [6,7,8],
                  [0,3,6],
                  [1,4,7],
                  [2,5,8],
                  [0,4,8],
                  [2,4,6]];
var turn = 0;
var currentGame = 0;
var board = {};

var player = () => turn % 2 ? 'O' : 'X';

function doTurn(square){
  updateState(square);
  turn++;
  if (checkWinner()){
    saveGame();
    resetBoard();
  } else if (turn === 9){
    setMessage(`Tie game.`);
    saveGame();
    resetBoard();
  }
};

function resetBoard(){
  $('td').empty();
  turn = 0;
  currentGame = 0;
};

function attachListeners(){
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPreviousGames());
  $('#clear').on('click', () => resetBoard());
};

function checkWinner(){

  var winner = false

  $('td').text((index, square) => board[index] = square);

  winCombos.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
    setMessage(`Player ${board[combo[0]]} Won!`);
    return winner = true;
  }
 })
 return winner;
};

function updateState(square){
    $(square).text(player());
};

function setMessage(message){
 $('#message').text(message);
};

function saveGame(){
  let state = [];
  let gameData;

  $('td').text((index, square) => {
   state.push(square);
  });

  gameData = { state: state };

  if (currentGame) {
   $.ajax({
     type: 'PATCH',
     url: `/games/${currentGame}`,
     data: gameData
   });

  } else {
   $.post('/games', gameData, function(game) {
     currentGame = game.data.id;
     $('#games').append(`<button id="gameid-${game.data.id}">Game: ${game.data.id}</button><br>`);
     $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
   });
  }
};

function showPreviousGames(){
	$("#games").empty()
	$.get('/games', function(data){

		data["data"].forEach((game) => {
			$("div#games").append(`<p><button type='button' id=gameid-${game.id}>Game: ${game.id}</button></p>`)
			$(`#gameid-${game.id}`).on('click', () => {reloadGame(game.id)})
		})
	})
};

function reloadGame(gameID) {
  setMessage("");
  $.get('/games/' + gameID, function(data) {
      var index = 0, state = data.data.attributes.state;
      for (var y = 0; y < 3; y++){
          for (var x = 0; x < 3; x++) {
              $("[data-x='" + x + "'][data-y='" + y + "']").html(state[index]);
              index++;
          }
      }

      turn = state.join("").length;
      currentGameId = data.data.id;
      if(!checkWinner() && turn === 9){
        setMessage('Tie game.');
      }
  })
}

 $(document).ready(function() {
   attachListeners();
 });
