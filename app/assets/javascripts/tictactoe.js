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

function setMessage(string) {
  const messageDiv = document.getElementById('message');
  messageDiv.innerHTML = string
}

function checkWinner() {
  const squares = document.querySelectorAll('td');
  let values = [];
  squares.forEach(square => values.push(square.innerHTML));
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
//  const squares = document.querySelectorAll('td');
//  let state = [];
//  squares.forEach(square => state.push(square.innerHTML));
//
//  let savedGame = $.post('/games', state);
//  savedGame.done(function(data) {
//    console.log(data);
//  })
  if (gameID !== 0) {
    //$.get("/games/" + gameID)
    //update game info
    //$.update?("/games/" +gameID)
    currentGame.state
  } else {
    //create new game
    //var newGame = $.post("/games", {state: state);
    //newGame.done(function(saveData) {
    //  gameID = saveData["data"]["id"];
  //});
    //set gameID by the game instance id
  }
  setMessage("Game saved");
}

function previousGames() {
  var gameList = "";
  $.getJSON('/games', function(response) {
    console.log(response);
    response["data"].forEach(function(game) {
      var gameButton = `<button class="prior-game" data-id="${game["id"]}">${game["id"]}</button>`;
      gameList += gameButton;
      debugger;
    });
    $(".prior-game").on('click', loadGame);
  });
  debugger;
  const gamesDiv = document.getElementById('games');
  gamesDiv.innerHTML = gameList
  console.log(gameList)
}

function loadGame() {
  //get gameID from data
  //$.get("/games/" + gameID, function(response) {
  //var gameState = response["data"]["attributes"]["state"];
//})
  //function updateSquare(square, index) {
    //square.innerHTML = gameState[index];
  //}
  //squares.forEach(updateSquare);
  var gameID = $(this).data("id");
  $.getJSON(`/games/${gameID}`, function(response) {
    var gameState = response["data"]["attributes"]["state"];
    //transfer gameState to DOM
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
  clearButton.addEventListener('click', clearGame);
};
