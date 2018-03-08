
var turn = 0;
var id = 0;

function doTurn(td) {
  updateState(td);
  var won = checkWinner()
  turn++;

  var tie = !won && turn === 9;
  var gameOver = won || tie;

  if (gameOver) {
    if (tie) {
      setMessage("Tie game.");
    }
    $("td").empty();
    turn = 0;
    saveGame();
  }
}

function updateState(td) {
  $(td).text(player());
}

function setMessage(msg) {
  $("div#message").html(msg);
}

function checkWinner() {
  var tds = Array.from(document.getElementsByTagName("td"));
  var board = tds.map(td => td.innerHTML);
  var winningCombos = [[1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7]];;

  var x = 0;
  var win = false;

  while (!win && x < winningCombos.length) {
    if (board[winningCombos[x][0] - 1] === board[winningCombos[x][1] - 1] && board[winningCombos[x][0] - 1] === board[winningCombos[x][2] -1] && board[winningCombos[x][0] - 1] !== "") {
      win = true;
      var winner = board[winningCombos[x][0] - 1];
      var msg = `Player ${winner} Won!`;
      setMessage(msg)
    }
    x++;
  }

  return win;
}

function player() {
  return turn % 2 === 0 ? "X" : "O";
}

function saveGame() {

}

function attachListeners() {
  $("td").on("click", function(e) {
    e.preventDefault();
    if (this.innerHTML === "") {
      doTurn(this)
    }
  })

  // previous button
  $("#previous").on("click", function(e) {
    // previous button click handler
      // AJAX interactions with the Rails API Clicking the button#previous element sends a GET request to the "/games" route: (clear children before attaching)

      $.get("/games", function(response) {
        console.log(response)

      });
  })

  // save button
  $("save").on("click", function(e) {
    // save button click handler
      // button#save element when the current game has not yet been saved sends a POST request to the "/games" route:
  })

  // clear button
  $("clear").on("click", function(e) {
    // clear button click handler
      //  when an unsaved game is in progress clears the game
  })
}

$(function() {
  attachListeners();
})
