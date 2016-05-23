var turn = 0;
var winning_combos = [
  //ACROSS
  ['[data-x="0"][data-y="0"]', '[data-x="1"][data-y="0"]', '[data-x="2"][data-y="0"]'],
  ['[data-x="0"][data-y="1"]', '[data-x="1"][data-y="1"]', '[data-x="2"][data-y="1"]'],
  ['[data-x="0"][data-y="2"]', '[data-x="1"][data-y="2"]', '[data-x="2"][data-y="2"]'],

  //DOWN
  ['[data-x="0"][data-y="0"]', '[data-x="0"][data-y="1"]', '[data-x="0"][data-y="2"]'],
  ['[data-x="1"][data-y="0"]', '[data-x="1"][data-y="1"]', '[data-x="1"][data-y="2"]'],
  ['[data-x="2"][data-y="0"]', '[data-x="2"][data-y="2"]', '[data-x="2"][data-y="2"]'],

  //DIAG
  ['[data-x="0"][data-y="0"]', '[data-x="1"][data-y="1"]', '[data-x="2"][data-y="2"]'],
  ['[data-x="0"][data-y="2"]', '[data-x="1"][data-y="1"]', '[data-x="2"][data-y="0"]']
]

function doTurn(selector) {
  updateState(selector);
  turn += 1;
  checkWinner();
}

function player() {
  return (turn % 2) == 0 ? "X" : "O";
}

function checkWinner() {
  var winner = ''

  winning_combos.find(function(combo) {
    if($(combo[0]).val() === $(combo[1]).val() && $(combo[1]).val() === $(combo[2]).val()) {
      winner = $(combo[0]).val();
    }
  });
  if(turn === 9 && winner === '') {
    message('Tie game');
    reset();
    return;
  } else if(winner === "O") {
    message('Player O Won!');
    reset();
    return;
  } else if(winner === "X") {
    message('Player X Won!');
    reset();
    return;
  } else {
    return false;
  }
}

function currentGame() {

}

function updateState(selector) {
  $(selector).text(player()).val(player());
}

function attachListeners() {
 $('[data-x="0"][data-y="0"]').click(function(data) { doTurn(this) });
 $('[data-x="1"][data-y="0"]').click(function(data) { doTurn(this) });
 $('[data-x="2"][data-y="0"]').click(function(data) { doTurn(this) });

 $('[data-x="0"][data-y="1"]').click(function(data) { doTurn(this) });
 $('[data-x="1"][data-y="1"]').click(function(data) { doTurn(this) });
 $('[data-x="2"][data-y="1"]').click(function(data) { doTurn(this) });

 $('[data-x="0"][data-y="2"]').click(function(data) { doTurn(this) });
 $('[data-x="1"][data-y="2"]').click(function(data) { doTurn(this) });
 $('[data-x="2"][data-y="2"]').click(function(data) { doTurn(this) });
}

function reset() {
  turn = 0;
  $('[data-x="0"][data-y="0"]').text('').val('');
  $('[data-x="1"][data-y="0"]').text('').val('');
  $('[data-x="2"][data-y="0"]').text('').val('');
  $('[data-x="0"][data-y="1"]').text('').val('');
  $('[data-x="1"][data-y="1"]').text('').val('');
  $('[data-x="2"][data-y="1"]').text('').val('');
  $('[data-x="0"][data-y="2"]').text('').val('');
  $('[data-x="1"][data-y="2"]').text('').val('');
  $('[data-x="2"][data-y="2"]').text('').val('');
}

function message(message) {
  $("#message").text(message).fadeOut(5000);
}

$(document).ready(function(event) {
  attachListeners();
})
