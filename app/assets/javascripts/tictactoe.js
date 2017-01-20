var turn = 0;

function attachListeners() {
  // called in $(document).ready to attach click handlers
  // click handlers pass params of clicked cell to doTurn()
  $("td").on("click", function() {
    $(this).addClass("current");
    doTurn($(this).data());
    $(this).removeClass("current");
  });
}

function doTurn(cellData) {
  // turn + 1
  // calls updateState() and checkWinner()
  turn++;
  updateState(cellData);
  checkWinner();
}

function updateState(cellData) {
  // calls player(), adds return (x or o) to the clicked cell
  $(".current").html(player());
}

function checkWinner() {
  // checks to see if anyone has won
  // if winner, calls on player to see who won
  // and passes "Player X/O Won" to message()
}

function player() {
  // returns x or o depending on whether turn is odd or even
  if (turn % 2 == 0) {
    return "X";
  } else {
    return "O";
  }
}

function message(string) {
  // adds the given string to div#message
  $("#message").html(string);
}

$(document).ready(function () {
  attachListeners();
});
