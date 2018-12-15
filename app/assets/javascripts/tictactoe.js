var turn = 0;
var gameId = 0;
var squares = document.getElementsByTagName("td");
var winCombinations = [[0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6],[0,3,6],[1,4,7],[2,5,8]];

$(attachListeners());

var player = () => turn % 2? "O": "X";

var updateState = (square) => {square.innerHTML = player()};

var setMessage = (string) => {$("#message").text(string)};

var checkWinner = () => {
  for (var i = 0; i < winCombinations.length; i++) {
    var firstIndex = winCombinations[i][0];
    var secondIndex = winCombinations[i][1];
    var thirdIndex = winCombinations[i][2];
    var firstToken = squares[firstIndex].innerHTML;
    var secondToken = squares[secondIndex].innerHTML;
    var thirdToken = squares[thirdIndex].innerHTML;
    if (firstToken === "X" && secondToken === "X" && thirdToken === "X") {
      setMessage("Player X Won!");
      return true;
    } else if (firstToken === "O" && secondToken === "O" && thirdToken === "O") {
      setMessage("Player O Won!");
      return true;
    };
  };
  return false;
}

var doTurn = (square) => {
  updateState(square);
  turn++;
  if (checkWinner()) {
    saveGame();
    resetGame();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    resetGame();
  };
};

function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      debugger
      doTurn(this);
    };
  });

  $("#save").on('click', function () {
    saveGame();
  });

  $("#previous").on('click', function () {
    previousGames();
  });

  $("#clear").on('click', function () {
    resetGame();
  });
};

function saveGame() {
  var state = [];
  var gameData;
  for(let i = 0; i < squares.length; i++) {
    state.push(squares[i].innerText)
  };

  gameData = {state: state};

  if (gameId) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${gameId}`,
      data: gameData
    });
  } else {
    $.post('/games', gameData, function(game){
      gameId = game.data.id
    });
  };
};

function previousGames() {
  $.get('/games', function(savedGames) {
    $('#games').empty();
    $('#message').empty();
    savedGames.data.forEach(function(game) {
      if (savedGames.data.length) {
        $("#games").append(`<button id="gameId-${game.id}">Game ${game.id} - updated: ${game.attributes["updated-at"]}</button><br>`);
        $("#gameId-" + game.id).on('click', function() {
          loadGame(game.id);
        });
      };
    });
  });
};

function loadGame(id) {
  $.get(`/games/${id}`, function(game) {
    $("#games").empty();
    $("#message").text(`Game ${id}`);
    gameId = game.data.id;
    var state = game.data.attributes.state;
    turn = state.join("").length;
    i= 0;
    state.forEach((el) => {$('td')[i].innerHTML = el, i++})
  });
};

function resetGame() {
  $('td').empty();
  turn = 0;
  gameId = 0;
};
