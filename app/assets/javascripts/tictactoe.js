var turn = 0;

var winningCombos =
[[[0,0],[1,0],[2,0]],
[[0,1],[1,1],[2,1]],
[[0,2],[1,2],[2,2]],
[[0,0],[1,1],[2,2]],
[[0,0],[0,1],[0,2]],
[[2,0],[2,1],[2,2]],
[[1,0],[1,1],[1,2]],
[[2,0],[1,1],[0,2]]]

function attachListeners() {
  //$('[data-x="0"][data-y="0"]').click(function() {
  //  doTurn();
  //});
  $('[data-x]').click(function() {
    //var cell = this;
    //debugger;
    doTurn(this);
  });
}

function doTurn(cell) {
  checkWinner();
  updateState(cell);
  //debugger;

  turn += 1;
  //console.log("clicky" + cell);
  //$(this).text("X");
}

function player() {
  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}

function updateState(cell) {
  //debugger;
  if ($(cell).text() === "") {
    $(cell).text(player());
  }
}

function checkWinner() {

}

function message(string) {
  $('#message').text(string);
}

$(document).ready(function() {
  attachListeners();
});
