var turn = 0;
var state = ["", "", "", "", "", "", "", "", ""];

var winningCombos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

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
  var bool = (checkWinner() || checkTied());
  console.log(bool);
  if (checkWinner() || checkTied()) {
    // resetBoard();
  };
  // console.log(turn);
  turn++;
}

function resetBoard() {
  alert("hello");
  turn = 0;
}

function checkTied() {
  if (turn == 8) {
    message("Tie game");
    state = ["", "", "", "", "", "", "", "", ""];
    $('td').html("")
    return true;
  } else {
    return false;
  }
}

function checkWinner() {

  for (i = 0; i < winningCombos.length; i++) {
    if(isThisWinningCombo(winningCombos[i]) === true) {
      message('Player '+ player() +' Won!');
      return true;
    }
  }
  return false;
}

function addX(selector) {
  if (selector.dataset.x == "1") {
    return 1;
  } else if (selector.dataset.x == "2") {
    return 2;
  } else {
    return 0;
  }
}

function updateState(selector) {
  var id = 0; //finding index for state array from td data-x and data-y
  if (selector.dataset.y == "1") {
    id += 3;
    id += addX(selector);
  } else if (selector.dataset.y == "2") {
    id += 6;
    id += addX(selector);
  } else {
    id += addX(selector);
  }
  state[id] = player();
  // console.log(state);
  $(selector).html(player());
}

function player() {
  if (turn%2 == 0) {
    return "X";
  }  else {
    return "O";
  }
}



function isThisWinningCombo(combo) {
  return state[combo[0]] === state[combo[1]] && state[combo[1]] === state[combo[2]] && state[combo[0]] != "";
}

$(document).ready(function(){
  attachListeners();
});
