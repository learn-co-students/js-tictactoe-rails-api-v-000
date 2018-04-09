var turn = 0;
function player() {
  return turn %2 === 0 ? 'X':'O';
}


function updateState(cell) {
  cell.innerHTML = player()
}

function setMessage(string) {
  $('#message').text(string);
}


function checkWinner() {

}

function doTurn() {

}

function attachListeners() {

}
