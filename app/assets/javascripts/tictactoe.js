// Code your JavaScript / jQuery solution here

var turn = 0;
var gameId = 0;
WINNING_COMBINATIONS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

function player(){
  if(turn % 2 === 0){
    return 'X';
  } else {
    return 'O'
  }
}

function updateState(square){
  var token = player();
  $(square).text(token)
}

function setMessage(string){
  $("#message").text(string)
}

function currentBoard(){
  var squares = $('td');
  var board = []
  for(var s of squares){
    board.push(s.innerHTML);
  }
  return board;
}

function allGames(){
  $.get("/games").done(function(resp){
    var games = resp.data;
    for(var game of games){
      gameButtons(game)
    }
  })
}

function gameButtons(game){
  var button = `<button id=${game.id}>Game ${game.id}</button>`;
  $('#games').append(button)
}

function clearPrevious(){
  $('#games').empty();
}

function setGames(){
  clearPrevious();
  allGames();
}

function validMove(square){
  if(square.innerHTML === ''){
    return true;
  } else {
    return false;
  }
}

function isTie(){
  if(turn === 9 && !checkWinner()){
    setMessage(`Tie game.`);
    return true
  }
}

function gameOver(){
  if(checkWinner() || isTie()){
    saveGame();
    resetGame();
    return true;
  } else {
    return false;
  }
}

function resetGame(){
  var squares = $("td");
  turn = 0;
  gameId = 0;
  for(var s of squares){
    $(s).empty();
  }
}

function checkWinner(){
  var board = currentBoard();

  for(combo of WINNING_COMBINATIONS){
    var position1 = board[combo[0]]
    var position2 = board[combo[1]]
    var position3 = board[combo[2]]

    if(position1 != '' && position1 === position2 && position2 === position3){
      setMessage(`Player ${position1} Won!`);
      return true
    }
  }
  return false;
}

function doTurn(square){
  if(validMove(square)){
    updateState(square);
    turn += 1;
  }
  gameOver();
}

function saveGame(){
  var currentState = currentBoard();
  var gameData = {state: currentState};

    if(gameId){
    $.ajax({
      type: 'PATCH',
      url: `/games/${gameId}`,
      data: gameData
    }).done(function(game){
      gameId = game.data.id
    });
  }else{
    $.post('/games', gameData, function(game){
      gameId = game.data.id
    });
  }
}

function retrieveGame(id){
  $.get(`/games/${id}`).done(function(game){
    var state = game.data.attributes.state
    turn = state.filter((s) => s !== "").length
    gameId = game.data.id
    setBoard(state)
  });
}

function setBoard(state){
  var spaces = $('td')
  for(var i in state){
    $(spaces[i]).html(state[i]);
  };
};

function squaresListener(){
  $("td").on('click', function(){
    if(!gameOver()){
      doTurn(this);
    }
  })
}

function clearListener(){
  $("#clear").on('click', resetGame)
}

function previousListener(){
  $('#previous').on('click', setGames)
}

function saveListener(){
  $('#save').on('click', saveGame)
}

function retrieveGamesListener(){
  $('#games').on('click', 'button', function(event){
    var id = $(event.target).attr('id');
    retrieveGame(id)
  })
}

function attachListeners(){
  squaresListener();
  previousListener();
  clearListener();
  saveListener();
  retrieveGamesListener();
}

$(function (){
  attachListeners();
});
