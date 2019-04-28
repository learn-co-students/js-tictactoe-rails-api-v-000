const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0;
var currentGame = 0;


$(document).ready(function() {
  attachListeners();
});


function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => previousGames());
  $('#clear').on('click', () => resetBoard());
}

var player = function(){
  return (turn % 2 === 0) ? "X" : "O";
};

function doTurn(eventSquare) {
  updateState(eventSquare);
  turn++;
  if (checkWinner()) { //after each turn, check for a winner. 
    saveGame(); //after each turn,save the game 
    resetBoard(); //after each turn, if winner, reset board. 
  } else if (turn === 9) { //only 9 possible positions on board, if all filled and no winner, its a tie. 
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  }
}

function resetBoard() {
  $('td').empty();
  turn = 0; //reset turn count and currentGame
  currentGame = 0;
}

function checkWinner() {
  var board = {};
  var win = false;
  $('td').text((index, eventSquare) => board[index] = eventSquare);
  
  WINNING_COMBOS.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return win = true;
    }
  });

  return win;
}

function updateState(eventSquare) {
  $(eventSquare).html(player());
}

function setMessage(message) {
  $('#message').html(message);
}

function saveGame() {
  var state = [];
  var gameData;
  $('td').text((index, square) => {state.push(square);
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
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
      $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
    });
  }
}

function previousGames() {
  $('#games').empty();
  $.get('/games', (savedGames) => {
    if (savedGames.data.length) {
      savedGames.data.forEach(buttonizePreviousGame);
    }
  });
}

function buttonizePreviousGame(game) {
  $('#games').append(`<button id="gameid-${game.id}">Game: ${game.id}</button><br>`);
  $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
}

function reloadGame(gameId){
  $.ajax({type: "GET", url: `/games/${gameId}`, success: function(gameData){
    var id = gameData.id
    var gameState = gameData.data.attributes.state
    currentGame = gameId
    $.each(gameState, function(index){
      $(`td:eq(${index})`).text(this)
    })
    turn = gameState.join('').length
    }
  })
  }
