$(document).ready(function(){
  attachListeners();
});

var turn = 0, currentGame = 1, outcome = false, state = [];
// board and state are the same thing, board is local variable or parameter reping state

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
  updateState(td_tag);
  checkWinner();
  turn ++;
}

function checkWinner(){
  if (state.length > 0) {
    for (var count = 0; count < winningCombos.length; count++) {
      var box0 = winningCombos[count][0];
      var box1 = winningCombos[count][1];
      var box2 = winningCombos[count][2];
      if (state[box0] === state[box1] && state[box1] === state[box2] && state[box2] != "") {
        outcome = true;
        message(`Player ${state[box2]} Won!`);
      } else if (state.includes("") === false) {
        message("Tie game");
      }
    }
  }
  return outcome;
}

function updateState(td_tag){
  $(td_tag).text(player())
  var tds = $('td')
  var board = [];
  for (var count = 0; count < tds.length; count++) {
    board.push(tds[count].innerHTML);
  }
  state = board;
}

function message(msg){
  $('#message').text(msg);
}