$(function () {
  attachListeners();
})


const WIN_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

var turn = 0;
var gameId = 0;

var player = function() {
  return turn % 2 ? 'O' : 'X';
}

var updateState = function(square) {
  $(square).text(player());
}

var setMessage = function(string) {
  $('#message').text(string);
}

var checkWinner = function() {
  var board = {};
  var winner = false;
  $('td').text((index, square) => board[index] = square);

  WIN_COMBOS.forEach(function(combo) {
    if (board[combo[0]] == board[combo[1]] && board[combo[0]] == board[combo[2]] && board[combo[0]] != "") {
      winner = true;
      setMessage(`Player ${board[combo[0]]} Won!`);
    }
  });
  return winner;
};

var doTurn = function(square) {
  updateState(square)
  turn++;
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  }
}

function saveGame() {
  let state = [];

  $('td').text((index, square) => {
    state.push(square);
  });

  gameData = { state };

  if (gameId) {
    $.ajax({
      type: 'PATCH',
      url: "/games/" + gameId, data: gameData
    });
  } else {
    $.post('/games', gameData, function(game) {
      gameId = game.data.id;
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
      $("#gameid-" + game.data.id).on('click', () => showPreviousGames(game.data.id));
    });
  }
}

function showPreviousGames() {
 $('#games').empty();
  $.get('/games', (savedGames) => {
  if (savedGames) {
    savedGames.data.forEach(function(game) {
    $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);

    $(`#gameid-${game.id}`).click(function() {

      $.get( `/games/${game.id}`, function(dataResult) {

        const id = dataResult.data.id;
        const gameState = dataResult.data.attributes.state;

        let index = 0;

          for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {

             document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = gameState[index];

          index++;

          turn = gameState.join('').length;
          gameId = id;
            };
          };
        });
      });
     });
   };
 });
};


var resetBoard = function() {
  turn = 0;
  gameId = 0;
  $('td').empty();
}

var attachListeners = function() {
  $("td").click(function(){
    if(this.innerHTML === "" && !checkWinner()){
      doTurn(this)
    }
  });

  $("#save").click(function(){
    saveGame()
  });

  $("#clear").click(function(){
    $("td").empty()
    turn = 0;
    gameId = 0
  });

  $("#previous").click(function(){
    showPreviousGames()
  });
};
