var turn = 0;

var doTurn = function(this) {
  turn += 1;
  updateState(this);
  checkWinner();
}

var attachListeners = function() {
  $('td').click(function() {
    doTurn(this);
}

var player = function() {

}

var updateState = function() {

}

var checkWinner = function() {

}

var message = function() {

}


$(document).ready(function() {
  attachListeners();
});
$(this).text('O');
