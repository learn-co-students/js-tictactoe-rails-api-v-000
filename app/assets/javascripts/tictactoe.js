var turn = 0;

function attachListeners() {
  $('td').click(doTurn);
}

function doTurn() {
  position = $(this);
  console.log(`${position.data('x')}, ${position.data('y')}`);
  turn++;
  checkWinner();
  updateState(position);
}

function checkWinner() {}

function updateState(position) {
  position.text(player());
}

function player() {
  if (turn % 2 == 0) {
    return 'X';
  }
  else {
    return 'O';
  }
}

$(function() {
  attachListeners();
});
