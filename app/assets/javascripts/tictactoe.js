$(document).ready(function() {
  attachListeners();
});

const winCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];
var gameID = 0;
var turn = 0;
//tests would not pass when "let" was used instead of "var"

function player() {
  return (turn % 2 === 0 ? "X" : "O")
}

function updateState(square) {
  square.innerHTML = player();
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
}

function doTurn() {
  updateState(this);
  turn++;
  if (checkWinner()) {
    //saveGame();
    clearGame();
  } else if (turn === 9) {
    setMessage("Tie game.");
    //saveGame();
    clearGame();
  }
}

function clearGame() {
  const squares = document.querySelectorAll('td');
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
//  console.log(state);
//  debugger;
//  let savedGame = $.post('/games', state);
//  savedGame.done(function(data) {
//    console.log(data);
//  })
  if (gameID !== 0) {
    //locate existing game
    //update board
  } else {
    //create new game
    //set gameID by the game instance id
  }
  setMessage("Game saved");
}

function previousGames() {
//when button#previous clicked then all persisted games grabbed and then
//added to the dom in clickable format to div#games
  console.log("Prior Games here");
  var gameList = "";
  $.getJSON('/games', function(response) {
    response["data"].forEach(function(game) {
      var gameButton = `<button class="prior-game" data-id="${game["id"]}">${game["id"]}</button>`;
      $(".prior-game").on('click', loadGame);
      gameList.push(gameButton);
    });
  });
  const gamesDiv = document.getElementById('games');
  gamesDiv.innerHTML = gameList
  console.log(gameList)
}

function loadGame() {
  //get gameID from data
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
