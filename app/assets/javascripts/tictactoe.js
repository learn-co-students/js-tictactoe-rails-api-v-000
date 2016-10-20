$(document).ready(function(){
  attachListeners();
});

var winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
var turn = 0, state = [], currentGame;

function attachListeners(){
  $('td').on("click", function(event){
    doTurn(event);
  });
  $('#previous').on("click", function(){
    seePrevious();
  });
  $('#save').on("click", function(){
    saveGame();
  });
  $('#games').on("click", function(event){
    goToGame(event.target);
  });
}

function doTurn(event){
  updateState(event);
  if (checkWinner()){
    saveGame(true);
    resetAndIncrementVars();
    resetHtml();
  } else {
    turn++;
  }
}

function resetAndIncrementVars(){
  state = [];
  turn = 0;
  currentGame = 0;
}

function resetHtml(){
  var tds = $('td')
  for (var count = 0; count < tds.length; count++) {
    tds[count].innerHTML = "";
  }  
}

function updateState(event){
  $(event.target).text(player())
  var tds = $('td')
  var board = [];
  for (var count = 0; count < tds.length; count++) {
    board.push(tds[count].innerHTML);
  }
  state = board;
}

function checkWinner(){
  for (var count = 0; count < winningCombos.length; count++) {
    var box0 = winningCombos[count][0];
    var box1 = winningCombos[count][1];
    var box2 = winningCombos[count][2];
    if (state[box0] === state[box1] && state[box1] === state[box2] && state[box2] != "") {
      message("Player " + state[box2] + " Won!");
      return true;
    } else if (checkTie()) {
      message("Tie game");
      return true;
    }
  }
  return false;
}

function checkTie(){
  if (state.includes("")){
    return false;
  } else {
    message("Tie game");
    return true;
  }
}

function over(){
  if (checkWinner() || checkTie()){
    return true;
  } else {
    return false;
  }
}

function player(){
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function message(msg){
  $('#message').text(msg);
}

function seePrevious() {
  var game_lis = "";
  $.ajax({
    "url" : "/games", 
    "type" : "GET",
    "dataType" : "json",
    success : function(data){
      var games_array = data.games;
      for (var count = 0; count < games_array.length; count ++) {
        game_lis += "<li data-gameid='" + games_array[count].id + "'>" + games_array[count].id + "</li>";
      }
      $('#games').html(game_lis);
    }
  })
}

function saveGame(resetCurrentGame = false) {
  var url, method ,post_data;
  if (currentGame) {
    url = "/games/" + currentGame;
    method = "PATCH";
    post_data = {"game" : {"id" : currentGame, "state" : state}};
  } else {
    url = "/games";
    method = "POST";
    post_data = {"game" : {"id" : currentGame, "state" : state}};
  }
  $.ajax({
    "url" : url,
    "type" : method,
    "data" : post_data, 
    "dataType" : "json",
    success : function(response, text, xhr){
      if (resetCurrentGame) {
        currentGame = undefined;
      } else {
        currentGame = response.game.id || response.id;
      }
    }
  });
}

function setTurn(){
  var temp_array = [];
  for (var count = 0; count < state.length; count++) {
    if (state[count] != "") {
      temp_array.push(state[count]);
    }
  }
  turn = temp_array.length;
}

function goToGame(li_tag){
  var game_id = li_tag.innerHTML;
  $.ajax({
    "type" : "GET",
    "dataType" : "json",
    "url" : "/games/" + game_id,
    success : function(data) {
      currentGame = data.games.id;
      state = data.games.state;
      setTurn();
      var tds = $('td');
      for (var count = 0; count < tds.length; count++) {
        $(tds[count]).text(state[count]);
      }
    }
  })
}