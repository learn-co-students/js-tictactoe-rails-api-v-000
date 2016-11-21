$(function() {
  attachListeners();
});



var turn = 0;

function attachListeners() {
  $("td").click(function() {
    var $td = $(this);
    var xCoord = $td.data('x');
    var yCoord = $td.data('y');
    doTurn(xCoord, yCoord);
    console.log($("td[data-x='"+xCoord+"'][data-y='"+yCoord+"']").html(), $("td[data-x='"+xCoord+"'][data-y='"+yCoord+"']").selector)
  });
}

function doTurn(x, y) {
  updateState(x, y);
  turn++;
  checkWinner();
}

function player() {
  var move = "O"
  if(turn % 2 === 0) {
    move = "X"
  }

  return move
}

function updateState(x, y) {
  $("td[data-x='"+x+"'][data-y='"+y+"']").text(player);
}

function checkWinner() {
  var vertWin1 = [$("td[data-x='0'][data-y='0']").html(), $("td[data-x='0'][data-y='1']").html(), $("td[data-x='0'][data-y='2']").html()]
  var vertWin2 = [$("td[data-x='1'][data-y='0']").html(), $("td[data-x='1'][data-y='1']").html(), $("td[data-x='1'][data-y='2']").html()]
  var vertWin3 = [$("td[data-x='2'][data-y='0']").html(), $("td[data-x='2'][data-y='1']").html(), $("td[data-x='2'][data-y='2']").html()]
  var horizWin1 = [$("td[data-x='0'][data-y='0']").html(), $("td[data-x='1'][data-y='0']").html(), $("td[data-x='2'][data-y='0']").html()]
  var horizWin2 = [$("td[data-x='0'][data-y='1']").html(), $("td[data-x='1'][data-y='1']").html(), $("td[data-x='2'][data-y='1']").html()]
  var horizWin3 = [$("td[data-x='0'][data-y='2']").html(), $("td[data-x='1'][data-y='0']").html(), $("td[data-x='2'][data-y='2']").html()]
  var diagWin1 = [$("td[data-x='0'][data-y='0']").html(), $("td[data-x='1'][data-y='1']").html(), $("td[data-x='2'][data-y='2']").html()]
  var diagWin2 = [$("td[data-x='0'][data-y='2']").html(), $("td[data-x='1'][data-y='1']").html(), $("td[data-x='2'][data-y='0']").html()]

  var winPoss = [vertWin1, vertWin2, vertWin3, horizWin1, horizWin2, horizWin3, diagWin1, diagWin2]

  var xWin = ["X", "X", "X"]
  var oWin = ["O", "O", "O"]

  // if turn = 9 and nobody has won, tie game...clear the board
  $.each(winPoss, function(index, sequence) {
    // Loop through each sequence and compare with xWin and oWin

  });
}

function message(text) {
  $("div#message").html(text)
}
