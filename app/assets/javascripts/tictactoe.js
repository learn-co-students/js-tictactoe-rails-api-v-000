$(document).ready(function(){
  attachListeners();
});

var turn = 0, currentGame = 1, outcome = false;

var winningCombos = [
  [0, 1, 2], 
  [3, 4, 5], 
  [6, 7, 8], 
  [0, 3, 6], 
  [1, 4, 7], 
  [2, 5, 8], 
  [0, 4, 8], 
  [2, 4, 6]
]

function attachListeners(){
  $('td').on("click", function(){
    doTurn(this);
  });
}

function player(){
  if (turn % 2 === 0 || turn === 0) {
    return "X"
  } else {
    return "O"
  }
}

function doTurn(td_tag){
  if (checkWinner() === true) {
    //
  } else {
    updateState(td_tag);
    turn ++;
    checkWinner();
  }
}

function checkWinner(){
  var tds = $('td')
  var state = []
  for (var count = 0; count < tds.length; count++) {
    state.push(tds[count].innerHTML);
  }
  // i.e. state = ["X", "X", "X", "O", "O", "", "", "", ""]
  for (var count = 0; count < winningCombos.length; count++) {
    var box0 = winningCombos[count][0];
    var box1 = winningCombos[count][1];
    var box2 = winningCombos[count][2];
    if (state[box0] === state[box1] && state[box1] === state[box2] && state[box2] != "") {
      outcome = true;
      message(`Player ${state[box2]} Won!`);
    }
  }
  return outcome;
}

function updateState(td_tag){
  $(td_tag).text(player())
}

function message(msg){
  $('#message').text(msg);
}