var turn = 0;
var currentGame;
var games;

function cellValues(){
  var cellOne = $('[data-x="0"][data-y="0"]').html();
  var cellTwo = $('[data-x="1"][data-y="0"]').html();
  var cellThree = $('[data-x="2"][data-y="0"]').html();
  var cellFour = $('[data-x="0"][data-y="1"]').html();
  var cellFive = $('[data-x="1"][data-y="1"]').html();
  var cellSix = $('[data-x="2"][data-y="1"]').html();
  var cellSeven = $('[data-x="0"][data-y="2"]').html();
  var cellEight = $('[data-x="1"][data-y="2"]').html();
  var cellNine = $('[data-x="2"][data-y="2"]').html();
  values = [cellOne, cellTwo, cellThree, cellFour, cellFive, cellSix, cellSeven, cellEight, cellNine]
  return values;
}

function matchValues(values){
  if ( values[0] === player() && values[1] === player() && values[2] === player() ){
    return true;
  } else if ( values[3] === player() && values[4] === player() && values[5] === player() ) {
    return true;
  } else if ( values[6] === player() && values[7] === player() && values[8] === player() ){
    return true;
  } else if ( values[0] === player() && values[3] === player() && values[6] === player() ){
    return true;
  } else if ( values[1] === player() && values[4] === player() && values[7] === player() ){
    return true;
  } else if ( values[2] === player() && values[5] === player() && values[8] === player() ){
    return true;
  } else if ( values[0] === player() && values[4] === player() && values[8] === player() ){
    return true;
  } else if ( values[2] === player() && values[4] === player() && values[6] === player() ){
    return true;
  } else {
    return false;
  }
}

function attachListeners() {
  $('td').click(function(){
    doTurn(this);
  });
  $('#previous').click(function(){
    previousGame();
  });
  $('#save').click(function(){
    saveGame();
  });
  $('#games').click(function(){
    switchGame();
  });
}

function doTurn(event){
  updateState(event);
  if ( checkWinner() == true ) {
    debugger
    resetGame();
  } else if ( checkTie() == true ) {
    resetGame();
  } else {
    turn += 1;
  }
}

function updateState(event){
  if ( $(event).html() === "" ) {
    $(event).html(player());
  }
}

function checkWinner(){
  var values = cellValues();
  if ( matchValues(values) == true ) {
    var winMessage = "Player " + player() + " Won!"
    message(winMessage);
    return true;
  } else {
    return false;
  }
}

function checkTie(){
  var values = cellValues();
  if ( matchValues(values) == false && $.inArray("", values) == -1) {
    var tieMessage = "Tie game"
    message(tieMessage);
    return true;
  } else {
    return false;
  }
}

function player(){
  if ( turn % 2 == 0 ){ 
    return "X";
  } else {
    return "O";
  }
}

function message(message){
  $('#message').html(message);
}

function resetGame(){
  turn = 0;
  saveGame();
  currentGame += 1;
  $('#currentGame').html(currentGame);
  $('#gamesCount').html(currentGame - 1);
  $('td').html("");
}

function saveGame(){
  if (games[currentGame-1] !== undefined && currentGame === games[currentGame-1].id) {
    updateGame();
  } else {
    var stateValues = cellValues()
    $.ajax({
      url: '/games',
      method: 'post',
      dataType: "json",
      data: {
        game: {
          state: stateValues
        }
      }
    }).done(function(response){
      $('#games ul').append('<li [data-gameid="' + response.id+'"]>' + response.id+ '</li>')
      currentGame = response.id;
    });
  } 
}

function updateGame(){
  $.ajax({
    url: '/games/' + currentGame,
    method: 'PATCH',
    dataType: "json",
    data: {
      game: {
        state: cellValues(),
        id: currentGame,
      }
    }
  }).done(function(response){
    currentGame = response.id;
  });
}

function previousGame(){
  $.ajax({
      url: '/games',
      method: 'get',
      dataType: "json"
    }).done(function(response){
      listGames(response.games)
    });
}

function getGames(){
  $.get('/games').done(function(response){
     $('#currentGame').html(response.games.length + 1)
     $('#gamesCount').html(response.games.length );
     currentGame = response.games.length + 1;
     games = response.games;
  });
}

function listGames(games) {
  $('#games ul').html("");
  for (var i = 0; i < games.length ; i++) {
    $('#games').append('<li [data-gameid="' + games[i].id +'"]>' + games[i].id + '</li>');
  }
}

function switchGame (){
  var game = $(event.target).html();
  $.ajax({
      url: '/games/' + game,
      method: 'get',
      dataType: "json",
    }).done(function(response){
      setGame(response);
      $('#currentGame').html(response.id);
      currentGame = response.id;
    });
}

function setGame(game){
  $('[data-x="0"][data-y="0"]').html(game.state[0]);
  $('[data-x="1"][data-y="0"]').html(game.state[1]);
  $('[data-x="2"][data-y="0"]').html(game.state[2]);
  $('[data-x="0"][data-y="1"]').html(game.state[3]);
  $('[data-x="1"][data-y="1"]').html(game.state[4]);
  $('[data-x="2"][data-y="1"]').html(game.state[5]);
  $('[data-x="0"][data-y="2"]').html(game.state[6]);
  $('[data-x="1"][data-y="2"]').html(game.state[7]);
  $('[data-x="2"][data-y="2"]').html(game.state[8]);
}

$(document).ready(function() {
  attachListeners();
  getGames();
});