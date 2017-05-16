$(function() {
  attachListeners();
})

var turn = 0
var currentGame = 0
var gameOver = false
const winningCombos = [ [0, 1, 2], [3, 4, 5],[6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6] ]

//GAME FUNCTIONALITY

function attachListeners() {
  $('td').on('click', function(e) {
    e.preventDefault();
    doTurn(e)
  })
  $('#previous').on('click', function() { //if id previous is clicked, call getAllGames function
    getAllGames();
  })
  $('#save').on('click', function() { //if id save is clicked, call save function
    save();
  })
   $("#games").on('click', function(e) {
    //placeholder for now, but can be used to navigate amongst saved games
    var id = e.target.id.slice(5);
    findGame(id);
    e.preventDefault();
  })
}

function player() {
  return (turn % 2 === 0) ? "O" : "X"; //if no remainder then x
}

function doTurn(e) {
  turn += 1
  updateState(e)
  checkWinner()
}

var updateState = function(e) {
  $(e.currentTarget).html(player());
}

function checkWinner() {
  var currentPlayer = player()
  var board = getBoard();

  winningCombos.forEach(function(combo) { //iterates over Combos array
    if (board[combo[0]] == currentPlayer && board[combo[1]] == currentPlayer && board[combo[2]] == currentPlayer) {
      //calls message() based on current player
      save();
      clearBoard();
      message("Player " + currentPlayer + " Won!");
      gameOver = true;

    } else if (turn === 9) {
      save();
      clearBoard();
      message("Tie game");
      gameOver = true
    }
  })
  return gameOver
}

function getBoard() {
  var board = [];
  $td = $("td");
  for (var i=0; i < 9; i++) {
    var cell = $td[i];
    board.push(cell.innerHTML);
    }
  return board;
}

function clearBoard() {
  turn = 0;
  $("td").html("");
}

function message(string) {
  $("div#message").text(string) //edited to replace text instead of append
}

function save() { //a good resource for this function is here -> https://stackoverflow.com/questions/14762775/ajax-if-condition
  $.ajax({
      type: (currentGame === 0) ? "POST"  : "PATCH",
      url: (currentGame === 0) ? "/games" : "/games/" + currentGame,
      data: { game: { state: getBoard() }},
      success: callback,
      dataType: "json",
  })
}

function callback(data) {
  if ( gameOver === true ) {
    currentGame = 0;
    gameOver = false;
  } else {
    currentGame = data.game.id
  }
}

function getAllGames() {
  $.ajax({
    type: "GET",
    url: '/games',
    dataType: 'json'
  }).done(function(response) {
    showAllGames(response.games);
  })
}

function showAllGames(games) {
  if (games.length > 0) {
    var gamesHtml =''
    games.forEach(function(game) { //should add games to games id in DOM
      gamesHtml += showGame(game)
    })
    $("#games").html(gamesHtml)
  } else {
    $("#games").html()
  }
}

function findGame(id) {
  $.ajax({
    type: "GET",
    url: '/games/' + id,
    dataType: 'json'
  }).done(function(response) {
    updateBoard(response.game);
  })
}

function updateBoard(game) {
  var state = game.state
  $td = $("td");
  for (var i=0; i < 9; i++) {
    var cell = $td[i];
    cell.innerHTML = state[i];
    }
  currentGame = game.id;
  setTurn();
}

function setTurn() {
  var board = getBoard();
  count = 0;
  for (var i = 0; i < 9; i++) {
    if (board[i] === "X" || board[i] === "O") {
      count++
    }
  }
  turn = count;
}

function showGame(game) {
  return '<div id="game-' + game.id + '">' + game.id + '</div>'
}
