









// new rule: always always always keep anything you want to do inside of the request i.e. in success of post or patch
// and inside function of get request
// see messycode for old stuff
// http://stackoverflow.com/questions/9158531/jquery-variable-becomes-undefined-for-no-reason





















$(document).ready(function(){
  attachListeners();
});

var winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
var turn = 0, over = false, state = [], currentGame = 0;
// board and state are the same thing, board is local variable or parameter reping state

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
}

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
    // saveGame();
  } else {
    turn ++;
  }
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

function seePrevious() {
  var game_lis = ""
  $.get("/games", function(data){
    data["games"].forEach(function(obj){
      game_lis += `<li><button id="game">${obj["id"]}</button></li>`;
    });
    $('#games').html(game_lis);
  });
}