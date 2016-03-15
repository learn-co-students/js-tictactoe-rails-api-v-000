//var board = [" ", " ", " ", " ", " ", " ", " ", " ", " "]

var turn = 0;

var winningCombos = [
  ['[data-x="0"][data-y="0"]','[data-x="1"][data-y="0"]','[data-x="2"][data-y="0"]'], //[[0,0],[1,0],[2,0]],
  ['[data-x="0"][data-y="1"]','[data-x="1"][data-y="1"]','[data-x="2"][data-y="1"]'], //[[0,1],[1,1],[2,1]],
  ['[data-x="0"][data-y="2"]','[data-x="1"][data-y="2"]','[data-x="2"][data-y="2"]'], //[[0,2],[1,2],[2,2]],
  ['[data-x="0"][data-y="0"]','[data-x="1"][data-y="1"]','[data-x="2"][data-y="2"]'], //[[0,0],[1,1],[2,2]],
  ['[data-x="0"][data-y="0"]','[data-x="0"][data-y="1"]','[data-x="0"][data-y="2"]'], //[[0,0],[0,1],[0,2]],
  ['[data-x="2"][data-y="0"]','[data-x="2"][data-y="1"]','[data-x="2"][data-y="2"]'], //[[2,0],[2,1],[2,2]],
  ['[data-x="1"][data-y="0"]','[data-x="1"][data-y="1"]','[data-x="1"][data-y="2"]'], //[[1,0],[1,1],[1,2]],
  ['[data-x="2"][data-y="0"]','[data-x="1"][data-y="1"]','[data-x="0"][data-y="2"]']  //[[2,0],[1,1],[0,2]]
];


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
  updateState(cell);
  checkWinner();
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
  $.each(winningCombos, function (index, combo) {
    //debugger;
    if ($(combo[0]).text() === player() && $(combo[1]).text() === player() && $(combo[2]).text() === player()) {
      //debugger;
      return message("Player " + player() + " Won!");
    }
  });
  return false;
}

function message(string) {
  $('#message').text(string);
}

$(document).ready(function() {
  attachListeners();
});
