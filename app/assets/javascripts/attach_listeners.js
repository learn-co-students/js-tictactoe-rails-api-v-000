
var turn = 0;
var gameState = ['', '', '', '', '', '', '', '', ''];
var winningCombos = [[[0,0], [1,0], [2,0]], [[0,1], [1,1], [2,1]], [[0,2], [1,2], [2,2]],
                     [[0,0], [0,1], [0,2]], [[1,0], [1,1], [1,2]], [[2,0], [2,1], [2,2]],
                     [[0,0], [1,1], [2,2]], [[0,2], [1,1], [2,0]]];

function attachListeners() {
  $("tbody").click(function(event) {
    doTurn(event);
  });

  event.preventDefault();
}

function doTurn(event) {
  updateState(event);
  if (checkWinner() || tie()) {
    save(true);
    clearTable();
  } else {
    turn++;
  }
}

function updateState(event) {
  if (event.target.innerHTML === "") {
    $(event.target).html(player());
  }
}

function checkCells(array) {
  for(var i = 0; i < array.length; i++) {
    var winningCombo = array[i];
    var x = winningCombo[0];
    var y = winningCombo[1];
    var selector = $('[data-x="' + x + '"][data-y="' + y + '"]');
    if (noCellMatch(selector)) {
      return false;
    }
  }
  return true;
}

function noCellMatch(element) {
  return (element.html() !== player());
}

function checkWinner() {
  for(var i = 0; i < winningCombos.length; i++) {
    if(checkCells(winningCombos[i]) === true) {
      message("Player " + player() + " Won!");
      return true;
    }
  }
  return false;
}

function winner(element, index, array) {
  return element === player();
}

function tie() {
  var thereIsATie = true;
  $("td").each(function() {
    if ($(this).html().length <= 0) {
      console.log($(this).html.length);
      thereIsATie = false;
    }
  });
  if (thereIsATie) message("Tie game");
  return thereIsATie;
}

function allFull(element, index, array) {
  return element === "X" || element === "O";
}

function clearTable() {
  $("td").empty();
  turn = 0;
}

function message(winner) {
  $("#message").html(winner);
}

function player() {
  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}

$(document).ready(function() {
  attachListeners();
});
