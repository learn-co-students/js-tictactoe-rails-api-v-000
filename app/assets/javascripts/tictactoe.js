$(document).ready(function() {
  attachListeners();
});


var winCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];
var gameID = 0;
var turn = 0;
//tests would not pass when "let" or "const" was used instead of "var"

function player() {
  return (turn % 2 === 0 ? "X" : "O")
}

function updateState(square) {
  if (!square.innerHTML) {
    square.innerHTML = player();
    return true;
  } else {setMessage('Try another space.')};
}

function currentState() {
  const squares = document.querySelectorAll('td');
  let state = [];
  squares.forEach(square => state.push(square.innerHTML));
  return state;
}

function setMessage(string) {
  const messageDiv = document.getElementById('message');
  messageDiv.innerHTML = string
}

function checkWinner() {
  var values = currentState();
  var winner;
  winCombinations.forEach(function(win) {
    if (values[win[0]] == values[win[1]] && values[win[1]] == values[win[2]] && values[win[0]] !== "") {
      winner = values[win[0]]
      setMessage(`Player ${winner} Won!`)
    };
  });
  if (winner) {return true}
  else {return false}
}

function doTurn() {
  if (updateState(this)) {
    setMessage('')
    turn++;
  };
  if (checkWinner()) {
    saveGame();
    resetGame();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    resetGame();
  };
}

function resetGame() {
  let squares = document.querySelectorAll('td');
  squares.forEach(function(square) {
    square.innerHTML = "";
  });
  gameID = 0;
  turn = 0;
}

function saveGame() {
//when button#save clicked, creates a new game if does not already exist
//otherwise updates
  if (gameID !== 0) {
    //update existing game
    $.patch(`/games/${gameID}`, {state: currentState()});
  } else {
    //create new game
    $.post("/games", {state: currentState()}, function(savedGame) {
      gameID = savedGame["data"]["id"];
    });
    //newGame.done(function(saveData) {
    //  gameID = saveData["data"]["id"];
    //});
    setMessage("Game saved");
  }
}

function previousGames() {
  const gamesDiv = document.getElementById('games');
  var gameList = "";
  $.getJSON('/games', function(response) {
    response["data"].forEach(function(game) {
      var gameButton = `<button class="prior-game" data-id="${game["id"]}">Game ${game["id"]}</button><br>`;
      gameList += gameButton;
    });
  }).done(function() {
    gamesDiv.innerHTML = gameList
    $(".prior-game").on('click', loadGame);
  });
}

function loadGame() {
  var gameID = $(this).data("id");
  $.getJSON(`/games/${gameID}`, function(response) {
    var gameState = response["data"]["attributes"]["state"];
    const squares = document.querySelectorAll('td');
    function updateSquares(square, index) {
      square.innerHTML = gameState[index];
    };
    squares.forEach(updateSquares);
    debugger;
  })
}

function attachListeners() {
  const squares = document.querySelectorAll('td');
  const saveButton = document.getElementById('save');
  const previousButton = document.getElementById('previous');
  const clearButton = document.getElementById('clear');

  squares.forEach(function(square) {
    square.addEventListener('click', doTurn);
  });
  saveButton.addEventListener('click', saveGame);
  previousButton.addEventListener('click', previousGames);
  clearButton.addEventListener('click', resetGame);
};
