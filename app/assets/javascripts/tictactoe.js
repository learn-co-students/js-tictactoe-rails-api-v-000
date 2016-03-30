var turn = 0;
var board = [[null, null, null], [null, null, null], [null, null, null]];
const WINNERS = [
  [[0,0], [1,0], [2,0]],
  [[0,1], [1,1], [2,1]],
  [[0,2], [1,2], [2,2]],
  [[0,0], [0,1], [0,2]],
  [[1,0], [1,1], [1,2]],
  [[2,0], [2,1], [2,2]],
  [[0,0], [1,1], [2,2]],
  [[0,2], [1,1], [2,0]]
];

var attachListeners = function() {
  $("tbody").click(function(event){
    doTurn(event)
  });
}

var doTurn = function(event) {
  console.log(event);
  var coords = [parseInt(event.target.dataset["x"]), parseInt(event.target.dataset["y"])];
  $('#message').text('');
  if (event.target.textContent.length > 0) {
    $("#message").text("Try another move");
  } else {
    updateState(coords, event);
    var winner = checkWinner();
    turn++;
  }
}

var updateState = function(coords, event) {
  $(event.target).text(player());
  board[coords[0]][coords[1]] = player();
}

var checkWinner = function(){
  var win = false;
  WINNERS.forEach(function(winner){
    if(board[winner[0][0]][winner[0][1]] == board[winner[1][0]][winner[1][1]] && board[winner[2][0]][winner[2][1]] == board[winner[1][0]][winner[1][1]] && board[winner[0][0]][winner[0][1]] != null) {
      win = player();
    }
  });
  console.log("checking winner");
  if(win){
    message("Player " + win + " Won!");
    reset_board();
  }
  if ([].concat.apply([], board).includes(null)){
    return win;
  } else {
    message("Tie game");
    reset_board();
  }
}

var player = function(){
  if (turn % 2 == 0) {
    return "X";
  } else {
    return "O";
  }
}

var message = function(msg) {
  $('#message').text(msg);
}

var reset_board = function() {
    board = [[null, null, null], [null, null, null], [null, null, null]];
    $("td").text("");
    turn = -1;
    console.log("Resetting turn = " + turn);
}

$(document).ready(function(){
  attachListeners();
});
