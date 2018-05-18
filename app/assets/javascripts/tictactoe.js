$(function () {
  turn = 0;
  attachListeners();
});

function player() {
  if (turn % 2 == 0) {
    return 'X'
  }
  else {
    return 'O'
  }
}

function updateState(target) {
  console.log(target)
  //.dataset.x
  // Invokes player() and adds the returned string ('X' or 'O') to the clicked square on the game board.
  $(target).html(player())
}

function setMessage(message) {
  $("#message").html(message);
}

function checkWinner() {
  if (winningCombination()) {
    console.log("someone won")
  }
  else {
    console.log("no winning combo")
  }
}

function winningCombination() {
  return false;
}

function doTurn(event) {
  updateState(event.target);
  checkWinner();
  turn += 1;
}

function attachListeners() {
  $("tbody").on("click", "td", doTurn)
}
