// Code your JavaScript / jQuery solution here
$(document).ready(attachListeners)
var turn = 0;
var currentGame = 0;
function attachListeners() {
  $('td').on('click',function(){
    doTurn(this);
  })

  $('#save').on('click', function(){
    saveGame();
  });

  $('#previous').on('click', function(){
    getPreviousGames();
  });

  $('#clear').on('click', function(){
    turn = 0;
    currentGame = 0;
    $('td').empty()
  });


}

function player() {
  return turn % 2 === 0 ? "X" : "O"
}

function doTurn(cell) {
  updateState(cell)

}

function updateState(cell) {
  if ($(cell.target).text() === "") {
    $(cell.target).text(player())
    turn++;
  }
}

function getPreviousGames() {

}

function setMessage(message) {
  $('div#message').text(message)
}

function checkWinner() {

}

function saveGame() {
  var state = [];

  $('td').text((index, square) => {
    state.push(square)
  });

  var gameData = {state};

  if (currentGame) {
    $.ajax({type: 'PATCH', url: "/games/" + currentGame , data: gameData});
  } else {
    $.post("/games", gameData, function(game) {

      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
      $("#gameid-" + game.data.id).on('click', () => showPreviousGames(game.data.id));
      currentGame = game.data.id;
    });
  }
}
