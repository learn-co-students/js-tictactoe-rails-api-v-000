var turn = 0;

var winCombinations = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6],
]

var gameParams = {game: {state: ['','','','','','','','','']}};
var currentGame = gameParams['game']['id'];

function boardState(){ 
  return $('td').map(function(){
    return $(this).text();
  }).get();
}

function saveGame(){
  if(!gameParams['game']['id']){
    $.post('/games', gameParams, function(savedGame){
      gameParams = savedGame;
    });
  } else {
    $.ajax({
      type: 'PATCH',
      url: '/games/'+ gameParams['game']['id'],
      data: gameParams,
      dataType: 'json'
    });
  }
}

function resetBoard(){ 
  gameParams = {game: {state: ['','','','','','','','','']}};
  $('td').each(function(){
    $(this).text('');
  });
  turn = 0; 
}

function showPreviousGames(){
  $('#games').html('');
  $.get('/games', function(data){
    data['games'].forEach(function(game){
      $('#games').append("<li data-gameid="+ game['id'] +">"+ game['id'] +"</li>");
    });
  });
}


function returnTokens(board){
 $('td').each(function(i){
    $(this).text(board[i]);
  });
}

function setTurns(board){
  turn = 0;
  board.forEach(function(space){
    if (space === "X" || space === "O"){turn++}
  });
}


function restoreGame(){
  var gameNumber = $(this).text();
  var board;
  $.get('/games', function(data){
    data['games'].forEach(function(game){
      if (game['id'] == gameNumber){
        board = game['state'];
        gameParams['game']['state'] = board;
        gameParams['game']['id'] = gameNumber;
        returnTokens(board)
        setTurns(board)
      }
    });
  });
}

function doTurn(e, cell){
  updateState(e, cell);
  turn++;
  checkWinner();
}

function checkWinner(){
  var win;
  winCombinations.forEach(function(combo){
    if (boardState()[combo[0]] === boardState()[combo[1]] && boardState()[combo[0]] === boardState()[combo[2]] && boardState()[combo[0]] != "" ){
      win = "Player " + boardState()[combo[0]] + " Won!";
    }
  });
  if (win) {
    saveGame();
    resetBoard();
    return message(win);
  } else if(!win && turn === 9) { 
    saveGame();
    resetBoard();
    return message("Tie game");
  } else {
    return false;
  }
}

function updateState(e, cell){
  $(cell).html(player);
  gameParams['game']['state'] = boardState();
}

function player() {
  if (turn % 2) { return "O" } else { return "X" };
} 

function message(string){
  $("#message").html(string)
}

function attachListeners(){
  $('td').click(function(e){
    if ($(this).text() === "" && !checkWinner()){
      doTurn(e, this);
    }
  });
  $('#previous').click(showPreviousGames);
  $('#save').click(saveGame);
  $('#games').on('click', 'li[data-gameid]', restoreGame);
}


$(document).ready(attachListeners)



