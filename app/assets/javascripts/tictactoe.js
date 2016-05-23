var turn = 0;

var selector = [
  '[data-x="0"][data-y="0"]',
  '[data-x="1"][data-y="0"]',
  '[data-x="2"][data-y="0"]',
  '[data-x="0"][data-y="1"]',
  '[data-x="1"][data-y="1"]',
  '[data-x="2"][data-y="1"]',
  '[data-x="0"][data-y="2"]',
  '[data-x="1"][data-y="2"]',
  '[data-x="2"][data-y="2"]'
]
var winning_combos = [
  //ACROSS
  [selector[0], selector[1], selector[2]],
  [selector[3], selector[4], selector[5]],
  [selector[6], selector[7], selector[8]],
  //DOWN
  [selector[0], selector[3], selector[6]],
  [selector[1], selector[4], selector[7]],
  [selector[2], selector[5], selector[8]],
  //DIAG
  [selector[0], selector[4], selector[8]],
  [selector[2], selector[4], selector[6]]
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
  selector.forEach(function(selector) {
    $(selector).click(function(data) { doTurn(this) });
  });
}

function reset() {
  turn = 0;
  selector.forEach(function(selector) {
    $(selector).text('').val('');
  });
}

function message(message) {
  $("#message").text(message).fadeOut(5000);
}

$(document).ready(function(event) {
  attachListeners();
})
