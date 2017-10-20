function updateState(square){
	$(square).text(player());
}

function player() {
	if ( turn%2 === 1 ){
		return "O";
	} else {
		return "X";
	}
}

function setMessage(msg){
	$('div#message').html(msg);
}

var winCombos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function checkWinner(){
  var board = $("td");
  var won = false;
  var symbol = "";
  winCombos.some(function(winComboLoc){
    var winCondition = ($(board[winComboLoc[0]]).html() === "X" && $(board[winComboLoc[1]]).html() === "X" && $(board[winComboLoc[2]]).html() === "X") || ($(board[winComboLoc[0]]).html() === "O" && $(board[winComboLoc[1]]).html() === "O" && $(board[winComboLoc[2]]).html() === "O")
    if (winCondition) {
      symbol = $(board[winComboLoc[0]]).html();
      return won = true;
    }
  });

  //WORKS BUT WON"T PASS TEST WITHOUT CHECKING FOR THE OTHER PLAYER
  // var symbol = player();
  // winCombos.some(function(winComboLoc){
  //   if ($(board[winComboLoc[0]]).html() === symbol &&
  //     $(board[winComboLoc[1]]).html() === symbol &&
  //     $(board[winComboLoc[2]]).html() === symbol ) {
  //     return won = true;
  //   }
  // });
  if (won) setMessage(`Player ${symbol} Won!`);
  return won;
}

function attachListeners() {
	$("td").click(function(){
			doTurn(this);
	});

  $("#save").click(saveGame);
  $("#previous").click(loadPreviousGame);
  $("#clear").click(resetBoard);
}

function doTurn(square){
  if ($(square).html() === "") {
    updateState(square);
    if (++turn === 9) {
      setMessage("Tie game.");
      resetBoard();
    }else if (checkWinner()) resetBoard();
  } else {
    alert ('square taken');
  }
}

function resetBoard() {
  $('td').empty();
  turn = 0;
}


$(attachListeners());
var turn = 0;

function saveGame() {

}

function loadPreviousGame() {

}
