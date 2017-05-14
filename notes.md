if the table is blank, we create a game. On click, we update the state of the game. Compare winning combos against the state of the current instance of game.

[["X", "O", ""], ["", "X", ""], ["", "O", "X"]]

function getStuff() {
  var board = [];
  $td = $("td");
  for (var i=0; i < 9; i++) {
    var cell = $td[i];
    board.push(cell.innerHTML);
    }
  return board;
}
