var turn = 0;

function attachListeners() {
  $('td').on("click", function() {
    var position = $(this);
    doTurn(position);
    if (turn === 9 && checkWinner() === false)
    {
      message('Tie game');
      resetBoard();
      turn = 0;
    }
  });
}

function checkWinner() {
  var WINNING_POSITIONS = [
    ['{"x": "0", "y": "0"}','{"x": "1", "y": "0"}', '{"x": "2", "y": "0"}'],
    ['{"x": "0", "y": "1"}','{"x": "1", "y": "1"}', '{"x": "2", "y": "1"}'],
    ['{"x": "0", "y": "2"}','{"x": "1", "y": "2"}', '{"x": "2", "y": "2"}'],
    ['{"x": "0", "y": "0"}','{"x": "0", "y": "1"}', '{"x": "0", "y": "2"}'],
    ['{"x": "1", "y": "0"}','{"x": "1", "y": "1"}', '{"x": "1", "y": "2"}'],
    ['{"x": "2", "y": "0"}','{"x": "2", "y": "1"}', '{"x": "2", "y": "2"}'],
    ['{"x": "0", "y": "0"}','{"x": "1", "y": "1"}', '{"x": "2", "y": "2"}'],
    ['{"x": "2", "y": "0"}','{"x": "1", "y": "1"}', '{"x": "0", "y": "2"}']
  ];

  var win = false;
  WINNING_POSITIONS.forEach(function(combo) {
    var combo0x = JSON.parse(combo[0])["x"]
    var combo0y = JSON.parse(combo[0])["y"]

    var combo1x = JSON.parse(combo[1])["x"]
    var combo1y = JSON.parse(combo[1])["y"]

    var combo2x = JSON.parse(combo[2])["x"]
    var combo2y = JSON.parse(combo[2])["y"]
    if
    (
      (
        $('td[data-x="' + combo0x + '"][data-y="' + combo0y + '"]').html() !== '' &&
        $('td[data-x="' + combo1x + '"][data-y="' + combo1y + '"]').html() !== '' &&
        $('td[data-x="' + combo2x + '"][data-y="' + combo2y + '"]').html() !== ''
      )
      &&
      (
        ($('td[data-x="' + combo0x + '"][data-y="' + combo0y + '"]').html() === $('td[data-x="' + combo1x + '"][data-y="' + combo1y + '"]').html()) &&
        ($('td[data-x="' + combo1x + '"][data-y="' + combo1y + '"]').html() === $('td[data-x="' + combo2x + '"][data-y="' + combo2y + '"]').html())
      )
    )
    {
      win = true
      // console.log(win);
    }
  });

return win;
}

function player() {
  if (turn % 2 === 0) {
    return 'X';
  } else {
    return 'O';
  }
}



function doTurn(position) {
    var position = position;
    if ($(position).html() === '') {
      updateState(position);
      if (checkWinner() === true) {
        var winner = player();
        message("Player " + winner + " Won!");
        turn = 0;
        resetBoard();
  } else if (turn < 9) {
      turn += 1;
  }
}
}

function updateState(position) {
  var player = this.player();
  $(position).html(player);
}

function resetBoard() {
  $('td[data-x="0"][data-y="0"]').html('');
  $('td[data-x="1"][data-y="0"]').html('');
  $('td[data-x="2"][data-y="0"]').html('');
  $('td[data-x="0"][data-y="1"]').html('');
  $('td[data-x="1"][data-y="1"]').html('');
  $('td[data-x="2"][data-y="1"]').html('');
  $('td[data-x="0"][data-y="2"]').html('');
  $('td[data-x="1"][data-y="2"]').html('');
  $('td[data-x="2"][data-y="2"]').html('');
}

function message(msg) {
  $("#message").text(msg);
}

$(document).ready(function() {
  attachListeners();
});
