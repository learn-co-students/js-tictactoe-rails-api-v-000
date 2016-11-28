var turn = 0;
var state = ["", "", "", "", "", "", "", "", ""];

var winCombinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

function message(string) {
  $("#message").html(string);
}


function attachListeners() {
  $('td').on('click', function(){
    var selector = this;
    doTurn(selector);
  });
}

function doTurn(selector) {
  updateState(selector);
  if(checkWinner()) {

    turn =0;
  } else {

  }
  turn++;
  console.log(turn);
}

function checkWinner() {

  if (winCombinations.some(isThereWinningCombo)) {
    return true;
  } else {
    return false;
  }
  message('Player '+ player() +' Won!');
}


function updateState(selector) {
  state[parseInt(selector.id)] = player();
  console.log(state);
  $(selector).html(player());
}

function player() {
  if (turn%2 == 0) {
    return "X";
  }  else {
    return "O";
  }
}



function isThereWinningCombo(combo) {
  return state[combo[0]] === state[combo[1]] && state[combo[1]] === state[combo[2]] && state[combo[0]] != "";
}

$(document).ready(function(){
  attachListeners();
});
