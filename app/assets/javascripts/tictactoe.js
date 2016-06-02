var currentGame = 0;
var turn = 0;

var winningCombinations = [
    [[0,0],[1,0],[2,0]],
    [[0,1],[1,1],[2,1]],
    [[0,2],[1,2],[2,2]],
    [[0,0],[1,1],[2,2]],
    [[0,0],[0,1],[0,2]],
    [[2,0],[2,1],[2,2]],
    [[1,0],[1,1],[1,2]],
    [[2,0],[1,1],[0,2]]
  ];


function resetBoard() {
  turn = 0;
  currentGame = 0;
  $("td").each(function(index, td){
  $(td).text("");
  });
}

function attachListeners(){
    $('td').click(function(event){
      doTurn(event);
    })
  }

function doTurn(event){
  updateState(event);
  if (checkWinner() === true) {resetBoard();}
  else {
  turn += 1;}
}

function updateState(event){
    $(event.target).text(player());
}
//
function player(){
  return (turn % 2) ? "O" : "X";
}

function checkWinner(){
  var tie = $('td').filter(function(index, char){return $(char).text() === ""});
  var winner = winningCombinations.filter(function(combo) {
  return ($('td[data-x=' + combo[0][0] + '][data-y=' + combo[0][1] + ']').text() === player()) &&
  ($('td[data-x=' + combo[1][0] + '][data-y=' + combo[1][1] + ']').text() === player()) &&
  ($('td[data-x=' + combo[2][0] + '][data-y=' + combo[2][1] + ']').text() === player());
  });
  if (tie.length === 0) {
    message("Tie game");
    return true;
    // resetBoard();
  }
  else if (winner.length > 0) {
    message("Player " + player() + " Won!");
    return true;
    // resetBoard();
  }
  else { return false;}
}


function message(string) {
  $('#message').text(string);
}

$('document').ready(function(){

  attachListeners();

});
