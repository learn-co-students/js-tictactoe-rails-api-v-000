$(function(){
  attachListeners();
});

var turn = 0;
var currentGame = 0;
var winCombos = {
  [[0,0], [1,0], [2,0]],
  [[0,1], [1,1], [2,1]],
  [[0,2], [1,2], [2,2]],
  [[0,0], [1,1], [2,2]],
  [[0,0], [0,1], [0,2]],
  [[1,0], [1,1], [1,2]],
  [[2,0], [1,1], [0,2]],
  [[2,0], [2,1], [2,2]]
};

var attachListeners = function(){
  $('td').click(function(event){
    doTurn(event);
  });
  $('#games').click(function(event){
    var state = parseState(event);
    changeGame(state, getGameId(event));
  });
  $('#save').click(function(){
    saveGame();
  });
  $('#previous').click(function(){
    getGames();
  });
};

var doTurn = function(event){
  updateState(event);
  if(checkWinner() || checkTie()){
    saveGame(true);
    resetGame();
  }
  else {
    turn++;
  }
};

var updateState = function(event){
  var token = player();
  $(event.target).html(token);
};

var checkWinner = function(){
  for(var i = 0; i < winningCombos.length; i++){
    if(checkCells(winningCombos[i]) == true){
      message("Player " + player() + " has won.");
      return true;
    }
  }
  return false;
};

var checkTie = function(){
  var tie = true;
  $('td').each(function(){
    if($(this).html().length <= 0){
      tie = false;
    }
  });
  if(tie){
    message("Tie game.");
  }
  return tie;
};

var saveGame = function(resetGame){
  if(currentGame){
    var url = '/games/' + currentGame;
    var method = 'PATCH';
  }
  else {
    var url = '/games';
    var method = 'POST';
  }

  $.ajax({
    url: url,
    method: method,
    dataType: 'json',
    data: {
      game: {
        state: getPositions();
      }
    },
    success: function(data){
      if(resetGame){
        currentGame = 0;
      }
      else {
        currentGame = data.game.id;
      }
    }
  })
};

var resetGame = function(){
  $('td').html('');
  turn = 0;
  currentGame = 0;
};

var checkCells = function(winningCombos){
  for(var i = 0; i < winningCombos.length; i++){
    var winningCombo = winningCombos[i];
    var x = winningCombo[0];
    var y = winningCombo[1];
    var selector = $('[data-x="' + x + '"][data-y="' + y + '"]')
    if(noMatch(selector)){
      return false;
    }
  }
  return true;
};

var noMatch = function(cell){
  return (cell.html() != player())
};

var player = function(){
  if (turn % 2 === 0){
    return "X";
  }
  else {
    return "O";
  }
};

var message = function(string){
  $('#message').html(string);
};

var getPositions = function(){
  var positions = [];
  $('td').each(function(i){
    positions.push($(this).text())
  })
  return positions;
};

var parseState = function(event){
  return $(event.target).data("state").split(",");
};

var changeGame = function(state, id){
  setPosition(state);
  currentGame = id;
  turn = findTurn(state);
};

var setPosition = function(positions){
  $('td').each(function(i){
    $(this).text(positions[i]);
  });
};

var findTurn = function(state){
  var turn = 0;
  state.forEach(function(item){
    if(item != ""){
      turn++;
    }
  });
  return turn;
};

var getGameId = function(event){
  return $(event.target).data("gameid");
};

var getGames = function(){
  $.getJSON("/games").done(function(response){
    showGames(response.games);
  });
};

var showGames = function(games){
  var board = $();
  games.forEach(function(game){
    board = board.add(cell(game));
  });
  $('#games').html(board);
};

var cell = function(game){
  return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: game.id});
};
