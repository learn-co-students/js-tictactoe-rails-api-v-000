var turn = 0;

function attachListeners() {
  var cells = document.getElementsByTagName("td");
    for (i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", function(event) {
          event.preventDefault();
          doTurn(event);
        });
    }
}

function doTurn(event) {
  turn++;
  updateState(event);
  checkWinner();
}

function player() {
  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}

function updateState(event) {
  var playerToken = player();
  var cell = event.currentTarget;
  cell.html(playerToken);
}

function message() {

}

function checkWinner() {

}

$(document).ready(function () {
  attachListeners();
});


