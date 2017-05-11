function message(text){
  $("#message").text(text);
}

function player(){
  var token = (turn%2) ? "O" : "X";
  return token;
}

function newBoard(){
  var slots = $('td');
  $.each(slots, function(index, slot){
    $(slot).text('');
  });
  board = new Array(9);
  board.fill('')
}

function slotNumber(slotHTML){
  var x = parseInt($(slotHTML).data("x"));
  var y = parseInt($(slotHTML).data("y"));
  var number = x+(y*3);
  return number;
}

function comboPresent(combo){
  var token = board[combo[0]];
  var allSame = (board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]);
  if(allSame && token!==''){
    winner = token;
    return true;
  } else { return false; }
}

function checkWinner(){
  var winningCombo = winCombos.find(function(combo){
    return comboPresent(combo);
  });
  console.log(winningCombo);
  if(winningCombo!==undefined){
    message("Player " + winner + " Won!");
    console.log("A WIN!")
    persistGame();
    return true;
  } else {return false;}
}

function checkTie(){
  if (winner===''&&turn>=8) {
    message('Tie game');
    console.log("A TIE")
    persistGame();
    return true;
  } else {return false;}
}

function updateState(slot, token){
  if ($(slot).text()===''){
    $(slot).text(token);
    board[ slotNumber(slot) ] = token;
    return false;
  } else {return true;}
}

function doTurn(slot){
  var hasBeenPressedBefore = updateState(slot, player());
  if (!hasBeenPressedBefore){
    if (checkWinner() || checkTie()) { newGame();} 
    else { turn+=1;}
  }
}

function boardToJson(){ return JSON.stringify({game:{state:board}}); }

function attachListeners() {
  $('td').click(function(){
    doTurn(this);
  });

  $('#save').click(function(){
    persistGame();
  });

  $('#previous').click(function(){
    getPreviousGames();
  });
}

function currentGame(){ return id }

function refreshBoardHtml(){
  $('td').each(function(index, slot){
    var token = board[index];
    $(this).text(token);
  });
}

function loadGame(gameId){
  $.get('/games/'+gameId).success(function(data){
    id=data.game.id;
    board=data.game.state;
    turn=turnCount();
    refreshBoardHtml();
  });
}

function persistGame() {
  currentBoard=boardToJson()
  if(id===null) {
    $.ajax({
      type: "POST",
      url: '/games',
      async: false,
      data: currentBoard,
      success: function(data){
        id = data["game"]["id"];
        console.log("Game created at id: "+id);
      },
      contentType : 'application/json',
      dataType: 'json'
    });
  } else {
    $.ajax({
      url : '/games/'+id,
      data : currentBoard,
      async: false,
      type : 'PATCH',
      success: function(data){ if (data['saved']==true){console.log("Game saved to id: "+id); }
      },
      contentType : 'application/json',
      dataType: 'json'
    });
  }
}

function displayPreviousGame(game){
  var gameBody=game.state.join(', ');
  var gameHtml = $('<div>'+gameBody+'<br></div>');
  $(gameHtml).attr('data-gameid', game.id);
  $('#games').prepend(gameHtml);
  $(gameHtml).click(function(){
    loadGame(game.id);
  });
}

function getPreviousGames(){
  $.get('/games').success(function(data){
    $('#games').text('');
    data.games.forEach(function(game){
      displayPreviousGame(game);
    })
  });
}

function turnCount(){
  var occupied_slots=0;
  board.forEach(function(slot){
    if(slot!==''){occupied_slots+=1;}
  });
  return occupied_slots;
}

function newGame() {
  newBoard();
  id=null;
  turn=0;
  winner = '';
  persistGame()
}

$( document ).ready(function() {
    console.log( "ready!" );
    attachListeners();
    winCombos = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [6,4,2] ];
    newGame();
});