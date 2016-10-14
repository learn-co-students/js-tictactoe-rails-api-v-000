$(document).ready(function(){
  attachListeners();
});

var turn = 0, over = false, state = [], currentGame = 0;
// board and state are the same thing, board is local variable or parameter reping state


// to dos //
// save game
// set current game
// got to game


var winningCombos = [
  [0, 1, 2], 
  [3, 4, 5], 
  [6, 7, 8], 
  [0, 3, 6], 
  [1, 4, 7], 
  [2, 5, 8], 
  [0, 4, 8], 
  [2, 4, 6]
];



////// tic tac toe related //////

function doTurn(td_tag){
  updateState(td_tag);
  checkWinner();
  gameOver();
}

function updateState(td_tag){
  if ($(td_tag).text() === ""){
    $(td_tag).text(player())
  }
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
      over = true;
      message(`Player ${state[box2]} Won!`);
    } else if (state.includes("") === false) {
      over = true;
      message("Tie game");
    }
  }
  return over;
}

function gameOver(){
  if (over === true) {
    turn = 0;
    over = false;
    state = [];
    var tds = $('td')
    for (var count = 0; count < tds.length; count++) {
      tds[count].innerHTML = "";
    }
    saveGame();
  } else {
    turn ++;
  }
}
var checkDb; 

function setCurrentGame(input){
  $.get("/games", function(data){
    if (data["games"].length > 0) {
      checkDb = data["games"].pop)()["id"];
    }
  });
  temp = input || currentGame || checkDb
  return temp;
}

function player(){
  if (turn % 2 === 0 || turn === 0) {
    return "X"
  } else {
    return "O"
  }
}

function message(msg){
  $('#message').text(msg);
}

/////  persistence etc  /////

function seePrevious() {
  var game_lis = ""
  $.get("/games", function(data){
    data["games"].forEach(function(obj){
      game_lis += `<li><button id="game">${obj["id"]}</button></li>`;
    });
  }).then(function(){
    $('#games').html(game_lis);
  });
}

function saveGame() {
  var post_data = {"game" : {"state" : state}};
  $.ajax("/games", {
    "type" : "GET", 
    success : function(data){
      var game_ids = data["games"].map(function(obj){
        return obj["id"];
      }) || [];
      if (game_ids.includes(currentGame())) {
        debugger;
        $.ajax(`/games/${currentGame() + 1}`, {
          "type" : "PATCH",
          "data" : post_data
        });
      } else {
        debugger;
        $.ajax("/games", {
          "type" : 'POST',
          "data" : post_data 
        });
      }
    }
  })
}

function goToGame(a_tag){
  debugger;
}