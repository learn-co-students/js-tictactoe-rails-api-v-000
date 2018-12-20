// Code your JavaScript / jQuery solution here

$(document).ready(function() {
  attachListeners();
});

var turn = 0;
//tests would not pass when "let" was used instead of "var"

function player() {
  return (turn % 2 === 0 ? "X" : "O")
}

function updateState(square) {
//tests would not pass when innerText used
  square.innerHTML = player();
}

function setMessage(string) {
  const messageDiv = document.getElementById('message');
  messageDiv.innerHTML = string
}

function checkWinner() {
//Returns true if the current board contains any winning combinations
//if winner, should invoke setMessage(), passing in the appropriate string
//based on who won: 'Player X Won!' or 'Player O Won!'
  const squares = document.querySelectorAll('td');
  let values = [];
  squares.forEach(square => values.push(square.innerHTML));
//squares[i].dataset.x (will get the x value)
}

function doTurn() {
//Increments the turn variable by 1
  updateState(this);
  ++turn;
  checkWinner();
//Invokes checkWinner() to see whether move results in a winning play.
}

function saveGame() {
//when button#save clicked, creates a new game if does not already exist
//otherwise updates
  const squares = document.querySelectorAll('td');
  let state = [];
  squares.forEach(square => state.push(square.innerHTML));
  console.log(state);
  debugger;
  let savedGame = $.post('/games', state);
  savedGame.done(function(data) {
    console.log(data);
  })
  setMessage("Game saved");
}

function previousGames() {
//when button#previous clicked then all persisted games grabbed and then
//added to the dom in clickable format to div#games
  var gameList = "<ul>";
  $.getJSON('/games', function(data) {
    data["data"].forEach(game => gameList += "<li><a href='/games/" + game["id"]+ "'>" + game["id"] + "</a></li>")
  });
  gameList += "</ul>";
  const gamesDiv = document.getElementById('games');
  gamesDiv.innerHTML = gameList
  console.log(gameList)
}

function clearGame() {
//should clear the game board and start a completely new game when
//button#clear clicked
  const gamesDiv = document.getElementById('games');
  gamesDiv.innerHTML = "games cleared"
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
