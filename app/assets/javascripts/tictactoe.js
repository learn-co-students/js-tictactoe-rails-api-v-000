var turn = 0;

$(document).ready(function() {
  attachListeners();
});

function player() {
  if (turn % 2 === 0)
    return "X";
  else
    return "O";
}

function updateState(square) {
  var token = player();
  $(square).text(token);
}

function setMessage(message) {
  $("div#message").text(message)
}

function checkWinner() {
  const WIN_COMBOS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  var winner = false;
  const squares = document.querySelectorAll('td');
  var board = Array.from(squares).map(s => s.innerHTML);
  WIN_COMBOS.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });
  return winner;
}

function doTurn(square) {
  updateState(square);
  turn += 1;
  if (checkWinner()) {
    turn = 0;
    $('td').empty(); // this is the board
  } else if (turn === 9) {
    setMessage("Tie game.");
    turn = 0;
    $('td').empty();
  }
}

function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  })

  $('#clear').click(function() {
    turn = 0;
    $('td').empty();
  });

  $('#save').click(saveGame());
  $('#previous').click(previousGame());
}

function previousGame() {
  $.ajax({
    method: 'GET',
    url: '/games',
  })
}

function saveGame() {
  $.ajax({
    method: 'POST',
    url: '/games',
  })
}
