$(document).ready(function(){
  attachListeners();
});

var winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
var turn = 0, state = [], currentGame;

function attachListeners(){
  $('td').on("click", function(){
    doTurn(this);
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

/// needs to take in the below????
// as in line spec 30 doTurn(myEvent);
// myEvent = $('[data-x="0"][data-y="0"]').click();

function doTurn(td_tag){
  updateState(td_tag);
  checkWinner();
  checkTie();
  if (over()) {
    saveGame();
    resetAndIncrementVars();
    resetHtml();
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

function updateState(td_tag){
  if ($(td_tag).text() === "") {
    $(td_tag).text(player())
    var tds = $('td')
    var board = [];
    for (var count = 0; count < tds.length; count++) {
      board.push(tds[count].innerHTML);
    }
    state = board;
    turn++;
  }
}

function checkWinner(){
  for (var count = 0; count < winningCombos.length; count++) {
    var box0 = winningCombos[count][0];
    var box1 = winningCombos[count][1];
    var box2 = winningCombos[count][2];
    if (state[box0] === state[box1] && state[box1] === state[box2] && state[box2] != "") {
      message(`Player ${state[box2]} Won!`);
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
  // debugger;
  if (turn % 2 === 0 || turn === 0) {
    return "X"
  } else {
    return "O"
  }
}

function message(msg){
  $('#message').text(msg);
}

function seePrevious() {
  var game_lis = ""
  $.get("/games", function(data){
    data["games"].forEach(function(obj){
      game_lis += `<li data-gameid="${obj["id"]}">${obj["id"]}</li>`;
    });
    $('#games').html(game_lis);
  });
}

function saveGame() {
  var url, method ,post_data;
  if (currentGame) {
    url = "/games/" + currentGame;
    method = "PATCH";
    post_data = {"game" : {"id" : currentGame, "state" : state}};
  } else {
    url = "/games";
    method = "POST";
    post_data = {"game" : {"state" : state}};
  }
  debugger;
  $.ajax({
    "url" : url,
    "type" : method,
    "data" : post_data, 
    success : function(response){
      if (over() === true) {
      } else {
        currentGame = response.id;
      }
    }
  });
}

function setTurn(){
  var temp_array = [];
  for (var count = 0; count < state.length; count++) {
    if(state[count] != "") {
      temp_array.push(state[count]);
    }
  }
  turn = temp_array.length;
}

function goToGame(li_tag){
  var game_id = li_tag.innerHTML;
  $.get("/games/" + game_id).done(function(data){
    currentGame = data.id;
    state = data.state;
    setTurn();
    debugger;
    var tds = $('td');
    for (var count = 0; count < tds.length; count++) {
      $(tds[count]).text(state[count]);
    }
  })
}