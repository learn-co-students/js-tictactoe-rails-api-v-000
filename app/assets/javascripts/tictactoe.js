$(function() {
  // call function attachListeners after DOM loaded
  attachListeners();
});

var turn = 0;

var attachListeners = function() {
  // call function doTurn and pass param of the event
  $('td').on('click', function(e) {
    doTurn(e);
  });
};

var doTurn = function(e) {
  // increment variable turn by one
  turn += 1;
  // call function updateState and pass param of the event
  updateState(e);
  // call function checkWinner
  checkWinner();
};

var player = function() {
  // if turn is even, return X as string, else return O as string
};

var updateState = function(e) {
  // call function player, which provides return value, add return value to clicked cell
};

var checkWinner = function() {
  // evaluate board to see if winner

  // if winner, return either "Player X Won!" or "Player O Won!", pass string to function message
};

var message = function(string) {
  // add string to div with id of message
}

