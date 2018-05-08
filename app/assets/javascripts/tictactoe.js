$(function() {
  attachListeners()
})

function attachListeners() {
  ///////////// SAVE GAME ////////////////
  $("#save").click(function(e) {
    e.preventDefault();
    saveGame()
  });
  ///////////// SHOW PREVIOUS GAMES ////////////////
  $("#previous").click(function(e) {
    e.preventDefault();
    previousGames()
  });
  ////////////// CLEAR CURRENT GAME ////////////////
  $("#clear").click(function(e) {
    e.preventDefault();
    clearGame()
  });
  $("td").on("click", function() {
    // $(this).html(player())
    doTurn($(this))
  })
}

function saveGame() {
  alert("pop pop")
}
function previousGames() {

}
function clearGame() {
  alert("nice gams!")
}

///////////////// GAMEPLAY /////////////////
var turn = 1

function player() {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function doTurn(element) {
  turn++;
  updateState(element);
  checkWinner()
}

function updateState(element) {
  $(element).text(player())
}

function checkWinner() {

}

function setMessage(string) {
  $("#message").html(string)
}
