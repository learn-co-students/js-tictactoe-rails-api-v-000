var turn = 0;
var currentGame = 0;

function player(){
  return turn % 2 ? 'O' : 'X';
}

function updateState(square){
  var token = player();
  $(square).text(token);
}

function setMessage(message){
  $('#message').text(message);
}

function currentState(){
  let board = []
   $('td').each(function(){
     board.push($(this).text())
   });
  return board;
}

function checkState(combo, board){
  if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
    winner = board[combo[1]]
    return true;
  };
}

function checkWinner(){
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

 for(i = 0; i < WIN_COMBINATIONS.length; i++){
   if (checkState(WIN_COMBINATIONS[i], currentState())){
     setMessage(`Player ${winner} Won!`)
     return true;
   };
 };
 return false;
}

function doTurn(square){
  updateState(square);
  turn++;
  if (checkWinner()){
    saveGame();
    resetBoard();
  } else if (turn === 9){
    setMessage('Tie game.');
    saveGame();
    resetBoard();
  }
}


function saveGame(){
  gameData = { state: currentState() };
  if (currentGame){
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    });
  } else {
    $.post('/games', gameData, function(game){
      currentGame = game.data.id;
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
    });
  }
}

function loadGame(gameId) {
  $('#message').text("");
  let id = gameId;
  $.get(`/games/${gameId}`, function(game){
    let state = game.data.attributes.state
    $("td").text((index, token) => state[index])
    currentGame = id
    turn = state.join("").length
    checkWinner();
  })
}

function previousGames(){
  $('#games').empty();
  $.get('/games', function(savedGames){
    if (savedGames.data.length){
      savedGames.data.forEach(function(game){
        $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
        $(`#gameid-${game.id}`).on('click', function(){loadGame(game.id)});
      });
    }
  });
}

function resetBoard(){
  $('td').empty();
  turn = 0;
  currentGame = 0;
}

function attachListeners(){
  $('td').on('click', function(){
    if (!$.text(this) && !checkWinner()){
      doTurn(this);
    }
  });
  $('#save').on('click', function() { saveGame() });
  $('#previous').on('click', function() { previousGames() });
  $('#clear').on('click', function() { resetBoard() });
}

$(document).ready(function(){
  attachListeners();
});
