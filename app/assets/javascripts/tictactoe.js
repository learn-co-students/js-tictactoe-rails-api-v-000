// Code your JavaScript / jQuery solution here
const WINCOMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

var turn = 0;
var gameId = 0;
var state = [];

$(document).ready(function(){
  attachListeners();
});

function player(){
  if (turn % 2 == 0 ){
    return 'X';
  }
  return 'O';
}

function updateState(cell) {
  $(cell).text(player());
}

function setMessage(message){
  $('#message').text(message);
}

function checkWinner(){
  let gameBoard = {};

  $('td').text( function(index, cell) {
      gameBoard[index] = cell;
  });

  return WINCOMBOS.some(function(winCombo){
    if (gameBoard[winCombo[0]] !== "" && gameBoard[winCombo[0]] === gameBoard[winCombo[1]] && gameBoard[winCombo[1]] === gameBoard[winCombo[2]]) {
        setMessage(`Player ${gameBoard[winCombo[0]]} Won!`);
        return true;
    }
  });
}

function doTurn(cell){
  updateState(cell);
  turn = turn + 1;
  if(checkWinner()){
    saveGame();
    clearGame();
  }
  else if (turn === 9 && !checkWinner()){
    setMessage("Tie game.");
    saveGame();
    clearGame();
  }
}

function attachListeners(){
  $('td').on('click', function(){
    if (!$.text(this) && !checkWinner()){
      doTurn(this);
    }
  })
  $('#save').on('click', function(){
    saveGame();
  });
  $('#previous').on('click', function(){
    previousGame();
  });
  $('#clear').on('click', function(){
    clearGame();
  });
}

function saveGame(){
  $('td').text(function(index, cell){
    state.push(cell);
  });
  if (gameId){
    $.ajax({
      data: {state: state},
      type: 'PATCH',
      url: `/games/${gameId}`
    });
  }
  else {
    $.post('/games', {state: state}, function(game){
      gameId = game.data.id;
    });
  };
}

function previousGame(){
  $.get('/games', function(previousGames) {
    $('#games').empty();
    $('#message').empty();
    previousGames.data.forEach(function(game){
      if (previousGames.data.length !== 0){
        $('#games').append(`<button id="gameId-${game.id}">Game ${game.id}</button><br>`);
        $('#gameId-' + game.id).on('click', function(){
          showGame(game.id);
        });
      };
    });
  });
}

function showGame(id){
  $.get(`/games/${id}`, function(game){
    $('#games').empty();
    $('#message').text(`/games/${id}`);
    gameId = game.data.id;
    state = game.data.attributes.state;
    turn = state.join('').length;
    i = 0;
    state.forEach(function(element){
      $('td')[i].innerHTML = element;
      i++;
    });
  });
}

function clearGame(){
  turn = 0;
  gameID = 0;
  $('td').empty();
}
