$(function() {
  attachListeners();
})

function attachListeners() {
  $("td").click(function(event) {
    doTurn(event);
  })
}

function doTurn() {
  var turn = 0;
  // check for validity of move then update game state
  // check for winner
  turn++;
}

function checkWinner() {

}

function updateState() {

}

function player() {
  if (turn % 2 == 0) {
    return 'X'; //X is first player
  } else {
    return 'O';
  }
}

function message() {

}