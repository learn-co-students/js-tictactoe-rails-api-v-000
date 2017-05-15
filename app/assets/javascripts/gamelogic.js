var turn = 0;
var winningPiece;
var currentGame;
const WIN_COMBINATIONS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [6,4,2]]

function doTurn(event) {
  updateState(event);
  turn += 1
  checkWinner();
};

function updateState(event) {
  var currentPlayer = player();
  if($(event.target).is(':empty')) {
    $(event.target).html(currentPlayer);
  };
};

function checkWinCombo(element) {
  var cells = $('td');
  if (cells[element[0]].innerHTML === cells[element[1]].innerHTML &&
      cells[element[1]].innerHTML === cells[element[2]].innerHTML &&
      cells[element[0]].innerHTML != "") {
         winningPiece = cells[element[0]].innerHTML;
  };
};

function checkWinner() {
  if(turn > 3) {
    WIN_COMBINATIONS.find(checkWinCombo);
    if(winningPiece == "X") {
      message("Player X Won!");
      saveGame(true);
      resetGame();
    } else if(winningPiece == "O") {
      message("Player O Won!");
      saveGame(true);
      resetGame();
    } else if(typeof winningPiece == "undefined" && turn === 9) {
      message("Tie game");
      saveGame(true);
      resetGame();
    } else {return false};
  } return false
};

function message(messageString) {
  $('#message').text(messageString);
};

function player() {
  if(turn % 2 === 0 || turn === 0) {
    return "X";
  } else {
    return "O";
  };
};