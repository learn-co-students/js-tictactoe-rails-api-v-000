var savedGames = [];
var turn = 0;

$(document).ready(function() {
  attachListeners();
});

function player() {
  if(turn % 2 === 0) {
    return 'X';
  } else {
    return 'O';
  }
}

function doTurn(square) {
  var winner = checkWinner();

  if(winner) {
    message();
  } else {
    updateState(square);
    turn++;
  }
}

function attachListeners() {
  $('td').on('click', function() {
    if(turn < 10) {
      doTurn(this);
    } else {
      message("Cat's game!");
    }
  })
}

function checkWinner() {

}

function updateState(square) {
  var token = player();
  $(square).text(token);
}

function message(string) {
  $('#message').text(string);
}